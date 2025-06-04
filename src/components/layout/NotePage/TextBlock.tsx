// 더이상 사용하지 않는 컴포넌트
// 대신 components/document/DocumentRenderer.tsx 사용

'use client';

import { useEffect, useState } from "react";
import { MarkdownRenderer } from "@/components/document/MarkdownRenderer";
import { MarkdownEditor } from "@/components/document/MarkdownEditor";
import useDocumentSync from "@/hooks/useDocumentSync";

interface TextBlockProps {
  user: User;
  uuid: string; // 문서 고유 ID
  initialContent: string;
  onContentChange?: (content: string) => void;
}

export default function TextBlock({
  user,
  uuid,
  initialContent,
  onContentChange,
}: TextBlockProps) {
  const [content, setContent] = useState(initialContent);
  const [isEditing, setIsEditing] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [needSend, setNeedSend] = useState(false);

  // 외부에서 전파된 변경사항을 반영
  const update = (newContent: string) => {
    setContent(newContent);
  };

  // 실시간 동기화 훅
  const { publish } = useDocumentSync(user, uuid, update);

  // 로컬에서 변경된 내용을 서버/다른 클라이언트에 전파
  const send = (newContent: string) => {
    setContent(newContent);
    publish(newContent);
    onContentChange?.(newContent);
  };

  // needSend가 true가 되면 send 실행
  useEffect(() => {
    if (needSend) {
      setNeedSend(false);
      send(content);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, needSend]);

  // 외부에서 initialContent가 바뀌면 동기화
  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  return (
    <div
      className={`w-full bg-white rounded-xl shadow px-8 py-5 flex items-start transition duration-150 ${
        !isEditing ? "hover:bg-[#dbeafe] cursor-pointer" : ""
      }`}
    >
      {isEditing ? (
        <div className="w-full">
          <MarkdownEditor
            initialContent={content}
            updateBlur={() => setIsEditing(false)}
            updateContent={(newContent: string) => {
              setNeedSend(true);
              setContent(newContent);
            }}
            lastCursorPosition={cursorPosition}
            cursorHandler={setCursorPosition}
          />
        </div>
      ) : (
        <div
          className="w-full break-words whitespace-pre-line"
          onClick={() => setIsEditing(true)}
        >
          <MarkdownRenderer content={content} startEditing={() => setIsEditing(true)} />
        </div>
      )}
    </div>
  );
}