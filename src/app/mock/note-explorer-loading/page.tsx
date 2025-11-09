"use client";

import { useEffect } from "react";

import NoteExplorer from "@/components/layout/NotePage/NoteExplorer";

const MOCK_USER: User = {
  id: "mock-user",
  name: "Mock User",
};

const ROOT_ID = "root";
const CHILD_FOLDER_ID = "child-folder";
const NOTE_ID = "note";

const rootDirectory = {
  id: ROOT_ID,
  name: "루트",
  owner: { id: MOCK_USER.id, name: MOCK_USER.name },
  type: "DIRECTORY",
  dir: null,
  githubImported: false,
};

const childDirectory = {
  id: CHILD_FOLDER_ID,
  name: "하위 폴더",
  owner: { id: MOCK_USER.id, name: MOCK_USER.name },
  type: "DIRECTORY",
  dir: ROOT_ID,
  githubImported: false,
};

const childNote = {
  id: NOTE_ID,
  name: "샘플 노트",
  owner: { id: MOCK_USER.id, name: MOCK_USER.name },
  type: "DOCUMENT",
  dir: CHILD_FOLDER_ID,
  githubImported: false,
};

const treeResponse = [rootDirectory, childDirectory, childNote];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function NoteExplorerMockPage() {
  useEffect(() => {
    const originalFetch = window.fetch.bind(window);

    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;

      if (url.includes("/api/files/list")) {
        const requestUrl = new URL(url, window.location.origin);
        const recursive = requestUrl.searchParams.get("recursive") === "true";
        const pathSegments = requestUrl.pathname.split("/").filter(Boolean);

        if (recursive) {
          await delay(600);
          return new Response(JSON.stringify(treeResponse), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }

        if (pathSegments.length === 3) {
          await delay(150);
          return new Response(JSON.stringify(treeResponse), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        }

        await delay(100);
        return new Response(JSON.stringify(treeResponse), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      return originalFetch(input, init);
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 p-10 space-y-6">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-200 p-6">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">NoteExplorer Mock</h1>
        <p className="text-slate-500 mb-6">
          초기 페이지 로드 이후 전체 파일 트리를 비동기로 가져오는 동안 노트/폴더 추가 모달의 동작을 확인할 수 있는 테스트용
          페이지입니다.
        </p>
        <NoteExplorer user={MOCK_USER} selectedNoteId={NOTE_ID} />
      </div>
    </div>
  );
}
