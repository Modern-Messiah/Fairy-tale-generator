import "server-only";
import { createXai } from "@ai-sdk/xai";
import { streamText } from "ai";
import { buildPrompts } from "@/domain/prompts";
import type { StoryRequest } from "@/domain/schema";
import { getEnv } from "./env";

export async function* generateStoryText(
  input: StoryRequest,
  signal?: AbortSignal,
): AsyncGenerator<string> {
  const env = getEnv();
  const xai = createXai({ apiKey: env.XAI_API_KEY });
  const prompts = buildPrompts(input);
  const result = streamText({
    model: xai(env.XAI_MODEL),
    system: prompts.system,
    prompt: prompts.user,
    temperature: 0.8,
    topP: 0.9,
    maxOutputTokens: 2000,
    abortSignal: signal,
  });

  for await (const chunk of result.textStream) {
    yield chunk;
  }
}
