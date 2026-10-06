export const LOCALES = ["ru", "kk"] as const;

export type Locale = (typeof LOCALES)[number];

export const LOCALE_COOKIE = "ui-locale";

export function parseLocale(value: string | undefined | null): Locale {
  return value === "kk" ? "kk" : "ru";
}
