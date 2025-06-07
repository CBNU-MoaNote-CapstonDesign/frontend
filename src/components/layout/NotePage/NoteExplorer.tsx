"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { BsChevronLeft } from "react-icons/bs";

import FolderTree from "./FolderTree";
import AddMenu from "./AddMenu";
import FolderAddModal from "./FolderAddModal";
import FolderEditModal from "./FolderEditModal";
import { MoaFile } from "@/types/file";
import { getFileTree } from "@/libs/client/file";

interface NoteExplorerProps {
  user: User;
  selectedNoteId: string;
}

export default function NoteExplorer({
                                       user,
                                       selectedNoteId,
                                     }: NoteExplorerProps) {
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [selectedNotes, setSelectedNotes] = useState<MoaFile[]>([]);
  const [files, setFiles] = useState<MoaFile[]>([]);
  const [folderOpen, setFolderOpen] = useState<Record<string, boolean>>({});
  const [parentFolderId, setParentFolderId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [editFolderId, setEditFolderId] = useState<string | null>(null);
  const [editFolderName, setEditFolderName] = useState("");
  const [editFolderNotes, setEditFolderNotes] = useState<MoaFile[]>([]);
  const asideRef = useRef<HTMLDivElement>(null);

  // 폴더 데이터 초기화
  useEffect(() => {
    getFileTree(null, user).then((rootFolder) => {
      if (rootFolder) {
        setFiles([rootFolder]);
      } else {
        setFiles([]);
      }
    });
  }, [user]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const openFolderModal = () => {
    setShowAddMenu(false);
    setShowFolderModal(true);
    setFolderName("");
    setSelectedNotes([]);
    setParentFolderId(null);
  };

  const handleAddFolder = () => {
    const alreadyInFolder = files.some((folder) => {
      if (folder.children) {
        return folder.children.some((child) => child.id === selectedNoteId);
      }
      return false;
    });

    if (alreadyInFolder) {
      setErrorMsg("이미 다른 폴더에 포함된 노트입니다.");
      return;
    }

    if (!folderName.trim() || selectedNotes.length === 0) return;

    // 실제 폴더 생성 로직(API 호출 등) 추가 가능

    getFileTree(null, user).then((rootFolder) => {
      if (rootFolder) {
        setFiles([rootFolder]);
      } else {
        setFiles([]);
      }
      setShowFolderModal(false);
      setFolderName("");
      setSelectedNotes([]);
      setParentFolderId(null);
      setErrorMsg(null);
    });
  };

  useEffect(() => {
    if (showFolderModal) setErrorMsg(null);
  }, [showFolderModal]);

  const handleToggleFolder = (folderId: string) => {
    setFolderOpen((prev) => ({
      ...prev,
      [folderId]: !prev[folderId],
    }));
  };

  function openEditModal(folder: MoaFile) {
    setEditFolderId(folder.id);
    setEditFolderName(folder.name);
    if (folder.children) setEditFolderNotes([...folder.children]);
    else setEditFolderNotes([]);
  }

  function closeEditModal() {
    setEditFolderId(null);
    setEditFolderName("");
    setEditFolderNotes([]);
  }

  return (
    <>
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
            <span className="text-xl font-bold text-[#186370] tracking-tight">
              내 노트
            </span>
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
                  }}
                  onAddFolder={openFolderModal}
                  onClose={() => setShowAddMenu(false)}
                />
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-2 py-4 space-y-2">
            {files.length > 0 ? (
              <FolderTree
                file={files[0]}
                selectedNoteId={selectedNoteId}
                folderOpen={folderOpen}
                onToggleFolder={handleToggleFolder}
                onEditFolder={openEditModal}
                onNoteClick={(noteId) => router.push(`/doc/${noteId}`)}
              />
            ) : (
              <>로딩중...</>
            )}
          </div>

          {showFolderModal && (
            <FolderAddModal
              notes={root}
              folders={files}
              parentFolderId={parentFolderId}
              setParentFolderId={setParentFolderId}
              folderName={folderName}
              setFolderName={setFolderName}
              selectedNotes={selectedNotes}
              setSelectedNotes={setSelectedNotes}
              onCancel={() => setShowFolderModal(false)}
              onAdd={handleAddFolder}
              errorMsg={errorMsg}
            />
          )}

          {editFolderId && (
            <FolderAddModal
              selectedNotes={selectedNotes}
              setSelectedNotes={setSelectedNotes}
              folderName={folderName}
              setFolderName={setFolderName}
              parentFolderId={parentFolderId}
              setParentFolderId={setParentFolderId}
              onAdd={handleAddFolder}
              onCancel={() => setShowFolderModal(false)}
              errorMsg={errorMsg}
            />
          )}
        </aside>
      )}
    </>
  );
}
