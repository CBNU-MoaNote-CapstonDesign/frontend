import invariant from 'tiny-invariant';
import React, {useEffect, useRef, useState} from "react";
import TextareaAutosize from "react-textarea-autosize";
import {CursorPosition} from "@/types/cursor";
import {flushSync} from "react-dom";

//import toast from "react-hot-toast";

/**
 * 마크다운 에디터
 * @param initialContent 초기 내용
 * @param updateContent 에디터에서 내용 업데이트할 때 콜백 (optional)
 * @param updateBlur 사용자가 에디터의 포커스를 잃었을 때 콜백 (optional)
 * @param cursorPosition 커서 위치
 * @param cursorHandler 커서 위치를 상위 컴포넌트로 전달하는 콜백 (optional)
 * @constructor
 */
export function TreeMarkdownEditor({
                                     initialContent = null,
                                     updateContent = null,
                                     updateBlur = null,
                                     cursorPosition = null,
                                     cursorHandler = null,
                                   }: {
  initialContent: string | null | undefined,
  updateContent?: null | ((content: string) => void),
  updateBlur?: null | (() => void),
  cursorPosition?: CursorPosition | null | undefined,
  cursorHandler?: null | ((start: number, end: number) => void),
}) {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  if (textAreaRef.current && cursorPosition && cursorPosition.start && cursorPosition.end) {
    console.log('TreeMarkdownEditor cursorPosition', cursorPosition);
    textAreaRef.current.setSelectionRange(cursorPosition.start.key as number + 1, cursorPosition.end.key as number + 1);
  }

  const handleSelect = () => {
    const el = textAreaRef?.current;
    invariant(el, "textAreaRef is null");
    if (!el)
      return;
    console.log('handleSelect', el.selectionStart, el.selectionEnd);
    if (cursorHandler)
      cursorHandler(el.selectionStart, el.selectionEnd);
  }

  useEffect(() => {
    console.log('useEffect cursorPosition', cursorPosition?.start.key as number + 1, cursorPosition?.end.key as number + 1);
    if (textAreaRef?.current && cursorPosition) {
      textAreaRef?.current.setSelectionRange(cursorPosition.start.key as number + 1, cursorPosition.end.key as number + 1);
    }
  }, [cursorPosition, textAreaRef]);

  useEffect(() => {
    requestAnimationFrame(() => {
      if (textAreaRef && textAreaRef.current) {
        console.log('useEffect textAreaRef', textAreaRef.current?.selectionStart, textAreaRef.current?.selectionEnd);
        textAreaRef.current?.setSelectionRange(cursorPosition?.start.key as number + 1, cursorPosition?.end.key as number + 1);
      }
    });
  }, [initialContent]);

  const handleChange = () => {
    const el = textAreaRef?.current;
    if (el && updateContent) {
      updateContent(el.value);
    }
  }

  const handleBlur = () => {
    if (updateBlur)
      updateBlur();
  }

  return (
    <div className="w-full">
      <TextareaAutosize
        className="w-full border p-2 rounded-xl"
        minRows={5}
        placeholder={"Type Document Here..."}
        value={initialContent ? initialContent : ""}
        onBlur={handleBlur}
        onChange={handleChange}
        onSelect={handleSelect}
        ref={textAreaRef}
        autoFocus={true}
      />
      <p>
        cursorStart={cursorPosition?.start.key as number + 1}
        cursorEnd={cursorPosition?.end.key as number + 1}
      </p>
      <p>
        selectionStart={textAreaRef.current?.selectionStart}
        selectionEnd={textAreaRef.current?.selectionEnd}
      </p>
    </div>
  );
}