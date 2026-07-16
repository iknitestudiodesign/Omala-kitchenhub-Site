import { enContent } from "./en";

export const supportedLocales = ["en"] as const;
export type SupportedLocale = (typeof supportedLocales)[number];

export const defaultLocale: SupportedLocale = "en";

const contentByLocale = {
  en: enContent,
} as const;

export type SiteCopy = (typeof contentByLocale)[SupportedLocale];

export function isSupportedLocale(locale: string): locale is SupportedLocale {
  return supportedLocales.includes(locale as SupportedLocale);
}

export function getSiteCopy(locale: SupportedLocale = defaultLocale): SiteCopy {
  return contentByLocale[locale];
}

export const siteCopy = getSiteCopy();
