"use client";

import { useState } from "react";
import { TreeMarkdownEditor } from "@/components/document/TreeMarkdownEditor";
import { MarkdownRenderer } from "@/components/document/MarkdownRenderer";
import getDiff from "@/libs/simpledDiff";
import { SelectionRange } from "@/types/selectionRange";
import { Edit3, Eye } from "lucide-react";
import useFugueTextSync from "@/hooks/useFugueTextSync";

export default function DocumentRenderer({ user, uuid }: { user: User, uuid: string }) {
  const {treeNoteRef, document, send, commitActions} = useFugueTextSync(user, uuid);
  const [isEditing, setEditing] = useState<boolean>(false);
  const [cursorPosition, setCursorPosition] = useState<SelectionRange>({ baseOffset: 0, extentOffset: 0 });

  const startEditing = () => setEditing(true);
  const endEditing = () => setEditing(false);

  return (
    <div
      className={`
        w-full bg-gradient-to-br from-white via-slate-50 to-white rounded-2xl shadow-sm border border-slate-100 px-8 py-6 flex items-start transition-all duration-300 ease-in-out relative overflow-hidden group
        ${
        !isEditing
          ? "hover:shadow-lg hover:border-slate-200 hover:bg-gradient-to-br hover:from-blue-50 hover:via-white hover:to-slate-50 cursor-pointer"
          : "shadow-lg border-blue-200 bg-gradient-to-br from-blue-50 via-white to-slate-50"
      }
      `}
      key={treeNoteRef.current.id}
      onClick={() => {
        if (!isEditing) startEditing();
      }}
    >
      {/* 상태 표시 아이콘 */}
      <div className="absolute top-4 right-4 opacity-60 transition-opacity duration-200 group-hover:opacity-100">
        {isEditing ? (
          <div className="flex items-center gap-2 text-blue-600">
            <Edit3 className="w-4 h-4" />
            <span className="text-xs font-medium">편집 중</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-slate-500">
            <Eye className="w-4 h-4" />
            <span className="text-xs font-medium">읽기 모드</span>
          </div>
        )}
      </div>

      {/* 장식적 요소 */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

      {isEditing ? (
        <TreeMarkdownEditor
          initialContent={document.content}
          updateContent={(newContent: string) => {
            const diff = getDiff(document.content, newContent);
            if (!diff) return;

            if (diff.insertedContent)
              treeNoteRef.current.insert(diff.removeFrom, diff.insertedContent);
            if (diff.removeLength > 0)
              treeNoteRef.current.remove(diff.removeFrom, diff.removeLength);

            send(treeNoteRef.current.operationHistories[treeNoteRef.current.operationHistories.length - 1]);
            commitActions();
          }}
          lastCursorPosition={cursorPosition}
          cursorHandler={setCursorPosition}
          onBlur={() => {
            endEditing();
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