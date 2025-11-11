"use client";

import type { MouseEvent, ReactNode } from "react";

import {
  ChevronDown,
  ChevronRight,
  Folder,
  FolderOpen,
  Edit3,
  Users,
  Github,
} from "lucide-react";
import type { MoaFile } from "@/types/file";

/**
 * 폴더 및 하위 파일 항목을 렌더링합니다.
 * @param folder 렌더링할 폴더 파일
 * @param open 하위 항목 노출 여부
 * @param onToggle 폴더 열기/닫기 핸들러
 * @param onEdit 폴더 편집 핸들러
 * @param children 하위 요소
 * @param isShared 공유 폴더 여부
 * @param onContextMenu 우클릭 컨텍스트 메뉴 호출 핸들러
 */
export default function FolderItem({
  folder,
  open,
  onToggle,
  onEdit,
  children,
  isShared = false,
  onContextMenu,
}: {
  folder: MoaFile;
  open: boolean;
  onToggle: () => void;
  onEdit: () => void;
  children: ReactNode;
  isShared?: boolean;
  onContextMenu?: (folder: MoaFile, event: MouseEvent<HTMLDivElement>) => void;
}) {
  return (
    <div
      className="mb-2"
      onContextMenu={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onContextMenu?.(folder, event);
      }}
    >
      <div
        className={`
          group flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 select-none
          ${
          isShared
            ? "bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 hover:from-green-100 hover:to-blue-100 hover:border-green-300"
            : "bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 hover:from-purple-100 hover:to-blue-100 hover:border-purple-300"
        }
        `}
      >
        <button
          className="flex items-center justify-center w-6 h-6 rounded-lg transition-all duration-200 hover:bg-white/60 hover:scale-110"
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          title={open ? "폴더 닫기" : "폴더 열기"}
          type="button"
        >
          {open ? (
            <ChevronDown className="w-4 h-4 text-slate-600"/>
          ) : (
            <ChevronRight className="w-4 h-4 text-slate-600"/>
          )}
        </button>

        <div className="flex items-center gap-2 flex-1">
          <div
            className={`
              w-6 h-6 rounded-lg flex items-center justify-center transition-colors duration-200
              ${
              isShared
                ? "bg-green-200 group-hover:bg-green-300"
                : open
                  ? "bg-purple-200 group-hover:bg-purple-300"
                  : "bg-slate-200 group-hover:bg-slate-300"
            }
            `}
          >
            {open ? (
              <FolderOpen
                className={`w-3 h-3 ${
                  isShared ? "text-green-700" : "text-purple-700"
                }`}
              />
            ) : (
              <Folder
                className={`w-3 h-3 ${
                  isShared ? "text-green-700" : "text-slate-700"
                }`}
              />
            )}
          </div>

          <span
            className={`
              font-semibold text-sm transition-colors duration-200
              ${
              isShared
                ? "text-green-800 group-hover:text-green-900"
                : "text-purple-800 group-hover:text-purple-900"
            }
            `}
          >
            {folder.name}
          </span>

          {isShared && <Users className="w-3 h-3 text-green-600 ml-1"/>}
          {folder.githubImported && (
            <span className="ml-1" title="GitHub에서 가져온 폴더">
              <Github className="w-3 h-3 text-slate-600" aria-hidden/>
            </span>
          )}
        </div>

        {!isShared && (
          <button
            className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-white/60 transition-all duration-200 hover:scale-110"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            title="폴더 수정"
            type="button"
          >
            <Edit3 className="w-3 h-3 text-purple-600"/>
          </button>
        )}
      </div>

      {open && children}
    </div>
  );
}
