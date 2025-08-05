"use client";

import invariant from "tiny-invariant";
import { useEffect, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { Type } from "lucide-react";
// import toast from "react-hot-toast";

/**
 * 마크다운 에디터
 * @param initialContent 초기 내용
 * @param updateContent 에디터에서 내용 업데이트할 때 콜백 (optional)
 * @param updateBlur 사용자가 에디터의 포커스를 잃었을 때 콜백 (optional)
 * @param lastCursorPosition 커서 위치 초기값
 * @param cursorHandler 커서 위치를 상위 컴포넌트로 전달하는 콜백 (optional)
 * @constructor
 */
export function TreeMarkdownEditor({
  initialContent = null,
  updateContent = null,
  updateBlur = null,
  lastCursorPosition = null,
  cursorHandler = null,
}: {
  initialContent: string | null | undefined;
  updateContent?: null | ((content: string) => void);
  updateBlur?: null | (() => void);
  lastCursorPosition?: number | null | undefined;
  cursorHandler?: null | ((cursor: number) => void);
}) {
  const [cursorPosition, setCursor] = useState(
    lastCursorPosition ? lastCursorPosition : 0
  );
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleSelect = () => {
    const el = textAreaRef.current;
    invariant(el, "textAreaRef is null");
    if (!el) return;
    setCursor(el.selectionStart);
    if (cursorHandler) cursorHandler(el.selectionStart);
  };

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.focus();
      textAreaRef.current.setSelectionRange(cursorPosition, cursorPosition);
    }
  }, [cursorPosition, textAreaRef]);

  const handleChange = () => {
    const el = textAreaRef.current;
    if (el && updateContent) {
      updateContent(el.value);
    }
  };

  const handleBlur = () => {
    if (updateBlur) updateBlur();
  };

  return (
    <div className="w-full relative">
      {/* 편집기 헤더 */}
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2 text-slate-600">
          <Type className="w-4 h-4" />
          <span className="text-sm font-medium">마크다운 편집기</span>
        </div>
        <div className="flex-1"></div>
        <div className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
          실시간 동기화
        </div>
      </div>

      {/* 텍스트 에어리어 */}
      <div className="relative">
        <TextareaAutosize
          className="w-full border-2 border-slate-200 p-4 rounded-xl bg-white/80 backdrop-blur-sm transition-all duration-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 focus:bg-white resize-none font-mono text-slate-700 leading-relaxed placeholder:text-slate-400"
          minRows={8}
          placeholder="여기에 마크다운으로 문서를 작성하세요..."
          value={initialContent ? initialContent : ""}
          onBlur={handleBlur}
          onChange={handleChange}
          onSelect={handleSelect}
          ref={textAreaRef}
          autoFocus={true}
        />

        {/* 포커스 인디케이터 */}
        <div className="absolute bottom-2 right-2 opacity-50">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* 편집 팁 */}
      <div className="mt-3 text-xs text-slate-500 flex items-center gap-4">
        <span>💡 **굵게**, *기울임*, `코드` 지원</span>
        <span>📝 실시간으로 다른 사용자와 협업</span>
      </div>
    </div>
  );
}
