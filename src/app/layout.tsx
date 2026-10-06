import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Literata } from "next/font/google";
import Link from "next/link";
import { LocaleProvider } from "@/components/locale-provider";
import { LocaleSwitch } from "@/components/locale-switch";
import { Mark } from "@/components/mark";
import { ScrollTop } from "@/components/scroll-top";
import { getMessages } from "@/domain/messages";
import { getLocale } from "@/server/locale";
import "./globals.css";

const storyFont = Literata({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  display: "swap",
  style: ["normal", "italic"],
  variable: "--font-story",
});

export async function generateMetadata(): Promise<Metadata> {
  const messages = getMessages(await getLocale());
  return {
    title: {
      default: messages.siteTitle,
      template: `%s | ${messages.siteTitle}`,
    },
    description: messages.siteDescription,
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3f0ea" },
    { media: "(prefers-color-scheme: dark)", color: "#2f4a42" },
  ],
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale();
  const messages = getMessages(locale);

  return (
    <html lang={locale} className={`${storyFont.variable} h-full`}>
      <body className="flex min-h-full flex-col">
        <LocaleProvider locale={locale}>
          <header className="nav-bar">
            <div className="mx-auto flex w-full max-w-3xl items-center gap-2 px-4 py-2">
              <Link href="/" className="btn btn-plain min-w-0 gap-2 px-0">
                <Mark className="h-5 w-5 shrink-0" />
                <span className="truncate">{messages.brand}</span>
              </Link>
              <div className="ml-auto flex shrink-0 items-center gap-1">
                <LocaleSwitch />
                <nav>
                  <Link href="/history" className="btn btn-plain">
                    {messages.history}
                  </Link>
                </nav>
              </div>
            </div>
          </header>
          <main className="mx-auto w-full max-w-3xl flex-1 px-4 pt-6 pb-[calc(2rem+env(safe-area-inset-bottom,0px))]">
            {children}
          </main>
          <ScrollTop />
        </LocaleProvider>
      </body>
    </html>
  );
}
