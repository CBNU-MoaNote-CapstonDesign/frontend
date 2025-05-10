import invariant from 'tiny-invariant';
import {useEffect, useRef, useState} from "react";
import TextareaAutosize from "react-textarea-autosize";
//import toast from "react-hot-toast";

/**
 * 마크다운 에디터
 * @param initialContent 초기 내용
 * @param updateContent 사용자가 내용 업데이트할 때 콜백, 상위 컴포넌트에서 서버로 업데이트 해야 함
 * @param updateBlur 사용자가 에디터의 포커스를 잃었을 때 콜백
 * @param lastCursorPosition 커서 위치 초기값
 * @param cursorHandler 커서 위치를 상위 컴포넌트로 전달하는 콜백
 * @constructor
 */
export function MarkdownEditor({initialContent, updateContent = null, updateBlur = null, lastCursorPosition, cursorHandler}: {
  initialContent: string | null | undefined,
  updateContent?: null | ((content: string) => void),
  updateBlur?: null | (() => void),
  lastCursorPosition: number,
  cursorHandler: ((cursor: number) => void)
}) {

  const [content, setContent] = useState(initialContent ? initialContent : "");
  const [cursorPosition, setCursor] = useState(lastCursorPosition);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleSelect = () => {
    const el = textAreaRef.current;
    invariant(el, "textAreaRef is null");
    if (el) {
      setCursor(el.selectionStart);
      cursorHandler(el.selectionStart);
    }
  }

  useEffect(() => {
    if (updateContent) {
      updateContent(content);
    }
  }, [content]);

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.focus();
      textAreaRef.current.setSelectionRange(cursorPosition, cursorPosition);
    }
  }, [cursorPosition, textAreaRef]);

  // TODO : change 발생 시 api 로 백엔드 호출해 적용시키기, 상위 컴포넌트에서 할 것
  const handleChange = () => {
    const el = textAreaRef.current;
    if (el) {
      setContent(el.value);
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
        value={content ? content : ""}
        onBlur={handleBlur}
        onChange={handleChange}
        onSelect={handleSelect}
        ref={textAreaRef}
        autoFocus={true}/>
    </div>
  );
}