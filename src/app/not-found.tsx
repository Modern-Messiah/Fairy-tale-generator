import Link from "next/link";
import { getMessages } from "@/domain/messages";
import { getLocale } from "@/server/locale";

export default async function NotFound() {
  const messages = getMessages(await getLocale());

  return (
    <section className="px-2 py-16 text-center">
      <h1 className="large-title">{messages.notFoundTitle}</h1>
      <p className="lede">{messages.notFoundBody}</p>
      <div className="mx-auto mt-6 grid max-w-xs gap-2">
        <Link href="/" className="btn btn-fill">
          {messages.newStory}
        </Link>
        <Link href="/history" className="btn btn-gray">
          {messages.history}
        </Link>
      </div>
    </section>
  );
}
