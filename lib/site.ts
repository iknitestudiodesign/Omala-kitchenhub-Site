import { siteCopy } from "@/content";

const resolvedSiteUrl = process.env.NEXT_PUBLIC_SITE_URL
  ?? (process.env.RAILWAY_PUBLIC_DOMAIN ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}` : "http://localhost:3000");

export const siteConfig = {
  ...siteCopy,
  description: siteCopy.pages.home.metadata.description,
  url: resolvedSiteUrl,
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "") ?? "",
  consentVersion: process.env.CONSENT_TEXT_VERSION ?? "2026-07-v1",
};

export function whatsappHref(message?: string) {
  if (!siteConfig.whatsappNumber) return null;
  const query = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${siteConfig.whatsappNumber}${query}`;
}
