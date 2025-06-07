"use client";

import { MoaFile } from "@/types/file";

interface Props {
  root: MoaFile; // 루트 디렉토리 트리 전체
  selectedNotes: MoaFile[]; // 현재 선택된 노트들
  setSelectedNotes: (notes: MoaFile[]) => void;
  folderName: string;
  setFolderName: (name: string) => void;
  parentFolderId: string | null;
  setParentFolderId: (id: string | null) => void;
  onAdd: () => void;
  onCancel: () => void;
  errorMsg?: string | null;
}

export default function FolderAddModal({
                                         root,
                                         selectedNotes,
                                         setSelectedNotes,
                                         folderName,
                                         setFolderName,
                                         parentFolderId,
                                         setParentFolderId,
                                         onAdd,
                                         onCancel,
                                         errorMsg,
                                       }: Props) {

  const renderFolderOptions = (
    folder: MoaFile,
    depth = 0
  ): React.ReactNode => {
    if (folder.type.toString() !== "DIRECTORY") return null;
    return (
      <>
        <option key={folder.id} value={folder.id}>
          {`${"—".repeat(depth)} ${folder.name}`}
        </option>
        {folder.children &&
          folder.children.map((child) =>
            renderFolderOptions(child, depth + 1)
          )}
      </>
    );
  };

  // 재귀적으로 노트 목록 출력
  const renderNoteList = (folder: MoaFile) => {
    const notes = [];
    if (folder.type.toString() === "DOCUMENT") {
      notes.push(folder);
    }
    if (folder.children) {
      folder.children.forEach((child) => {
        notes.push(...renderNoteList(child));
      });
    }
    return notes;
  };

  const allNotes = renderNoteList(root);

  return (
    <div className="fixed inset-0 bg-[#f0f8fe]/80 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-[#186370]">폴더 추가</h2>

        {/* 안내문 표시 */}
        {errorMsg && (
          <div className="mb-4 text-red-500 text-sm font-semibold">{errorMsg}</div>
        )}

        {/* 폴더 생성 위치 */}
        <label className="block mb-2 font-semibold">폴더 생성 위치</label>
        <select
          className="w-full border rounded px-3 py-2 mb-4"
          value={parentFolderId ?? ""}
          onChange={(e) => setParentFolderId(e.target.value || null)}
        >
          <option value="">내 노트 (최상위)</option>
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
        <label className="block mb-2 font-semibold">폴더에 추가할 노트 선택</label>
        <div className="max-h-40 overflow-y-auto mb-4">
          {allNotes.length === 0 && (
            <div className="text-gray-400 text-sm">노트가 없습니다.</div>
          )}
          {allNotes.map((note) => (
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
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 cursor-pointer"
            onClick={onCancel}
          >
            취소
          </button>
          <button
            className="px-4 py-2 rounded bg-[#186370] text-white font-semibold hover:bg-[#38bdf8] cursor-pointer"
            onClick={onAdd}
            disabled={!folderName.trim() || selectedNotes.length === 0}
          >
            추가
          </button>
        </div>
      </div>
    </div>
  );
}
