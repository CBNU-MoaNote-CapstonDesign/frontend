"use client";

import { MoaFile } from "@/types/file";
import React, { useEffect, useState } from "react";

interface Props {
  root: MoaFile;
  folderId: string;
  onDelete: (folderId: string) => void;
  onEdit: (
    folderId: string,
    folderName: string,
    parentId: string,
    selectedNotes: string[]
  ) => void;
  onCancel: () => void;
}

export const getFileById = (
  folderId: string,
  node: MoaFile
): MoaFile | null => {
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
};

export const getParent = (
  folderId: string,
  node: MoaFile,
  parentId: string | null = null
): string | null => {
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
};

// 모든 노트 목록
function getNoteList(folder: MoaFile) {
  const notes = [];
  if (folder.type.toString() === "DOCUMENT") {
    notes.push(folder);
  }
  if (folder.children) {
    folder.children.forEach((child) => {
      notes.push(...getNoteList(child));
    });
  }
  return notes;
}

// 모든 디렉토리 목록
function renderFolderOptions(folder: MoaFile, depth = 0): React.ReactNode {
  // 루트 폴더 가져오기

  if (folder.type.toString() !== "DIRECTORY") return null;

  return (
    <React.Fragment key={folder.id}>
      <option value={folder.id}>{`${"—".repeat(depth)} ${folder.name}`}</option>
      {folder.children &&
        folder.children.map((child) => renderFolderOptions(child, depth + 1))}
    </React.Fragment>
  );
}

export default function FolderEditModal({
  root,
  folderId,
  onDelete,
  onEdit,
  onCancel,
}: Props) {
  const [folderName, setFolderName] = useState<string>("");
  const [parentId, setParentId] = useState<string | null>(null);
  const [selectedNotes, setSelectedNotes] = useState<MoaFile[]>([]);

  // 부모 ID 찾고, Selected Notes 에 children 추가하고, folder name에 이름 바꾸기

  useEffect(() => {
    const newParentId = getParent(folderId, root, root.id);
    const folder = getFileById(folderId, root);

    if (parent && folder) {
      setParentId(newParentId);
      setFolderName(folder.name);
      const newSelectedNotes: MoaFile[] = [];
      if (folder.children) {
        for (const file of folder.children) {
          newSelectedNotes.push(file);
        }
      }
      setSelectedNotes(newSelectedNotes);
    }
  }, [folderId, root]);

  const notes = getNoteList(root);

  return (
    <div className="fixed inset-0 bg-[#f0f8fe]/80 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-bold mb-4 text-[#186370]">폴더 수정</h2>

        {/* 폴더 이름 */}
        <label className="block mb-2 font-semibold">폴더 이름</label>
        <input
          className="w-full border rounded px-3 py-2 mb-4"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
        />

        {/* 폴더 위치 */}
        <label className="block mb-2 font-semibold">폴더 위치</label>
        <select
          className="w-full border rounded px-3 py-2 mb-4"
          value={parentId ? parentId : root.id}
          onChange={(e) => setParentId(e.target.value)}
        >
          {renderFolderOptions(root)}
        </select>

        {/* 폴더에 포함된 노트 */}
        <label className="block mb-2 font-semibold">
          폴더에 추가할 노트 선택
        </label>
        <div className="max-h-40 overflow-y-auto mb-4">
          {notes.length === 0 && (
            <div className="text-gray-400 text-sm">노트가 없습니다.</div>
          )}
          {notes.map((note) => (
            <label
              key={note.id}
              className="flex items-center gap-2 mb-1 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedNotes.some((n) => n.id === note.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedNotes([...selectedNotes, note]);
                  } else {
                    setSelectedNotes(
                      selectedNotes.filter((n) => n.id !== note.id)
                    );
                  }
                }}
                className="cursor-pointer"
              />
              <span>{note.name}</span>
            </label>
          ))}
        </div>

        {/* 버튼 영역 */}
        <div className="flex justify-between gap-2">
          {/* 폴더 삭제 */}
          <button
            className="px-4 py-2 rounded bg-red-200 hover:bg-red-400 text-red-900 font-semibold cursor-pointer"
            onClick={() => {
              onDelete(folderId);
            }}
          >
            폴더 삭제
          </button>

          {/* 저장 및 취소 */}
          <div className="flex gap-2">
            <button
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 cursor-pointer"
              onClick={() => {
                onCancel();
              }}
            >
              취소
            </button>
            <button
              className="px-4 py-2 rounded bg-[#186370] text-white font-semibold hover:bg-[#38bdf8] cursor-pointer"
              onClick={() => {
                onEdit(
                  folderId,
                  folderName,
                  parentId ? parentId : "",
                  selectedNotes.map((file) => file.id)
                );
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
