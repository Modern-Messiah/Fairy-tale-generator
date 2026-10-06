import { z } from "zod";
import { CHARACTER_VALUES, GENRES, LANGUAGES } from "./catalog";
import { validationCopy, type ValidationCopy } from "./messages";

export function createStoryRequestSchema(copy: ValidationCopy = validationCopy("ru")) {
  return z
    .object({
      age: z
        .number({ error: copy.age })
        .int({ error: copy.age })
        .min(1, { error: copy.age })
        .max(10, { error: copy.age }),
      language: z.enum(LANGUAGES, { error: copy.language }),
      genre: z.enum(GENRES, { error: copy.genre }),
      characters: z
        .array(z.string(), { error: copy.characters })
        .min(2, { error: copy.charactersMin })
        .max(5, { error: copy.charactersMax }),
    })
    .superRefine((value, ctx) => {
      const cleaned = value.characters.map((name) => name.trim());

      if (cleaned.some((name) => name.length === 0)) {
        ctx.addIssue({
          code: "custom",
          path: ["characters"],
          message: copy.charactersEmpty,
        });
      }

      if (cleaned.some((name) => name.length > 50)) {
        ctx.addIssue({
          code: "custom",
          path: ["characters"],
          message: copy.charactersLong,
        });
      }

      if (new Set(cleaned).size !== cleaned.length) {
        ctx.addIssue({
          code: "custom",
          path: ["characters"],
          message: copy.charactersDuplicate,
        });
      }

      const unknown = cleaned.find((name) => name.length > 0 && !CHARACTER_VALUES.has(name));
      if (unknown) {
        ctx.addIssue({
          code: "custom",
          path: ["characters"],
          message: copy.charactersUnknown,
        });
      }
    });
}

export const storyRequestSchema = createStoryRequestSchema();

export type StoryRequest = z.infer<typeof storyRequestSchema>;

export function issueMessages(error: z.ZodError): { path: string; message: string }[] {
  return error.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
  }));
}
