"use client";

import { useEffect, useState } from "react";
import { getFile, getNoteMeta } from "@/libs/client/file";
import type { MoaFile } from "@/types/file";
import type { NoteDTO } from "@/types/dto";
import { FileText, Plus, Sparkles } from "lucide-react";

import DocumentTitle from "@/components/document/DocumentTitle";
import TreeBasedDocumentRenderer from "@/components/document/TreeBasedDocumentRenderer";
import CodeEditor from "@/components/document/CodeEditor";

export default function NoteUI({
  user,
  noteId,
}: {
  user: User;
  noteId?: string;
}) {
  const [note, setNote] = useState<MoaFile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [noteMeta, setNoteMeta] = useState<NoteDTO | null>(null);

  useEffect(() => {
    let isCancelled = false;

    const loadNote = async () => {
      if (!noteId) {
        if (!isCancelled) {
          setNote(null);
          setNoteMeta(null);
          setIsLoading(false);
        }
        return;
      }

      if (!isCancelled) {
        setIsLoading(true);
        setNoteMeta(null);
      }

      try {
        const file = await getFile(noteId, user);
        if (isCancelled) {
          return;
        }

        setNote(file);

        if (file) {
          try {
            const metadata = await getNoteMeta(file, user);
            if (!isCancelled) {
              setNoteMeta(metadata ?? null);
            }
          } catch {
            if (!isCancelled) {
              setNoteMeta(null);
            }
          }
        } else {
          setNoteMeta(null);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    loadNote();

    return () => {
      isCancelled = true;
    };
  }, [user, noteId]);

  if (!noteId) {
    return (
      <main className="flex-1 h-[calc(100vh-6rem)] ml-0 bg-gradient-to-br from-slate-50 via-white to-blue-50 rounded-l-2xl shadow-lg border border-slate-200 overflow-auto flex flex-col items-center z-30">
        <div className="w-full max-w-4xl min-h-full flex flex-col gap-8 px-8 py-10 items-center justify-center">
          {/* 빈 상태 일러스트레이션 */}
          <div className="text-center space-y-6">
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl flex items-center justify-center mx-auto shadow-lg">
                <FileText className="w-16 h-16 text-slate-400" />
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Plus className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                <div className="flex items-center gap-1 px-3 py-1 bg-white rounded-full shadow-md border border-slate-200">
                  <Sparkles className="w-3 h-3 text-blue-500" />
                  <span className="text-xs font-medium text-slate-600">
                    새로 시작하기
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                노트를 선택하세요
              </h2>
              <p className="text-slate-500 max-w-md mx-auto leading-relaxed">
                왼쪽 사이드바에서 기존 노트를 선택하거나 새로운 노트를 만들어
                작업을 시작하세요.
              </p>
            </div>
          </div>

          {/* 장식적 요소 */}
          <div className="absolute bottom-8 left-8 opacity-20">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full blur-xl"></div>
          </div>
          <div className="absolute top-8 right-8 opacity-20">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-200 to-blue-200 rounded-full blur-xl"></div>
          </div>
        </div>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="flex-1 h-[calc(100vh-6rem)] ml-0 bg-gradient-to-br from-slate-50 via-white to-blue-50 rounded-l-2xl shadow-lg border border-slate-200 overflow-auto flex flex-col items-center z-30">
        <div className="w-full max-w-4xl min-h-full flex flex-col gap-8 px-8 py-10 items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto">
              <FileText className="w-8 h-8 text-slate-500 animate-pulse" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-slate-700">
                노트를 불러오는 중...
              </h3>
              <div className="flex items-center justify-center gap-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!note) {
    return (
        <main className="flex-1 h-[calc(100vh-6rem)] ml-0 bg-gradient-to-br from-slate-50 via-white to-blue-50 rounded-l-2xl shadow-lg border border-slate-200 overflow-auto flex flex-col items-center z-30">
          <div className="w-full max-w-4xl min-h-full flex flex-col gap-8 px-8 py-10 items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto">
                <FileText className="w-8 h-8 text-slate-500" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-slate-700">
                  노트를 불러오지 못했습니다
                </h3>
                <p className="text-sm text-slate-500">
                  잠시 후 다시 시도해주세요.
                </p>
              </div>
            </div>
          </div>
        </main>
    );
  }

  return (
    <main className="flex-1 h-[calc(100vh-6rem)] ml-0 bg-gradient-to-br from-slate-50 via-white to-blue-50 rounded-l-2xl shadow-lg border border-slate-200 overflow-auto flex flex-col items-center z-30 relative">
      {/* 배경 장식 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 opacity-60"></div>
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full opacity-30 blur-3xl"></div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="relative w-full max-w-4xl min-h-full flex flex-col gap-6 px-8 py-10">
        <DocumentTitle title={note.name} />
        <div className="flex-1">
          {noteMeta?.sourceCode ? (
              <CodeEditor
                  user={user}
                  uuid={note.id as string}
                  initialLanguage={noteMeta.codeLanguage}
              />
          ) : (
              <TreeBasedDocumentRenderer user={user} uuid={note.id as string} />
          )}
        </div>
      </div>
    </main>
  );
}
