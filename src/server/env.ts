import "server-only";
import { z } from "zod";

const envSchema = z.object({
  XAI_API_KEY: z.string().default(""),
  XAI_MODEL: z.string().min(1).default("grok-4.7"),
});

export type AppEnv = z.infer<typeof envSchema>;

let cached: AppEnv | undefined;

export function getEnv(): AppEnv {
  if (!cached) {
    const model = process.env.XAI_MODEL?.trim();
    cached = envSchema.parse({
      XAI_API_KEY: process.env.XAI_API_KEY?.trim() ?? "",
      XAI_MODEL: model ? model : undefined,
    });
  }
  return cached;
}
