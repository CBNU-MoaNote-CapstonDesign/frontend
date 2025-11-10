"use client";

import { useEffect, useRef } from "react";
import { SelectionRange } from "@/types/selectionRange";
import { Type } from "lucide-react";

/*
 * 각 줄의 시작과 끝에서 caret 을 1 만큼 이동할 때에 (주로 shift + 방향키를 통해서 이러한 이동을 함)
 * 실제 caret 이동이 의도하지 않은 위치로 이동하는 문제가 있음
 */

function selectionToIndex(element: HTMLElement, selection: Selection): SelectionRange {
  let baseOffset = 0;
  let extentOffset = 0;
  let currectOffset = 0;

  function walk(node: Node) {
    // 수정: baseNode → anchorNode, baseOffset → anchorOffset
    if (node === selection.anchorNode) {
      baseOffset = currectOffset + selection.anchorOffset;
    }
    // 수정: extentNode → focusNode, extentOffset → focusOffset
    if (node === selection.focusNode) {
      extentOffset = currectOffset + selection.focusOffset;
      return;
    }
    if (node.nodeType === Node.TEXT_NODE) {
      currectOffset += node.nodeValue?.length || 0;
    } else if (node.nodeType === Node.ELEMENT_NODE) { // 수정: tagName 속성은 Element에 있음
      const element = node as Element;
      if (element.tagName === 'BR') { 
        currectOffset++;
      }
    }
    for (let i = 0; i < node.childNodes.length; i++) {
      walk(node.childNodes[i]);
    }
  }

  walk(element);
  return { baseOffset, extentOffset };
}

function indexToRange(element: HTMLElement, baseOffset: number, extentOffset: number): Range {
  const range = document.createRange();
  let currentOffset = 0;
  let baseNode: Node | null = null;
  let baseNodeOffset = 0;
  let extentNode: Node | null = null;
  let extentNodeOffset = 0;

  function walk(node: Node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const textLength = node.nodeValue?.length || 0;
      if (currentOffset + textLength >= baseOffset && !baseNode) {
        baseNode = node;
        baseNodeOffset = baseOffset - currentOffset;
      }
      if (currentOffset + textLength >= extentOffset && !extentNode) {
        extentNode = node;
        extentNodeOffset = extentOffset - currentOffset;
      }
      currentOffset += textLength;
    } else if (node.nodeType === Node.ELEMENT_NODE) { // 수정: tagName 속성은 Element에 있음
      const element = node as Element;
      if (element.tagName === 'BR') {
        currentOffset++;
      }
    }
    for (let i = 0; i < node.childNodes.length; i++) {
      walk(node.childNodes[i]);
    }
  }

  walk(element);

  if (baseNode && extentNode) {
    range.setStart(baseNode, baseNodeOffset);
    range.setEnd(extentNode, extentNodeOffset);
  }

  return range;
}

function getSelectionRangeIndex(element: HTMLElement): SelectionRange {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return { baseOffset: 0, extentOffset: 0 };

  return selectionToIndex(element, selection);
}

function setSelectionRangeCaret(element: HTMLElement, baseOffset: number, extentOffset: number) {
  if (element.childNodes.length == 0)
    return;

  const range = indexToRange(element, baseOffset, extentOffset);

  const selection = document.getSelection();
  selection?.removeAllRanges();
  selection?.addRange(range);
  selection?.setBaseAndExtent(range.startContainer, range.startOffset, range.endContainer, range.endOffset);
}

/**
 * 마크다운 에디터
 * @deprecated
 * @param initialContent 초기 내용
 * @param updateContent 에디터에서 내용 업데이트할 때 콜백
 * @param lastCursorPosition 커서 위치 초기값
 * @param cursorHandler 커서 위치를 상위 컴포넌트로 전달하는 콜백
 */
export function TreeMarkdownEditor({
  initialContent = null,
  updateContent,
  lastCursorPosition,
  cursorHandler,
  onBlur
}: {
  initialContent: string | null | undefined,
  updateContent: (content: string) => void,
  lastCursorPosition: SelectionRange,
  cursorHandler: ((cursor: SelectionRange) => void),
  onBlur?: () => void
}) {
  const editorRef = useRef<HTMLDivElement>(null);
  const selectionRange = lastCursorPosition ? lastCursorPosition : { baseOffset: 0, extentOffset: 0 };

  // 입력 시 텍스트 및 커서/선택 범위 저장
  const handleInput = () => {
    const el = editorRef.current;
    if (!el) return;

    updateContent(el.innerText);
    const range = getSelectionRangeIndex(el);
    cursorHandler(range);
  };

  // 선택 변경 시 selection 범위 업데이트
  const handleSelectionChange = () => {
    const el = editorRef.current;
    if (!el || document.activeElement !== el) return;

    const range = getSelectionRangeIndex(el);
    cursorHandler(range);
  };

  // 붙여넣기 처리
  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const text = e.clipboardData?.getData('text/plain');
    document.execCommand('insertText', false, text ? text : '');
  };

  // content 가 바뀌면 내부 반영
  useEffect(() => {
    const el = editorRef.current;
    if (el && el.innerText !== initialContent) {
      el.innerText = initialContent ? initialContent : '';
      setSelectionRangeCaret(el, selectionRange.baseOffset, selectionRange.extentOffset);
    }
  }, [initialContent]);

  // selectionRange 가 바뀌면 반영
  useEffect(() => {
    const el = editorRef.current;
    if (el) {
      setSelectionRangeCaret(el, selectionRange.baseOffset, selectionRange.extentOffset);
    }
  }, [selectionRange.baseOffset, selectionRange.extentOffset]);

  // selectionchange 감지
  useEffect(() => {
    document.addEventListener('selectionchange', handleSelectionChange);
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, []);

  // placeholder 표시
  const showPlaceholder = !initialContent || initialContent.length === 0;

  return (
    <div className="w-full relative">
      {/* 편집기 헤더 */}
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2 text-slate-600">
          <Type className="w-4 h-4" />
          <span className="text-sm font-medium">마크다운 편집기</span>
        </div>
        <div className="flex-1"></div>
      </div>

      {/* 텍스트 에디터 */}
      <div className="relative">
        <div
          className="w-full border-2 border-slate-200 p-4 rounded-xl bg-white/80 backdrop-blur-sm transition-all duration-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 focus:bg-white resize-none font-mono text-slate-700 leading-relaxed placeholder:text-slate-400"
          style={{
            minHeight: '100px',
            fontSize: '16px',
            whiteSpace: 'pre-wrap',
            outline: 'none',
            position: 'relative'
          }}
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onPaste={handlePaste}
          onBlur={() => {
            if (onBlur) onBlur();
          }}
          suppressContentEditableWarning
        />
        {showPlaceholder && (
          <div
            style={{
              position: 'absolute',
              left: 16,
              top: 16,
              color: '#94a3b8',
              pointerEvents: 'none',
              fontSize: '16px'
            }}
          >
            여기에 마크다운으로 문서를 작성하세요...
          </div>
        )}

        {/* 포커스 인디케이터 */}
        <div className="absolute bottom-2 right-2 opacity-50">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* 편집 팁 */}
      <div className="mt-3 text-xs text-slate-500 flex items-center gap-4">
        <span>💡 <b>**굵게**</b>, <i>*기울임*</i>, <code>`코드`</code> 지원</span>
        <span>📝 실시간으로 다른 사용자와 협업</span>
      </div>
    </div>
  );
}