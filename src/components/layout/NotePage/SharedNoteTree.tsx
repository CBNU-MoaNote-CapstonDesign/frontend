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

  const router = useRouter();

  useEffect(() => {
    getSharedFiles(user).then((files: MoaFile[]) => {
      setSharedFiles(files);
    })
  }, [user]);

  return (<div>
    <FolderItem
      folder={{
        id: "null",
        name: "공유받은 문서",
        type: FileTypeDTO.DIRECTORY,
        children: []
      } as MoaFile}
      open={()=>{}}
      onToggle={()=>{}}
      onEdit={()=>{}} />
    {
      sharedFiles.length > 0 && (
        sharedFiles.map((file: MoaFile) => {
          return (
            <NoteItem key={file.id}
                      note={file}
                      onEdit={()=>{}}
                      selected={selectedNoteId == file.id}
                      onClick={()=>{
                        router.push(`/doc/${file.id}`);
                      }} />
          );
        })
      )
    }
  </div>);
}