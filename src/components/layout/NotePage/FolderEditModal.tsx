import { Note } from "@/types/note";

interface Folder {
  id: string;
  name: string;
  noteIds: string[];
  parentId?: string | null;
}

interface Props {
  notes: Note[];
  folders: Folder[];
  editFolderId: string;
  editFolderName: string;
  setEditFolderName: (v: string) => void;
  editFolderNotes: string[];
  setEditFolderNotes: (v: string[]) => void;
  setFolders: React.Dispatch<React.SetStateAction<Folder[]>>;
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

  return (
    <div className="fixed inset-0 bg-[#f0f8fe]/80 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-bold mb-4 text-[#186370]">폴더 수정</h2>
        <label className="block mb-2 font-semibold">폴더 이름</label>
        <input
          className="w-full border rounded px-3 py-2 mb-4"
          value={editFolderName}
          onChange={e => setEditFolderName(e.target.value)}
        />
        <label className="block mb-2 font-semibold">폴더에 포함된 노트</label>
        <div className="mb-4">
          {editFolderNotes.length === 0 && (
            <div className="text-gray-400 text-sm">노트 없음</div>
          )}
          {editFolderNotes.map(noteId => {
            const note = notes.find(n => n.id === noteId);
            if (!note) return null;
            return (
              <div key={note.id} className="flex items-center gap-2 mb-1">
                <span className="flex-1">{note.id}</span>
                {/* 노트 삭제 버튼 */}
                <button
                  className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 text-xs cursor-pointer"
                  onClick={() => {
                    setEditFolderNotes(editFolderNotes.filter(id => id !== note.id));
                  }}
                >
                  삭제
                </button>
              </div>
            );
          })}
        </div>
        <label className="block mb-2 font-semibold">폴더에 추가할 노트</label>
        <div className="max-h-32 overflow-y-auto mb-4">
          {notes
            .filter(
              n =>
                !editFolderNotes.includes(n.id) &&
                !folders.some(f => f.noteIds.includes(n.id))
            )
            .map(note => (
              <div
                key={note.id}
                className="flex items-center gap-2 mb-1 cursor-pointer hover:bg-[#e0f2ff] rounded px-2 py-1 transition"
                onClick={() => {
                  setEditFolderNotes([...editFolderNotes, note.id]);
                }}
              >
                <span>{note.id}</span>
              </div>
            ))}
        </div>
        <div className="flex justify-between gap-2">
          <button
            className="px-4 py-2 rounded bg-red-200 hover:bg-red-400 text-red-900 font-semibold cursor-pointer"
            onClick={() => {
              const parentId = editedFolder.parentId ?? null;
              // 삭제될 폴더의 노트들을 상위 폴더로 이동
              if (editedFolder.noteIds.length > 0) {
                if (parentId) {
                  setFolders(prev =>
                    prev.map(f =>
                      f.id === parentId
                        ? { ...f, noteIds: [...f.noteIds, ...editedFolder.noteIds] }
                        : f
                    )
                  );
                }
                // 최상위로 이동: 어떤 폴더에도 포함시키지 않음(별도 처리 필요 없음)
              }
              // 폴더 삭제
              setFolders(prev => prev.filter(f => f.id !== editFolderId));
              closeEditModal();
            }}
          >
            폴더 삭제
          </button>
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
                // 폴더 이름/노트 변경 저장
                setFolders(prev =>
                  prev.map(f =>
                    f.id === editFolderId
                      ? { ...f, name: editFolderName, noteIds: editFolderNotes }
                      : f
                  )
                );
                // 삭제된 노트는 상위 폴더(혹은 최상위)로 이동
                const removedNotes = editedFolder.noteIds.filter(
                  id => !editFolderNotes.includes(id)
                );
                if (removedNotes.length > 0) {
                  const parentId = editedFolder.parentId ?? null;
                  if (parentId) {
                    setFolders(prev =>
                      prev.map(f =>
                        f.id === parentId
                          ? { ...f, noteIds: [...f.noteIds, ...removedNotes] }
                          : f
                      )
                    );
                  }
                  // 최상위로 이동: 어떤 폴더에도 포함시키지 않음(별도 처리 필요 없음)
                }
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