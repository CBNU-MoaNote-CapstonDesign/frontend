"use client";

import {useEffect, useRef, useState} from "react";
import {Note} from "@/types/note";
import {TreeMarkdownEditor} from "@/components/document/TreeMarkdownEditor";
import {MarkdownRenderer} from "@/components/document/MarkdownRenderer";
import DocumentTitle from "@/components/document/DocumentTitle";
import {TreeNote} from "@/libs/structures/treenote";
import getDiff from "@/libs/simpledDiff";
import {CRDTOperation} from "@/types/crdtOperation";
import useFugueDocumentSync from "@/hooks/useFugueDocumentSync";
import {CursorPosition} from "@/types/cursor";
import invariant from "tiny-invariant";
import {flushSync} from "react-dom";
import {TreeNode} from "@/types/treenode";
import {tree} from "next/dist/build/templates/app-page";

export default function DocumentRenderer({user, uuid}: { user: User, uuid: string }) {
  // TODO 임시 데이터
  const [treeNote, setTreeNote] = useState<TreeNote>(TreeNote.fromString(user.id, uuid, "initial title", "initial content"));
  const [document, setDocument] = useState<Note>({title: treeNote.title, id: treeNote.id, content: treeNote.content}); // 현재 문서 내용
  const [isEditing, setEditing] = useState<boolean>(false); // 현재 편집중인가?
  const [cursorPosition, setCursorPosition] = useState<CursorPosition>(); // 커서 위치
  const startEditing = () => setEditing(true);
  const endEditing = () => setEditing(false);

  console.log("DocumentRenderer rendered  ", cursorPosition);

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

  useEffect(() => {
    setCursorPosition({start: treeNote.getNodeByIndex(document.content.length - 1) as TreeNode, end: treeNote.getNodeByIndex(document.content.length - 1) as TreeNode});
  }, []);


  const [{broadcast},] = useState(useFugueDocumentSync(uuid, update));

// 로컬 변경사항을 보내는거
  const send =
    (actions: CRDTOperation[]) => {
      console.log("Send ", actions);
      broadcast(actions);
    };

  return (
    <div className={"flex flex-col w-full"} key={treeNote.id}>
      <DocumentTitle title={document.title}/>
      <TreeMarkdownEditor
        initialContent={document.content}
        updateBlur={endEditing}
        updateContent={(newContent: string) => {
          const diff = getDiff(document.content, newContent);

          if (diff.insertedContent)
            treeNote.insert(diff.removeFrom, diff.insertedContent);
          if (diff.removeLength > 0)
            treeNote.remove(diff.removeFrom, diff.removeLength);

          const sendIt = treeNote.operationHistories[treeNote.operationHistories.length - 1].slice(0, treeNote.operationHistories[treeNote.operationHistories.length - 1].length);
          setTimeout(() => {
            send(sendIt);
          }, 2000);
          commitActions();
          if (diff.insertedContent) {
            setCursorPosition({
              start: treeNote.getNodeByIndex(diff.removeFrom + diff.insertedContent.length - 1) as TreeNode,
              end: treeNote.getNodeByIndex(diff.removeFrom + diff.insertedContent.length - 1) as TreeNode
            });
          } else {
            setCursorPosition({
              start: treeNote.getNodeByIndex(diff.removeFrom - 1) as TreeNode,
              end: treeNote.getNodeByIndex(diff.removeFrom - 1) as TreeNode
            });
          }
        }}
        cursorPosition={cursorPosition}
        cursorHandler={(start: number, end: number) => {
          setCursorPosition({
            start: treeNote.getNodeByIndex(start - 1) as TreeNode,
            end: treeNote.getNodeByIndex(end - 1) as TreeNode
          });
        }}
      />
    </div>
  );
}
