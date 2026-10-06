import { describe, expect, it } from "vitest";
import { buildPrompts } from "./prompts";
import type { StoryRequest } from "./schema";

const russian: StoryRequest = {
  age: 7,
  language: "ru",
  genre: "animals",
  characters: ["Заяц", "Волк", "Лиса"],
};

const kazakh: StoryRequest = {
  age: 6,
  language: "kk",
  genre: "magic",
  characters: ["Алдар Көсе", "Ер Төстік"],
};

describe("buildPrompts", () => {
  it("writes the Russian prompt with age, genre and characters", () => {
    const prompts = buildPrompts(russian);
    expect(prompts.system).toContain("РУССКОМ");
    expect(prompts.system).toContain("7 лет");
    expect(prompts.system).toContain("Сказка о животных");
    expect(prompts.user).toContain("Заяц, Волк, Лиса");
    expect(prompts.user).toContain("русском языке");
  });

  it("writes the Kazakh prompt with a translated genre and a closing line", () => {
    const prompts = buildPrompts(kazakh);
    expect(prompts.system).toContain("қазақ тілі");
    expect(prompts.system).toContain("6 жас");
    expect(prompts.system).toContain("Сиқырлы ертегі");
    expect(prompts.user).toContain("Алдар Көсе, Ер Төстік");
    expect(prompts.user).toContain('Соңында "Түйін:"');
  });
});
