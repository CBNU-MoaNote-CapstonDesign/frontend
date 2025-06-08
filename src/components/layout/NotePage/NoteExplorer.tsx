"use client";

import {useRouter} from "next/navigation";
import {useEffect, useRef, useState} from "react";
import {RxHamburgerMenu} from "react-icons/rx";
import {BsChevronLeft} from "react-icons/bs";

import FolderTree from "./FolderTree";
import AddMenu from "./AddMenu";
import FolderAddModal from "./FolderAddModal";
import {MoaFile} from "@/types/file";
import {createFile, editFile, getFile, getFileTree} from "@/libs/client/file";
import {FileTypeDTO} from "@/types/dto";
import AddNoteModal from "@/components/layout/NotePage/AddNoteModal";

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
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [root, setRoot] = useState<MoaFile | null>(null);
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
        setRoot(rootFolder);
      } else {
        setRoot(null);
      }
    });
  }, [user]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const openFolderModal = () => {
    setShowAddMenu(false);
    setShowFolderModal(true);
    setParentFolderId(null);
  };

  const handleAddFolder = (folderName: string, parentId: string, selectedNotes: string[]) => {
    // if (!folderName.trim() || selectedNotes.length === 0) return;

    console.log("폴더 생성 호출")
    console.log(folderName)
    console.log(parentId)
    // 실제 폴더 생성 로직(API 호출 등) 추가 가능
    createFile(folderName, FileTypeDTO.DIRECTORY, parentId, user).then((folder) => {
      if(!folder)
        return;
      // Selected Notes
      for(const noteId of selectedNotes) {
        getFile(noteId, user).then((note) => {
          if (note) {
            editFile(note, folder.id, user).then((result) => {
              console.log(result? "에딧 성공 " : "에딧 실패");
              console.log(note.name);
              console.log(note.id);
            })
          }
        })
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
        setParentFolderId(null);
        setErrorMsg(null);
      });
    });
  };

  const handleAddNote = (noteName: string, parentId: string) => {
    createFile(noteName,FileTypeDTO.DOCUMENT, parentId, user).then(() => {
      window.alert("생성완료");
      // 파일 구조 초기화
      getFileTree(null, user).then((rootFolder) => {
        if (rootFolder) {
          setRoot(rootFolder);
        } else {
          setRoot(null);
        }
        setShowFolderModal(false);
        setShowNoteModal(false);
        setParentFolderId(null);
        setErrorMsg(null);
      });
    });
  }

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
          <RxHamburgerMenu className="w-7 h-7 text-[#186370]"/>
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
            <BsChevronLeft className="w-7 h-7 text-[#186370]"/>
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
                    setShowNoteModal(true);
                  }}
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
                onEditFolder={openEditModal}
                onNoteClick={(noteId) => router.push(`/doc/${noteId}`)}
              />
            ) : (
              <>로딩중...</>
            )}
          </div>
          {
            showNoteModal && root && (
              <AddNoteModal
                root={root}
                onAdd={handleAddNote}
                onCancel={()=>{setShowNoteModal(false)}}
                />
            )
          }

          {showFolderModal && root && (
            <FolderAddModal
              root={root}
              onCancel={() => setShowFolderModal(false)}
              onAdd={handleAddFolder}
              errorMsg={errorMsg}
            />
          )}

          {
            /*
            editFolderId && (
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
          )*/}
        </aside>
      )}
    </>
  )
};
