import { Note } from "@/types/note";
import { useRouter } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { BsChevronLeft, BsChevronDown, BsChevronRight, BsFolderFill, BsPencil } from "react-icons/bs";

import FolderTree from "./FolderTree";
import AddMenu from "./AddMenu";
import FolderAddModal from "./FolderAddModal";
import FolderEditModal from "./FolderEditModal";

interface NoteExplorerProps {
  user: User;
  notes: Note[];
  selectedNoteId: string;
}

interface Folder {
  id: string;
  name: string;
  noteIds: string[];
  parentId?: string | null; // ← 이 줄 추가!
}

export default function NoteExplorer({
  user,
  notes,
  selectedNoteId,
}: NoteExplorerProps) {
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [selectedNoteIds, setSelectedNoteIds] = useState<string[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [folderOpen, setFolderOpen] = useState<Record<string, boolean>>({});
  const [parentFolderId, setParentFolderId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [editFolderId, setEditFolderId] = useState<string | null>(null);
  const [editFolderName, setEditFolderName] = useState("");
  const [editFolderNotes, setEditFolderNotes] = useState<string[]>([]);
  const asideRef = useRef<HTMLDivElement>(null);

  // 햄버거 버튼 클릭 시 NoteExplorer 열기
  const handleOpen = () => setOpen(true);
  // 닫기 버튼 클릭 시 NoteExplorer 닫기
  const handleClose = () => setOpen(false);

  // 폴더 추가 모달 열기
  const openFolderModal = () => {
    setShowAddMenu(false);
    setShowFolderModal(true);
    setFolderName("");
    setSelectedNoteIds([]);
    setParentFolderId(null);
  };

  // 폴더 추가 핸들러
  const handleAddFolder = () => {
    // 이미 다른 폴더에 포함된 노트가 있는지 검사
    const alreadyInFolder = selectedNoteIds.find(noteId =>
      folders.some(folder => folder.noteIds.includes(noteId))
    );
    if (alreadyInFolder) {
      setErrorMsg("이미 다른 폴더에 포함된 노트입니다.");
      return;
    }
    if (!folderName.trim() || selectedNoteIds.length === 0) return;
    const newId = `${Date.now()}`;
    setFolders([
      ...folders,
      {
        id: newId,
        name: folderName,
        noteIds: selectedNoteIds,
        parentId: parentFolderId ?? null,
      },
    ]);
    setFolderOpen((prev) => ({ ...prev, [newId]: true }));
    setShowFolderModal(false);
    setFolderName("");
    setSelectedNoteIds([]);
    setParentFolderId(null);
    setErrorMsg(null);
  };

  // 폴더 추가 모달이 열릴 때 에러 메시지 초기화
  useEffect(() => {
    if (showFolderModal) setErrorMsg(null);
  }, [showFolderModal]);

  // 노트가 폴더에 포함되어 있는지 확인
  const isNoteInFolder = (noteId: string) =>
    folders.some((folder) => folder.noteIds.includes(noteId));

  // 폴더 토글 핸들러
  const handleToggleFolder = (folderId: string) => {
    setFolderOpen((prev) => ({
      ...prev,
      [folderId]: !prev[folderId],
    }));
  };

  function renderFolders(parentId: string | null) {
    return folders
      .filter(folder => (folder.parentId ?? null) === parentId)
      .map(folder => (
        <div key={folder.id} className="mb-2 ml-2">
          <div
            className="flex items-center gap-2 px-2 py-1 font-semibold text-[#186370] bg-[#e0e7ff] rounded select-none"
          >
            {/* 폴더 토글 버튼 */}
            <button
              className={`
                flex items-center justify-center
                w-6 h-6
                rounded
                transition
                cursor-pointer
                hover:bg-[#dbeafe]
                hover:scale-110
                mr-1
              `}
              onClick={e => {
                e.stopPropagation();
                handleToggleFolder(folder.id);
              }}
              title={folderOpen[folder.id] ? "폴더 닫기" : "폴더 열기"}
              type="button"
            >
              {folderOpen[folder.id] ? (
                <BsChevronDown className="w-4 h-4" />
              ) : (
                <BsChevronRight className="w-4 h-4" />
              )}
            </button>
            <BsFolderFill className="w-5 h-5" />
            <span>{folder.name}</span>
            {/* 연필(수정) 아이콘 - 가장 우측 */}
            <button
              className={`
                ml-auto p-1 rounded
                hover:bg-[#dbeafe]
                hover:scale-110
                transition
                cursor-pointer
              `}
              onClick={e => {
                e.stopPropagation();
                openEditModal(folder);
              }}
              title="폴더 수정"
              type="button"
            >
              <BsPencil className="w-4 h-4 text-[#186370]" />
            </button>
          </div>
          {folderOpen[folder.id] && (
            <div className="ml-6 mt-1 space-y-1">
              {/* 1. 상위 폴더의 노트 먼저 */}
              {folder.noteIds.map(noteId => {
                const note = notes.find(n => n.id === noteId);
                if (!note) return null;
                return (
                  <div
                    key={note.id}
                    className={`
                      group
                      flex items-center justify-between
                      px-4 py-3
                      rounded-xl
                      shadow
                      cursor-pointer
                      transition
                      ${selectedNoteId === note.id ? "bg-[#dbeafe] font-bold" : "bg-white hover:bg-[#dbeafe]"}
                    `}
                    onClick={() => router.push(`/doc/${note.id}`)}
                  >
                    <span className="text-base font-medium text-[#222] truncate">
                      {note.id}
                    </span>
                    <svg
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="ml-2 opacity-0 group-hover:opacity-100 transition"
                    >
                      <path d="M9 6l6 6-6 6" stroke="#186370" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                );
              })}
              {/* 2. 하위 폴더는 아래에 */}
              {renderFolders(folder.id)}
            </div>
          )}
        </div>
      ));
  }

  // 폴더 수정 모달 열기
  function openEditModal(folder: Folder) {
    setEditFolderId(folder.id);
    setEditFolderName(folder.name);
    setEditFolderNotes([...folder.noteIds]);
  }

  // 폴더 수정 모달 닫기
  function closeEditModal() {
    setEditFolderId(null);
    setEditFolderName("");
    setEditFolderNotes([]);
  }

  return (
    <>
      {/* 햄버거 버튼: 닫혀있을 때만 표시 */}
      {!open && (
        <button
          className="fixed top-28 left-4 z-50 w-12 h-12 bg-white rounded-full shadow flex items-center justify-center hover:bg-[#e0f2ff] transition cursor-pointer"
          onClick={handleOpen}
          title="노트 목록 열기"
          aria-label="노트 목록 열기"
        >
          <RxHamburgerMenu className="w-7 h-7 text-[#186370]" />
        </button>
      )}

      {/* NoteExplorer 패널: open 상태일 때만 표시 */}
      {open && (
        <aside
          ref={asideRef}
          className="
            flex flex-col
            w-full max-w-xs
            h-[calc(100vh-6rem)]
            bg-[#e0f2ff]
            shadow-md
            rounded-r-2xl
            overflow-visible
            z-40
            transition-transform
            duration-300
            relative
          "
        >
          {/* 닫기 버튼: 우측 가운데에 < 화살표로 표시 */}
          <button
            className="absolute top-1/2 right-[-32px] z-50 w-12 h-12 bg-white rounded-full shadow flex items-center justify-center hover:bg-[#dbeafe] transition -translate-y-1/2 cursor-pointer"
            onClick={handleClose}
            title="노트 목록 닫기"
            aria-label="노트 목록 닫기"
            type="button"
          >
            <BsChevronLeft className="w-7 h-7 text-[#186370]" />
          </button>

          <div className="flex items-center justify-between px-6 py-4 border-b border-[#b6d6f2] bg-[#e0f2ff]">
            <span className="text-xl font-bold text-[#186370] tracking-tight">내 노트</span>
            {/* + 버튼 부분 */}
            <div className="relative">
              <button
                className="px-3 py-1 rounded-lg bg-[#186370] text-white text-sm font-semibold hover:bg-[#1e7a8a] transition cursor-pointer flex items-center gap-1"
                title="노트/폴더 추가"
                onClick={() => setShowAddMenu((v) => !v)}
              >
                +
              </button>
              {showAddMenu && (
                <AddMenu
                  onAddNote={() => {
                    setShowAddMenu(false);
                    // 노트 추가 기능은 아직 미구현
                  }}
                  onAddFolder={openFolderModal}
                  onClose={() => setShowAddMenu(false)}
                />
              )}
            </div>
          </div>

          {/* 폴더 구조로 노트 목록 표시 */}
          <div className="flex-1 overflow-y-auto px-2 py-4 space-y-2">
            <FolderTree
              folders={folders}
              notes={notes}
              selectedNoteId={selectedNoteId}
              folderOpen={folderOpen}
              onToggleFolder={handleToggleFolder}
              onEditFolder={openEditModal}
              onNoteClick={noteId => router.push(`/doc/${noteId}`)}
            />
            {/* 폴더 밖 노트는 FolderTree에서 parentId=null로 처리 */}
          </div>

          {/* 폴더 추가 모달 부분 */}
          {showFolderModal && (
            <FolderAddModal
              notes={notes}
              folders={folders}
              parentFolderId={parentFolderId}
              setParentFolderId={setParentFolderId}
              folderName={folderName}
              setFolderName={setFolderName}
              selectedNoteIds={selectedNoteIds}
              setSelectedNoteIds={setSelectedNoteIds}
              onCancel={() => setShowFolderModal(false)}
              onAdd={handleAddFolder}
              errorMsg={errorMsg}
            />
          )}

          {/* 폴더 수정 모달 부분 */}
          {editFolderId && (
            <FolderEditModal
              notes={notes}
              folders={folders}
              editFolderId={editFolderId}
              editFolderName={editFolderName}
              setEditFolderName={setEditFolderName}
              editFolderNotes={editFolderNotes}
              setEditFolderNotes={setEditFolderNotes}
              setFolders={setFolders}
              closeEditModal={closeEditModal}
            />
          )}
        </aside>
      )}
    </>
  );
}