"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, ChevronLeft, Plus, FileText, Folder, Users } from "lucide-react";

import type { MoaFile } from "@/types/file";
import {
  addNoteSegment,
  createFile,
  deleteFile,
  editFile,
  getFile,
  getFileTree,
} from "@/libs/client/file";
import { FileTypeDTO } from "@/types/dto";

import AddMenu from "@/components/layout/NotePage/AddMenu";
import NoteAddModal from "@/components/layout/NotePage/NoteAddModal";
import FolderAddModal from "@/components/layout/NotePage/FolderAddModal";
import NoteEditModal from "@/components/layout/NotePage/NoteEditModal";
import FolderEditModal from "@/components/layout/NotePage/FolderEditModal";
import FolderTree from "@/components/layout/NotePage/FolderTree";
import SharedNoteTree from "@/components/layout/NotePage/SharedNoteTree";
import GithubImportModal from "@/components/layout/NotePage/GithubImportModal";
import type { Language } from "@/types/note";

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
  const [showGithubImportModal, setShowGithubImportModal] = useState(false);
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

  const openFolderModal = () => {
    setShowAddMenu(false);
    setShowFolderModal(true);
  };

  const openEditModal = (folder: MoaFile) => {
    setEditFolder(folder);
    setShowAddMenu(false);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
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

  const handleAddNote = (noteName: string, parentId: string, language?: Language | undefined) => {
    createFile(noteName, FileTypeDTO.DOCUMENT, parentId, user, language).then((file) => {
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
    deleteFile(folderId, user).then(() => {
      reRoot();
    });
  };

  const handleEditFolder = (
    folderId: string,
    folderName: string,
    parentId: string,
    selectedNotes: string[]
  ) => {
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
    deleteFile(noteId, user).then(() => {
      reRoot();
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
          className="fixed top-28 left-4 z-50 w-12 h-12 bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-lg border border-slate-200 flex items-center justify-center hover:shadow-xl hover:scale-105 transition-all duration-200 group"
          onClick={handleOpen}
          title="노트 목록 열기"
          aria-label="노트 목록 열기"
        >
          <Menu className="w-5 h-5 text-slate-600 group-hover:text-blue-600 transition-colors duration-200" />
        </button>
      )}

      {open && (
        <aside
          ref={asideRef}
          className="
            flex flex-col
            w-full max-w-xs
            h-[calc(100vh-6rem)]
            bg-gradient-to-b from-white via-slate-50 to-white
            shadow-xl
            border border-slate-200
            rounded-r-2xl
            overflow-visible
            z-40
            transition-all
            duration-300
            relative
            backdrop-blur-sm
          "
        >
          <button
            className="absolute top-1/2 right-[-20px] z-50 w-10 h-10 bg-gradient-to-br from-white to-slate-50 rounded-full shadow-lg border border-slate-200 flex items-center justify-center hover:shadow-xl hover:scale-105 transition-all duration-200 -translate-y-1/2 group"
            onClick={handleClose}
            title="노트 목록 닫기"
            aria-label="노트 목록 닫기"
            type="button"
          >
            <ChevronLeft className="w-4 h-4 text-slate-600 group-hover:text-blue-600 transition-colors duration-200" />
          </button>

          {/* 헤더 */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Folder className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="text-lg font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  내 노트
                </span>
                <div className="w-6 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-1"></div>
              </div>
            </div>

            <div className="relative">
              <button
                className="group flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-sm hover:shadow-md"
                title="노트/폴더 추가"
                onClick={() => setShowAddMenu((v) => !v)}
              >
                <Plus className="w-4 h-4 transition-transform duration-200 group-hover:rotate-90" />
                <span>추가</span>
              </button>
              {showAddMenu && (
                <AddMenu
                  onAddNote={() => {
                    setShowAddMenu(false);
                    setShowNoteModal(true);
                  }}
                  onAddFolder={openFolderModal}
                  onImportGithub={() => {
                    setShowAddMenu(false);
                    setShowGithubImportModal(true);
                  }}
                  onClose={() => setShowAddMenu(false)}
                />
              )}
            </div>
          </div>

          {/* 콘텐츠 영역 */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {root ? (
              <div className="space-y-2">
                <FolderTree
                  file={root}
                  selectedNoteId={selectedNoteId}
                  folderOpen={folderOpen}
                  onToggleFolder={handleToggleFolder}
                  onEditFolder={openEditModal}
                  onEditNote={openNoteEditModal}
                  onNoteClick={(noteId) => router.push(`/doc/${noteId}`)}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <FileText className="w-6 h-6 text-slate-500 animate-pulse" />
                  </div>
                  <p className="text-sm text-slate-500 font-medium">
                    로딩 중...
                  </p>
                </div>
              </div>
            )}

            {/* 공유된 노트 섹션 */}
            <div className="pt-4 border-t border-slate-200">
              <div className="flex items-center gap-2 mb-3 px-2">
                <Users className="w-4 h-4 text-slate-500" />
                <span className="text-sm font-medium text-slate-600">
                  공유된 노트
                </span>
              </div>
              <SharedNoteTree user={user} selectedNoteId={selectedNoteId} />
            </div>
          </div>

          {/* 모달들 */}
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
              onCancel={closeEditModal}
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

          {showGithubImportModal && (
            <GithubImportModal
              user={user}
              open={showGithubImportModal}
              onClose={() => setShowGithubImportModal(false)}
              onImported={() => {
                reRoot();
                setShowGithubImportModal(false);
              }}
            />
          )}
        </aside>
      )}
    </>
  );
}
