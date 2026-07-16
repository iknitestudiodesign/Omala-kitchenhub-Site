import assert from "node:assert/strict";
import test from "node:test";

import {
  checkRateLimit,
  FORM_SECURITY_ENTRY_LIMIT,
  resetFormSecurityStateForTests,
  runIdempotent,
  stableSerialize,
} from "../lib/forms/security.ts";
import { verifyTurnstile } from "../lib/forms/turnstile.ts";
import { forwardToGhl } from "../lib/forms/webhook.ts";

test.beforeEach(() => resetFormSecurityStateForTests());

test("rate limiting uses a fixed window and returns a useful retry delay", () => {
  const options = { limit: 2, windowMs: 10_000, now: 1_000 };
  assert.deepEqual(checkRateLimit("visitor", options), {
    allowed: true,
    remaining: 1,
    retryAfterSeconds: 0,
  });
  assert.equal(checkRateLimit("visitor", options).allowed, true);
  assert.deepEqual(checkRateLimit("visitor", options), {
    allowed: false,
    remaining: 0,
    retryAfterSeconds: 10,
  });
  assert.equal(checkRateLimit("visitor", { ...options, now: 11_000 }).allowed, true);
});

test("stable serialization ignores object key insertion order", () => {
  assert.equal(
    stableSerialize({ kitchen: "A", quantity: 2, nested: { b: false, a: true } }),
    stableSerialize({ nested: { a: true, b: false }, quantity: 2, kitchen: "A" }),
  );
});

test("idempotency coalesces concurrent submissions and detects changed payloads", async () => {
  let calls = 0;
  let release;
  const gate = new Promise((resolve) => {
    release = resolve;
  });
  const work = async () => {
    calls += 1;
    await gate;
    return { status: 202, receiptId: "OML-ONE" };
  };

  const first = runIdempotent("key", "payload-a", work);
  const second = runIdempotent("key", "payload-a", work);
  release();
  const [firstResult, secondResult] = await Promise.all([first, second]);

  assert.equal(calls, 1);
  assert.equal(firstResult.kind, "executed");
  assert.equal(secondResult.kind, "replayed");
  assert.deepEqual(firstResult.value, secondResult.value);

  const conflict = await runIdempotent("key", "payload-b", async () => ({ status: 202 }));
  assert.deepEqual(conflict, { kind: "conflict" });
});

test("failed submissions are removable from the idempotency cache", async () => {
  const first = await runIdempotent(
    "retryable",
    "same-payload",
    async () => ({ status: 503 }),
    { shouldCache: (value) => value.status < 500 },
  );
  const second = await runIdempotent(
    "retryable",
    "same-payload",
    async () => ({ status: 202 }),
    { shouldCache: (value) => value.status < 500 },
  );

  assert.equal(first.kind, "executed");
  assert.equal(second.kind, "executed");
  assert.equal(second.value.status, 202);
});

test("security caches reject new keys at capacity without weakening existing protection", async () => {
  const rateOptions = { limit: 2, windowMs: 60_000, now: 1_000 };
  for (let index = 0; index < FORM_SECURITY_ENTRY_LIMIT; index += 1) {
    assert.equal(checkRateLimit(`visitor-${index}`, rateOptions).allowed, true);
  }
  assert.equal(checkRateLimit("visitor-over-capacity", rateOptions).allowed, false);
  assert.equal(checkRateLimit("visitor-0", rateOptions).allowed, true);

  resetFormSecurityStateForTests();
  for (let index = 0; index < FORM_SECURITY_ENTRY_LIMIT; index += 1) {
    const result = await runIdempotent(`key-${index}`, "payload", async () => index);
    assert.equal(result.kind, "executed");
  }
  assert.deepEqual(
    await runIdempotent("key-over-capacity", "payload", async () => "unexpected"),
    { kind: "capacity" },
  );
  const replay = await runIdempotent("key-0", "payload", async () => "unexpected");
  assert.equal(replay.kind, "replayed");
  if (replay.kind === "replayed") assert.equal(replay.value, 0);
});

test("Turnstile is optional until configured and required once enabled", async () => {
  assert.deepEqual(await verifyTurnstile(undefined, undefined), { ok: true });
  assert.deepEqual(await verifyTurnstile(undefined, "configured-secret"), {
    ok: false,
    reason: "missing-token",
  });

  let requestedUrl = "";
  const result = await verifyTurnstile(
    "valid-token",
    "configured-secret",
    async (url) => {
      requestedUrl = String(url);
      return Response.json({ success: true });
    },
  );
  assert.deepEqual(result, { ok: true });
  assert.equal(requestedUrl, "https://challenges.cloudflare.com/turnstile/v0/siteverify");
});

test("GHL forwarding stubs only outside production and sends the safe envelope", async () => {
  const envelope = {
    submissionId: "submission-1",
    receiptId: "OML-ONE",
    formType: "contact",
    submittedAt: "2026-07-16T12:00:00.000Z",
    sourceUrl: "https://omala.example/contact",
    language: "en",
    consentTextVersion: "v1",
    utm: { source: null, medium: null, campaign: null, content: null, term: null },
    communicationPermissions: {
      service: true,
      marketingWhatsApp: false,
      marketingSms: false,
      marketingEmail: false,
    },
    consentAudit: {
      textVersion: "v1",
      capturedAt: "2026-07-16T12:00:00.000Z",
      withdrawnAt: null,
      sourceUrl: "https://omala.example/contact",
      language: "en",
      permissions: {
        service: true,
        marketingWhatsApp: false,
        marketingSms: false,
        marketingEmail: false,
      },
    },
    routing: {
      audience: "general",
      pipeline: null,
      stage: null,
      tags: ["website-source", "contact-request"],
    },
    data: {
      name: "Test User",
      phone: "+237677123456",
      topic: "Help",
      message: "Please help with my request.",
      serviceContactConsent: true,
    },
  };

  assert.deepEqual(
    await forwardToGhl(envelope, { webhookUrl: undefined, production: false }),
    { status: "stubbed" },
  );
  assert.deepEqual(
    await forwardToGhl(envelope, { webhookUrl: undefined, production: true }),
    { status: "configuration-error" },
  );

  let forwarded;
  const sent = await forwardToGhl(envelope, {
    webhookUrl: "https://services.leadconnectorhq.com/hooks/example",
    production: true,
    fetchImplementation: async (url, init) => {
      forwarded = { url: String(url), init };
      return new Response(null, { status: 204 });
    },
  });
  assert.deepEqual(sent, { status: "sent" });
  assert.equal(forwarded.url, "https://services.leadconnectorhq.com/hooks/example");
  assert.equal(forwarded.init.method, "POST");
  assert.equal(JSON.parse(forwarded.init.body).receiptId, "OML-ONE");
});
