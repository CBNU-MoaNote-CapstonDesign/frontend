import {useEffect, useRef, useState} from "react";
import {SelectionRange} from "@/types/selectionRange";

/*
 * 각 줄의 시작과 끝에서 caret 을 1 만큼 이동할 때에 (주로 shift + 방향키를 통해서 이러한 이동을 함)
 * 실제 caret 이동이 의도하지 않은 위치로 이동하는 문제가 있음
 */

function selectionToIndex(element: HTMLElement, selection: Selection): SelectionRange {
  let baseOffset = 0;
  let extentOffset = 0;
  let currectOffset = 0;

  function walk(node: Node) {
    if (node === selection.baseNode) {
      baseOffset = currectOffset + selection.baseOffset;
    }
    if (node === selection.extentNode) {
      extentOffset = currectOffset + selection.extentOffset;
      return;
    }
    if (node.nodeType === Node.TEXT_NODE) {
      currectOffset += node.nodeValue?.length || 0;
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      if (node.tagName === 'BR') {
        currectOffset++;
      }
    }
    for (let i = 0; i < node.childNodes.length; i++) {
      walk(node.childNodes[i]);
    }
  }

  walk(element);
  return {baseOffset, extentOffset};
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
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      if (node.tagName === 'BR') {
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
  if (!selection || selection.rangeCount === 0) return {baseOffset: 0, extentOffset: 0};

  return selectionToIndex(element, selection);
}

function setSelectionRangeCaret(element: HTMLElement, baseOffset: number, extentOffset: number) {
  if (element.childNodes.length == 0)
    return;

  debugger;
  const range = indexToRange(element, baseOffset, extentOffset);

  const newRange = indexToRange(element, baseOffset, extentOffset);

  const selection = document.getSelection();
  selection?.removeAllRanges();
  selection?.addRange(newRange);
  selection?.setBaseAndExtent(range.startContainer, range.startOffset, range.endContainer, range.endOffset);
}

/**
 * 마크다운 에디터
 * @param initialContent 초기 내용
 * @param updateContent 에디터에서 내용 업데이트할 때 콜백 (optional)
 * @param lastCursorPosition 커서 위치 초기값
 * @param cursorHandler 커서 위치를 상위 컴포넌트로 전달하는 콜백 (optional)
 * @constructor
 */
export function TreeMarkdownEditor({initialContent = null, updateContent, lastCursorPosition, cursorHandler}: {
  initialContent: string | null | undefined,
  updateContent: (content: string) => void,
  lastCursorPosition: SelectionRange,
  cursorHandler: ((cursor: SelectionRange) => void)
}) {

  const editorRef = useRef<HTMLDivElement>(null);

  const selectionRange = lastCursorPosition ? lastCursorPosition : {baseOffset: 0, extentOffset: 0};

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
    debugger;
    const el = editorRef.current;
    if (!el || document.activeElement !== el) return;

    const range = getSelectionRangeIndex(el);
    cursorHandler(range);
  };

  // 붙여넣기 처리
  const handlePaste = (e) => {
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

  return (
    <div className="w-full">
      <div
        className="w-full border p-2 rounded-xl"
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onPaste={handlePaste}
        suppressContentEditableWarning
        style={{
          border: '1px solid #ccc',
          padding: '10px',
          borderRadius: '8px',
          minHeight: '100px',
          fontSize: '16px',
          whiteSpace: 'pre-wrap',
          outline: 'none',
        }}
      />
    </div>
  );
}