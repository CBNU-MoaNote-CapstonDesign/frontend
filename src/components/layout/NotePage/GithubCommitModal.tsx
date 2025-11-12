"use client";

import { useCallback, useEffect, useId, useMemo, useState } from "react";
import Portal from "@/components/common/Portal";
import {
  createGithubBranchAndCommit,
  listGithubRepositoryFiles,
  listImportedRepositories,
} from "@/libs/client/github";
import { GithubImportedRepositoryDTO, GithubRepositoryFileDTO } from "@/types/github";
import { CheckSquare, GitBranch, Loader2, Search, Square, X } from "lucide-react";
import toast from "react-hot-toast";

interface GithubCommitModalProps {
  user: User;
  open: boolean;
  onClose: () => void;
}

export default function GithubCommitModal({
  user,
  open,
  onClose,
}: GithubCommitModalProps) {
  const [repositories, setRepositories] = useState<GithubImportedRepositoryDTO[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<string>("");
  const [baseBranch, setBaseBranch] = useState("main");
  const [branchName, setBranchName] = useState("");
  const [commitMessage, setCommitMessage] = useState("");
  const [repositoryFiles, setRepositoryFiles] = useState<GithubRepositoryFileDTO[]>([]);
  const [selectedFileIds, setSelectedFileIds] = useState<string[]>([]);
  const [fileSearch, setFileSearch] = useState("");
  const [loadingRepos, setLoadingRepos] = useState(false);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const repoSelectId = useId();
  const baseBranchId = useId();
  const branchNameId = useId();
  const commitMessageId = useId();
  const fileSearchId = useId();

  /**
   * Resets the modal state when it closes or re-initializes.
   */
  const resetState = useCallback(() => {
    setSelectedRepo("");
    setBaseBranch("main");
    setBranchName("");
    setCommitMessage("");
    setRepositoryFiles([]);
    setSelectedFileIds([]);
    setFileSearch("");
    setError(null);
  }, []);

  useEffect(() => {
    if (!open) {
      resetState();
      return;
    }

    const loadRepositories = async () => {
      try {
        setLoadingRepos(true);
        const list = await listImportedRepositories(user.id);
        setRepositories(list);
        setError(null);
        if (list.length > 0) {
          setSelectedRepo(list[0].repositoryUrl);
        }
      } catch (err) {
        console.error(err);
        setError((err as Error).message ?? "저장소 목록을 불러오지 못했습니다.");
      } finally {
        setLoadingRepos(false);
      }
    };

    loadRepositories();
  }, [open, resetState, user.id]);

  useEffect(() => {
    if (!open || !selectedRepo) {
      setRepositoryFiles([]);
      setSelectedFileIds([]);
      return;
    }

    let cancelled = false;

    const loadRepositoryFiles = async () => {
      try {
        setLoadingFiles(true);
        setError(null);
        const files = await listGithubRepositoryFiles(user.id, selectedRepo);
        if (!cancelled) {
          setRepositoryFiles(files);
          setSelectedFileIds([]);
          setFileSearch("");
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setRepositoryFiles([]);
          setSelectedFileIds([]);
          setError((err as Error).message ?? "파일 목록을 불러오지 못했습니다.");
        }
      } finally {
        if (!cancelled) {
          setLoadingFiles(false);
        }
      }
    };

    loadRepositoryFiles();

    return () => {
      cancelled = true;
    };
  }, [open, selectedRepo, user.id]);

  const isSubmitDisabled = useMemo(() => {
    if (!selectedRepo || !baseBranch.trim() || !branchName.trim() || !commitMessage.trim()) {
      return true;
    }

    return selectedFileIds.length === 0;
  }, [selectedRepo, baseBranch, branchName, commitMessage, selectedFileIds]);

  /**
   * Returns whether a file is currently selected for the commit.
   *
   * @param fileId The unique file identifier.
   */
  const isFileSelected = (fileId: string) => selectedFileIds.includes(fileId);

  /**
   * Toggles a file selection when the user interacts with it.
   *
   * @param fileId The unique file identifier to toggle.
   */
  const handleToggleFile = (fileId: string) => {
    setSelectedFileIds((prev) =>
      prev.includes(fileId) ? prev.filter((id) => id !== fileId) : [...prev, fileId]
    );
  };

  const filteredFiles = useMemo(() => {
    const keyword = fileSearch.trim().toLowerCase();
    if (!keyword) {
      return repositoryFiles;
    }
    return repositoryFiles.filter((file) => file.path.toLowerCase().includes(keyword));
  }, [fileSearch, repositoryFiles]);

  const handleSubmit = async () => {
    if (isSubmitDisabled) {
      setError("필수 항목을 모두 입력해주세요.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await createGithubBranchAndCommit({
        userId: user.id,
        repositoryUrl: selectedRepo,
        baseBranch: baseBranch.trim(),
        branchName: branchName.trim(),
        commitMessage: commitMessage.trim(),
        fileIds: selectedFileIds,
      });
      toast.success("새 브랜치에 변경 사항을 푸시했습니다.");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error((err as Error).message ?? "브랜치 생성/커밋에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <Portal>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999] animate-in fade-in-0 duration-200">
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl mx-4 overflow-hidden animate-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center">
                <GitBranch className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">새 브랜치로 커밋</h2>
                <p className="text-sm text-slate-500">새 브랜치를 만들고 변경 사항을 푸시합니다.</p>
              </div>
            </div>
            <button
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
              onClick={onClose}
            >
              <X className="w-4 h-4 text-slate-500" />
            </button>
          </div>

          <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700" htmlFor={repoSelectId}>
                  대상 저장소
                </label>
                <select
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:outline-none focus:border-blue-400 focus:bg-white transition-all"
                  value={selectedRepo}
                  onChange={(event) => setSelectedRepo(event.target.value)}
                  id={repoSelectId}
                  disabled={loadingRepos || repositories.length === 0}
                >
                  {repositories.length === 0 && (
                    <option value="">가져온 저장소가 없습니다. 먼저 가져오기를 실행하세요.</option>
                  )}
                  {repositories.map((repo) => (
                    <option key={repo.repositoryUrl} value={repo.repositoryUrl}>
                      {repo.repositoryName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700" htmlFor={baseBranchId}>
                  기준 브랜치
                </label>
                <input
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:outline-none focus:border-blue-400 focus:bg-white transition-all"
                  value={baseBranch}
                  onChange={(event) => setBaseBranch(event.target.value)}
                  id={baseBranchId}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700" htmlFor={branchNameId}>
                  새 브랜치 이름
                </label>
                <input
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:outline-none focus:border-blue-400 focus:bg-white transition-all"
                  value={branchName}
                  onChange={(event) => setBranchName(event.target.value)}
                  id={branchNameId}
                  placeholder="feature/my-change"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700" htmlFor={commitMessageId}>
                  커밋 메시지
                </label>
                <input
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:outline-none focus:border-blue-400 focus:bg-white transition-all"
                  value={commitMessage}
                  onChange={(event) => setCommitMessage(event.target.value)}
                  id={commitMessageId}
                  placeholder="Add new changes"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    커밋할 파일 선택
                  </h3>
                </div>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    className="w-full border-2 border-slate-200 rounded-xl pl-10 pr-4 py-2.5 bg-slate-50 focus:outline-none focus:border-blue-400 focus:bg-white transition-all"
                    value={fileSearch}
                    onChange={(event) => setFileSearch(event.target.value)}
                    id={fileSearchId}
                    placeholder="파일 이름 또는 경로 검색"
                  />
                </div>

                <div className="border border-slate-200 rounded-2xl bg-white max-h-72 overflow-y-auto divide-y divide-slate-100">
                  {loadingFiles && (
                    <div className="flex items-center justify-center gap-2 py-10 text-slate-500 text-sm">
                      <Loader2 className="w-4 h-4 animate-spin" /> 파일 목록을 불러오는 중입니다
                    </div>
                  )}

                  {!loadingFiles && filteredFiles.length === 0 && (
                    <div className="py-10 text-center text-sm text-slate-500">
                      커밋할 수 있는 파일이 없습니다.
                    </div>
                  )}

                  {!loadingFiles &&
                    filteredFiles.map((file) => {
                      const selected = isFileSelected(file.id);
                      return (
                        <button
                          key={file.id}
                          type="button"
                          onClick={() => handleToggleFile(file.id)}
                          className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${
                            selected ? "bg-purple-50" : "hover:bg-slate-50"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {selected ? (
                              <CheckSquare className="w-4 h-4 text-purple-500" />
                            ) : (
                              <Square className="w-4 h-4 text-slate-400" />
                            )}
                            <span className="text-sm text-slate-700">{file.path}</span>
                          </div>
                        </button>
                      );
                    })}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                className="px-5 py-3 rounded-xl bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition-colors"
                onClick={onClose}
                type="button"
              >
                취소
              </button>
              <button
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 text-white font-semibold shadow-sm hover:shadow-md disabled:opacity-60"
                onClick={handleSubmit}
                disabled={
                  submitting ||
                  isSubmitDisabled ||
                  repositories.length === 0 ||
                  loadingFiles ||
                  loadingRepos
                }
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "브랜치 생성"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
}
