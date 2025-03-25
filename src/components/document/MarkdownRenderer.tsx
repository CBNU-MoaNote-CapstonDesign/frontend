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
      className="prose"
      onClick={handleClick}
    >
      <Markdown>{content ? content : ""}</Markdown>
    </div>
  );
}