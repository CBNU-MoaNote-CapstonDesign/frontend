'use client';

import {useEffect, useState} from "react";
import {Collaborator} from "@/types/dto";
import {getCollaborators, invite} from "@/libs/client/file";


interface InviteUserModalProps {
  user:User,
  noteId: string,
  open: boolean;
  onClose: () => void;
  onInvite: () => void;
  initialUsers?: User[]; // 기존 공유자 목록을 받아옴
}

export default function InviteUserModal({
                                          user,
                                          noteId,
                                          open,
                                          onClose,
                                          onInvite
                                        }: InviteUserModalProps) {
  const [input, setInput] = useState("");
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);

  useEffect(() => {
    getCollaborators(noteId, user).then((collaborators)=>{
      console.log("체크");
      console.log(collaborators);
      setCollaborators(collaborators);
    });
  }, [noteId, user, setCollaborators]);

  const reload = () => {
    getCollaborators(noteId, user).then((collaborators)=>{
      setCollaborators(collaborators);
    });
  };

  const handleAddUser = () => {
    invite(noteId, user, input, "READ").then(()=>{
      reload();
    });
  };

  const handlePermissionChange = (collaborator: Collaborator) => {
    console.log("collaborator", collaborator);
    invite(noteId, user, collaborator.user.name, collaborator.permission).then(()=>{
      reload();
    })
  };

  const handleRemoveUser = (collaborator: Collaborator) => {
    // TODO api 호출
    console.log("권한 제거 API 호출을 구현하십시오.");
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-xl shadow-lg p-6 w-96 flex flex-col gap-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-lg font-bold text-[#186370]">사용자 초대</span>
          <button
            className="text-gray-400 hover:text-gray-700 text-xl"
            onClick={onClose}
            aria-label="닫기"
          >
            ×
          </button>
        </div>
        {/* 사용자 입력 및 추가 */}
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 px-3 py-2 border border-[#b6d6f2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#69F179] transition"
            placeholder="사용자 이름 입력"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter") handleAddUser();
            }}
          />
          <button
            className="bg-[#69F179] hover:bg-[#7eea8a] text-white font-semibold px-4 rounded-lg transition"
            onClick={handleAddUser}
            type="button"
          >
            확인
          </button>
        </div>
        {/* 추가된 사용자 목록 */}
        <div className="flex flex-col gap-2 max-h-40 overflow-y-auto">
          {
            collaborators.map((collaborator)=><li key={collaborator.user.id}>
              <div className={"flex flex-row"}>
                <div className={"me-auto"}>
                  {collaborator.user.name}
                </div>
                <select
                  value={collaborator.permission}
                  onChange={(e)=>{
                    collaborator.permission = e.target.value;
                    handlePermissionChange(collaborator);
                  }}>
                  <option value="READ">읽기</option>
                  <option value="WRITE">쓰기</option>
                  <option value="OWNER">소유자</option>
                </select>
              </div>
            </li>)
          }
        </div>
        {/* 초대하기 버튼 */}
        <button
          className="w-full bg-[#69F179] hover:bg-[#7eea8a] text-white font-semibold py-2 rounded-lg transition mt-2 cursor-pointer"
          onClick={() => {
            onInvite();
            onClose();
          }}
        >
          초대하기
        </button>
      </div>
    </div>
  );
}