import { describe, expect, it } from "vitest";
import { storyRequestSchema } from "./schema";

const valid = {
  age: 7,
  language: "ru",
  genre: "adventure",
  characters: ["Заяц", "Волк"],
};

describe("storyRequestSchema", () => {
  it("accepts a complete request", () => {
    expect(storyRequestSchema.safeParse(valid).success).toBe(true);
  });

  it.each([
    [{ ...valid, age: 0 }, "age"],
    [{ ...valid, age: 11 }, "age"],
    [{ ...valid, age: 18 }, "age"],
    [{ ...valid, age: 6.5 }, "age"],
    [{ ...valid, language: "en" }, "language"],
    [{ ...valid, genre: "horror" }, "genre"],
    [{ ...valid, characters: ["Заяц"] }, "characters"],
    [{ ...valid, characters: ["Заяц", "Волк", "Лиса", "Медведь", "Колобок", "Маша"] }, "characters"],
    [{ ...valid, characters: ["Заяц", "Заяц"] }, "characters"],
    [{ ...valid, characters: ["Заяц", "  "] }, "characters"],
    [{ ...valid, characters: ["Заяц", "Неизвестный"] }, "characters"],
    [{ ...valid, characters: ["Заяц", "А".repeat(51)] }, "characters"],
  ])("rejects %#", (input) => {
    expect(storyRequestSchema.safeParse(input).success).toBe(false);
  });

  it("accepts a Kazakh pair from the catalog", () => {
    const parsed = storyRequestSchema.safeParse({
      age: 6,
      language: "kk",
      genre: "magic",
      characters: ["Алдар Көсе", "Ер Төстік"],
    });
    expect(parsed.success).toBe(true);
  });
});
