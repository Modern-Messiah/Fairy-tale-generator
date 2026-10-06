import { deleteStory, getStory, parseStoryId } from "@/server/stories";

export const dynamic = "force-dynamic";

type StoryRouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, ctx: StoryRouteContext) {
  const { id: raw } = await ctx.params;
  const id = parseStoryId(raw);
  if (!id) return Response.json({ error: "Сказка не найдена" }, { status: 404 });

  const story = await getStory(id);
  if (!story) return Response.json({ error: "Сказка не найдена" }, { status: 404 });

  return Response.json({ ...story, createdAt: story.createdAt.toISOString() });
}

export async function DELETE(_request: Request, ctx: StoryRouteContext) {
  const { id: raw } = await ctx.params;
  const id = parseStoryId(raw);
  if (!id) return Response.json({ error: "Сказка не найдена" }, { status: 404 });

  const removed = await deleteStory(id);
  if (!removed) return Response.json({ error: "Сказка не найдена" }, { status: 404 });

  return Response.json({ ok: true });
}
