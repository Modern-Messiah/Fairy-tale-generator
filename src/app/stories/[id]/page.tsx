import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { genreLabel, languageName } from "@/domain/catalog";
import { getMessages } from "@/domain/messages";
import { ageLabel, formatStoryDate } from "@/domain/text";
import { Chevron } from "@/components/mark";
import { DeleteStoryButton } from "@/components/delete-story-button";
import { StoryMarkdown } from "@/components/story-markdown";
import { getLocale } from "@/server/locale";
import { getStory, parseStoryId } from "@/server/stories";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const messages = getMessages(await getLocale());
  return { title: messages.storyTitle };
}

export default async function StoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: raw } = await params;
  const id = parseStoryId(raw);
  if (!id) notFound();

  const story = await getStory(id);
  if (!story) notFound();

  const locale = await getLocale();
  const messages = getMessages(locale);
  const facts = [
    [messages.factLanguage, languageName(story.language, locale)],
    [messages.factGenre, genreLabel(locale, story.genre)],
    [messages.factAge, ageLabel(story.age, locale)],
    [messages.factCreated, formatStoryDate(story.createdAt)],
  ];

  return (
    <article>
      <p>
        <Link href="/history" className="btn btn-plain gap-1 px-0">
          <Chevron className="chevron rotate-180" />
          {messages.backHistory}
        </Link>
      </p>
      <h1 className="large-title mt-2 text-balance">{story.characters.join(", ")}</h1>

      <dl className="group mt-5">
        {facts.map(([label, value]) => (
          <div key={label} className="row">
            <dt style={{ color: "var(--secondary)" }}>{label}</dt>
            <dd className="ml-auto text-right font-medium break-words">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="reading mt-5">
        <StoryMarkdown content={story.content} />
      </div>

      <div className="mt-4">
        <DeleteStoryButton id={story.id} />
      </div>
    </article>
  );
}
