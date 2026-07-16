import type { SubmissionEnvelope } from "./envelope";
import type { FormType } from "./validation";

export const WEBHOOK_ENV_BY_FORM: Record<FormType, string> = {
  "kitchen-application": "GHL_KITCHEN_APPLICATION_WEBHOOK_URL",
  "order-request": "GHL_ORDER_REQUEST_WEBHOOK_URL",
  "group-order": "GHL_GROUP_ORDER_WEBHOOK_URL",
  contact: "GHL_CONTACT_WEBHOOK_URL",
  "marketing-preferences": "GHL_MARKETING_PREFERENCES_WEBHOOK_URL",
};

export type WebhookResult =
  | { status: "sent" }
  | { status: "stubbed" }
  | { status: "configuration-error" }
  | { status: "unavailable" };

function isAllowedWebhookUrl(rawUrl: string, production: boolean): boolean {
  try {
    const url = new URL(rawUrl);
    if (url.username || url.password) return false;
    if (production) return url.protocol === "https:";
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export async function forwardToGhl(
  envelope: SubmissionEnvelope,
  options: {
    webhookUrl: string | undefined;
    production: boolean;
    fetchImplementation?: typeof fetch;
  },
): Promise<WebhookResult> {
  if (!options.webhookUrl) {
    return options.production ? { status: "configuration-error" } : { status: "stubbed" };
  }
  if (!isAllowedWebhookUrl(options.webhookUrl, options.production)) {
    return { status: "configuration-error" };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8_000);
  const fetchImplementation = options.fetchImplementation ?? fetch;
  try {
    const response = await fetchImplementation(options.webhookUrl, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-omala-submission-id": envelope.submissionId,
        "x-omala-receipt-id": envelope.receiptId,
      },
      body: JSON.stringify(envelope),
      signal: controller.signal,
    });
    return response.ok ? { status: "sent" } : { status: "unavailable" };
  } catch {
    return { status: "unavailable" };
  } finally {
    clearTimeout(timeout);
  }
}
