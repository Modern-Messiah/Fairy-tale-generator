"use client";

import { LOCALE_COOKIE, LOCALES, type Locale } from "@/domain/locale";
import { useRouter } from "next/navigation";
import { useLocale } from "./locale-provider";

function writeLocaleCookie(next: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${next}; Path=/; Max-Age=31536000; SameSite=Lax`;
}

export function LocaleSwitch() {
  const router = useRouter();
  const { locale, messages } = useLocale();

  function choose(next: Locale) {
    if (next === locale) return;
    writeLocaleCookie(next);
    router.refresh();
  }

  return (
    <div className="segment locale" role="group" aria-label={messages.siteLanguage}>
      {LOCALES.map((value) => (
        <label key={value} className="segment-item">
          <input
            type="radio"
            name="ui-locale"
            value={value}
            className="sr-only"
            checked={locale === value}
            onChange={() => choose(value)}
          />
          {value === "ru" ? "Русский" : "Қазақша"}
        </label>
      ))}
    </div>
  );
}
