"use client";

import { FileText, FolderPlus, Sparkles } from "lucide-react";

export default function AddMenu({
  onAddNote,
  onAddFolder,
  onClose,
}: {
  onAddNote: () => void;
  onAddFolder: () => void;
  onClose?: () => void;
}) {
  return (
    <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">
      {/* 헤더 */}
      <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-semibold text-slate-700">
            새로 만들기
          </span>
        </div>
      </div>

      {/* 메뉴 아이템들 */}
      <div className="py-2">
        <button
          className="group w-full flex items-center gap-3 px-4 py-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200 text-left"
          onClick={() => {
            onAddNote();
            onClose && onClose();
          }}
        >
          <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center group-hover:from-blue-200 group-hover:to-blue-300 transition-all duration-200">
            <FileText className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-800">노트 추가</p>
            <p className="text-xs text-slate-500">새로운 문서 만들기</p>
          </div>
        </button>

        <button
          className="group w-full flex items-center gap-3 px-4 py-3 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all duration-200 text-left"
          onClick={() => {
            onAddFolder();
            onClose && onClose();
          }}
        >
          <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center group-hover:from-purple-200 group-hover:to-purple-300 transition-all duration-200">
            <FolderPlus className="w-4 h-4 text-purple-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-800">폴더 추가</p>
            <p className="text-xs text-slate-500">노트를 정리하기</p>
          </div>
        </button>
      </div>
    </div>
  );
}
