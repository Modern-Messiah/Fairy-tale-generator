import type { Metadata } from "next";
import { StoryStudio } from "@/components/story-studio";
import { getMessages } from "@/domain/messages";
import { getLocale } from "@/server/locale";

export async function generateMetadata(): Promise<Metadata> {
  const messages = getMessages(await getLocale());
  return { title: messages.newStory };
}

export default function HomePage() {
  return <StoryStudio />;
}
