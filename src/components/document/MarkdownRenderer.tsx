"use client";

import Markdown from "react-markdown";
import { MousePointer2 } from "lucide-react";

export function MarkdownRenderer({
  content,
  startEditing,
}: {
  content: string | null | undefined;
  startEditing: () => void;
}) {
  const handleClick = () => {
    startEditing();
  };

  return (
    <div
      className="flex prose prose-slate flex-col min-h-[300px] w-full p-4 rounded-xl !max-w-none relative group transition-all duration-200 hover:bg-white/50"
      onClick={handleClick}
    >
      {/* 편집 힌트 */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1 text-xs text-slate-500 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full border border-slate-200">
        <MousePointer2 className="w-3 h-3" />
        클릭하여 편집
      </div>

      {/* 마크다운 콘텐츠 */}
      <div className="prose-headings:text-slate-800 prose-headings:font-bold prose-p:text-slate-700 prose-p:leading-relaxed prose-strong:text-slate-800 prose-code:bg-slate-100 prose-code:text-slate-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-blockquote:border-l-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:text-slate-700">
        <Markdown>
          {content
            ? content
            : "문서가 비어있습니다. 클릭하여 내용을 추가하세요."}
        </Markdown>
      </div>

      {/* 빈 문서 상태 */}
      {(!content || content.trim() === "") && (
        <div className="flex-1 flex items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-lg py-12 transition-colors duration-200 group-hover:border-slate-300 group-hover:bg-slate-50">
          <div className="text-center">
            <div className="text-4xl mb-2">📝</div>
            <p className="text-sm font-medium">문서가 비어있습니다</p>
            <p className="text-xs mt-1">클릭하여 내용을 추가하세요</p>
          </div>
        </div>
      )}
    </div>
  );
}
