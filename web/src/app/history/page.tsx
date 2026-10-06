import type { Metadata } from "next";
import Link from "next/link";
import { genreLabel, languageBadge } from "@/domain/catalog";
import { formatStoryDate, parsePage } from "@/domain/text";
import { Pagination } from "@/components/pagination";
import { listStories } from "@/server/stories";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "История сказок",
};

export default async function HistoryPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[] }>;
}) {
  const params = await searchParams;
  const result = await listStories(parsePage(params.page));

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold">История сказок</h1>
          <p className="mt-2 text-stone-700">Все ваши сказочные истории в одном месте</p>
        </div>
        <Link
          href="/"
          className="rounded-xl bg-gradient-to-br from-[#667eea] to-[#764ba2] px-5 py-3 font-semibold text-white"
        >
          Создать новую сказку
        </Link>
      </div>

      {result.total === 0 ? (
        <div className="rounded-3xl bg-white px-6 py-16 text-center shadow-lg">
          <p className="text-5xl" aria-hidden="true">
            📖
          </p>
          <h2 className="mt-4 text-2xl font-bold text-stone-700">История сказок пуста</h2>
          <p className="mt-2 text-stone-600">Создайте свою первую волшебную сказку прямо сейчас.</p>
          <Link
            href="/"
            className="mt-6 inline-block rounded-xl bg-gradient-to-br from-[#667eea] to-[#764ba2] px-5 py-3 font-semibold text-white"
          >
            Создать первую сказку
          </Link>
        </div>
      ) : (
        <>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {result.items.map((story) => (
              <li key={story.id} className="flex flex-col rounded-2xl bg-white p-5 shadow-md">
                <p className="self-end rounded-l-lg bg-gradient-to-br from-[#667eea] to-[#764ba2] px-3 py-1 text-sm font-semibold text-white">
                  {languageBadge(story.language)}
                </p>
                <h2 className="mt-3 text-lg font-bold text-[#4c51bf]">
                  Сказка для {story.age}-летнего ребенка
                </h2>
                <p className="mt-1 text-sm text-stone-500">{formatStoryDate(story.createdAt)}</p>
                <p className="mt-3 text-sm font-semibold">Жанр: {genreLabel(story.language, story.genre)}</p>
                <p className="mt-2 text-sm text-stone-700">
                  {story.characters.slice(0, 3).join(", ")}
                  {story.characters.length > 3 ? ` +${story.characters.length - 3}` : ""}
                </p>
                <p className="mt-3 line-clamp-3 flex-1 text-sm text-stone-600">{story.preview}</p>
                <Link
                  href={`/stories/${story.id}`}
                  className="mt-4 rounded-xl bg-gradient-to-br from-[#667eea] to-[#764ba2] px-4 py-2 text-center font-semibold text-white"
                >
                  Читать сказку
                </Link>
              </li>
            ))}
          </ul>
          <Pagination page={result.page} pageCount={result.pageCount} />
        </>
      )}
    </div>
  );
}
