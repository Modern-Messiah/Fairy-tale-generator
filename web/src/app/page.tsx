import type { Metadata } from "next";
import { StoryForm } from "@/components/story-form";

export const metadata: Metadata = {
  title: "Генератор сказок",
};

export default function HomePage() {
  return <StoryForm />;
}
