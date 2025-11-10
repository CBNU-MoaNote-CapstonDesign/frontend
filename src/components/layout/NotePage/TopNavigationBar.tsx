"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { MoaFile } from "@/types/file";
import { getCollaborators, getFile } from "@/libs/client/file";
import {
  UserPlus,
  MoreHorizontal,
  Sparkles,
  RefreshCcw,
  GitBranch,
} from "lucide-react";

import Profile from "@/components/layout/Profile";
import InviteUserModal from "@/components/layout/NotePage/InviteUserModal";
import GithubFetchModal from "@/components/layout/NotePage/GithubFetchModal";
import GithubCommitModal from "@/components/layout/NotePage/GithubCommitModal";

/**
 * Navigational link that leads to the repository question page.
 * @returns Styled link component matching the main navigation buttons.
 */
function RepositoryAskButton() {
  return (
    <Link
      href="/main/ask"
      className="group flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50"
    >
      <Sparkles className="h-4 w-4 text-purple-500 transition-transform duration-200 group-hover:scale-110" />
      <span>코드 질문하기</span>
    </Link>
  );
}

export default function TopNavigationBar({
  user,
  selectedNoteId,
}: {
  user: User;
  selectedNoteId: string;
}) {
  const [note, setNote] = useState<MoaFile | null>(null);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [sharedUsers, setSharedUsers] = useState<User[]>([]);
  const [fetchOpen, setFetchOpen] = useState(false);
  const [commitOpen, setCommitOpen] = useState(false);

  useEffect(() => {
    getFile(selectedNoteId, user).then((file) => {
      setNote(file);
    });

    getCollaborators(selectedNoteId, user).then((collaborators) => {
      const users: User[] = (collaborators ?? []).map(
        (collaborator) => collaborator.user
      );
      setSharedUsers(users);
    });
  }, [selectedNoteId, user]);

  return (
    <header className="fixed top-0 left-0 w-full h-20 bg-gradient-to-r from-white via-slate-50 to-white backdrop-blur-sm border-b border-slate-200 z-50 flex items-center px-8 shadow-sm">
      {/* 로고 및 제목 */}
      <div className="flex items-center gap-4 min-w-[200px]">
        <div className="relative">
          <img
            src="/moanote_logo/logo1.png"
            className="w-10 h-10 object-contain transition-transform duration-200 hover:scale-110"
            alt="logo"
          />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-80"></div>
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent tracking-tight select-none">
            코드 포레스트
          </span>
          <div className="w-8 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
        </div>
      </div>

      {/* 문서 제목 및 블록 타입 */}
      <div className="flex-1 flex flex-col items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-lg md:text-xl font-semibold text-slate-700 truncate max-w-[60vw]">
            {note ? note.name : "문서 없음"}
          </span>
        </div>
      </div>

      {/* 공유자 프로필 + 초대 버튼 */}
      <div className="flex items-center gap-2 mr-6">
        <div className="flex items-center gap-1">
          {sharedUsers.slice(0, 3).map((sharedUser, idx) => (
            <div
              key={sharedUser.name}
              className="relative w-9 h-9 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 border-2 border-white shadow-sm flex items-center justify-center text-sm font-bold text-slate-700 transition-transform duration-200 hover:scale-110 hover:z-10"
              title={`${sharedUser.name}`}
              style={{
                zIndex: 10 - idx,
                marginLeft: idx > 0 ? "-8px" : "0",
              }}
            >
              {sharedUser.name[0]?.toUpperCase() || "?"}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20"></div>
            </div>
          ))}

          {sharedUsers.length > 3 && (
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 border-2 border-white shadow-sm flex items-center justify-center text-xs font-bold text-slate-600 -ml-2">
              +{sharedUsers.length - 3}
            </div>
          )}
        </div>

        {/* 초대 버튼 */}
        <button
          className="group w-9 h-9 flex items-center justify-center rounded-full bg-gradient-to-br from-green-50 to-blue-50 border-2 border-dashed border-green-300 text-green-600 shadow-sm hover:shadow-md hover:from-green-100 hover:to-blue-100 hover:border-green-400 transition-all duration-200 ml-2"
          title="사용자 초대"
          onClick={() => setInviteOpen(true)}
        >
          <UserPlus className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
        </button>

        <InviteUserModal
          user={user}
          noteId={selectedNoteId}
          onClose={() => setInviteOpen(false)}
          open={inviteOpen}
          onInvite={() => {}}
        />
      </div>

      <div className="flex items-center gap-3 mr-6">
        <RepositoryAskButton />
        <button
          className="group flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-slate-100 to-slate-200 border border-slate-300 text-slate-700 font-medium shadow-sm hover:shadow-md hover:from-slate-200 hover:to-slate-300 hover:border-slate-400 transition-all duration-200"
          onClick={() => setFetchOpen(true)}
        >
          <RefreshCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
          <span>GitHub Fetch</span>
        </button>

        <button
          className="group flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 text-white font-medium shadow-sm hover:shadow-md hover:from-purple-600 hover:to-blue-700 transition-all duration-200"
          onClick={() => setCommitOpen(true)}
        >
          <GitBranch className="w-4 h-4" />
          <span>브랜치 커밋</span>
        </button>
      </div>

      {/* 더보기 버튼 및 본인 프로필 */}
      <div className="flex items-center gap-4 min-w-[120px] justify-end">
        <button
          className="group flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 hover:shadow-md hover:from-slate-100 hover:to-slate-200 hover:border-slate-300 transition-all duration-200"
          title="더보기"
        >
          <MoreHorizontal className="w-4 h-4 text-slate-600 transition-transform duration-200 group-hover:scale-110" />
        </button>

        <div className="relative">
          <Profile name={user?.name || ""} />
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
        </div>
      </div>

      <GithubFetchModal user={user} open={fetchOpen} onClose={() => setFetchOpen(false)} />
      <GithubCommitModal user={user} open={commitOpen} onClose={() => setCommitOpen(false)} />
    </header>
  );
}
