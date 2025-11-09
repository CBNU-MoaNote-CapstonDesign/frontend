"use client";

import { useRouter } from "next/navigation";
import type { MouseEvent as ReactMouseEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Menu, ChevronLeft, Plus, FileText, Folder, Users } from "lucide-react";

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
import type { Language } from "@/types/note";

interface NoteExplorerProps {
  user: User;
  selectedNoteId: string;
}

type FileTreeNode = MoaFile & {
  children?: FileTreeNode[];
  childrenLoaded?: boolean;
};

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
  const [folderOpen, setFolderOpen] = useState<Record<string, boolean>>({});
  const [loadingFolders, setLoadingFolders] = useState<Record<string, boolean>>({});
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { contextMenu, openContextMenu, closeContextMenu } = useFileContextMenu();
  const [shareTarget, setShareTarget] = useState<MoaFile | null>(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const asideRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<FileTreeNode | null>(null);
  const loadingFoldersRef = useRef(new Set<string>());

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
  }, [user]);

  // 폴더 데이터 초기화
  useEffect(() => {
    void ensureInitialTree();
  }, [ensureInitialTree]);

  useEffect(() => {
    rootRef.current = root;
  }, [root]);

  const prepareModalTree = useCallback(async () => {
    const fullTree = await getFileTree(null, user, { recursive: true });
    if (fullTree) {
      return convertToNode(fullTree, { isRoot: true, subtreeLoaded: true });
    }
    return root;
  }, [root, user]);

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

  const openFolderModal = () => {
    setShowAddMenu(false);
    void (async () => {
      const tree = await prepareModalTree();
      setModalTree(tree ?? null);
      setShowFolderModal(true);
    })();
  };

  const openEditModal = (folder: MoaFile) => {
    setEditFolder(folder);
    setShowAddMenu(false);
    void (async () => {
      const tree = await prepareModalTree();
      setModalTree(tree ?? null);
      setShowEditModal(true);
    })();
  };

  const closeEditModal = () => {
    setEditFolder(null);
    setShowAddMenu(false);
    setShowEditModal(false);
    setModalTree(null);
  };

  const openNoteEditModal = (note: MoaFile) => {
    setEditNote(note);
    setShowAddMenu(false);
    void (async () => {
      const tree = await prepareModalTree();
      setModalTree(tree ?? null);
      setShowNoteEditModal(true);
    })();
  };

  const closeNoteEditModal = () => {
    setEditNote(null);
    setShowAddMenu(false);
    setShowNoteEditModal(false);
    setModalTree(null);
  };

  const reRoot = () => {
    void ensureInitialTree().then(() => {
      setShowFolderModal(false);
      setShowNoteModal(false);
      setShowEditModal(false);
      setShowNoteEditModal(false);
      setErrorMsg(null);
      setModalTree(null);
    });
  };

  const handleAddFolder = (folderName: string, parentId: string) => {
    createFile(folderName, FileTypeDTO.DIRECTORY, parentId, user).then((folder) => {
      if (!folder) return;

      void ensureInitialTree().then(() => {
        setShowFolderModal(false);
        setShowNoteModal(false);
        setShowEditModal(false);
        setErrorMsg(null);
        setModalTree(null);
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
            setErrorMsg(null);
            setModalTree(null);
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
                    void (async () => {
                      const tree = await prepareModalTree();
                      setModalTree(tree ?? null);
                      setShowNoteModal(true);
                    })();
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
          {showNoteModal && (modalTree ?? root) && (
            <NoteAddModal
              root={(modalTree ?? root) as MoaFile}
              onAdd={handleAddNote}
              onCancel={() => {
                setShowNoteModal(false);
                setModalTree(null);
              }}
            />
          )}

          {showFolderModal && (modalTree ?? root) && (
            <FolderAddModal
              root={(modalTree ?? root) as MoaFile}
              onCancel={() => {
                setShowFolderModal(false);
                setModalTree(null);
              }}
              onAdd={handleAddFolder}
              errorMsg={errorMsg}
            />
          )}

          {showEditModal && (modalTree ?? root) && editFolder && (
            <FolderEditModal
              root={(modalTree ?? root) as MoaFile}
              folderId={editFolder.id}
              onDelete={handleDeleteFolder}
              onEdit={handleEditFolder}
              onCancel={closeEditModal}
            />
          )}

          {showNoteEditModal && (modalTree ?? root) && editNote && (
            <NoteEditModal
              root={(modalTree ?? root) as MoaFile}
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
    </>
  );
}
