export const REQUIRED_PRODUCTION_ENV = [
  "NEXT_PUBLIC_SITE_URL",
  "NEXT_PUBLIC_WHATSAPP_NUMBER",
  "NEXT_PUBLIC_TURNSTILE_SITE_KEY",
  "TURNSTILE_SECRET_KEY",
  "CONSENT_TEXT_VERSION",
  "GHL_KITCHEN_APPLICATION_WEBHOOK_URL",
  "GHL_ORDER_REQUEST_WEBHOOK_URL",
  "GHL_GROUP_ORDER_WEBHOOK_URL",
  "GHL_CONTACT_WEBHOOK_URL",
  "GHL_MARKETING_PREFERENCES_WEBHOOK_URL",
] as const;

export type ProductionEnvName = (typeof REQUIRED_PRODUCTION_ENV)[number];

function isHttpsUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password;
  } catch {
    return false;
  }
}

export function isProductionReady(values: Partial<Record<ProductionEnvName, string>>): boolean {
  if (!REQUIRED_PRODUCTION_ENV.every((name) => values[name]?.trim())) return false;
  if (!isHttpsUrl(values.NEXT_PUBLIC_SITE_URL ?? "")) return false;
  if (!/^237[2-9]\d{8}$/.test((values.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "").replace(/\D/g, ""))) {
    return false;
  }
  return REQUIRED_PRODUCTION_ENV
    .filter((name) => name.startsWith("GHL_"))
    .every((name) => isHttpsUrl(values[name] ?? ""));
}
