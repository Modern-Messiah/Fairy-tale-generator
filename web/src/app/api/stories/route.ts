import { createStoryStream } from "@/domain/story-stream";
import { issueMessages, storyRequestSchema } from "@/domain/schema";
import { parsePage } from "@/domain/text";
import { generateStoryText } from "@/server/ai";
import { getEnv } from "@/server/env";
import { listStories, saveStory } from "@/server/stories";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const page = parsePage(new URL(request.url).searchParams.get("page") ?? undefined);
  const result = await listStories(page);
  return Response.json({
    ...result,
    items: result.items.map((item) => ({
      ...item,
      createdAt: item.createdAt.toISOString(),
    })),
  });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Некорректный JSON" }, { status: 400 });
  }

  const parsed = storyRequestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Проверьте поля формы", issues: issueMessages(parsed.error) },
      { status: 422 },
    );
  }

  if (!getEnv().XAI_API_KEY) {
    return Response.json({ error: "Ключ модели не настроен" }, { status: 503 });
  }

  return createStoryStream(parsed.data, {
    signal: request.signal,
    generate: generateStoryText,
    save: saveStory,
  });
}
