"use client";

import {useState} from "react";
import {Note} from "@/types/note";
import {MarkdownEditor} from "@/components/document/MarkdownEditor";
import {MarkdownRenderer} from "@/components/document/MarkdownRenderer";
import DocumentTitle from "@/components/document/DocumentTitle";
import useDocumentSync from "@/hooks/useDocumentSync";

export default function DocumentRenderer({user, uuid}: { user:User, uuid: string }) {
  const [document, setDocument] = useState<Note>({title: uuid, id: uuid, content: "편집하려면 여기 클릭"}); // 현재 문서 내용
  const [isEditing, setEditing] = useState<boolean>(false); // 현재 편집중인가?

  const startEditing = () => setEditing(true);
  const endEditing = () => setEditing(false);

  // 다른데서 전파한 사항을 업데이트 하는거
  const update =
    (content: string) => {
        setDocument({title: document.title, id: document.id, content: content});
    }

  const {publish} = useDocumentSync(user, uuid, update);

  // 로컬 변경사항을 보내는거
  const send =
    (content: string) => {
      const newDocument = {title: document.title, id: document.id, content: content};
      setDocument(newDocument);
      publish(content);
    }

  return (
    <div className={"flex flex-col w-full"} key={uuid}>
      <DocumentTitle title={document.title}/>
      {isEditing ? (
        <MarkdownEditor
          initialContent={document?.content}
          updateBlur={endEditing}
          updateContent={(content) => {
            send(content);
          }}
        />
      ) : (
        <MarkdownRenderer
          content={document?.content}
          startEditing={startEditing}
        />
      )}
    </div>
  );
}
