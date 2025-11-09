"use client";

import type { MoaFile } from "@/types/file";
import React, { useState } from "react";
import {
  X,
  FolderPlus,
  FolderOpen,
  Plus,
  AlertCircle,
} from "lucide-react";

import Portal from "@/components/common/Portal";

interface Props {
  root: MoaFile;
  onAdd: (folderName: string, parentId: string) => void;
  onCancel: () => void;
  errorMsg?: string | null;
}

export default function FolderAddModal({
  root,
  onAdd,
  onCancel,
  errorMsg,
}: Props) {
  const [folderName, setFolderName] = useState<string>("");
  const [parentId, setParentId] = useState<string>(root.id);

  // 모든 부모 목록
  const renderFolderOptions = (folder: MoaFile, depth = 0): React.ReactNode => {
    if (folder.type.toString() !== "DIRECTORY") return null;

    return (
      <React.Fragment key={folder.id}>
        <option value={folder.id}>{`${"—".repeat(depth)} ${
          folder.name
        }`}</option>
        {folder.children &&
          folder.children.map((child) => renderFolderOptions(child, depth + 1))}
      </React.Fragment>
    );
  };

  return (
    <Portal>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999] animate-in fade-in-0 duration-200">
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
          {/* 헤더 */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <FolderPlus className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">폴더 추가</h2>
                <p className="text-sm text-slate-500">
                  노트를 정리할 폴더를 만들어보세요
                </p>
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

          {/* 에러 메시지 */}
          {errorMsg && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <span className="text-sm text-red-700 font-medium">
                {errorMsg}
              </span>
            </div>
          )}

          {/* 폼 */}
          <div className="space-y-6">
            {/* 폴더 생성 위치 */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                <FolderOpen className="w-4 h-4" />
                폴더 생성 위치
              </label>
              <select
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:outline-none focus:border-purple-400 focus:bg-white transition-all duration-200"
                value={parentId}
                onChange={(e) => setParentId(e.target.value)}
              >
                {renderFolderOptions(root)}
              </select>
            </div>

            {/* 폴더 이름 */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                <FolderPlus className="w-4 h-4" />
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

          </div>

          {/* 버튼 영역 */}
          <div className="flex justify-end gap-3 mt-8">
            <button
              className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-all duration-200"
              onClick={onCancel}
            >
              취소
            </button>
            <button
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => {
                onAdd(folderName, parentId);
              }}
              disabled={!folderName.trim()}
            >
              <Plus className="w-4 h-4" />
              추가
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}
