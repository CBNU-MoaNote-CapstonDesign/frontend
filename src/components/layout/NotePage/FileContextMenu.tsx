"use client";

import React from "react";
import { Share2 } from "lucide-react";

import Portal from "@/components/common/Portal";

export interface FileContextMenuProps {
  /** 우클릭 기준 좌표 */
  anchorPoint: { x: number; y: number } | null;
  /** 컨텍스트 메뉴를 닫는 핸들러 */
  onClose: () => void;
  /** 공유 메뉴 항목 선택 시 실행되는 콜백 */
  onShare: () => void;
}

/**
 * 파일 및 폴더 카드에서 사용하는 컨텍스트 메뉴입니다.
 * 공유 버튼만을 제공하며 Portal을 이용해 렌더링됩니다.
 */
export default function FileContextMenu({
  anchorPoint,
  onClose,
  onShare,
}: FileContextMenuProps) {
  if (!anchorPoint) {
    return null;
  }

  return (
    <Portal>
      <div
        className="fixed inset-0 z-50"
        role="presentation"
        onClick={onClose}
        onContextMenu={(event) => {
          event.preventDefault();
          onClose();
        }}
      >
        <div
          className="absolute min-w-[180px] rounded-xl border border-slate-200 bg-white shadow-xl"
          style={{
            top: anchorPoint.y,
            left: anchorPoint.x,
          }}
          onClick={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            className="flex w-full items-center gap-2 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
            onClick={() => {
              onShare();
              onClose();
            }}
          >
            <Share2 className="h-4 w-4 text-purple-500" />
            파일 공유
          </button>
        </div>
      </div>
    </Portal>
  );
}
