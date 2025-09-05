// 더이상 사용하지 않는 컴포넌트로 보임
// 대신 TreeBasedDocumentRenderer.tsx에서 같은 기능이 구현된 것으로 보임

"use client";

import { useEffect, useState } from "react";
import { Note } from "@/types/note";
import { MarkdownEditor } from "@/components/document/MarkdownEditor";
import { MarkdownRenderer } from "@/components/document/MarkdownRenderer";
import useDocumentSync from "@/hooks/useDocumentSync";

export default function DocumentRenderer({
  user,
  uuid,
}: {
  user: User;
  uuid: string;
}) {
  const [document, setDocument] = useState<Note>({
    title: uuid,
    id: uuid,
    content: "",
  }); // 현재 문서 내용
  const [isEditing, setEditing] = useState<boolean>(false); // 현재 편집중인가?
  const [cursorPosition, setCursorPosition] = useState<number>(0); // 커서 위치
  const [needSend, setNeedSend] = useState<boolean>(false); // 수정 사항을 보내야 하는지

  const startEditing = () => setEditing(true);
  const endEditing = () => setEditing(false);

  // 다른데서 전파한 사항을 업데이트 하는거
  const update = (content: string) => {
    setDocument({ title: document.title, id: document.id, content: content });
  };

  const { publish } = useDocumentSync(user, uuid, update);

  // 로컬 변경사항을 보내는거
  const send = (content: string) => {
    const newDocument = {
      title: document.title,
      id: document.id,
      content: content,
    };
    setDocument(newDocument);
    publish(content);
  };

  useEffect(() => {
    if (needSend) {
      setNeedSend(false);
      send(document.content);
    }
    /*
     * needSend 는 dependency 에 포함하지 말아야 함.
     * useEffect 수정 시 dependency 목록을 변경해야 하는 지 확인하는 것이 좋음 (경고가 꺼져있으므로 직접 확인해야 함)
     */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [document.content, document.id, document.title, send]);

  return (
    <div
      className={`
        w-full bg-white rounded-xl shadow px-8 py-5 flex items-start transition duration-150
        ${!isEditing ? "hover:bg-[#dbeafe] cursor-pointer" : ""}
      `}
      key={uuid}
    >
      {isEditing ? (
        <div className="w-full">
          <MarkdownEditor
            initialContent={document.content}
            updateBlur={endEditing}
            updateContent={(content) => {
              setNeedSend(true);
              setDocument({ ...document, content });
            }}
            lastCursorPosition={cursorPosition}
            cursorHandler={setCursorPosition}
          />
        </div>
      ) : (
        <div
          className="w-full break-words whitespace-pre-line"
          onClick={startEditing}
        >
          <MarkdownRenderer
            content={document?.content}
            startEditing={startEditing}
          />
        </div>
      )}
    </div>
  );
}
