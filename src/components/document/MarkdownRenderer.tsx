"use client";

import Markdown from "react-markdown";

export function MarkdownRenderer({
  content,
  startEditing,
}: {
  content: string | null | undefined;
  startEditing?: () => void | undefined;
}) {
  const handleClick = () => {
    if (startEditing)
      startEditing();
  };

  return (
    <div
      className="flex prose prose-slate flex-col min-h-[300px] w-full p-4 rounded-xl !max-w-none relative group transition-all duration-200 hover:bg-white/50"
      onClick={handleClick}
    >
      {/* 마크다운 콘텐츠 */}
      <div className="prose-headings:text-slate-800 prose-headings:font-bold prose-p:text-slate-700 prose-p:leading-relaxed prose-strong:text-slate-800 prose-code:bg-slate-100 prose-code:text-slate-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-blockquote:border-l-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:text-slate-700">
        <Markdown>
          {content
            ? content
            : ""}
        </Markdown>
      </div>

      {/* 빈 문서 상태 */}
      {(!content || content.trim() === "") && (
        <div className="flex-1 flex items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-lg py-12 transition-colors duration-200 group-hover:border-slate-300 group-hover:bg-slate-50">
          <div className="text-center">
            <div className="text-4xl mb-2">📝</div>
            <p className="text-sm font-medium">문서가 비어있습니다</p>
          </div>
        </div>
      )}
    </div>
  );
}
