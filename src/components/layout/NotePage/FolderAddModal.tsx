"use client";

import { MoaFile } from "@/types/file";
import React, { useState } from "react";

interface Props {
  root: MoaFile;
  onAdd: (
    folderName: string,
    parentId: string,
    selectedNotes: string[]
  ) => void;
  onCancel: () => void;
  errorMsg?: string | null;
}

export default function FolderAddModal({
  root,
  onAdd,
  onCancel,
  errorMsg,
}: Props) {
  const [folderName, setFolderName] = useState<string>("");
  const [parentId, setParentId] = useState<string>(root.id);
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);

  // 모든 부모 목록
  const renderFolderOptions = (folder: MoaFile, depth = 0): React.ReactNode => {
    if (folder.type.toString() !== "DIRECTORY") return null;

    return (
      <React.Fragment key={folder.id}>
        <option value={folder.id}>
          {`${"—".repeat(depth)} ${folder.name}`}
        </option>
        {folder.children &&
          folder.children.map((child) => renderFolderOptions(child, depth + 1))}
      </React.Fragment>
    );
  };

  // 모든 노트 목록
  const getNoteList = (folder: MoaFile) => {
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
  };

  const notes = getNoteList(root);

  return (
    <div className="fixed inset-0 bg-[#f0f8fe]/80 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-[#186370]">폴더 추가</h2>

        {/* 안내문 표시 */}
        {errorMsg && (
          <div className="mb-4 text-red-500 text-sm font-semibold">
            {errorMsg}
          </div>
        )}

        {/* 폴더 생성 위치 */}
        <label className="block mb-2 font-semibold">폴더 생성 위치</label>
        <select
          className="w-full border rounded px-3 py-2 mb-4"
          value={parentId}
          onChange={(e) => setParentId(e.target.value)}
        >
          {renderFolderOptions(root)}
        </select>

        {/* 폴더 이름 */}
        <label className="block mb-2 font-semibold">폴더 이름</label>
        <input
          className="w-full border rounded px-3 py-2 mb-4"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          placeholder="폴더 이름을 입력하세요"
        />

        {/* 폴더에 추가할 노트 선택 */}
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
                checked={selectedNotes.some((n) => n === note.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedNotes([...selectedNotes, note.id]);
                  } else {
                    setSelectedNotes(
                      selectedNotes.filter((n) => n !== note.id)
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
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 cursor-pointer"
            onClick={onCancel}
          >
            취소
          </button>
          <button
            className="px-4 py-2 rounded bg-[#186370] text-white font-semibold hover:bg-[#38bdf8] cursor-pointer"
            onClick={() => {
              console.log("삽입 테스트");
              console.log(folderName);
              console.log(parentId);
              onAdd(folderName, parentId, selectedNotes);
            }}
            disabled={
              /*!folderName.trim() || selectedNotes.length === 0*/ false
            }
          >
            추가
          </button>
        </div>
      </div>
    </div>
  );
}
