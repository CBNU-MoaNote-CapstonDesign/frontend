"use client"

import {useState} from "react";
import {MoaFile} from "@/types/file";

interface Props {
  root: MoaFile;
  onAdd: (noteId: string, parentId: string) => void;
  onCancel: () => void;
  errorMsg?: string | null;
}

export default function NoteAddModal({
                                       root,
                                       onAdd,
                                       onCancel,
                                     }: Props) {
  const [noteName, setNoteName] = useState<string>("");
  const [parentId, setParentId] = useState<string>(root.id);

  // 모든 디렉토리 목록
  const renderFolderOptions = (
    folder: MoaFile,
    depth = 0
  ): React.ReactNode => {
    // 루트 폴더 가져오기

    if (folder.type.toString() !== "DIRECTORY") return null;

    return (
      <>
        <option key={folder.id} value={folder.id}>
          {`${"—".repeat(depth)} ${folder.name}`}
        </option>
        {folder.children &&
          folder.children.map((child) =>
            renderFolderOptions(child, depth + 1)
          )
        }
      </>
    );
  };

  return (
    <div className="fixed inset-0 bg-[#f0f8fe]/80 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-[#186370]">폴더 추가</h2>

        {/* 노트 생성 위치 */}
        <label className="block mb-2 font-semibold">노트 생성 위치</label>
        <select
          className="w-full border rounded px-3 py-2 mb-4"
          value={parentId}
          onChange={(e) => setParentId(e.target.value)}
        >
          {renderFolderOptions(root)}
        </select>

        {/* 노트 이름 */}
        <label className="block mb-2 font-semibold">폴더 이름</label>
        <input
          className="w-full border rounded px-3 py-2 mb-4"
          value={noteName}
          onChange={(e) => setNoteName(e.target.value)}
          placeholder="노트 이름을 입력하세요"
        />

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
            onClick={()=>{
              onAdd(noteName, parentId);
            }}
            disabled={/*!folderName.trim() || selectedNotes.length === 0*/ false}
          >
            추가
          </button>
        </div>
      </div>
    </div>
  );
}