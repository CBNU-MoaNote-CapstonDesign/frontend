"use client";

import { useEffect } from "react";
import { Share2 } from "lucide-react";

import Portal from "@/components/common/Portal";
import type { MoaFile } from "@/types/file";
import type { FileContextMenuPosition } from "@/hooks/useFileContextMenu";

interface FileContextMenuProps {
  file: MoaFile;
  position: FileContextMenuPosition;
  onShare: (file: MoaFile) => void;
  onClose: () => void;
}

/**
 * 파일 우클릭 컨텍스트 메뉴를 렌더링합니다.
 * @param file 메뉴를 표시할 대상 파일
 * @param position 화면 좌표
 * @param onShare 공유 동작 콜백
 * @param onClose 메뉴 닫기 콜백
 */
export default function FileContextMenu({
                                          file,
                                          position,
                                          onShare,
                                          onClose,
                                        }: FileContextMenuProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <Portal>
      <div
        className="fixed inset-0 z-[2000]"
        onClick={onClose}
        onContextMenu={(event) => event.preventDefault()}
        role="presentation"
      >
        <div
          className="absolute min-w-[180px] rounded-xl border border-slate-200 bg-white/95 shadow-xl backdrop-blur-sm"
          style={{ top: position.y, left: position.x }}
          onClick={(event) => event.stopPropagation()}
          role="menu"
        >
          <button
            type="button"
            onClick={() => {
              onShare(file);
              onClose();
            }}
            className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 transition-colors duration-150 hover:bg-slate-100"
          >
            <Share2 className="h-4 w-4 text-blue-500" />
            <span>
              공유하기
              <span className="sr-only"> {file.name}</span>
            </span>
          </button>
        </div>
      </div>
    </Portal>
  );
}