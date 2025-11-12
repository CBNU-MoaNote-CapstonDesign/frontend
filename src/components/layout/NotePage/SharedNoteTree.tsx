"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import type { MoaFile } from "@/types/file";
import { getSharedFiles } from "@/libs/client/file";
import { FileTypeDTO } from "@/types/dto";

import FolderItem from "@/components/layout/NotePage/FolderItem";
import NoteItem from "@/components/layout/NotePage/NoteItem";

export default function SharedNoteTree({
  user,
  selectedNoteId,
  onSelectNote,
}: {
  user: User;
  selectedNoteId: string;
  onSelectNote?: (noteId: string) => void;
}) {
  const [sharedFiles, setSharedFiles] = useState<MoaFile[]>([]);
  const [folderOpen, setFolderOpen] = useState<Record<string, boolean>>({});

  const router = useRouter();

  useEffect(() => {
    getSharedFiles(user).then((files: MoaFile[]) => {
      setSharedFiles(files);
    });
  }, [user]);

  // 폴더 토글 핸들러
  const handleToggleFolder = (folderId: string) => {
    setFolderOpen((prev) => ({
      ...prev,
      [folderId]: !prev[folderId],
    }));
  };

  const sharedNotes = sharedFiles.filter((file) => file.type === FileTypeDTO.DOCUMENT);

  return (
    <div>
      <FolderItem
          folder={
            {
              id: "00000000-0000-0000-0000-000000000000", // 공유 폴더의 임시 uuid
              name: "공유받은 문서",
              type: FileTypeDTO.DIRECTORY,
              children: [],
            } as MoaFile
          }
          open={folderOpen["00000000-0000-0000-0000-000000000000"] ?? true}
          onToggle={() =>
              handleToggleFolder("00000000-0000-0000-0000-000000000000")
          }
          onEdit={() => {
          }}
          isShared={true}
      >
        {sharedNotes.length > 0 && (
            <div className="mt-2 space-y-1 animate-in slide-in-from-top-2 duration-200">
              {sharedNotes.map((file: MoaFile) => (
                  <NoteItem
                      key={file.id}
                      note={file}
                      onEdit={() => {
                      }}
                      selected={selectedNoteId == file.id}
                      onClick={() => {
                        if (onSelectNote) {
                          onSelectNote(file.id);
                        } else {
                          router.push(`/doc/${file.id}`);
                        }
                      }}
                      isShared={true}
                  />
              ))}
            </div>
        )}
      </FolderItem>
    </div>
  );
}
