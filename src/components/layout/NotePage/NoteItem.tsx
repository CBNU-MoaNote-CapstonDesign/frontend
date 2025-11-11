"use client";

import type { MouseEvent } from "react";

import type { MoaFile } from "@/types/file";
import { FileText, Edit3, Users } from "lucide-react";

/**
 * 노트 항목을 렌더링합니다.
 * @param note 표시할 문서 파일
 * @param selected 현재 선택 여부
 * @param onEdit 문서 편집 핸들러
 * @param onClick 문서 선택 핸들러
 * @param isShared 공유 여부
 * @param onContextMenu 우클릭 컨텍스트 메뉴 호출 핸들러
 */
export default function NoteItem({
  note,
  selected,
  onEdit,
  onClick,
  isShared = false,
  onContextMenu,
}: {
  note: MoaFile;
  onEdit: () => void;
  selected: boolean;
  onClick: () => void;
  isShared?: boolean;
  onContextMenu?: (note: MoaFile, event: MouseEvent<HTMLDivElement>) => void;
}) {
  return (
    <div
      className={`
        group
        flex items-center gap-3
        px-4 py-3
        rounded-xl
        border
        cursor-pointer
        transition-all duration-200
        ${
          selected
            ? isShared
              ? "bg-gradient-to-r from-green-100 to-blue-100 border-green-300 shadow-md"
              : "bg-gradient-to-r from-blue-100 to-purple-100 border-blue-300 shadow-md"
            : isShared
            ? "bg-white border-green-200 hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50 hover:border-green-300 hover:shadow-sm"
            : "bg-white border-slate-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:border-blue-300 hover:shadow-sm"
        }
      `}
      onClick={onClick}
      onContextMenu={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onContextMenu?.(note, event);
      }}
    >
      <div
        className={`
          w-6 h-6 rounded-lg flex items-center justify-center transition-colors duration-200
          ${
            selected
              ? isShared
                ? "bg-green-200"
                : "bg-blue-200"
              : isShared
              ? "bg-green-100 group-hover:bg-green-200"
              : "bg-blue-100 group-hover:bg-blue-200"
          }
        `}
      >
        <FileText
          className={`
            w-3 h-3 transition-colors duration-200
            ${
              selected
                ? isShared
                  ? "text-green-700"
                  : "text-blue-700"
                : isShared
                ? "text-green-600 group-hover:text-green-700"
                : "text-blue-600 group-hover:text-blue-700"
            }
          `}
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span
            className={`
              text-sm font-medium truncate transition-colors duration-200
              ${
                selected
                  ? isShared
                    ? "text-green-900"
                    : "text-blue-900"
                  : isShared
                  ? "text-green-800 group-hover:text-green-900"
                  : "text-slate-800 group-hover:text-slate-900"
              }
            `}
          >
            {note.name}
          </span>
          {isShared && (
            <Users className="w-3 h-3 text-green-600 flex-shrink-0" />
          )}
        </div>
      </div>

      {!isShared && (
        <button
          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-white/60 transition-all duration-200 hover:scale-110"
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          title="노트 수정"
          type="button"
        >
          <Edit3
            className={`w-3 h-3 ${
              selected ? "text-blue-600" : "text-slate-600"
            }`}
          />
        </button>
      )}
    </div>
  );
}
