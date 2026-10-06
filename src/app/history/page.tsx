import type { Metadata } from "next";
import Link from "next/link";
import { genreLabel, languageName } from "@/domain/catalog";
import { getMessages } from "@/domain/messages";
import { ageLabel, formatStoryDate, parsePage } from "@/domain/text";
import { Chevron, Mark } from "@/components/mark";
import { Pagination } from "@/components/pagination";
import { getLocale } from "@/server/locale";
import { listStories } from "@/server/stories";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const messages = getMessages(await getLocale());
  return { title: messages.historyTitle };
}

export default async function HistoryPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[] }>;
}) {
  const params = await searchParams;
  const locale = await getLocale();
  const messages = getMessages(locale);
  const result = await listStories(parsePage(params.page));

  return (
    <section>
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="large-title">{messages.history}</h1>
          <p className="lede">{messages.newestFirst}</p>
        </div>
        <Link href="/" className="btn btn-plain shrink-0">
          {messages.newShort}
        </Link>
      </div>

      {result.total === 0 ? (
        <div className="px-6 py-16 text-center">
          <span
            className="mx-auto grid h-14 w-14 place-items-center rounded-full"
            style={{ background: "var(--fill)", color: "var(--tint)" }}
          >
            <Mark className="h-7 w-7" />
          </span>
          <h2 className="mt-4 text-[1.375rem] font-semibold tracking-[-0.02em]">{messages.emptyTitle}</h2>
          <p className="mx-auto mt-1 max-w-xs" style={{ color: "var(--secondary)" }}>
            {messages.emptyBody}
          </p>
          <Link href="/" className="btn btn-fill mx-auto mt-6 max-w-xs">
            {messages.createStory}
          </Link>
        </div>
      ) : (
        <>
          <ul className="group mt-6">
            {result.items.map((story) => (
              <li key={story.id}>
                <Link href={`/stories/${story.id}`} className="row row-link">
                  <span className="row-copy">
                    <span className="row-title block">{story.characters.join(", ")}</span>
                    <span className="row-sub block">
                      {languageName(story.language, locale)} · {genreLabel(locale, story.genre)} ·{" "}
                      {ageLabel(story.age, locale)} · {formatStoryDate(story.createdAt)}
                    </span>
                    <span className="row-preview block line-clamp-2">{story.preview}</span>
                  </span>
                  <span style={{ color: "var(--secondary)" }}>
                    <Chevron />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <Pagination
            page={result.page}
            pageCount={result.pageCount}
            label={messages.pages}
            line={messages.pageLine(result.page, result.pageCount)}
          />
        </>
      )}
    </section>
  );
}
