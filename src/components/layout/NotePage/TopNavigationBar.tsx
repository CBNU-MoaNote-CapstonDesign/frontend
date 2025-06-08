'use client';

import {useEffect, useState} from "react";
import Profile from "@/components/layout/Profile";
import InviteUserModal from "@/components/layout/NotePage/InviteUserModal";
import { MoaFile } from "@/types/file";
import {getFile} from "@/libs/client/file";

type Permission = "읽기" | "쓰기" | "소유자";

interface InviteUser {
  username: string;
  permission: Permission;
}

export default function TopNavigationBar({user, selectedNoteId}: { user: User; selectedNoteId: string }) {
  const [note, setNote] = useState<MoaFile|null>(null);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [sharedUsers, setSharedUsers] = useState<InviteUser[]>([]);

  useEffect(() => {
    getFile(selectedNoteId, user).then((file) => {
      setNote(file);
    });
  }, [selectedNoteId, user]);

  /* 아래 주석처리된 handleInvite 함수는 초대한 사용자 이름과 권한 정보를 백엔드에 전송하는 로직 */
  /* 백엔드에서 초대한 사용자의 정보는 아래와 같은 JSON 형식으로 받게 된다. */
  /*
  *   {
  *        "users": [
  *            { "username": "alice", "permission": "읽기" },
  *            { "username": "bob", "permission": "쓰기" },
  *            { "username": "carol", "permission": "소유자" }
  *        ]
  *   }
  */

  // // 현재 선택된 노트 id를 저장하는 변수(미완성)
  // const note = /* CURRENT NOTE ID */

  // // 초대 정보 백엔드로 전송
  // const handleInvite = async (users: InviteUser[]) => {
  //     if (!note) return;
  //     try {
  //         // 초대 API 링크 가정
  //         const res = await fetch(`/api/notes/${note.id}/invite`, {
  //             method: "POST",
  //             headers: { "Content-Type": "application/json" },
  //             body: JSON.stringify({ users }),
  //         });
  //         if (!res.ok) {
  //             // 실패 처리 (예: alert)
  //             alert("초대에 실패했습니다.");
  //             return;
  //         }
  //         setSharedUsers(users);
  //     } catch (e) {
  //         alert("네트워크 오류가 발생했습니다.");
  //     } finally {
  //         setInviteOpen(false);
  //     }
  // };

  return (
    <header
      className="fixed top-0 left-0 w-full h-24 bg-gradient-to-r from-[#f0f8fe] to-[#e0e7ff] z-50 flex items-center px-8 shadow-md">
      {/* 로고 및 제목 */}
      <div className="flex items-center gap-4 min-w-[200px]">
        <img
          src="/moanote_logo/logo1.png"
          className="w-12 h-12 object-contain"
          alt="logo"
        />
        <span className="text-2xl font-bold text-[#186370] tracking-tight select-none">
                    모아노트
                </span>
      </div>

      {/* 문서 제목 및 블록 타입 */}
      <div className="flex-1 flex flex-col items-center">
                <span className="text-lg md:text-xl font-semibold text-[#333] mb-1 truncate max-w-[60vw]">
                  {note ? note.name: "문서 없음"}
                </span>
        <div className="flex gap-4">
                    <span
                      className="
                            px-4
                            py-1
                            rounded-full
                            bg-[#f3f4f6]
                            text-base
                            font-medium
                            text-[#7E40F9]
                            shadow-sm
                            hover:bg-[#dbeafe]
                            cursor-pointer
                            transition
                        "
                    >
                        디자인 블록
                    </span>
          <span
            className="
                            px-4
                            py-1
                            rounded-full
                            bg-[#f3f4f6]
                            text-base
                            font-medium
                            text-[#29E6F0]
                            shadow-sm
                            hover:bg-[#dbeafe]
                            cursor-pointer
                            transition
                        "
          >
                        텍스트 블록
                    </span>
        </div>
      </div>

      {/* 공유자 프로필 + 초대 버튼 */}
      <div className="flex items-center gap-3 mr-8 cursor-pointer">
        {sharedUsers.map((user, idx) => (
          <div
            key={user.username}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-[#b6eaff] to-[#7EEA8A] flex items-center justify-center text-base font-bold text-[#186370] border-2 border-[#69F179] shadow-sm -ml-2 first:ml-0"
            title={`${user.username} (${user.permission})`}
            style={{zIndex: 10 - idx}}
          >
            {user.username[0]?.toUpperCase() || "?"}
          </div>
        ))}
        {/* 초대 버튼 */}
        <button
          className="w-10 h-10 flex items-center justify-center rounded-full bg-[#e0f8ff] border-2 border-dashed border-[#69F179] text-[#69F179] text-2xl font-bold shadow-sm hover:bg-[#dbeafe] transition cursor-pointer"
          title="사용자 초대"
          onClick={() => setInviteOpen(true)}
        >
          +
        </button>
        <InviteUserModal
          open={inviteOpen}
          onClose={() => setInviteOpen(false)}
          initialUsers={sharedUsers}
          onInvite={(users) => {
            setSharedUsers(users);
            setInviteOpen(false);
          }}

          /* 백엔드 초대 사용자 받는 API가 완성되면 기존 onInvite를 지우고 아래 주석으로 대체 */
          // onInvite={handleInvite}
        />
      </div>

      {/* 더보기 버튼 및 본인 프로필 */}
      <div className="flex items-center gap-6 min-w-[120px] justify-end cursor-pointer">
        <button
          className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-[#e0e7ff] transition"
          title="더보기"
        >
          <span className="text-2xl font-bold text-[#444] cursor-pointer">…</span>
        </button>
        <Profile name={user?.name || ""}/>
      </div>
    </header>
  );
}