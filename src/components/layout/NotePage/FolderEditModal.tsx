"use client";

import type { MoaFile } from "@/types/file";
import React, { useEffect, useState } from "react";
import { X, FolderOpen, Save, Trash2, AlertTriangle } from "lucide-react";

import Portal from "@/components/common/Portal";

interface Props {
  root: MoaFile;
  folderId: string;
  onDelete: (folderId: string) => void;
  onEdit: (folderId: string, folderName: string, parentId: string) => void;
  onCancel: () => void;
}

export const getFileById = (
  folderId: string,
  node: MoaFile
): MoaFile | null => {
  if (node.id === folderId) {
    return node;
  }

  if (node.children) {
    for (const child of node.children) {
      const found = getFileById(folderId, child);
      if (found) {
        return found;
      }
    }
  }

  return null;
};

export const getParent = (
  folderId: string,
  node: MoaFile,
  parentId: string | null = null
): string | null => {
  if (node.id === folderId) {
    return parentId;
  }

  if (node.children) {
    for (const child of node.children) {
      const foundParent = getParent(folderId, child, node.id);
      if (foundParent) {
        return foundParent;
      }
    }
  }

  return null;
};

// 모든 디렉토리 목록
function renderFolderOptions(folder: MoaFile, depth = 0): React.ReactNode {
  // 루트 폴더 가져오기

  if (folder.type.toString() !== "DIRECTORY") return null;

  return (
    <React.Fragment key={folder.id}>
      <option value={folder.id}>{`${"—".repeat(depth)} ${folder.name}`}</option>
      {folder.children &&
        folder.children.map((child) => renderFolderOptions(child, depth + 1))}
    </React.Fragment>
  );
}

export default function FolderEditModal({
  root,
  folderId,
  onDelete,
  onEdit,
  onCancel,
}: Props) {
  const [folderName, setFolderName] = useState<string>("");
  const [parentId, setParentId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // 부모 ID와 폴더 이름 초기화

  useEffect(() => {
    const newParentId = getParent(folderId, root, root.id);
    const folder = getFileById(folderId, root);

    if (folder) {
      setParentId(newParentId ?? root.id);
      setFolderName(folder.name);
    }
  }, [folderId, root]);

  const handleDelete = () => {
    onDelete(folderId);
    setShowDeleteConfirm(false);
  };

  return (
    <Portal>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999] animate-in fade-in-0 duration-200">
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
          {/* 헤더 */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <FolderOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">폴더 수정</h2>
                <p className="text-sm text-slate-500">폴더 정보를 변경하세요</p>
              </div>
            </div>
            <button
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors duration-200"
              onClick={onCancel}
              aria-label="닫기"
            >
              <X className="w-4 h-4 text-slate-500" />
            </button>
          </div>

          {/* 폼 */}
          <div className="space-y-6">
            {/* 폴더 이름 */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                <FolderOpen className="w-4 h-4" />
                폴더 이름
              </label>
              <input
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:outline-none focus:border-purple-400 focus:bg-white transition-all duration-200 placeholder:text-slate-400"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                placeholder="폴더 이름을 입력하세요"
                autoFocus
              />
            </div>

            {/* 폴더 위치 */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                <FolderOpen className="w-4 h-4" />
                폴더 위치
              </label>
              <select
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:outline-none focus:border-purple-400 focus:bg-white transition-all duration-200"
                value={parentId ? parentId : root.id}
                onChange={(e) => setParentId(e.target.value)}
              >
                {renderFolderOptions(root)}
              </select>
            </div>

          </div>

          {/* 삭제 확인 모달 */}
          {showDeleteConfirm && (
            <div className="absolute inset-0 bg-black/20 rounded-2xl flex items-center justify-center">
              <div className="bg-white rounded-xl shadow-lg border border-red-200 p-6 mx-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">폴더 삭제</h3>
                    <p className="text-sm text-slate-600">
                      정말로 이 폴더를 삭제하시겠습니까?
                    </p>
                    <p className="text-xs text-red-600 mt-1">
                      폴더 내의 모든 파일도 함께 삭제됩니다.
                    </p>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors duration-200"
                    onClick={() => setShowDeleteConfirm(false)}
                  >
                    취소
                  </button>
                  <button
                    className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition-colors duration-200"
                    onClick={handleDelete}
                  >
                    삭제
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 버튼 영역 */}
          <div className="flex justify-between items-center mt-8">
            {/* 폴더 삭제 */}
            <button
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 font-medium border border-red-200 hover:border-red-300 transition-all duration-200"
              onClick={() => setShowDeleteConfirm(true)}
            >
              <Trash2 className="w-4 h-4" />
              삭제
            </button>

            {/* 저장 및 취소 */}
            <div className="flex gap-3">
              <button
                className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-all duration-200"
                onClick={onCancel}
              >
                취소
              </button>
              <button
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => {
                  onEdit(folderId, folderName, parentId ?? root.id);
                }}
                disabled={!folderName.trim()}
              >
                <Save className="w-4 h-4" />
                저장
              </button>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
}
