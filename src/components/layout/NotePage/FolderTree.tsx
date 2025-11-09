"use client";

import type {MouseEvent} from "react";

import type {MoaFile} from "@/types/file";

import FolderItem from "@/components/layout/NotePage/FolderItem";
import NoteItem from "@/components/layout/NotePage/NoteItem";

/**
 * 파일 트리를 재귀적으로 렌더링합니다.
 * @param file 렌더링할 루트 파일
 * @param selectedNoteId 선택된 문서 ID
 * @param folderOpen 폴더 열림 상태 맵
 * @param onToggleFolder 폴더 열림/닫힘 토글 핸들러
 * @param onEditFolder 폴더 편집 요청 핸들러
 * @param onEditNote 노트 편집 요청 핸들러
 * @param onNoteClick 노트 클릭 핸들러
 * @param onContextMenu 컨텍스트 메뉴 요청 핸들러
 * @param loadingFolders 폴더 로딩 상태 맵
 * @param isRoot 루트 노드 여부
 */
export default function FolderTree({
   file,
   selectedNoteId,
   folderOpen,
   onToggleFolder,
   onEditFolder,
   onEditNote,
   onNoteClick,
   onContextMenu,
   loadingFolders = {},
   isRoot = false,
 }: {
  file: MoaFile;
  selectedNoteId: string;
  folderOpen: Record<string, boolean>;
  onToggleFolder: (id: string) => void;
  onEditFolder: (folder: MoaFile) => void;
  onEditNote: (note: MoaFile) => void;
  onNoteClick: (noteId: string) => void;
  parentId?: string | null;
  onContextMenu: (file: MoaFile, event: MouseEvent<HTMLDivElement>) => void;
  loadingFolders?: Record<string, boolean>;
  isRoot?: boolean;
}) {
  if (file.type.toString() == "DOCUMENT") {
    return (
      <NoteItem
        key={file.id}
        note={file}
        selected={file.id === selectedNoteId}
        onClick={() => onNoteClick(file.id)}
        onEdit={() => onEditNote(file)}
        onContextMenu={(note, event) => onContextMenu(note, event)}
      />
    );
  } else if (file.type.toString() == "DIRECTORY") {
    const isOpen = folderOpen[file.id] ?? isRoot;
    const notes = file.children
      ? file.children.filter((file) => file.type.toString() === "DOCUMENT")
      : [];
    const directories = file.children
      ? file.children.filter((file) => file.type.toString() === "DIRECTORY")
      : [];
    const isLoading = loadingFolders[file.id] ?? false;

    return (
      <FolderItem
        key={file.id}
        folder={file}
        open={isOpen}
        onToggle={() => onToggleFolder(file.id)}
        onEdit={() => onEditFolder(file)}
        onContextMenu={(folder, event) => onContextMenu(folder, event)}
      >
        <>
          {isLoading && (
            <div className="pl-10 py-1 text-xs text-slate-500">로딩 중...</div>
          )}
          {directories.length > 0 && (
            <div className="mt-2 space-y-1 animate-in slide-in-from-top-2 duration-200">
              {directories.map((directory) => (
                <FolderTree
                  key={directory.id}
                  file={directory}
                  selectedNoteId={selectedNoteId}
                  folderOpen={folderOpen}
                  onToggleFolder={onToggleFolder}
                  onEditFolder={onEditFolder}
                  onEditNote={onEditNote}
                  onNoteClick={onNoteClick}
                  onContextMenu={onContextMenu}
                  loadingFolders={loadingFolders}
                  isRoot={false}
                />
              ))}
            </div>
          )}
          {notes.length > 0 && (
            <div className="mt-2 space-y-1 animate-in slide-in-from-top-2 duration-200">
              {notes.map((note) => (
                <FolderTree
                  key={note.id}
                  file={note}
                  selectedNoteId={selectedNoteId}
                  folderOpen={folderOpen}
                  onToggleFolder={onToggleFolder}
                  onEditFolder={onEditFolder}
                  onEditNote={onEditNote}
                  onNoteClick={onNoteClick}
                  onContextMenu={onContextMenu}
                  loadingFolders={loadingFolders}
                  isRoot={false}
                />
              ))}
            </div>
          )}
        </>
      </FolderItem>
    );
  }

  return null;
}