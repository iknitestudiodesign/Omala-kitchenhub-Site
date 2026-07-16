import { communicationPermissionsFor, createSubmissionEnvelope } from "./envelope";
import { getRuntimeEnv, parsePositiveEnv } from "./runtime-env";
import {
  MAX_IDEMPOTENCY_KEY_LENGTH,
  checkRateLimit,
  hashValue,
  rateLimitIdentity,
  runIdempotent,
  stableSerialize,
} from "./security";
import { verifyTurnstile } from "./turnstile";
import { validateFormPayload, type FormType } from "./validation";
import { forwardToGhl, WEBHOOK_ENV_BY_FORM } from "./webhook";

type JsonObject = Record<string, unknown>;

interface ResponseSnapshot {
  status: number;
  body: JsonObject;
  headers?: Record<string, string>;
}

type JsonReadResult =
  | { ok: true; body: JsonObject }
  | { ok: false; response: ResponseSnapshot };

const MAX_BODY_BYTES = 64 * 1024;
const DEFAULT_CONSENT_VERSION = "2026-07-v1";

function snapshotResponse(snapshot: ResponseSnapshot, additionalHeaders?: Record<string, string>): Response {
  return new Response(JSON.stringify(snapshot.body), {
    status: snapshot.status,
    headers: {
      "cache-control": "no-store",
      "content-type": "application/json; charset=utf-8",
      ...snapshot.headers,
      ...additionalHeaders,
    },
  });
}

const CONFIRMATION_PATH: Record<FormType, string> = {
  "kitchen-application": "/confirmation/kitchen-application",
  "order-request": "/confirmation/order",
  "group-order": "/confirmation/group-order",
  contact: "/confirmation/contact",
  "marketing-preferences": "/confirmation/preferences",
};

const FORM_PATH: Record<FormType, string> = {
  "kitchen-application": "/for-kitchens#apply",
  "order-request": "/order#order-form",
  "group-order": "/group-orders#group-form",
  contact: "/contact#contact-form",
  "marketing-preferences": "/marketing-preferences",
};

