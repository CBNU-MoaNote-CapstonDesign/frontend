import invariant from 'tiny-invariant';
import {useEffect, useRef, useState} from "react";
import TextareaAutosize from "react-textarea-autosize";
//import toast from "react-hot-toast";

/**
 * 마크다운 에디터
 * @param initialContent 초기 내용
 * @param updateContent 에디터에서 내용 업데이트할 때 콜백 (optional)
 * @param updateBlur 사용자가 에디터의 포커스를 잃었을 때 콜백 (optional)
 * @param lastCursorPosition 커서 위치 초기값
 * @param cursorHandler 커서 위치를 상위 컴포넌트로 전달하는 콜백 (optional)
 * @constructor
 */
export function MarkdownEditor({initialContent = null, updateContent = null, updateBlur = null, lastCursorPosition = null, cursorHandler = null}: {
  initialContent: string | null | undefined,
  updateContent?: null | ((content: string) => void),
  updateBlur?: null | (() => void),
  lastCursorPosition?: number | null | undefined,
  cursorHandler?: null | ((cursor: number) => void)
}) {

  const [cursorPosition, setCursor] = useState(lastCursorPosition ? lastCursorPosition : 0);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleSelect = () => {
    const el = textAreaRef.current;
    invariant(el, "textAreaRef is null");
    if (!el)
      return;
    setCursor(el.selectionStart);
    if (cursorHandler)
      cursorHandler(el.selectionStart);
  }

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.focus();
      textAreaRef.current.setSelectionRange(cursorPosition, cursorPosition);
    }
  }, [cursorPosition, textAreaRef]);

  // TODO : change 발생 시 api 로 백엔드 호출해 적용시키기, 상위 컴포넌트에서 할 것
  const handleChange = () => {
    const el = textAreaRef.current;
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
        className="w-full p-2 rounded-xl"
        minRows={5}
        placeholder={"여기에 마크다운 형식 텍스트를 입력하세요"}
        value={initialContent ? initialContent : ""}
        onBlur={handleBlur}
        onChange={handleChange}
        onSelect={handleSelect}
        ref={textAreaRef}
        autoFocus={true}
        style={{ resize: "none" }} // 크기 조절 기능 제거
      />
    </div>
  );
}