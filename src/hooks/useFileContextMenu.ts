import { useCallback, useState } from "react";

import type { MoaFile } from "@/types/file";

/**
 * 2차원 좌표를 표현합니다.
 */
export interface FileContextMenuPosition {
  x: number;
  y: number;
}

/**
 * 우클릭 컨텍스트 메뉴 상태를 나타냅니다.
 */
export interface FileContextMenuState {
  file: MoaFile;
  position: FileContextMenuPosition;
}

/**
 * 파일 우클릭 컨텍스트 메뉴 열림/닫힘 상태를 관리합니다.
 * @returns 컨텍스트 메뉴 상태와 제어 함수
 */
export default function useFileContextMenu() {
  const [contextMenu, setContextMenu] = useState<FileContextMenuState | null>(
    null
  );

  /**
   * 주어진 파일과 위치에서 컨텍스트 메뉴를 표시합니다.
   * @param file 메뉴를 열 파일
   * @param position 마우스 위치 좌표
   */
  const openContextMenu = useCallback(
    (file: MoaFile, position: FileContextMenuPosition) => {
      setContextMenu({ file, position });
    },
    []
  );

  /**
   * 컨텍스트 메뉴를 닫습니다.
   */
  const closeContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  return {
    contextMenu,
    openContextMenu,
    closeContextMenu,
  } as const;
}