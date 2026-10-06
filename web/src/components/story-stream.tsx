"use client";

import { genreLabel, languageLabel, STORY_REQUEST_STORAGE_KEY } from "@/domain/catalog";
import { storyRequestSchema, type StoryRequest } from "@/domain/schema";
import Link from "next/link";
import { useEffect, useState } from "react";
import { StoryMarkdown } from "./story-markdown";

type Phase = "loading" | "streaming" | "done" | "error" | "missing";

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

export function StoryStream() {
  const [request, setRequest] = useState<StoryRequest | null>(null);
  const [text, setText] = useState("");
  const [phase, setPhase] = useState<Phase>("loading");
  const [error, setError] = useState("");
  const [storyId, setStoryId] = useState<number | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    async function run() {
      await Promise.resolve();
      if (cancelled) return;

      const raw = sessionStorage.getItem(STORY_REQUEST_STORAGE_KEY);
      if (!raw) {
        setPhase("missing");
        return;
      }

      let parsed: unknown;
      try {
        parsed = JSON.parse(raw);
      } catch {
        setPhase("missing");
        return;
      }

      const result = storyRequestSchema.safeParse(parsed);
      if (!result.success) {
        setPhase("missing");
        return;
      }

      const input: StoryRequest = result.data;
      sessionStorage.removeItem(STORY_REQUEST_STORAGE_KEY);
      setRequest(input);
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
          body: JSON.stringify(input),
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
  }, [attempt]);

  if (phase === "missing") {
    return (
      <div className="mx-auto max-w-xl rounded-3xl bg-white p-8 text-center shadow-xl">
        <h1 className="text-2xl font-bold">Данные формы не найдены</h1>
        <p className="mt-3 text-stone-600">Заполните форму ещё раз, и сказка начнёт создаваться.</p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-xl bg-gradient-to-br from-[#667eea] to-[#764ba2] px-5 py-3 font-semibold text-white"
        >
          К форме
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-4 text-center text-3xl font-bold">Генерация сказки</h1>
      {request ? (
        <section className="mb-4 grid gap-4 rounded-3xl bg-white p-5 text-center shadow-lg sm:grid-cols-2">
          <p>
            <span className="block text-2xl">👶</span>
            <strong>Возраст:</strong> {request.age} лет
          </p>
          <p>
            <span className="block text-2xl">🌍</span>
            <strong>Язык:</strong> {languageLabel(request.language)}
          </p>
          <p>
            <span className="block text-2xl">📖</span>
            <strong>Жанр:</strong> {genreLabel(request.language, request.genre)}
          </p>
          <p>
            <span className="block text-2xl">🎭</span>
            <strong>Персонажи:</strong> {request.characters.join(", ")}
          </p>
        </section>
      ) : null}

      <section className="rounded-3xl bg-white p-6 shadow-xl sm:p-8" aria-live="polite">
        {phase === "done" ? <StoryMarkdown content={text} /> : <p className="story-plain">{text}</p>}
        {phase === "streaming" || phase === "loading" ? (
          <p className="mt-6 text-center text-stone-600">
            <span className="mr-2 inline-block h-3 w-3 animate-pulse rounded-full bg-[#667eea]" />
            Создаю волшебную сказку...
          </p>
        ) : null}
        {phase === "error" ? (
          <div className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-red-800" role="alert">
            <p>{error}</p>
            <button
              type="button"
              className="mt-3 font-semibold underline"
              onClick={() => {
                if (request) {
                  sessionStorage.setItem(STORY_REQUEST_STORAGE_KEY, JSON.stringify(request));
                  setAttempt((value) => value + 1);
                }
              }}
            >
              Повторить
            </button>
          </div>
        ) : null}
        {phase === "done" ? (
          <div className="mt-8 text-center">
            <p className="mb-4 rounded-xl bg-emerald-50 px-4 py-3 text-emerald-800">Сказка успешно создана!</p>
            <div className="flex flex-wrap justify-center gap-3">
              {storyId ? (
                <Link
                  href={`/stories/${storyId}`}
                  className="rounded-xl bg-gradient-to-br from-[#667eea] to-[#764ba2] px-5 py-3 font-semibold text-white"
                >
                  Посмотреть в истории
                </Link>
              ) : null}
              <Link href="/" className="rounded-xl border-2 border-stone-200 px-5 py-3 font-semibold">
                Создать ещё
              </Link>
              <Link href="/history" className="rounded-xl border-2 border-stone-200 px-5 py-3 font-semibold">
                История
              </Link>
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}
