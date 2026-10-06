import { MAX_STORY_CHARS } from "./catalog";
import type { StoryRequest } from "./schema";

export type StoryDraft = StoryRequest & { content: string };

export type StoryStreamDeps = {
  generate: (input: StoryRequest, signal?: AbortSignal) => AsyncIterable<string>;
  save: (draft: StoryDraft) => Promise<{ id: number }>;
  signal?: AbortSignal;
};

export const STORY_STREAM_HEADERS = {
  "Content-Type": "text/event-stream; charset=utf-8",
  "Cache-Control": "no-cache, no-transform",
  Connection: "keep-alive",
  "X-Accel-Buffering": "no",
} as const;

export function encodeSse(data: unknown): string {
  return `data: ${JSON.stringify(data)}\n\n`;
}

export function createStoryStream(input: StoryRequest, deps: StoryStreamDeps): Response {
  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (data: unknown) => {
        controller.enqueue(encoder.encode(encodeSse(data)));
      };

      let content = "";

      try {
        if (deps.signal?.aborted) return;

        for await (const chunk of deps.generate(input, deps.signal)) {
          if (deps.signal?.aborted) return;
          if (!chunk) continue;

          const room = MAX_STORY_CHARS - content.length;
          if (room <= 0) break;

          const piece = chunk.length > room ? chunk.slice(0, room) : chunk;
          content += piece;
          send({ chunk: piece });
          if (piece.length < chunk.length) break;
        }

        if (deps.signal?.aborted) return;

        if (!content.trim()) {
          send({ error: "Сказка не получилась. Попробуйте ещё раз." });
          return;
        }

        const saved = await deps.save({ ...input, content });
        send({ done: true, storyId: saved.id });
      } catch (error) {
        if (deps.signal?.aborted) return;
        console.error("Story generation failed", error);
        send({ error: "Не удалось создать сказку. Попробуйте ещё раз." });
      } finally {
        try {
          controller.close();
        } catch {
          // The stream is already closed when the client disconnects.
        }
      }
    },
  });

  return new Response(stream, { headers: STORY_STREAM_HEADERS });
}
