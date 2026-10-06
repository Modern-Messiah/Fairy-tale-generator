import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { genreLabel, languageBadge, languageLabel } from "@/domain/catalog";
import { formatStoryDate } from "@/domain/text";
import { DeleteStoryButton } from "@/components/delete-story-button";
import { StoryMarkdown } from "@/components/story-markdown";
import { getStory, parseStoryId } from "@/server/stories";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Сказка",
};

export default async function StoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: raw } = await params;
  const id = parseStoryId(raw);
  if (!id) notFound();

  const story = await getStory(id);
  if (!story) notFound();

  return (
    <article className="mx-auto max-w-3xl">
      <div className="mb-4 flex flex-wrap gap-3">
        <Link href="/history" className="rounded-xl border-2 border-stone-300 bg-white px-4 py-2 font-semibold">
          Назад к истории
        </Link>
        <Link
          href="/"
          className="rounded-xl bg-gradient-to-br from-[#667eea] to-[#764ba2] px-4 py-2 font-semibold text-white"
        >
          Новая сказка
        </Link>
      </div>

      <section className="mb-4 overflow-hidden rounded-3xl bg-white shadow-lg">
        <div className="flex items-center justify-between gap-3 bg-gradient-to-br from-[#667eea] to-[#764ba2] px-5 py-4 text-white">
          <h1 className="text-xl font-bold">Информация о сказке</h1>
          <span className="rounded-lg bg-white/20 px-3 py-1">{languageBadge(story.language)}</span>
        </div>
        <dl className="grid gap-3 p-5 sm:grid-cols-2">
          <div className="rounded-xl bg-stone-50 p-3">
            <dt className="text-sm text-stone-500">Возраст</dt>
            <dd className="text-lg font-bold">{story.age} лет</dd>
          </div>
          <div className="rounded-xl bg-stone-50 p-3">
            <dt className="text-sm text-stone-500">Язык</dt>
            <dd className="text-lg font-bold">{languageLabel(story.language)}</dd>
          </div>
          <div className="rounded-xl bg-stone-50 p-3">
            <dt className="text-sm text-stone-500">Жанр</dt>
            <dd className="text-lg font-bold">{genreLabel(story.language, story.genre)}</dd>
          </div>
          <div className="rounded-xl bg-stone-50 p-3">
            <dt className="text-sm text-stone-500">Создана</dt>
            <dd className="text-lg font-bold">{formatStoryDate(story.createdAt)}</dd>
          </div>
        </dl>
        <div className="px-5 pb-5">
          <p className="mb-2 font-semibold">Герои сказки</p>
          <ul className="flex flex-wrap gap-2">
            {story.characters.map((character) => (
              <li key={character} className="rounded-lg border-2 border-amber-300 bg-amber-50 px-3 py-1">
                {character}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="rounded-3xl bg-white p-6 shadow-xl sm:p-10">
        <StoryMarkdown content={story.content} />
        <p className="mt-8 text-center text-stone-500 italic">Конец сказки</p>
      </section>

      <div className="mt-6">
        <DeleteStoryButton id={story.id} />
      </div>
    </article>
  );
}
