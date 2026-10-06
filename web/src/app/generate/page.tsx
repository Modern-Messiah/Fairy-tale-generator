import type { Metadata } from "next";
import { StoryStream } from "@/components/story-stream";

export const metadata: Metadata = {
  title: "Генерация сказки",
};

export default function GeneratePage() {
  return <StoryStream />;
}
