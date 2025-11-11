"use client";

import { useCallback, useEffect, useState } from "react";
import type { Collaborator, PermissionDTO } from "@/types/dto";
import { getCollaborators, invite, unshare } from "@/libs/client/file";
import { X, UserPlus, Users, Send, Trash2 } from "lucide-react";

import Portal from "@/components/common/Portal";

interface InviteUserModalProps {
  user: User;
  noteId: string;
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
  onInvite,
}: InviteUserModalProps) {
  const [input, setInput] = useState("");
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * 협업자 목록을 최신 상태로 다시 불러옵니다.
   */
  const reload = useCallback(async () => {
    const collaboratorList = await getCollaborators(noteId, user);
    setCollaborators(collaboratorList);
  }, [noteId, user]);

  useEffect(() => {
    if (open) {
      void reload();
    }
  }, [noteId, user, open, reload]);

  /**
   * 입력된 사용자 이름을 기반으로 새 협업자를 초대합니다.
   */
  const handleAddUser = async () => {
    if (!input.trim()) return;

    setIsLoading(true);
    try {
      await invite(noteId, user, input, "READ");
      setInput("");
      await reload();
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 협업자의 권한 변경을 서버에 반영합니다.
   * @param collaborator 권한이 수정된 협업자
   */
  const handlePermissionChange = async (collaborator: Collaborator) => {
    setIsLoading(true);
    try {
      await invite(
          noteId,
          user,
          collaborator.user.name,
          collaborator.permission
      );
      await reload();
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 선택한 협업자를 문서에서 제거합니다.
   * @param collaborator 제거할 협업자
   */
  const handleRemoveUser = async (collaborator: Collaborator) => {
    setIsLoading(true);
    try {
      const success = await unshare(noteId, user, collaborator.user.name);
      if (success) {
        await reload();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getPermissionColor = (permission: PermissionDTO) => {
    switch (permission) {
      case "READ":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "WRITE":
        return "text-green-600 bg-green-50 border-green-200";
      case "OWNER":
        return "text-purple-600 bg-purple-50 border-purple-200";
      default:
        return "text-slate-600 bg-slate-50 border-slate-200";
    }
  };

  if (!open) return null;

  return (
    <Portal>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 w-[480px] max-w-[90vw] flex flex-col gap-6 animate-in fade-in-0 zoom-in-95 duration-200">
          {/* 헤더 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <UserPlus className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  사용자 초대
                </h2>
                <p className="text-sm text-slate-500">
                  문서를 공유하고 함께 작업하세요
                </p>
              </div>
            </div>
            <button
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors duration-200"
              onClick={onClose}
              aria-label="닫기"
            >
              <X className="w-4 h-4 text-slate-500" />
            </button>
          </div>

          {/* 사용자 입력 및 추가 */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-blue-400 focus:bg-white transition-all duration-200 placeholder:text-slate-400"
                placeholder="사용자 이름을 입력하세요"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") void handleAddUser();
                }}
                disabled={isLoading}
              />
            </div>
            <button
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
              onClick={() => void handleAddUser()}
              disabled={isLoading || !input.trim()}
              type="button"
            >
              <Send className="w-4 h-4" />
              초대
            </button>
          </div>

          {/* 협업자 목록 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
              <Users className="w-4 h-4" />
              협업자 목록 (
              {Array.isArray(collaborators) ? collaborators.length : 0}명)
            </div>

            <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
              {(Array.isArray(collaborators) ? collaborators : []).map(
                (collaborator) => (
                  <div
                    key={collaborator.user.id}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-sm font-bold text-slate-700">
                        {collaborator.user.name[0]?.toUpperCase() || "?"}
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">
                          {collaborator.user.name}
                        </p>
                        <p className="text-xs text-slate-500">협업자</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={collaborator.permission}
                        onChange={(e) => {
                          collaborator.permission = e.target
                            .value as PermissionDTO;
                          void handlePermissionChange(collaborator);
                        }}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors duration-200 ${getPermissionColor(
                          collaborator.permission
                        )}`}
                        disabled={isLoading}
                      >
                        <option value="READ">읽기</option>
                        <option value="WRITE">쓰기</option>
                        <option value="OWNER">소유자</option>
                      </select>

                      <button
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-100 text-red-500 hover:text-red-600 transition-colors duration-200"
                        onClick={() => void handleRemoveUser(collaborator)}
                        title="제거"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )
              )}

              {(!collaborators || collaborators.length === 0) && (
                <div className="text-center py-8 text-slate-500">
                  <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">아직 협업자가 없습니다</p>
                  <p className="text-xs">사용자를 초대해보세요</p>
                </div>
              )}
            </div>
          </div>

          {/* 초대하기 버튼 */}
          <button
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => {
              onInvite();
              onClose();
            }}
            disabled={isLoading}
          >
            {isLoading ? "처리 중..." : "초대 완료"}
          </button>
        </div>
      </div>
    </Portal>
  );
}
