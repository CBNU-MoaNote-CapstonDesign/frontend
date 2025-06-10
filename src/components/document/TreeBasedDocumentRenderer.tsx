"use client";

import {useState} from "react";
import {Note} from "@/types/note";
import {TreeMarkdownEditor} from "@/components/document/TreeMarkdownEditor";
import {MarkdownRenderer} from "@/components/document/MarkdownRenderer";
import {TreeNote} from "@/libs/structures/treenote";
import getDiff from "@/libs/simpledDiff";
import {CRDTOperation} from "@/types/crdtOperation";
import useFugueDocumentSync from "@/hooks/useFugueDocumentSync";
import {TextNoteSegmentDTO} from "@/types/dto";

export default function DocumentRenderer({user, uuid}: { user:User, uuid: string }) {
  const [treeNote, setTreeNote] = useState<TreeNote>(TreeNote.fromString(user.id, uuid, "loading...", "loading..."));
  const [document, setDocument] = useState<Note>({title: treeNote.title, id: treeNote.id, content: treeNote.content}); // 현재 문서 내용
  const [isEditing, setEditing] = useState<boolean>(false); // 현재 편집중인가?
  const [cursorPosition, setCursorPosition] = useState<number>(0); // 커서 위치
  const startEditing = () => setEditing(true);
  const endEditing = () => setEditing(false);

  const commitActions = () => {
    treeNote.traversal();
    console.log('applied : ' + treeNote.content);
    setDocument({
      ...document,
      content: treeNote.content,
    });
    setTreeNote(treeNote);
  }

  // 다른데서 전파한 사항을 업데이트 하는거
  const update =
    (actions: CRDTOperation[]) => {
      console.log("Received actions: ", actions);
      for (const action of actions) {
        if (action.byWho === user.id) {
          console.log("Ignoring action by self");
          return; // 자신이 보낸건 무시
        }
        treeNote.onAction(action);
      }
      commitActions();
    };

  const initialize = (segment: TextNoteSegmentDTO) => {
    setTreeNote(TreeNote.fromTree(user.id, segment.id, "tree", segment.rootNode, segment.nodes));
  }

  const [{broadcast}, ] = useState(useFugueDocumentSync(uuid, update, initialize));

  // 로컬 변경사항을 보내는거
  const send =
    (actions: CRDTOperation[]) => {
      console.log("Send ", actions);
      broadcast(actions);
    };

  return (
    <div className={`
        w-full bg-white rounded-xl shadow px-8 py-5 flex items-start transition duration-150
        ${!isEditing ? "hover:bg-[#dbeafe] cursor-pointer" : ""}
      `} key={treeNote.id}>
      {isEditing ? (
        <TreeMarkdownEditor
          initialContent={document.content}
          updateBlur={endEditing}
          updateContent={(newContent: string) => {
            const diff = getDiff(document.content, newContent);

            if (diff.insertedContent)
              treeNote.insert(diff.removeFrom, diff.insertedContent);
            if (diff.removeLength > 0)
              treeNote.remove(diff.removeFrom, diff.removeLength);

            send(treeNote.operationHistories[treeNote.operationHistories.length - 1]);
            commitActions();
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
