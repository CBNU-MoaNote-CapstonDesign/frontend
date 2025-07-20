"use client";

import {MoaFile} from "@/types/file";
import React, {useEffect, useState} from "react";

interface Props {
  root: MoaFile;
  noteId: string;
  onDelete: (noteId: string) => void;
  onEdit: (noteId:string, noteName: string, parentId: string) => void;
  onCancel: () => void;
}

function getFileById (
  folderId: string,
  node: MoaFile
): MoaFile | null {
  if (node.id === folderId) {
    return node;
  }

  if (node.children) {
    for (const child of node.children) {
      const found = getFileById(folderId, child);
      if (found) {
        return found;
      }
    }
  }

  return null;
}

function getParent (
  folderId: string,
  node: MoaFile,
  parentId: string | null = null
): string | null {
  if (node.id === folderId) {
    return parentId;
  }

  if (node.children) {
    for (const child of node.children) {
      const foundParent = getParent(folderId, child, node.id);
      if (foundParent) {
        return foundParent;
      }
    }
  }

  return null;
}

// 모든 디렉토리 목록
function renderFolderOptions (
  folder: MoaFile,
  depth = 0
): React.ReactNode {
  if (folder.type.toString() !== "DIRECTORY") return null;

  return (
    <React.Fragment key={folder.id}>
      <option value={folder.id}>
        {`${"—".repeat(depth)} ${folder.name}`}
      </option>
      {folder.children &&
        folder.children.map((child) =>
          renderFolderOptions(child, depth + 1)
        )
      }
    </React.Fragment>
  );
}

export default function NoteEditModal({
                                          root,
                                          noteId,
                                          onDelete,
                                          onEdit,
                                          onCancel,
                                        }: Props) {

  const [noteName, setNoteName] = useState<string>("");
  const [parentId, setParentId] = useState<string|null>(null);

  useEffect(() => {
    const newParentId = getParent(noteId, root, root.id);
    const folder = getFileById(noteId, root);

    if(parent && folder) {
      setParentId(newParentId);
      setNoteName(folder.name);
    }
  },[noteId, root])

  return (
    <div className="fixed inset-0 bg-[#f0f8fe]/80 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-bold mb-4 text-[#186370]">노트 수정</h2>

        {/* 노트 이름 */}
        <label className="block mb-2 font-semibold">노트 이름</label>
        <input
          className="w-full border rounded px-3 py-2 mb-4"
          value={noteName}
          onChange={e => setNoteName(e.target.value)}
        />

        { /* 노트 위치 */ }
        <label className="block mb-2 font-semibold">노트 위치</label>
        <select
          className="w-full border rounded px-3 py-2 mb-4"
          value={parentId?parentId:root.id}
          onChange={(e) => setParentId(e.target.value)}
        >
          {renderFolderOptions(root)}
        </select>

        {/* 버튼 영역 */}
        <div className="flex justify-between gap-2">
          {/* 노트 삭제 */}
          <button
            className="px-4 py-2 rounded bg-red-200 hover:bg-red-400 text-red-900 font-semibold cursor-pointer"
            onClick={() => {
              onDelete(noteId);
            }}
          >
            노트 삭제
          </button>

          {/* 저장 및 취소 */}
          <div className="flex gap-2">
            <button
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 cursor-pointer"
              onClick={()=>{
                onCancel();
              }}
            >
              취소
            </button>
            <button
              className="px-4 py-2 rounded bg-[#186370] text-white font-semibold hover:bg-[#38bdf8] cursor-pointer"
              onClick={() => {
                onEdit(noteId, noteName, parentId?parentId:root.id);
              }}
            >
              저장
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
