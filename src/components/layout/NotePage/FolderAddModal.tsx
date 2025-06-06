import { Note } from "@/types/note";

interface Folder {
  id: string;
  name: string;
  noteIds: string[];
  parentId?: string | null;
}

export default function FolderAddModal({
  notes,
  folders,
  parentFolderId,
  setParentFolderId,
  folderName,
  setFolderName,
  selectedNoteIds,
  setSelectedNoteIds,
  onCancel,
  onAdd,
  errorMsg,
}: {
  notes: Note[];
  folders: Folder[];
  parentFolderId: string | null;
  setParentFolderId: (id: string | null) => void;
  folderName: string;
  setFolderName: (v: string) => void;
  selectedNoteIds: string[];
  setSelectedNoteIds: (v: string[]) => void;
  onCancel: () => void;
  onAdd: () => void;
  errorMsg?: string | null;
}) {
  return (
    <div className="fixed inset-0 bg-[#f0f8fe]/80 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-[#186370]">폴더 추가</h2>
        {/* 안내문 표시 */}
        {errorMsg && (
          <div className="mb-4 text-red-500 text-sm font-semibold">{errorMsg}</div>
        )}
        <label className="block mb-2 font-semibold">폴더 생성 위치</label>
        <select
          className="w-full border rounded px-3 py-2 mb-4"
          value={parentFolderId ?? ""}
          onChange={(e) => setParentFolderId(e.target.value || null)}
        >
          <option value="">내 노트 (최상위)</option>
          {folders.map((folder) => (
            <option key={folder.id} value={folder.id}>
              {folder.name}
            </option>
          ))}
        </select>
        <label className="block mb-2 font-semibold">폴더 이름</label>
        <input
          className="w-full border rounded px-3 py-2 mb-4"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          placeholder="폴더 이름을 입력하세요"
        />
        <label className="block mb-2 font-semibold">폴더에 추가할 노트 선택</label>
        <div className="max-h-40 overflow-y-auto mb-4">
          {notes.map((note) => (
            <label key={note.id} className="flex items-center gap-2 mb-1 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedNoteIds.includes(note.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedNoteIds([...selectedNoteIds, note.id]);
                  } else {
                    setSelectedNoteIds(selectedNoteIds.filter((id) => id !== note.id));
                  }
                }}
                className="cursor-pointer"
              />
              <span>{note.id}</span>
            </label>
          ))}
        </div>
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
            disabled={!folderName.trim() || selectedNoteIds.length === 0}
          >
            추가
          </button>
        </div>
      </div>
    </div>
  );
}