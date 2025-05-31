'use client';

import { useState, useEffect } from "react";

type Permission = "읽기" | "쓰기" | "소유자";

interface InviteUser {
  username: string;
  permission: Permission;
}

interface InviteUserModalProps {
  open: boolean;
  onClose: () => void;
  onInvite: (users: InviteUser[]) => void;
  initialUsers?: InviteUser[]; // 기존 공유자 목록을 받아옴
}

export default function InviteUserModal({
  open,
  onClose,
  onInvite,
  initialUsers = [],
}: InviteUserModalProps) {
  const [input, setInput] = useState("");
  const [users, setUsers] = useState<InviteUser[]>([]);

  // 모달이 열릴 때마다 기존 공유자 목록을 세팅
  useEffect(() => {
    if (open) setUsers(initialUsers);
  }, [open, initialUsers]);

  const handleAddUser = () => {
    const username = input.trim();
    if (!username || users.some(u => u.username === username)) return;
    setUsers([...users, { username, permission: "읽기" }]);
    setInput("");
  };

  const handlePermissionChange = (idx: number, permission: Permission) => {
    setUsers(users =>
      users.map((u, i) =>
        i === idx ? { ...u, permission } : u
      )
    );
  };

  const handleRemoveUser = (idx: number) => {
    setUsers(users => users.filter((_, i) => i !== idx));
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
            onKeyDown={e => { if (e.key === "Enter") handleAddUser(); }}
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
          {users.map((user, idx) => (
            <div
              key={user.username}
              className="flex items-center gap-3 bg-[#f0f8fe] rounded-lg px-3 py-2"
            >
              {/* 프로필(이름 첫글자) */}
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7EEA8A] to-[#b6eaff] flex items-center justify-center text-base font-bold text-[#186370] border-2 border-[#69F179] shadow">
                {user.username[0]?.toUpperCase() || "?"}
              </div>
              <span className="font-medium text-[#186370]">{user.username}</span>
              {/* 권한 토글 */}
              <div className="flex gap-1 ml-auto">
                {(["읽기", "쓰기", "소유자"] as Permission[]).map(p => (
                  <button
                    key={p}
                    className={`px-2 py-1 rounded text-xs font-semibold border transition
                      ${user.permission === p
                        ? "bg-[#69F179] text-white border-[#69F179]"
                        : "bg-white text-[#186370] border-[#b6d6f2] hover:bg-[#e0f8ff]"}
                    `}
                    onClick={() => handlePermissionChange(idx, p)}
                    type="button"
                  >
                    {p}
                  </button>
                ))}
              </div>
              {/* 삭제 버튼 */}
              <button
                className="ml-2 text-gray-400 hover:text-red-500 text-lg cursor-pointer"
                onClick={() => handleRemoveUser(idx)}
                aria-label="삭제"
                type="button"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        {/* 초대하기 버튼 */}
        <button
          className="w-full bg-[#69F179] hover:bg-[#7eea8a] text-white font-semibold py-2 rounded-lg transition mt-2 cursor-pointer"
          onClick={() => {
            onInvite(users);
            onClose();
          }}
        >
          초대하기
        </button>
      </div>
    </div>
  );
}