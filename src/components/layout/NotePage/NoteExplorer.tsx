"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { BsChevronLeft } from "react-icons/bs";

import FolderTree from "./FolderTree";
import AddMenu from "./AddMenu";
import FolderAddModal from "./FolderAddModal";
import { MoaFile } from "@/types/file";
import {
  addNoteSegment,
  createFile,
  deleteFile,
  editFile,
  getFile,
  getFileTree,
} from "@/libs/client/file";
import { FileTypeDTO } from "@/types/dto";
import NoteAddModal from "@/components/layout/NotePage/NoteAddModal";
import FolderEditModal, {
  getFileById,
} from "@/components/layout/NotePage/FolderEditModal";
import NoteEditModal from "@/components/layout/NotePage/NoteEditModal";
import SharedNoteTree from "@/components/layout/NotePage/SharedNoteTree";

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
  const [showEditModal, setShowEditModal] = useState(false);
  const [showNoteEditModal, setShowNoteEditModal] = useState(false);
  const [editFolder, setEditFolder] = useState<MoaFile | null>(null);
  const [editNote, setEditNote] = useState<MoaFile | null>(null);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [root, setRoot] = useState<MoaFile | null>(null);
  const [folderOpen, setFolderOpen] = useState<Record<string, boolean>>({});
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const asideRef = useRef<HTMLDivElement>(null);

  // 폴더 데이터 초기화
  useEffect(() => {
    getFileTree(null, user).then((rootFolder) => {
      if (rootFolder) {
        setRoot(rootFolder);
      } else {
        setRoot(null);
      }
    });
  }, [user]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const openNoteModal = () => {
    setShowAddMenu(false);
    setShowNoteModal(true);
  };

  const openFolderModal = () => {
    setShowAddMenu(false);
    setShowFolderModal(true);
  };

  const openFolderEditModal = (folder: MoaFile) => {
    setEditFolder(folder);
    setShowAddMenu(false);
    setShowEditModal(true);
  };

  const closeFolderEditModal = () => {
    setEditFolder(null);
    setShowAddMenu(false);
    setShowEditModal(false);
  };

  const openNoteEditModal = (note: MoaFile) => {
    setEditNote(note);
    setShowAddMenu(false);
    setShowNoteEditModal(true);
  };

  const closeNoteEditModal = () => {
    setEditNote(null);
    setShowAddMenu(false);
    setShowNoteEditModal(false);
  };

  const reRoot = () => {
    // 파일 구조 초기화
    getFileTree(null, user).then((rootFolder) => {
      if (rootFolder) {
        setRoot(rootFolder);
      } else {
        setRoot(null);
      }
      setShowFolderModal(false);
      setShowNoteModal(false);
      setShowEditModal(false);
      setShowNoteEditModal(false);
      setErrorMsg(null);
    });
  };

  const handleAddFolder = (
    folderName: string,
    parentId: string,
    selectedNotes: string[]
  ) => {
    // if (!folderName.trim() || selectedNotes.length === 0) return;

    console.log("폴더 생성 호출");
    console.log(folderName);
    console.log(parentId);
    // 실제 폴더 생성 로직(API 호출 등) 추가 가능
    createFile(folderName, FileTypeDTO.DIRECTORY, parentId, user).then(
      (folder) => {
        if (!folder) return;
        // Selected Notes
        for (const noteId of selectedNotes) {
          getFile(noteId, user).then((note) => {
            if (note) {
              editFile(note, folder.id, user).then((result) => {
                console.log(result ? "에딧 성공 " : "에딧 실패");
                console.log(note.name);
                console.log(note.id);
              });
            }
          });
        }

        // 파일 구조 초기화
        getFileTree(null, user).then((rootFolder) => {
          if (rootFolder) {
            setRoot(rootFolder);
          } else {
            setRoot(null);
          }
          setShowFolderModal(false);
          setShowNoteModal(false);
          setShowEditModal(false);
          setErrorMsg(null);
        });
      }
    );
  };

  const handleAddNote = (noteName: string, parentId: string) => {
    createFile(noteName, FileTypeDTO.DOCUMENT, parentId, user).then((file) => {
      // 첫번쨰 노트 세그먼트 생성
      if (file) {
        addNoteSegment(file.id, 0, user).then(() => {
          // 파일 구조 초기화
          getFileTree(null, user).then((rootFolder) => {
            if (rootFolder) {
              setRoot(rootFolder);
            } else {
              setRoot(null);
            }
            setShowFolderModal(false);
            setShowNoteModal(false);
            setShowEditModal(false);
            setErrorMsg(null);
          });
        });
      }
    });
  };

  const handleDeleteFolder = (folderId: string) => {
    console.log("폴더 삭제 요청 folderId:", folderId);
    console.log("폴더 삭제 요청 userId:", user);

    deleteFile(folderId, user).then(() => {
      reRoot(); // 트리 새로 고침
      closeFolderEditModal(); // 모달 닫기
    });
  };

  const handleEditFolder = (
    folderId: string,
    folderName: string,
    parentId: string,
    selectedNotes: string[]
  ) => {
    if (!root) return;

    // 기존 폴더에 포함된 노트 id 목록
    const folder = editFolder ?? getFileById(folderId, root);
    const originalNoteIds = (folder?.children ?? []).map((n) => n.id);

    // 체크 해제된(포함 해제된) 노트 id 목록
    const removedNoteIds = originalNoteIds.filter(
      (id) => !selectedNotes.includes(id)
    );

    // 포함 해제된 노트는 루트(혹은 상위 폴더)로 이동
    removedNoteIds.forEach((noteId) => {
      getFile(noteId, user).then((note) => {
        if (note) {
          editFile(note, root.id, user);
        }
      });
    });

    // 폴더 정보(이름, 위치 등) 수정
    editFile(
      {
        id: folderId,
        name: folderName,
        type: FileTypeDTO.DIRECTORY,
      } as MoaFile,
      parentId,
      user
    ).then((result) => {
      if (result) {
        let count = selectedNotes.length;
        for (const noteId of selectedNotes) {
          getFile(noteId, user).then((result) => {
            if (result) {
              editFile(result, folderId, user).then(() => {
                count -= 1;
                if (count < 1) {
                  reRoot();
                }
              });
            }
          });
        }
        if (count == 0) reRoot();
      }
    });
  };

  const handleDeleteNote = (noteId: string) => {
    console.log("노트 삭제 요청 noteId:", noteId);
    console.log("노트 삭제 요청 userId:", user);

    deleteFile(noteId, user).then(() => {
      reRoot(); // 트리 새로 고침
      closeNoteEditModal(); // 삭제 후 모달 닫기
    });
  };

  const handleEditNote = (
    noteId: string,
    noteName: string,
    parentId: string
  ) => {
    editFile(
      {
        id: noteId,
        name: noteName,
        type: FileTypeDTO.DOCUMENT,
      } as MoaFile,
      parentId,
      user
    ).then(() => {
      reRoot();
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
                  onAddNote={openNoteModal}
                  onAddFolder={openFolderModal}
                  onClose={() => setShowAddMenu(false)}
                />
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-2 py-4 space-y-2">
            {root ? (
              <FolderTree
                file={root}
                selectedNoteId={selectedNoteId}
                folderOpen={folderOpen}
                onToggleFolder={handleToggleFolder}
                onEditFolder={openFolderEditModal}
                onEditNote={openNoteEditModal}
                onNoteClick={(noteId) => router.push(`/doc/${noteId}`)}
              />
            ) : (
              <>로딩중...</>
            )}
            <br />
            <br />
            <SharedNoteTree user={user} selectedNoteId={selectedNoteId} />
          </div>
          {showNoteModal && root && (
            <NoteAddModal
              root={root}
              onAdd={handleAddNote}
              onCancel={() => {
                setShowNoteModal(false);
              }}
            />
          )}

          {showFolderModal && root && (
            <FolderAddModal
              root={root}
              onCancel={() => setShowFolderModal(false)}
              onAdd={handleAddFolder}
              errorMsg={errorMsg}
            />
          )}

          {showEditModal && root && editFolder && (
            <FolderEditModal
              root={root}
              folderId={editFolder.id}
              onDelete={handleDeleteFolder}
              onEdit={handleEditFolder}
              onCancel={closeFolderEditModal}
            />
          )}

          {showNoteEditModal && root && editNote && (
            <NoteEditModal
              root={root}
              noteId={editNote.id}
              onDelete={handleDeleteNote}
              onEdit={handleEditNote}
              onCancel={closeNoteEditModal}
            />
          )}
        </aside>
      )}
    </>
  );
}
