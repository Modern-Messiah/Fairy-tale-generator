import type { Metadata } from "next";
import { ScrollTop } from "@/components/scroll-top";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Генератор сказок",
    template: "%s | Генератор сказок",
  },
  description: "Создайте уникальную детскую сказку с помощью искусственного интеллекта",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru" className="h-full">
      <body className="flex min-h-full flex-col">
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">{children}</main>
        <footer className="px-4 py-6 text-center text-sm text-stone-700">
          © {new Date().getFullYear()} Генератор сказок. Все сказки уникальны.
        </footer>
        <ScrollTop />
      </body>
    </html>
  );
}
