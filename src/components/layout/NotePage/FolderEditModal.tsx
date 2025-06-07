"use client";

import { MoaFile } from "@/types/file";

interface Props {
  notes: MoaFile[]; // 전체 노트 (type === DOCUMENT)
  folders: MoaFile[]; // 전체 폴더 (type === DIRECTORY)
  editFolderId: string;
  editFolderName: string;
  setEditFolderName: (v: string) => void;
  editFolderNotes: MoaFile[];
  setEditFolderNotes: (v: MoaFile[]) => void;
  setFolders: React.Dispatch<React.SetStateAction<MoaFile[]>>;
  closeEditModal: () => void;
}

export default function FolderEditModal({
                                          notes,
                                          folders,
                                          editFolderId,
                                          editFolderName,
                                          setEditFolderName,
                                          editFolderNotes,
                                          setEditFolderNotes,
                                          setFolders,
                                          closeEditModal,
                                        }: Props) {
  const editedFolder = folders.find(f => f.id === editFolderId);

  if (!editedFolder) return null;

  // 상위 폴더 id 추출 (children 기반이라면 따로 관리 필요)
  const parentId = undefined; // MoaFile 구조라면 별도 관리 필요 (상위 폴더 id가 없다면 최상위 폴더)

  return (
    <div className="fixed inset-0 bg-[#f0f8fe]/80 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-bold mb-4 text-[#186370]">폴더 수정</h2>

        {/* 폴더 이름 */}
        <label className="block mb-2 font-semibold">폴더 이름</label>
        <input
          className="w-full border rounded px-3 py-2 mb-4"
          value={editFolderName}
          onChange={e => setEditFolderName(e.target.value)}
        />

        {/* 폴더에 포함된 노트 */}
        <label className="block mb-2 font-semibold">폴더에 포함된 노트</label>
        <div className="mb-4">
          {editFolderNotes.length === 0 && (
            <div className="text-gray-400 text-sm">노트 없음</div>
          )}
          {editFolderNotes.map(note => (
            <div key={note.id} className="flex items-center gap-2 mb-1">
              <span className="flex-1">{note.name}</span>
              <button
                className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 text-xs cursor-pointer"
                onClick={() => {
                  setEditFolderNotes(
                    editFolderNotes.filter(n => n.id !== note.id)
                  );
                }}
              >
                삭제
              </button>
            </div>
          ))}
        </div>

        {/* 폴더에 추가할 노트 */}
        <label className="block mb-2 font-semibold">폴더에 추가할 노트</label>
        <div className="max-h-32 overflow-y-auto mb-4">
          {notes
            .filter(
              n =>
                n.type.toString() === "DOCUMENT" &&
                !editFolderNotes.some(en => en.id === n.id) &&
                !folders.some(f =>
                  (f.children || []).some(child => child.id === n.id)
                )
            )
            .map(note => (
              <div
                key={note.id}
                className="flex items-center gap-2 mb-1 cursor-pointer hover:bg-[#e0f2ff] rounded px-2 py-1 transition"
                onClick={() => {
                  setEditFolderNotes([...editFolderNotes, note]);
                }}
              >
                <span>{note.name}</span>
              </div>
            ))}
        </div>

        {/* 버튼 영역 */}
        <div className="flex justify-between gap-2">
          {/* 폴더 삭제 */}
          <button
            className="px-4 py-2 rounded bg-red-200 hover:bg-red-400 text-red-900 font-semibold cursor-pointer"
            onClick={() => {
              // 삭제될 폴더의 노트들을 상위 폴더로 이동 (children 구조라면 flatten 필요)
              if (editedFolder.children && editedFolder.children.length > 0) {
                if (parentId) {
                  setFolders(prev =>
                    prev.map(f =>
                      f.id === parentId
                        ? {
                          ...f,
                          children: [
                            ...(f.children || []),
                            ...editedFolder.children!,
                          ],
                        }
                        : f
                    )
                  );
                }
                // 최상위로 이동 시, 별도 처리 필요(프로젝트 설계에 맞춰)
              }
              setFolders(prev => prev.filter(f => f.id !== editFolderId));
              closeEditModal();
            }}
          >
            폴더 삭제
          </button>

          {/* 저장 및 취소 */}
          <div className="flex gap-2">
            <button
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 cursor-pointer"
              onClick={closeEditModal}
            >
              취소
            </button>
            <button
              className="px-4 py-2 rounded bg-[#186370] text-white font-semibold hover:bg-[#38bdf8] cursor-pointer"
              onClick={() => {
                // 폴더 이름과 children 업데이트
                setFolders(prev =>
                  prev.map(f =>
                    f.id === editFolderId
                      ? { ...f, name: editFolderName, children: editFolderNotes }
                      : f
                  )
                );
                closeEditModal();
              }}
              disabled={!editFolderName.trim()}
            >
              저장
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
