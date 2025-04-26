import {useEffect, useRef, useState} from "react";
import TextareaAutosize from "react-textarea-autosize";
//import toast from "react-hot-toast";

/**
 * 마크다운 에디터
 * @param initialContent 초기 내용
 * @param updateContent 사용자가 내용 업데이트할 때 콜백, 상위 컴포넌트에서 서버로 업데이트 해야 함
 * @param updateBlur 사용자가 에디터의 포커스를 잃었을 때 콜백
 * @constructor
 * TODO : 상위 컴포넌트에서 커서 state를 보내서 여기서 useEffect로 커서가 제어되어야 함
 */
export function MarkdownEditor({initialContent, updateContent = null, updateBlur = null}: {
  initialContent: string | null | undefined,
  updateContent?: null | ((content: string) => void),
  updateBlur?: null | (() => void)
}) {

  const [, setCursor] = useState(0);
  const [content, setContent] = useState(initialContent ? initialContent : "");
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleCursor = () => {
    const el = textAreaRef.current;
    if (el)
      setCursor(el.selectionStart);
  }

  useEffect(() => {
    if (updateContent) {
      updateContent(content);
    }
  }, [content]);

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
        onSelect={handleCursor}
        ref={textAreaRef}
        autoFocus={true}/>
    </div>
  );
}