function browserFormResponse(snapshot: ResponseSnapshot, formType: FormType): Response {
  const receiptId = typeof snapshot.body.receiptId === "string" ? snapshot.body.receiptId : null;
  if (snapshot.status >= 200 && snapshot.status < 300 && receiptId) {
    const location = `${CONFIRMATION_PATH[formType]}?id=${encodeURIComponent(receiptId)}`;
    return new Response(null, { status: 303, headers: { ...snapshot.headers, location, "cache-control": "no-store" } });
  }

  const title = snapshot.status === 422 ? "Please review the form" : "We could not send this yet";
  const detail = snapshot.status === 422
    ? "One or more details need attention. Return to the form and check each required field."
    : "Your details were not lost to a query string. Please return to the form and retry, or contact Omala for help.";
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${title} | Omala Kitchen Hub</title><style>body{margin:0;background:#f7f3e9;color:#20271d;font:16px/1.6 system-ui,sans-serif}.card{width:min(620px,calc(100% - 32px));margin:10vh auto;background:#fffefb;border:1px solid rgba(16,21,13,.15);border-radius:24px;padding:clamp(24px,5vw,48px);box-shadow:0 20px 60px rgba(9,12,8,.12)}h1{color:#10150d;font:900 clamp(34px,7vw,52px)/1.05 Arial,sans-serif}a{display:inline-block;margin:8px 12px 0 0;color:#315b13;font-weight:800}</style></head><body><main class="card"><p>Omala Kitchen Hub</p><h1>${title}</h1><p>${detail}</p><a href="${FORM_PATH[formType]}">Return to the form</a><a href="/contact">Contact Omala</a></main></body></html>`;
  return new Response(html, {
    status: snapshot.status,
    headers: { ...snapshot.headers, "cache-control": "no-store", "content-type": "text/html; charset=utf-8" },
  });
}

function errorSnapshot(
  status: number,
  code: string,
  message: string,
  fields?: Array<{ field: string; message: string }>,
): ResponseSnapshot {
  return {
    status,
    body: {
      ok: false,
      message,
      error: {
        code,
        message,
        ...(fields ? { fields } : {}),
      },
    },
  };
}

function successSnapshot(receiptId: string, delivery: "sent" | "stubbed" = "sent"): ResponseSnapshot {
  return {
    status: 202,
    body: {
      ok: true,
      receiptId,
      message: "Your request has been received. Omala will follow up shortly.",
    },
    ...(delivery === "stubbed" ? { headers: { "x-omala-delivery": "development-stub" } } : {}),
  };
}

function logStatus(submissionId: string, status: string): void {
  console.info(JSON.stringify({ submissionId, status }));
}

function validIdempotencyKey(value: string): boolean {
  return value.length <= MAX_IDEMPOTENCY_KEY_LENGTH && !/[\u0000-\u001F\u007F]/.test(value);
}

function honeypotFilled(body: JsonObject): boolean {
  return [body.honeypot, body.website].some(
    (value) => typeof value === "string" && value.trim().length > 0,
  );
}

function turnstileToken(body: JsonObject): string | undefined {
  for (const value of [body.turnstileToken, body["cf-turnstile-response"]]) {
    if (typeof value === "string" && value.trim()) return value.trim().slice(0, 2048);
  }
  return undefined;
}

async function readJsonBody(request: Request): Promise<JsonReadResult> {
  const contentType = request.headers.get("content-type")?.toLowerCase() ?? "";
  const jsonRequest = contentType.startsWith("application/json");
  const browserFormRequest = contentType.startsWith("application/x-www-form-urlencoded");
  if (!jsonRequest && !browserFormRequest) {
    return { ok: false, response: errorSnapshot(415, "unsupported_media_type", "Submit this form as JSON or form data.") };
  }

  const declaredLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) {
    return { ok: false, response: errorSnapshot(413, "payload_too_large", "This form is too large to submit.") };
  }

  let text: string;
  try {
    text = await request.text();
  } catch {
    return { ok: false, response: errorSnapshot(400, "invalid_request", "We could not read this form.") };
  }
  if (new TextEncoder().encode(text).byteLength > MAX_BODY_BYTES) {
    return { ok: false, response: errorSnapshot(413, "payload_too_large", "This form is too large to submit.") };
  }

  if (browserFormRequest) {
    const body: JsonObject = {};
    const params = new URLSearchParams(text);
    for (const [key, value] of params.entries()) {
      const existing = body[key];
      if (existing === undefined) body[key] = value;
      else if (Array.isArray(existing)) existing.push(value);
      else body[key] = [existing, value];
    }
    return { ok: true, body };
  }

  try {
    const parsed = JSON.parse(text) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return { ok: false, response: errorSnapshot(400, "invalid_json", "Submit a valid form.") };
    }
    return { ok: true, body: parsed as JsonObject };
  } catch {
    return { ok: false, response: errorSnapshot(400, "invalid_json", "Submit valid JSON.") };
  }
}

