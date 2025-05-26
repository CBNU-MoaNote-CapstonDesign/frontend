"use client";

import {useState} from "react";
import {Note} from "@/types/note";
import {TreeMarkdownEditor} from "@/components/document/TreeMarkdownEditor";
import {MarkdownRenderer} from "@/components/document/MarkdownRenderer";
import DocumentTitle from "@/components/document/DocumentTitle";
import {TreeNote} from "@/libs/structures/treenote";
import getDiff from "@/libs/simpledDiff";

export default function DocumentRenderer() {
  // TODO 임시 데이터
  const [treeNote, setTreeNote] = useState<TreeNote>(TreeNote.fromString("userid", "noteid", "initial title", "initial content"));

  const [document, setDocument] = useState<Note>({title: treeNote.title, id: treeNote.id, content: treeNote.content}); // 현재 문서 내용 // 현재 문서 내용
  const [isEditing, setEditing] = useState<boolean>(false); // 현재 편집중인가?
  const [cursorPosition, setCursorPosition] = useState<number>(0); // 커서 위치
  // const [needSend, setNeedSend] = useState<boolean>(false); // 수정 사항을 보내야 하는지

  const startEditing = () => setEditing(true);
  const endEditing = () => setEditing(false);

  // // 다른데서 전파한 사항을 업데이트 하는거
  // const update =
  //   (content: string) => {
  //     console.log(content);
  //     return;
  //   };

  // const {publish} = useDocumentSync(user, uuid, update);

  // // 로컬 변경사항을 보내는거
  // const send =
  //   (action: Action) => {
  //     console.log("Send", action);
  //     return;
  //   };

  // useEffect(() => {
  //   if (needSend) {
  //     setNeedSend(false);
  //     send(document.content);
  //   }
  //   /*
  //    * needSend 는 dependency 에 포함하지 말아야 함.
  //    * useEffect 수정 시 dependency 목록을 변경해야 하는 지 확인하는 것이 좋음 (경고가 꺼져있으므로 직접 확인해야 함)
  //    */
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [document.content, document.id, document.title, send]);

  return (
    <div className={"flex flex-col w-full"} key={treeNote.id}>
      <DocumentTitle title={document.title}/>
      {isEditing ? (
        <TreeMarkdownEditor
          initialContent={document.content}
          updateBlur={endEditing}
          updateContent={(newContent: string) => {
            const diff = getDiff(document.content, newContent);

            if (diff.insertedContent)
              treeNote.insert(diff.removeFrom, diff.insertedContent);
            if (diff.removeLength > 0) {
              treeNote.remove(diff.removeFrom, diff.removeLength);
            }
            treeNote.traversal();
            console.log('applied : ' + treeNote.content);
            setDocument({
              ...document,
              content: treeNote.content,
            });
            setTreeNote(treeNote);
          }}
          lastCursorPosition={cursorPosition}
          cursorHandler={setCursorPosition}
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
