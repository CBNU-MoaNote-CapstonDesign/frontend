"use client";

import { useRouter } from "next/navigation";
import type { MouseEvent as ReactMouseEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Menu,
  ChevronLeft,
  Plus,
  FileText,
  Folder,
  Users,
  Loader2,
  AlertCircle,
} from "lucide-react";

import type { MoaFile } from "@/types/file";
import {
  addNoteSegment,
  createFile,
  deleteFile,
  editFile,
  getFileTree,
  listDirectoryChildren,
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
import InviteUserModal from "@/components/layout/NotePage/InviteUserModal";
import FileContextMenu from "@/components/layout/NotePage/FileContextMenu";
import useFileContextMenu from "@/hooks/useFileContextMenu";
import Portal from "@/components/common/Portal";
import type { Language } from "@/types/note";

interface NoteExplorerProps {
  user: User;
  selectedNoteId: string;
}

type FileTreeNode = MoaFile & {
  children?: FileTreeNode[];
  childrenLoaded?: boolean;
};

type PendingModalAction =
  | { type: "note-add" }
  | { type: "folder-add" }
  | { type: "folder-edit"; targetId: string }
  | { type: "note-edit"; targetId: string };

const DIRECTORY_TYPE = "DIRECTORY";

/**
 * 디렉터리 여부를 판단합니다.
 * @param file 검사할 파일
 */
function isDirectory(file: MoaFile) {
  return file.type.toString() === DIRECTORY_TYPE;
}

interface ConvertOptions {
  isRoot?: boolean;
  subtreeLoaded: boolean;
}

/**
 * API 응답으로 받은 MoaFile을 트리 노드로 변환합니다.
 * @param file 변환할 파일
 * @param options 변환 옵션
 */
function convertToNode(file: MoaFile, options: ConvertOptions): FileTreeNode {
  const children = (file.children ?? []).map((child) =>
    convertToNode(child, { subtreeLoaded: options.subtreeLoaded })
  );

  const node: FileTreeNode = {
    ...file,
    children,
  };

  if (isDirectory(file)) {
    node.childrenLoaded = options.isRoot ? true : options.subtreeLoaded;
  }

  return node;
}

type NodeUpdater = (node: FileTreeNode) => FileTreeNode;

/**
 * 특정 ID를 가진 노드에 업데이트를 적용합니다.
 * @param node 루트 노드
 * @param targetId 수정할 노드 ID
 * @param updater 적용할 업데이트 함수
 */
function updateNode(
  node: FileTreeNode,
  targetId: string,
  updater: NodeUpdater
): FileTreeNode {
  if (node.id === targetId) {
    return updater(node);
  }

  if (!node.children) {
    return node;
  }

  let changed = false;
  const nextChildren = node.children.map((child) => {
    const updatedChild = updateNode(child, targetId, updater);
    if (updatedChild !== child) {
      changed = true;
    }
    return updatedChild;
  });

  if (!changed) {
    return node;
  }

  return {
    ...node,
    children: nextChildren,
  };
}

/**
 * 주어진 ID의 노드를 찾습니다.
 * @param node 탐색을 시작할 노드
 * @param id 찾을 노드의 ID
 */
function findNode(node: FileTreeNode, id: string): FileTreeNode | null {
  if (node.id === id) return node;
  if (!node.children) return null;

  for (const child of node.children) {
    const found = findNode(child, id);
    if (found) return found;
  }

  return null;
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
  const [root, setRoot] = useState<FileTreeNode | null>(null);
  const [modalTree, setModalTree] = useState<FileTreeNode | null>(null);
  const [isModalTreeLoading, setIsModalTreeLoading] = useState(false);
  const [modalTreeError, setModalTreeError] = useState<string | null>(null);
  const [showModalLoading, setShowModalLoading] = useState(false);
  const [pendingModalAction, setPendingModalAction] = useState<
    PendingModalAction | null
  >(null);
  const [folderOpen, setFolderOpen] = useState<Record<string, boolean>>({});
  const [loadingFolders, setLoadingFolders] = useState<Record<string, boolean>>({});
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { contextMenu, openContextMenu, closeContextMenu } = useFileContextMenu();
  const [shareTarget, setShareTarget] = useState<MoaFile | null>(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const asideRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<FileTreeNode | null>(null);
  const loadingFoldersRef = useRef(new Set<string>());

  const loadModalTree = useCallback(async () => {
    try {
      const fullTree = await getFileTree(null, user, { recursive: true });
      if (fullTree) {
        const annotated = convertToNode(fullTree, {
          isRoot: true,
          subtreeLoaded: true,
        });
        setModalTree(annotated);
        setModalTreeError(null);
      } else {
        setModalTree(null);
        setModalTreeError("폴더 정보를 불러올 수 없습니다.");
      }
    } catch (error) {
      console.error(error);
      setModalTree(null);
      setModalTreeError("폴더 정보를 불러오는 중 문제가 발생했습니다.");
    } finally {
      setIsModalTreeLoading(false);
    }
  }, [user]);

  const refreshModalTree = useCallback(() => {
    if (isModalTreeLoading) {
      return;
    }
    setIsModalTreeLoading(true);
    setModalTree(null);
    setModalTreeError(null);
    void loadModalTree();
  }, [isModalTreeLoading, loadModalTree]);

  const ensureInitialTree = useCallback(async () => {
    loadingFoldersRef.current.clear();
    const rootFolder = await getFileTree(null, user, { recursive: false });
    if (rootFolder) {
      const annotated = convertToNode(rootFolder, {
        isRoot: true,
        subtreeLoaded: false,
      });
      setRoot(annotated);
      setFolderOpen({ [annotated.id]: true });
    } else {
      setRoot(null);
      setFolderOpen({});
    }
    setLoadingFolders({});
    refreshModalTree();
  }, [refreshModalTree, user]);

  // 폴더 데이터 초기화
  useEffect(() => {
    void ensureInitialTree();
  }, [ensureInitialTree]);

  useEffect(() => {
    rootRef.current = root;
  }, [root]);

  useEffect(() => {
    if (isModalTreeLoading || !pendingModalAction) {
      return;
    }

    if (modalTree) {
      const action = pendingModalAction;
      setShowModalLoading(false);
      setPendingModalAction(null);

      switch (action.type) {
        case "note-add":
          setShowNoteModal(true);
          break;
        case "folder-add":
          setShowFolderModal(true);
          break;
        case "folder-edit":
          if (editFolder && editFolder.id === action.targetId) {
            setShowEditModal(true);
          }
          break;
        case "note-edit":
          if (editNote && editNote.id === action.targetId) {
            setShowNoteEditModal(true);
          }
          break;
        default:
          break;
      }
    }
  }, [
    editFolder,
    editNote,
    isModalTreeLoading,
    modalTree,
    pendingModalAction,
  ]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleContextMenu = useCallback(
      (file: MoaFile, event: ReactMouseEvent<HTMLDivElement>) => {
        event.preventDefault();
        openContextMenu(file, { x: event.clientX, y: event.clientY });
      },
      [openContextMenu]
  );

  const handleShareTarget = useCallback((file: MoaFile) => {
    // 폴더 공유 시 하위 항목 처리는 백엔드에서 담당하므로 별도 재귀 호출이 필요하지 않습니다.
    setShareTarget(file);
    setShareModalOpen(true);
  }, []);

  const closeShareModal = useCallback(() => {
    setShareModalOpen(false);
    setShareTarget(null);
  }, []);

  const requestModalAction = useCallback(
    (action: PendingModalAction) => {
      setPendingModalAction(action);
      setShowModalLoading(true);
      if (!isModalTreeLoading) {
        refreshModalTree();
      }
    },
    [isModalTreeLoading, refreshModalTree]
  );

  const openFolderModal = () => {
    setShowAddMenu(false);
    if (!modalTree || isModalTreeLoading) {
      requestModalAction({ type: "folder-add" });
      return;
    }
    setShowFolderModal(true);
  };

  const openEditModal = (folder: MoaFile) => {
    setEditFolder(folder);
    setShowAddMenu(false);
    if (!modalTree || isModalTreeLoading) {
      requestModalAction({ type: "folder-edit", targetId: folder.id });
      return;
    }
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setEditFolder(null);
    setShowAddMenu(false);
    setShowEditModal(false);
    setPendingModalAction(null);
    setShowModalLoading(false);
  };

  const openNoteEditModal = (note: MoaFile) => {
    setEditNote(note);
    setShowAddMenu(false);
    if (!modalTree || isModalTreeLoading) {
      requestModalAction({ type: "note-edit", targetId: note.id });
      return;
    }
    setShowNoteEditModal(true);
  };

  const closeNoteEditModal = () => {
    setEditNote(null);
    setShowAddMenu(false);
    setShowNoteEditModal(false);
    setPendingModalAction(null);
    setShowModalLoading(false);
  };

  const reRoot = () => {
    void ensureInitialTree().then(() => {
      setShowFolderModal(false);
      setShowNoteModal(false);
      setShowEditModal(false);
      setShowNoteEditModal(false);
      setErrorMsg(null);
      setPendingModalAction(null);
      setShowModalLoading(false);
    });
  };

  const handleAddFolder = (folderName: string, parentId: string) => {
    createFile(folderName, FileTypeDTO.DIRECTORY, parentId, user).then((folder) => {
      if (!folder) return;

      void ensureInitialTree().then(() => {
        setShowFolderModal(false);
        setShowNoteModal(false);
        setShowEditModal(false);
        setShowNoteEditModal(false);
        setErrorMsg(null);
        setPendingModalAction(null);
        setShowModalLoading(false);
      });
    });
  };

  const handleAddNote = (
    noteName: string,
    parentId: string,
    language?: Language | undefined
  ) => {
    createFile(noteName, FileTypeDTO.DOCUMENT, parentId, user, language).then((file) => {
      if (file) {
        addNoteSegment(file.id, 0, user).then(() => {
          void ensureInitialTree().then(() => {
            setShowFolderModal(false);
            setShowNoteModal(false);
            setShowEditModal(false);
            setShowNoteEditModal(false);
            setErrorMsg(null);
            setPendingModalAction(null);
            setShowModalLoading(false);
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
    parentId: string
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
        reRoot();
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
    const willOpen = !(folderOpen[folderId] ?? false);
    setFolderOpen((prev) => ({
      ...prev,
      [folderId]: willOpen,
    }));

    if (willOpen) {
      void (async () => {
        if (loadingFoldersRef.current.has(folderId)) {
          return;
        }

        const currentRoot = rootRef.current;
        if (!currentRoot) return;
        const target = findNode(currentRoot, folderId);
        if (!target || !isDirectory(target) || target.childrenLoaded) {
          return;
        }

        loadingFoldersRef.current.add(folderId);
        setLoadingFolders((prev) => ({ ...prev, [folderId]: true }));

        try {
          const children = await listDirectoryChildren(folderId, user, {
            recursive: false,
          });
          const mappedChildren = children.map((child) =>
            convertToNode(child, { subtreeLoaded: false })
          );

          setRoot((prevRoot) => {
            if (!prevRoot) return prevRoot;
            return updateNode(prevRoot, folderId, (node) => ({
              ...node,
              children: mappedChildren,
              childrenLoaded: true,
            }));
          });
        } finally {
          loadingFoldersRef.current.delete(folderId);
          setLoadingFolders((prev) => {
            const next = { ...prev };
            delete next[folderId];
            return next;
          });
        }
      })();
    }
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
                    if (!modalTree || isModalTreeLoading) {
                      requestModalAction({ type: "note-add" });
                      return;
                    }
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
                  onContextMenu={handleContextMenu}
                  loadingFolders={loadingFolders}
                  isRoot
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
          {showNoteModal && modalTree && (
            <NoteAddModal
              root={modalTree as MoaFile}
              onAdd={handleAddNote}
              onCancel={() => {
                setShowNoteModal(false);
                setPendingModalAction(null);
                setShowModalLoading(false);
              }}
            />
          )}

          {showFolderModal && modalTree && (
            <FolderAddModal
              root={modalTree as MoaFile}
              onCancel={() => {
                setShowFolderModal(false);
                setPendingModalAction(null);
                setShowModalLoading(false);
              }}
              onAdd={handleAddFolder}
              errorMsg={errorMsg}
            />
          )}

          {showEditModal && modalTree && editFolder && (
            <FolderEditModal
              root={modalTree as MoaFile}
              folderId={editFolder.id}
              onDelete={handleDeleteFolder}
              onEdit={handleEditFolder}
              onCancel={closeEditModal}
            />
          )}

          {showNoteEditModal && modalTree && editNote && (
            <NoteEditModal
              root={modalTree as MoaFile}
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
      {contextMenu && (
          <FileContextMenu
              file={contextMenu.file}
              position={contextMenu.position}
              onShare={handleShareTarget}
              onClose={closeContextMenu}
          />
      )}
      <InviteUserModal
          user={user}
          noteId={shareTarget?.id ?? ""}
          open={shareModalOpen && !!shareTarget}
          onClose={closeShareModal}
          onInvite={() => {}}
      />

      {showModalLoading && (
        <Portal>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999] animate-in fade-in-0 duration-200">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-8 w-full max-w-sm mx-4 text-center space-y-6 animate-in zoom-in-95 duration-200">
              {isModalTreeLoading ? (
                <>
                  <div className="w-16 h-16 mx-auto rounded-full bg-blue-50 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-slate-800">폴더 정보를 불러오는 중입니다</p>
                    <p className="text-sm text-slate-500 mt-2">잠시만 기다려 주세요...</p>
                  </div>
                </>
              ) : modalTreeError ? (
                <>
                  <div className="w-16 h-16 mx-auto rounded-full bg-red-50 flex items-center justify-center">
                    <AlertCircle className="w-8 h-8 text-red-500" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-slate-800">폴더 정보를 불러오지 못했습니다</p>
                    <p className="text-sm text-slate-500 mt-2">{modalTreeError}</p>
                  </div>
                  <div className="flex justify-center gap-3">
                    <button
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-all duration-200"
                      onClick={() => {
                        if (pendingModalAction?.type === "folder-edit") {
                          setEditFolder(null);
                        } else if (pendingModalAction?.type === "note-edit") {
                          setEditNote(null);
                        }
                        setShowModalLoading(false);
                        setPendingModalAction(null);
                      }}
                    >
                      닫기
                    </button>
                    <button
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
                      onClick={() => {
                        setShowModalLoading(true);
                        if (!isModalTreeLoading) {
                          refreshModalTree();
                        }
                      }}
                    >
                      다시 시도
                    </button>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </Portal>
      )}
    </>
  );
}
