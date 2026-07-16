export type OmalaEvent =
  | "order_start"
  | "kitchen_application_start"
  | "group_order_start"
  | "whatsapp_click"
  | "consent_opt_in"
  | "form_submit_success";

export function trackEvent(name: OmalaEvent, detail: Record<string, string> = {}) {
  if (typeof window === "undefined") return;
  const payload = { event: name, ...detail };
  const dataLayer = (
    window as typeof window & { dataLayer?: Record<string, string>[] }
  ).dataLayer;
  dataLayer?.push(payload);
  window.dispatchEvent(new CustomEvent("omala:analytics", { detail: payload }));
}
