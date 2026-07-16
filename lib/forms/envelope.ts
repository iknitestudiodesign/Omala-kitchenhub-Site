import type { FormDataByType, FormType } from "./validation";

type RawBody = Record<string, unknown>;

export interface CommunicationPermissions {
  service: boolean;
  marketingWhatsApp: boolean;
  marketingSms: boolean;
  marketingEmail: boolean;
}

export interface ConsentChannelDecision {
  channel: "service" | "whatsapp" | "sms" | "email";
  status: "granted" | "declined" | "withdrawn" | "not-applicable";
  recordedAt: string;
  withdrawnAt: string | null;
}

export interface SubmissionEnvelope<K extends FormType = FormType> {
  submissionId: string;
  receiptId: string;
  formType: K;
  submittedAt: string;
  sourceUrl: string;
  language: "en" | "fr";
  consentTextVersion: string;
  utm: {
    source: string | null;
    medium: string | null;
    campaign: string | null;
    content: string | null;
    term: string | null;
  };
  communicationPermissions: CommunicationPermissions;
  consentAudit: {
    textVersion: string;
    capturedAt: string;
    withdrawnAt: string | null;
    sourceUrl: string;
    language: "en" | "fr";
    permissions: CommunicationPermissions;
    channelDecisions: ConsentChannelDecision[];
  };
  routing: {
    audience: "kitchen" | "customer" | "general";
    pipeline: "Kitchen Partners" | "Order Requests" | null;
    stage: "New Application" | "Request Received" | null;
    tags: string[];
  };
  data: FormDataByType[K];
}

interface EnvelopeOptions {
  consentTextVersion: string;
  now?: Date;
  uuid?: string;
}

const ROUTING: Record<FormType, SubmissionEnvelope["routing"]> = {
  "kitchen-application": {
    audience: "kitchen",
    pipeline: "Kitchen Partners",
    stage: "New Application",
    tags: ["website-source", "audience-kitchen", "pilot-application"],
  },
  "order-request": {
    audience: "customer",
    pipeline: "Order Requests",
    stage: "Request Received",
    tags: ["website-source", "audience-customer", "order-request"],
  },
  "group-order": {
    audience: "customer",
    pipeline: "Order Requests",
    stage: "Request Received",
    tags: ["website-source", "audience-customer", "group-order"],
  },
  contact: {
    audience: "general",
    pipeline: null,
    stage: null,
    tags: ["website-source", "contact-request"],
  },
  "marketing-preferences": {
    audience: "customer",
    pipeline: null,
    stage: null,
    tags: ["website-source", "consent-preferences"],
  },
};

function safeText(value: unknown, max = 120): string | null {
  if (typeof value !== "string") return null;
  const cleaned = value.replace(/[\u0000-\u001F\u007F]/g, "").trim().slice(0, max);
  return cleaned || null;
}

function safeSourceUrl(value: unknown, requestUrl: string, referer: string | null): string {
  const origin = new URL(requestUrl).origin;
  const attributionKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
  for (const candidate of [value, referer]) {
    if (typeof candidate !== "string" || !candidate.trim()) continue;
    try {
      const url = new URL(candidate, origin);
      if ((url.protocol === "http:" || url.protocol === "https:") && url.origin === origin) {
        url.username = "";
        url.password = "";
        url.hash = "";
        const attribution = new URLSearchParams();
        for (const key of attributionKeys) {
          const cleaned = safeText(url.searchParams.get(key));
          if (cleaned) attribution.set(key, cleaned);
        }
        url.search = attribution.toString();
        return url.toString().slice(0, 2048);
      }
    } catch {
      // Try the next safe fallback.
    }
  }
  return origin;
}

function languageFrom(body: RawBody, acceptLanguage: string | null): "en" | "fr" {
  const requested = safeText(body.language, 12)?.toLowerCase();
  if (requested === "fr" || requested?.startsWith("fr-")) return "fr";
  if (requested === "en" || requested?.startsWith("en-")) return "en";
  return acceptLanguage?.toLowerCase().startsWith("fr") ? "fr" : "en";
}

