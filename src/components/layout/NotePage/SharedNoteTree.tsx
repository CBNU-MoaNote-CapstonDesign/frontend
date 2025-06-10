"use client";

import {useState} from "react";
import {MoaFile} from "@/types/file";

export default function SharedNoteTree({user}:{user: User}) {
  const [sharedFiles, setSharedFiles] = useState<MoaFile[]>([]);

  useEffect(() => {

  },[user]);

  return <div>
    sharedFiles.map(()=>{

  });
  </div>
}