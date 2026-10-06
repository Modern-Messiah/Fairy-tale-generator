"use client";

import { getMessages, type Messages } from "@/domain/messages";
import { type Locale } from "@/domain/locale";
import { createContext, useContext, type ReactNode } from "react";

const LocaleContext = createContext<{ locale: Locale; messages: Messages } | null>(null);

export function LocaleProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  return (
    <LocaleContext.Provider value={{ locale, messages: getMessages(locale) }}>{children}</LocaleContext.Provider>
  );
}

export function useLocale(): { locale: Locale; messages: Messages } {
  const value = useContext(LocaleContext);
  if (!value) throw new Error("LocaleProvider is missing");
  return value;
}
