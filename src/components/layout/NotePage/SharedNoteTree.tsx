"use client";

import {useEffect, useState} from "react";
import {MoaFile} from "@/types/file";
import FolderItem from "@/components/layout/NotePage/FolderItem";
import NoteItem from "@/components/layout/NotePage/NoteItem";
import {getSharedFiles} from "@/libs/client/file";
import {useRouter} from "next/navigation";
import {FileTypeDTO} from "@/types/dto";

export default function SharedNoteTree({user, selectedNoteId}: { user: User, selectedNoteId:string }) {
  const [sharedFiles, setSharedFiles] = useState<MoaFile[]>([]);
  const [folderOpen, setFolderOpen] = useState<Record<string, boolean>>({});

  const router = useRouter();

  useEffect(() => {
    getSharedFiles(user).then((files: MoaFile[]) => {
      setSharedFiles(files);
    })
  }, [user]);

  // 폴더 토글 핸들러
  const handleToggleFolder = (folderId: string) => {
    setFolderOpen(prev => ({
      ...prev,
      [folderId]: !prev[folderId]
    }));
  };

  return (
    <div>
      <FolderItem
        folder={{
          id: "00000000-0000-0000-0000-000000000000", // 공유 폴더의 임시 uuid
          name: "공유받은 문서",
          type: FileTypeDTO.DIRECTORY,
          children: []
        } as MoaFile}
        open={folderOpen["00000000-0000-0000-0000-000000000000"] ?? true}
        onToggle={() => handleToggleFolder("00000000-0000-0000-0000-000000000000")}
        onEdit={()=>{}}>
        {sharedFiles.length > 0 && (
          sharedFiles.map((file: MoaFile) => (
            <div key={file.id} className={"my-1 ml-7"}>
              <NoteItem
                note={file}
                onEdit={()=>{}}
                selected={selectedNoteId == file.id}
                onClick={()=>{
                  router.push(`/doc/${file.id}`);
                }} />
            </div>
          ))
        )}
      </FolderItem>
    </div>
  );
}