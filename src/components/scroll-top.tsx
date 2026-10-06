"use client";

import { useEffect, useState } from "react";
import { useLocale } from "./locale-provider";

export function ScrollTop() {
  const { messages } = useLocale();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      className={`btn material-btn scroll-top fixed right-4 z-20 h-11 w-11 rounded-full p-0 ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      style={{ bottom: "calc(1.25rem + env(safe-area-inset-bottom, 0px))" }}
      aria-label={messages.scrollTop}
      tabIndex={visible ? 0 : -1}
      onClick={() => {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
      }}
    >
      ↑
    </button>
  );
}
