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
}: {
  file: MoaFile;
  selectedNoteId: string;
  folderOpen: Record<string, boolean>;
  onToggleFolder: (id: string) => void;
  onEditFolder: (folder: MoaFile) => void;
  onEditNote: (note: MoaFile) => void;
  onNoteClick: (noteId: string) => void;
  parentId?: string | null;
}) {
  console.log(file);
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
    const notes = file.children
      ? file.children.filter((file) => file.type.toString() === "DOCUMENT")
      : [];
    const directories = file.children
      ? file.children.filter((file) => file.type.toString() === "DIRECTORY")
      : [];

    console.log("노트들");
    console.log(notes);
    return (
      <FolderItem
        key={file.id}
        folder={file}
        open={folderOpen[file.id] ?? true} // 처음엔 폴더는 열린 상태로 보여짐
        onToggle={() => onToggleFolder(file.id)}
        onEdit={() => onEditFolder(file)}
      >
        <>
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
