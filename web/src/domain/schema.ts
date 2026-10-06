import { z } from "zod";
import { CHARACTER_VALUES, GENRES, LANGUAGES } from "./catalog";

const ageError = "Укажите возраст от 1 до 10 лет";

export const storyRequestSchema = z
  .object({
    age: z
      .number({ error: ageError })
      .int({ error: ageError })
      .min(1, { error: ageError })
      .max(10, { error: ageError }),
    language: z.enum(LANGUAGES, { error: "Выберите язык сказки" }),
    genre: z.enum(GENRES, { error: "Выберите жанр сказки" }),
    characters: z
      .array(z.string(), { error: "Выберите персонажей" })
      .min(2, { error: "Выберите минимум 2 персонажа" })
      .max(5, { error: "Выберите не более 5 персонажей" }),
  })
  .superRefine((value, ctx) => {
    const cleaned = value.characters.map((name) => name.trim());

    if (cleaned.some((name) => name.length === 0)) {
      ctx.addIssue({
        code: "custom",
        path: ["characters"],
        message: "Персонажи не могут быть пустыми строками",
      });
    }

    if (cleaned.some((name) => name.length > 50)) {
      ctx.addIssue({
        code: "custom",
        path: ["characters"],
        message: "Имя персонажа слишком длинное",
      });
    }

    if (new Set(cleaned).size !== cleaned.length) {
      ctx.addIssue({
        code: "custom",
        path: ["characters"],
        message: "Персонажи не должны повторяться",
      });
    }

    const unknown = cleaned.find((name) => name.length > 0 && !CHARACTER_VALUES.has(name));
    if (unknown) {
      ctx.addIssue({
        code: "custom",
        path: ["characters"],
        message: "Выберите персонажей из списка",
      });
    }
  });

export type StoryRequest = z.infer<typeof storyRequestSchema>;

export function issueMessages(error: z.ZodError): { path: string; message: string }[] {
  return error.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
  }));
}
