"use client";

import { genreLabel, languageName } from "@/domain/catalog";
import { localizeError } from "@/domain/messages";
import { ageLabel } from "@/domain/text";
import type { StoryRequest } from "@/domain/schema";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useLocale } from "./locale-provider";
import { StoryMarkdown } from "./story-markdown";

type Phase = "loading" | "streaming" | "done" | "error";

function takeEvents(buffer: string): { events: unknown[]; rest: string } {
  const parts = buffer.split("\n\n");
  const rest = parts.pop() ?? "";
  const events: unknown[] = [];
  for (const part of parts) {
    const data = part
      .split("\n")
      .filter((line) => line.startsWith("data:"))
      .map((line) => line.slice(5).trim())
      .join("\n");
    if (!data) continue;
    events.push(JSON.parse(data));
  }
  return { events, rest };
}

export function StoryStream({
  request,
  attempt,
  onRetry,
  onNew,
}: {
  request: StoryRequest;
  attempt: number;
  onRetry: () => void;
  onNew: () => void;
}) {
  const { locale, messages } = useLocale();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [text, setText] = useState("");
  const [phase, setPhase] = useState<Phase>("loading");
  const [error, setError] = useState("");
  const [storyId, setStoryId] = useState<number | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    async function run() {
      await Promise.resolve();
      if (cancelled) return;
      headingRef.current?.focus();
      setText("");
      setError("");
      setStoryId(null);
      setPhase("loading");

      let full = "";
      let buffer = "";
      let finished = false;

      try {
        const response = await fetch("/api/stories", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "text/event-stream" },
          body: JSON.stringify(request),
          signal: controller.signal,
        });

        if (!response.ok || !response.body) {
          const payload = (await response.json().catch(() => null)) as { error?: string } | null;
          if (!cancelled) {
            setError(payload?.error ?? "Не удалось создать сказку. Попробуйте ещё раз.");
            setPhase("error");
          }
          return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const parsedBuffer = takeEvents(buffer);
          buffer = parsedBuffer.rest;

          for (const event of parsedBuffer.events) {
            if (!event || typeof event !== "object") continue;
            const data = event as { chunk?: string; done?: boolean; storyId?: number; error?: string };
            if (data.error) {
              setError(data.error);
              setPhase("error");
              return;
            }
            if (data.chunk) {
              full += data.chunk;
              setText(full);
              setPhase("streaming");
            }
            if (data.done) {
              finished = true;
              setStoryId(typeof data.storyId === "number" ? data.storyId : null);
              setPhase("done");
            }
          }
        }

        if (!cancelled && !finished) {
          setError(
            full.trim()
              ? "Соединение прервалось до конца сказки."
              : "Сказка не получилась. Попробуйте ещё раз.",
          );
          setPhase("error");
        }
      } catch (caught) {
        if (cancelled || (caught instanceof DOMException && caught.name === "AbortError")) return;
        setError("Ошибка соединения с сервером");
        setPhase("error");
      }
    }

    void run();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [attempt, request]);

  const busy = phase === "loading" || phase === "streaming";

  return (
    <section>
      <div className="flex items-start justify-between gap-3">
        <h1 ref={headingRef} tabIndex={-1} className="large-title outline-none">
          {messages.newStory}
        </h1>
        <button type="button" onClick={onNew} className="btn btn-plain shrink-0">
          {messages.parameters}
        </button>
      </div>
      <p className="lede">
        {ageLabel(request.age, locale)} · {languageName(request.language, locale)} · {genreLabel(locale, request.genre)}
      </p>
      <p className="mt-1 text-[0.9375rem]">{request.characters.join(", ")}</p>

      <div className="reading mt-5" aria-busy={busy}>
        {phase !== "done" && text === "" ? (
          <div className="grid gap-3" aria-hidden="true">
            <div className="h-3 w-2/3 rounded-full" style={{ background: "var(--fill)" }} />
            <div className="h-3 rounded-full" style={{ background: "var(--fill)" }} />
            <div className="h-3 w-5/6 rounded-full" style={{ background: "var(--fill)" }} />
          </div>
        ) : null}
        {phase === "done" ? <StoryMarkdown content={text} /> : text ? <p className="story-plain">{text}</p> : null}
        {busy || phase === "done" ? (
          <p className="mt-5 text-[0.9375rem]" style={{ color: "var(--secondary)" }} aria-live="polite">
            {busy ? messages.writing : messages.saved}
          </p>
        ) : null}
        {phase === "error" ? (
          <div className="mt-4" role="alert">
            <p style={{ color: "var(--danger)" }}>{localizeError(error, locale)}</p>
            <button type="button" onClick={onRetry} className="btn btn-gray mt-4 w-full">
              {messages.retry}
            </button>
          </div>
        ) : null}
        {phase === "done" ? (
          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            {storyId ? (
              <Link href={`/stories/${storyId}`} className="btn btn-fill">
                {messages.openStory}
              </Link>
            ) : null}
            <button type="button" onClick={onRetry} className="btn btn-gray">
              {messages.another}
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
