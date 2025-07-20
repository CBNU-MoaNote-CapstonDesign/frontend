'use client';

import {useEffect, useState} from "react";
import Profile from "@/components/layout/Profile";
import InviteUserModal from "@/components/layout/NotePage/InviteUserModal";
import {MoaFile} from "@/types/file";
import {addNoteSegment, getCollaborators, getFile} from "@/libs/client/file";
import toast from "react-hot-toast";

export default function TopNavigationBar({user, selectedNoteId}: { user: User; selectedNoteId: string }) {
  const [note, setNote] = useState<MoaFile | null>(null);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [sharedUsers, setSharedUsers] = useState<User[]>([]);

  const handleAddDiagram = () => {
    addNoteSegment(selectedNoteId, 1, user).then((data)=>{
      const segmentId = data as string;

      const copyText = (text: string) => {
        navigator.clipboard.writeText(text)
          .then(() => {
            console.log('Text copied to clipboard!');
          })
          .catch((err) => {
            console.error('Failed to copy text: ', err);
          });
      };

      copyText(`/diagram/${segmentId}`);
      toast.success("Digram 태그를 클립보드에 복사했습니다.");
    });
  }

  useEffect(() => {
    getFile(selectedNoteId, user).then((file) => {
      setNote(file);
    });

    getCollaborators(selectedNoteId, user).then((collaborators)=>{
      const users:User[] = collaborators.map((collaborator)=>{
        return collaborator.user;
      });

      setSharedUsers(users);
    })
  }, [selectedNoteId, user]);

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
                  {note ? note.name : "문서 없음"}
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
                      onClick={()=>{handleAddDiagram();}}
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
            key={user.name}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-[#b6eaff] to-[#7EEA8A] flex items-center justify-center text-base font-bold text-[#186370] border-2 border-[#69F179] shadow-sm -ml-2 first:ml-0"
            title={`${user.name}`}
            style={{zIndex: 10 - idx}}
          >
            {user.name[0]?.toUpperCase() || "?"}
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
          user={user}
          noteId={selectedNoteId}
          onClose={() => setInviteOpen(false)}
          open={inviteOpen}
          onInvite={() => {}}
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