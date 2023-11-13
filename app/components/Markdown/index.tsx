import Markdown from "markdown-to-jsx";

export default function MarkdownComp({ message }: { message: string }) {
  return (
    <div className="prose prose-zinc prose-lg max-w-none overflow-x-hidden break-words">
      <Markdown>{message}</Markdown>
    </div>
  );
}
