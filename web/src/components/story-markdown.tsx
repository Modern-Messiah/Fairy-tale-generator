import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function StoryMarkdown({ content }: { content: string }) {
  return (
    <div className="story-content">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
