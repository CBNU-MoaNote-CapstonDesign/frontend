"use client";
import { getFileTree } from "@/libs/client/file";
import FolderTree from "@/components/layout/NotePage/FolderTree";
import { useEffect, useState } from "react";
import { MoaFile } from "@/types/file";

export default function TreeTest({ user }: { user: User }) {
  const [file, setFile] = useState<MoaFile | null>(null);

  useEffect(() => {
    getFileTree(null, user).then(file => {
      setFile(file);
    });
  }, [user]);

  if (file) {
    return (
      <FolderTree
        file={file}
        selectedNoteId={""}
        folderOpen={{}}
        onToggleFolder={() => {}}
        onEditFolder={() => {}}
        onNoteClick={() => {}}
      />
    );
  }

  return <>로딩중...</>;
}