import FolderItem from "./FolderItem";
import NoteItem from "./NoteItem";
import { Note } from "@/types/note";

// Folder 타입이 없다면 아래처럼 정의(혹은 import)
interface Folder {
  id: string;
  name: string;
  noteIds: string[];
  parentId?: string | null;
}

export default function FolderTree({
  folders,
  notes,
  selectedNoteId,
  folderOpen,
  onToggleFolder,
  onEditFolder,
  onNoteClick,
  parentId = null,
}: {
  folders: Folder[];
  notes: Note[];
  selectedNoteId: string;
  folderOpen: Record<string, boolean>;
  onToggleFolder: (id: string) => void;
  onEditFolder: (folder: Folder) => void;
  onNoteClick: (noteId: string) => void;
  parentId?: string | null;
}) {
  return (
    <>
      {folders
        .filter(folder => (folder.parentId ?? null) === parentId)
        .map(folder => (
          <FolderItem
            key={folder.id}
            folder={folder}
            open={folderOpen[folder.id]}
            onToggle={() => onToggleFolder(folder.id)}
            onEdit={() => onEditFolder(folder)}
          >
            {/* 상위 폴더의 노트 */}
            {folder.noteIds.map(noteId => {
              const note = notes.find(n => n.id === noteId);
              if (!note) return null;
              return (
                <NoteItem
                  key={note.id}
                  note={note}
                  selected={selectedNoteId === note.id}
                  onClick={() => onNoteClick(note.id)}
                />
              );
            })}
            {/* 하위 폴더 */}
            <FolderTree
              folders={folders}
              notes={notes}
              selectedNoteId={selectedNoteId}
              folderOpen={folderOpen}
              onToggleFolder={onToggleFolder}
              onEditFolder={onEditFolder}
              onNoteClick={onNoteClick}
              parentId={folder.id}
            />
          </FolderItem>
        ))}
      {/* 폴더 밖 노트는 parentId === null에서만 렌더링 */}
      {parentId === null &&
        notes
          .filter(note => !folders.some(folder => folder.noteIds.includes(note.id)))
          .map(note => (
            <NoteItem
              key={note.id}
              note={note}
              selected={selectedNoteId === note.id}
              onClick={() => onNoteClick(note.id)}
            />
          ))}
    </>
  );
}