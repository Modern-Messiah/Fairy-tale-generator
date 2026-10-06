import { describe, expect, it } from "vitest";
import { validationCopy } from "./messages";
import { createStoryRequestSchema, storyRequestSchema } from "./schema";

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

  it("keeps Russian validation text on the default schema", () => {
    const parsed = storyRequestSchema.safeParse({ ...valid, age: 0 });
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(parsed.error.issues.some((issue) => issue.message === "Укажите возраст от 1 до 10 лет")).toBe(true);
    }
  });

  it("uses Kazakh validation text when the form asks for it", () => {
    const parsed = createStoryRequestSchema(validationCopy("kk")).safeParse({ ...valid, age: 0 });
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(parsed.error.issues.some((issue) => issue.message === "Жас 1-ден 10-ға дейін болуы керек")).toBe(true);
    }
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
