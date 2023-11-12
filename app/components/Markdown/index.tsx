import Markdown from "markdown-to-jsx";

export default function MarkdownComp({ response }: { response: string }) {
  return (
    <div className="prose prose-zinc prose-lg max-w-none overflow-x-hidden break-words">
      <Markdown>{response}</Markdown>
    </div>
  );
}
