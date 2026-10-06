import "server-only";
import { PAGE_SIZE } from "@/domain/catalog";
import type { StoryDraft } from "@/domain/story-stream";
import { asCharacters, pageCount, storyPreview } from "@/domain/text";
import { getPrisma } from "./db";

export async function saveStory(draft: StoryDraft): Promise<{ id: number }> {
  const story = await getPrisma().story.create({
    data: {
      age: draft.age,
      language: draft.language,
      genre: draft.genre,
      characters: draft.characters,
      content: draft.content,
    },
  });
  return { id: story.id };
}

export async function listStories(page: number) {
  const prisma = getPrisma();
  const total = await prisma.story.count();
  const pages = pageCount(total, PAGE_SIZE);
  const safePage = Math.min(page, pages);
  const rows = await prisma.story.findMany({
    orderBy: { createdAt: "desc" },
    skip: (safePage - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
  });

  return {
    page: safePage,
    pageCount: pages,
    total,
    items: rows.map((row) => ({
      id: row.id,
      age: row.age,
      language: row.language,
      genre: row.genre,
      characters: asCharacters(row.characters),
      preview: storyPreview(row.content),
      createdAt: row.createdAt,
    })),
  };
}

export async function getStory(id: number) {
  const row = await getPrisma().story.findUnique({ where: { id } });
  if (!row) return null;
  return {
    id: row.id,
    age: row.age,
    language: row.language,
    genre: row.genre,
    characters: asCharacters(row.characters),
    content: row.content,
    createdAt: row.createdAt,
  };
}

export async function deleteStory(id: number): Promise<boolean> {
  const prisma = getPrisma();
  const existing = await prisma.story.findUnique({ where: { id }, select: { id: true } });
  if (!existing) return false;
  await prisma.story.delete({ where: { id } });
  return true;
}

export function parseStoryId(raw: string): number | null {
  if (!/^\d+$/.test(raw)) return null;
  const id = Number(raw);
  if (!Number.isSafeInteger(id) || id < 1) return null;
  return id;
}
