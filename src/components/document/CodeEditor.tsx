"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type * as monacoType from "monaco-editor";
import useFugueTextSync from "@/hooks/useFugueTextSync";
import getDiff from "@/libs/simpledDiff";

const Editor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

export default function CodeEditor({ user, uuid }: { user: User, uuid: string })  {
  const {treeNoteRef, document, send, commitActions} = useFugueTextSync(user, uuid);
  const [code, setCode] = useState(treeNoteRef?.current.content || "");
  const editorRef = useRef<monacoType.editor.IStandaloneCodeEditor | null>(null);

  // 마지막 edit 이 원격인지 로컬인지 플래그
  // 실제로는 동시성 문제로 인해 remote edit 처리 중 사용자 입력이 들어오면 입력이 remote user 에게 broadcast 되지 않아서 수정 필요
  const isRemoteEditRef = useRef(false);
  const [isMounted, setIsMounted] = useState(false);

  const handleEditorMount = (editor: monacoType.editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;
    setIsMounted(true);

    editor.onDidChangeModelContent(() => {
      if (isRemoteEditRef.current) return;
      const newContent = editor.getValue();
      const diff = getDiff(treeNoteRef?.current.content, newContent);
      setCode(newContent);
      if (!diff) return;

      if (diff.insertedContent)
        treeNoteRef.current.insert(diff.removeFrom, diff.insertedContent);
      if (diff.removeLength > 0)
        treeNoteRef.current.remove(diff.removeFrom, diff.removeLength);

      send(treeNoteRef.current.operationHistories[treeNoteRef.current.operationHistories.length - 1]);
      commitActions();
    });
  };

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;
    const model = editor.getModel();
    if (!model) return;

    let monaco: typeof import("monaco-editor");
    const diff = getDiff(code, treeNoteRef?.current.content);
    const removedPosition = model.getPositionAt(diff.removeFrom);
    const removedEndPosition = model.getPositionAt(diff.removeFrom + diff.removeLength);
    isRemoteEditRef.current = true;
    import("monaco-editor").then((m) => {
      monaco = m;
      model.applyEdits([
        {
          range: new monaco.Range(
            removedPosition.lineNumber,
            removedPosition.column,
            removedEndPosition.lineNumber,
            removedEndPosition.column
          ),
          text: diff.insertedContent ? diff.insertedContent : '',
          forceMoveMarkers: true
        }
      ]);
      isRemoteEditRef.current = false;
    });
    setCode(treeNoteRef?.current.content || "");
  }, [isMounted, treeNoteRef?.current.content]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="w-full h-[500px] border rounded">
        <Editor
          height="100%"
          defaultLanguage="javascript"
          defaultValue={code}
          onMount={handleEditorMount}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            scrollBeyondLastLine: false,
          }}
        />
      </div>
    </main>
  );
}
