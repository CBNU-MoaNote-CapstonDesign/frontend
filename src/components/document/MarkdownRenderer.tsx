import Markdown from "react-markdown";

export function MarkdownRenderer({content, startEditing}: {
  content: string | null | undefined,
  startEditing: () => void
}) {
  const handleClick = () => {
    startEditing();
  }

  return (
    <div
      className="flex prose flex-col min-h-[300px] w-full border p-2 rounded-xl !max-w-none"
      onClick={handleClick}
    >
      <Markdown>{content ? content : ""}</Markdown>
    </div>
  );
}