function checked(value: unknown): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value !== "string") return false;
  return ["true", "1", "yes", "on"].includes(value.trim().toLowerCase());
}

export function communicationPermissionsFor<K extends FormType>(
  formType: K,
  data: FormDataByType[K],
  rawBody: RawBody,
): CommunicationPermissions {
  if (formType === "marketing-preferences") {
    const preferences = data as FormDataByType["marketing-preferences"];
    return {
      service: false,
      marketingWhatsApp: preferences.consentMarketingWhatsApp,
      marketingSms: preferences.consentMarketingSms,
      marketingEmail: preferences.consentMarketingEmail,
    };
  }
  return {
    service: true,
    marketingWhatsApp: checked(rawBody.consentMarketingWhatsApp),
    marketingSms: checked(rawBody.consentMarketingSms),
    marketingEmail: checked(rawBody.consentMarketingEmail),
  };
}

export function createSubmissionEnvelope<K extends FormType>(
  formType: K,
  data: FormDataByType[K],
  rawBody: RawBody,
  request: Pick<Request, "url" | "headers">,
  options: EnvelopeOptions,
): SubmissionEnvelope<K> {
  const submissionId = options.uuid ?? crypto.randomUUID();
  const receiptId = `OML-${submissionId.replace(/-/g, "").slice(0, 12).toUpperCase()}`;
  const now = options.now ?? new Date();
  const submittedAt = now.toISOString();
  const sourceUrl = safeSourceUrl(rawBody.sourceUrl, request.url, request.headers.get("referer"));
  const sourceQuery = new URL(sourceUrl).searchParams;
  const language = languageFrom(rawBody, request.headers.get("accept-language"));
  const communicationPermissions = communicationPermissionsFor(formType, data, rawBody);
  const withdrawnAt = formType === "marketing-preferences"
    && (data as FormDataByType["marketing-preferences"]).action === "withdraw"
    ? submittedAt
    : null;
  const isPreferenceChange = formType === "marketing-preferences";
  const channelDecision = (
    channel: ConsentChannelDecision["channel"],
    allowed: boolean,
  ): ConsentChannelDecision => {
    const status = channel === "service" && isPreferenceChange
      ? "not-applicable"
      : allowed
        ? "granted"
        : isPreferenceChange
          ? "withdrawn"
          : "declined";
    return {
      channel,
      status,
      recordedAt: submittedAt,
      withdrawnAt: status === "withdrawn" ? submittedAt : null,
    };
  };

  return {
    submissionId,
    receiptId,
    formType,
    submittedAt,
    sourceUrl,
    language,
    consentTextVersion: options.consentTextVersion,
    utm: {
      source: safeText(rawBody.utmSource) ?? safeText(sourceQuery.get("utm_source")),
      medium: safeText(rawBody.utmMedium) ?? safeText(sourceQuery.get("utm_medium")),
      campaign: safeText(rawBody.utmCampaign) ?? safeText(sourceQuery.get("utm_campaign")),
      content: safeText(rawBody.utmContent) ?? safeText(sourceQuery.get("utm_content")),
      term: safeText(rawBody.utmTerm) ?? safeText(sourceQuery.get("utm_term")),
    },
    communicationPermissions,
    consentAudit: {
      textVersion: options.consentTextVersion,
      capturedAt: submittedAt,
      withdrawnAt,
      sourceUrl,
      language,
      permissions: communicationPermissions,
      channelDecisions: [
        channelDecision("service", communicationPermissions.service),
        channelDecision("whatsapp", communicationPermissions.marketingWhatsApp),
        channelDecision("sms", communicationPermissions.marketingSms),
        channelDecision("email", communicationPermissions.marketingEmail),
      ],
    },
    routing: ROUTING[formType],
    data,
  };
}
