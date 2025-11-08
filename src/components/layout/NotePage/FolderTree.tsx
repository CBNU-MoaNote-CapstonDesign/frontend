"use client";

import type { MoaFile } from "@/types/file";

import FolderItem from "@/components/layout/NotePage/FolderItem";
import NoteItem from "@/components/layout/NotePage/NoteItem";

export default function FolderTree({
  file,
  selectedNoteId,
  folderOpen,
  onToggleFolder,
  onEditFolder,
  onEditNote,
  onNoteClick,
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
