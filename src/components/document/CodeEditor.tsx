"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import type * as monacoType from "monaco-editor";
import useFugueTextSync from "@/hooks/useFugueTextSync";
import getDiff from "@/libs/simpledDiff";
import { Code, Copy, Download, Terminal } from "lucide-react";
import { LANGUAGES } from "@/libs/note";
import { Language } from "@/types/note";

const Editor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

function resolveLanguage(value?: string | null): Language {
  if (!value) {
    return LANGUAGES.javascript;
  }
  const matched = Object.values(LANGUAGES).find(
    (language) => language.value === value
  );
  return matched ?? LANGUAGES.javascript;
}

export default function CodeEditor({user, uuid, initialLanguage}: {
  user: User;
  uuid: string;
  initialLanguage?: string | null;
}) {
  const {treeNoteRef, send, commitActions} = useFugueTextSync(user, uuid);
  const [code, setCode] = useState(treeNoteRef?.current.content || "");
  const editorRef = useRef<monacoType.editor.IStandaloneCodeEditor | null>(null);

  // 마지막 edit 이 원격인지 로컬인지 플래그
  // 실제로는 동시성 문제로 인해 remote edit 처리 중 사용자 입력이 들어오면 입력이 remote user 에게 broadcast 되지 않아서 수정 필요
  const isRemoteEditRef = useRef(false);
  const [isMounted, setIsMounted] = useState(false);

  // 선택 언어 상태 (기본 javascript)
  const [language, setLanguage] = useState<Language>(() =>
    resolveLanguage(initialLanguage)
  );

  // 코드 복사
  const handleCopyCode = useCallback(() => {
    navigator.clipboard.writeText(code);
  }, [code]);

  // 코드 다운로드
  const handleDownloadCode = useCallback(() => {
    const blob = new Blob([code], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement("a");
    a.href = url;
    a.download = `code.${language.fileExtension}`;
    window.document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      URL.revokeObjectURL(url);
      a.remove();
    }, 0);
  }, [code, language]);

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

  useEffect(() => {
    setLanguage(resolveLanguage(initialLanguage));
  }, [initialLanguage]);

  return (
    // 코드 에디터 전체 레이아웃
    <main className="flex flex-col items-center justify-start p-0 w-full">
      {/* 카드 형태 컨테이너 */}
      <div
        className="
          w-full bg-gradient-to-br from-white via-slate-50 to-white rounded-2xl shadow-sm
          border border-slate-100 overflow-hidden transition-all duration-300 group
        "
      >
        {/* 상단 장식 바 */}
        <div className="w-full h-1 bg-gradient-to-r from-green-500 via-blue-500 to-purple-600 opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* 코드 에디터 헤더 */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-slate-50 to-white border-b border-slate-200">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center shadow-sm">
                <Code className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  코드 에디터
                </h3>
                <div className="w-8 h-0.5 bg-gradient-to-r from-green-500 to-blue-600 rounded-full mt-1"></div>
              </div>
            </div>

            <select
              value={language.value}
              onChange={(e) => {
                console.log(e.target.value);
                const selectedLanguage = Object.values(LANGUAGES).find(lang => lang.value === e.target.value);
                if (selectedLanguage) setLanguage(selectedLanguage);
              }}
              className="px-3 py-2 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
            >
              {Object.entries(LANGUAGES).map(([k, v]) => (
                <option key={k} value={v.value}>
                  {v.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            {/* 코드 복사 버튼 */}
            <button
              onClick={handleCopyCode}
              className="group/btn p-2 rounded-xl hover:bg-white/80 transition-all duration-200 border border-transparent hover:border-slate-200 hover:shadow-sm"
              title="코드 복사"
            >
              <Copy className="w-4 h-4 text-slate-600 group-hover/btn:text-blue-600 transition-colors duration-200" />
            </button>
            
            {/* 코드 다운로드 버튼 */}
            <button
              onClick={handleDownloadCode}
              className="group/btn p-2 rounded-xl hover:bg-white/80 transition-all duration-200 border border-transparent hover:border-slate-200 hover:shadow-sm"
              title="코드 다운로드"
            >
              <Download className="w-4 h-4 text-slate-600 group-hover/btn:text-green-600 transition-colors duration-200" />
            </button>
          </div>
        </div>

        {/* 코드 에디터 영역 */}
        <div className="relative">
          <div className="h-[500px] bg-white transition-all duration-300">
            <Editor
              height="100%"
              language={language.value}
              defaultValue={code}
              onMount={handleEditorMount}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                scrollBeyondLastLine: false,
                fontFamily: "'JetBrains Mono','Fira Code','Cascadia Code',monospace",
                lineHeight: 1.6,
                padding: { top: 16, bottom: 16 },
                smoothScrolling: true,
                cursorBlinking: "smooth",
                renderLineHighlight: "gutter",
                bracketPairColorization: { enabled: true },
                guides: { bracketPairs: true, indentation: true },
              }}
            />
          </div>

          {/* 언어 표시 배지 */}
            <div className="absolute bottom-4 right-4 flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-2 bg-white/90 backdrop-blur-sm rounded-xl border border-slate-200 shadow-sm">
                <Terminal className="w-3 h-3 text-slate-500" />
                <span className="text-xs font-medium text-slate-600">{language.value.toUpperCase()}</span>
              </div>
            </div>

          {/* 로딩 */}
          {!isMounted && (
            <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-blue-100 rounded-xl flex items-center justify-center mx-auto">
                  <Code className="w-6 h-6 text-slate-500 animate-pulse" />
                </div>
                <p className="text-sm font-medium text-slate-700">코드 에디터를 불러오는 중...</p>
              </div>
            </div>
          )}
        </div>

        {/* 하단 상태 바 */}
        <div className="flex items-center justify-between px-6 py-3 bg-gradient-to-r from-slate-50 to-white border-t border-slate-200 text-xs text-slate-600">
          <div className="flex items-center gap-4">
            <span>라인: {code.split("\n").length}</span>
            <span>문자: {code.length}</span>
            <span>바이트: {new Blob([code]).size}</span>
          </div>
        </div>
      </div>
    </main>
  );
}