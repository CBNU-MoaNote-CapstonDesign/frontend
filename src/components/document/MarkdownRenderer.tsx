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
      className="flex prose flex-col min-h-[300px] w-full p-2 rounded-xl !max-w-none" // border 클래스만 제거
      onClick={handleClick}
    >
      <Markdown>{content ? content : ""}</Markdown>
    </div>
  );
}