import { describe, expect, it } from "vitest";
import { MAX_STORY_CHARS } from "./catalog";
import type { StoryRequest } from "./schema";
import { createStoryStream, type StoryDraft } from "./story-stream";

const request: StoryRequest = {
  age: 7,
  language: "ru",
  genre: "adventure",
  characters: ["Заяц", "Волк"],
};

async function eventsOf(response: Response): Promise<Record<string, unknown>[]> {
  const text = await response.text();
  return text
    .split("\n\n")
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => JSON.parse(block.replace(/^data:\s*/, "")) as Record<string, unknown>);
}

async function* chunks(parts: string[]): AsyncGenerator<string> {
  for (const part of parts) yield part;
}

describe("createStoryStream", () => {
  it("streams chunks and saves the finished story once", async () => {
    const saved: StoryDraft[] = [];
    const response = createStoryStream(request, {
      generate: () => chunks(["Жила-", "была."]),
      save: async (draft) => {
        saved.push(draft);
        return { id: 12 };
      },
    });

    expect(response.headers.get("content-type")).toContain("text/event-stream");
    expect(response.headers.get("cache-control")).toContain("no-cache");
    expect(response.headers.get("x-accel-buffering")).toBe("no");

    const events = await eventsOf(response);
    expect(events).toEqual([
      { chunk: "Жила-" },
      { chunk: "была." },
      { done: true, storyId: 12 },
    ]);
    expect(saved).toEqual([{ ...request, content: "Жила-была." }]);
  });

  it("does not save when generation throws", async () => {
    let saves = 0;
    const response = createStoryStream(request, {
      generate: async function* () {
        yield "Жила";
        throw new Error("boom secret");
      },
      save: async () => {
        saves += 1;
        return { id: 1 };
      },
    });

    const events = await eventsOf(response);
    expect(saves).toBe(0);
    expect(events.at(-1)).toEqual({
      error: "Не удалось создать сказку. Попробуйте ещё раз.",
    });
    expect(JSON.stringify(events)).not.toContain("boom secret");
  });

  it("does not save an empty story", async () => {
    let saves = 0;
    const response = createStoryStream(request, {
      generate: () => chunks(["   "]),
      save: async () => {
        saves += 1;
        return { id: 1 };
      },
    });

    const events = await eventsOf(response);
    expect(saves).toBe(0);
    expect(events.at(-1)).toMatchObject({ error: expect.any(String) });
  });

  it("stops at the length limit and still saves", async () => {
    const huge = "а".repeat(MAX_STORY_CHARS + 20);
    let savedLength = 0;
    const response = createStoryStream(request, {
      generate: () => chunks([huge]),
      save: async (draft) => {
        savedLength = draft.content.length;
        return { id: 3 };
      },
    });

    const events = await eventsOf(response);
    expect(savedLength).toBe(MAX_STORY_CHARS);
    expect(events.at(-1)).toEqual({ done: true, storyId: 3 });
  });

  it("does not save when the request is already aborted", async () => {
    const controller = new AbortController();
    controller.abort();
    let saves = 0;
    const response = createStoryStream(request, {
      signal: controller.signal,
      generate: () => chunks(["Жила-была сказка."]),
      save: async () => {
        saves += 1;
        return { id: 1 };
      },
    });

    const events = await eventsOf(response);
    expect(saves).toBe(0);
    expect(events).toEqual([]);
  });
});