export async function handleFormRequest(request: Request, formType: FormType): Promise<Response> {
  const browserFormRequest = request.headers
    .get("content-type")
    ?.toLowerCase()
    .startsWith("application/x-www-form-urlencoded")
    && request.headers.get("accept")?.toLowerCase().includes("text/html");
  const respond = (snapshot: ResponseSnapshot, additionalHeaders?: Record<string, string>) =>
    browserFormRequest
      ? browserFormResponse(snapshot, formType)
      : snapshotResponse(snapshot, additionalHeaders);
  const [rateMaxRaw, rateWindowRaw] = await Promise.all([
    getRuntimeEnv("FORM_RATE_LIMIT_MAX"),
    getRuntimeEnv("FORM_RATE_LIMIT_WINDOW_MS"),
  ]);
  const identity = await rateLimitIdentity(request);
  const rate = checkRateLimit(`${formType}:${identity}`, {
    limit: parsePositiveEnv(rateMaxRaw, 12),
    windowMs: parsePositiveEnv(rateWindowRaw, 60_000),
  });
  if (!rate.allowed) {
    const response = errorSnapshot(
      429,
      "rate_limited",
      "Too many attempts. Please wait a moment and try again.",
    );
    response.headers = { "retry-after": String(rate.retryAfterSeconds) };
    return respond(response);
  }

  const parsedBody = await readJsonBody(request);
  if (!parsedBody.ok) return respond(parsedBody.response);
  const body = parsedBody.body;

  const suppliedIdempotencyKey = request.headers.get("idempotency-key")?.trim();
  if (suppliedIdempotencyKey && !validIdempotencyKey(suppliedIdempotencyKey)) {
    return respond(
      errorSnapshot(400, "invalid_idempotency_key", "Use a shorter request identifier."),
    );
  }

  if (honeypotFilled(body)) {
    const receiptId = `OML-${crypto.randomUUID().replace(/-/g, "").slice(0, 12).toUpperCase()}`;
    return respond(successSnapshot(receiptId));
  }

  const validation = validateFormPayload(formType, body);
  if (!validation.ok) {
    return respond(
      errorSnapshot(422, "validation_failed", "Review the highlighted fields and try again.", validation.issues),
    );
  }

  const [consentVersion, turnstileSecret, webhookUrl, runtimeNodeEnv] = await Promise.all([
    getRuntimeEnv("CONSENT_TEXT_VERSION"),
    getRuntimeEnv("TURNSTILE_SECRET_KEY"),
    getRuntimeEnv(WEBHOOK_ENV_BY_FORM[formType]),
    getRuntimeEnv("NODE_ENV"),
  ]);
  const production = (runtimeNodeEnv ?? process.env.NODE_ENV) === "production";

  const performSubmission = async (): Promise<ResponseSnapshot> => {
    const envelope = createSubmissionEnvelope(formType, validation.data, body, request, {
      consentTextVersion: consentVersion ?? DEFAULT_CONSENT_VERSION,
    });
    const turnstile = await verifyTurnstile(turnstileToken(body), turnstileSecret);
    if (!turnstile.ok) {
      const unavailable = turnstile.reason === "unavailable";
      logStatus(envelope.submissionId, unavailable ? "turnstile_unavailable" : "turnstile_rejected");
      return unavailable
        ? errorSnapshot(503, "verification_unavailable", "Verification is temporarily unavailable. Please try again.")
        : errorSnapshot(400, "verification_failed", "Please complete the verification and try again.");
    }

    const forwarded = await forwardToGhl(envelope, { webhookUrl, production });
    logStatus(envelope.submissionId, forwarded.status);
    if (forwarded.status === "sent" || forwarded.status === "stubbed") {
      return successSnapshot(envelope.receiptId, forwarded.status);
    }
    return errorSnapshot(
      503,
      "service_unavailable",
      "We could not submit your request right now. Please retry or contact Omala by WhatsApp.",
    );
  };

  if (!suppliedIdempotencyKey) return respond(await performSubmission());

  const [idempotencyHash, payloadFingerprint] = await Promise.all([
    hashValue(`${formType}:${suppliedIdempotencyKey}`),
    hashValue(stableSerialize({
      data: validation.data,
      communicationPermissions: communicationPermissionsFor(formType, validation.data, body),
    })),
  ]);
  const result = await runIdempotent(idempotencyHash, payloadFingerprint, performSubmission, {
    shouldCache: (response) => response.status >= 200 && response.status < 300,
  });
  if (result.kind === "conflict") {
    return respond(
      errorSnapshot(409, "idempotency_conflict", "Use a new request identifier for changed form details."),
    );
  }
  if (result.kind === "capacity") {
    return respond(
      errorSnapshot(503, "submission_capacity", "Submission protection is busy. Please wait a moment and retry."),
    );
  }
  return respond(
    result.value,
    result.kind === "replayed" ? { "idempotency-replayed": "true" } : undefined,
  );
}
