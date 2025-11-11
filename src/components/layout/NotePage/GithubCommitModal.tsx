"use client";

import { useEffect, useMemo, useState } from "react";
import Portal from "@/components/common/Portal";
import {
  createGithubBranchAndCommit,
  listImportedRepositories,
} from "@/libs/client/github";
import { GithubBranchCommitFileInput, GithubImportedRepositoryDTO } from "@/types/github";
import { FilePlus2, GitBranch, Loader2, Plus, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";

interface GithubCommitModalProps {
  user: User;
  open: boolean;
  onClose: () => void;
}

function createEmptyFileInput(): GithubBranchCommitFileInput {
  return {
    path: "",
    content: "",
  };
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
  const [files, setFiles] = useState<GithubBranchCommitFileInput[]>([createEmptyFileInput()]);
  const [loadingRepos, setLoadingRepos] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setSelectedRepo("");
      setBaseBranch("main");
      setBranchName("");
      setCommitMessage("");
      setFiles([createEmptyFileInput()]);
      setError(null);
      return;
    }

    const loadRepositories = async () => {
      try {
        setLoadingRepos(true);
        const list = await listImportedRepositories(user.id);
        setRepositories(list);
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
  }, [open, user.id]);

  const isSubmitDisabled = useMemo(() => {
    if (!selectedRepo || !baseBranch.trim() || !branchName.trim() || !commitMessage.trim()) {
      return true;
    }

    return files.some((file) => !file.path.trim());
  }, [selectedRepo, baseBranch, branchName, commitMessage, files]);

  const handleFileChange = (
    index: number,
    key: keyof GithubBranchCommitFileInput,
    value: string
  ) => {
    setFiles((prev) => {
      const next = [...prev];
      next[index] = {
        ...next[index],
        [key]: value,
      };
      return next;
    });
  };

  const handleAddFile = () => {
    setFiles((prev) => [...prev, createEmptyFileInput()]);
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => (prev.length === 1 ? prev : prev.filter((_, i) => i !== index)));
  };

  const handleSubmit = async () => {
    if (isSubmitDisabled) {
      setError("필수 항목을 모두 입력해주세요.");
      return;
    }

    const payloadFiles: Record<string, string> = {};
    files.forEach((file) => {
      const path = file.path.trim();
      if (path) {
        payloadFiles[path] = file.content ?? "";
      }
    });

    try {
      setSubmitting(true);
      setError(null);
      await createGithubBranchAndCommit({
        userId: user.id,
        repositoryUrl: selectedRepo,
        baseBranch: baseBranch.trim(),
        branchName: branchName.trim(),
        commitMessage: commitMessage.trim(),
        files: payloadFiles,
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
                <label className="text-sm font-semibold text-slate-700">대상 저장소</label>
                <select
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:outline-none focus:border-blue-400 focus:bg-white transition-all"
                  value={selectedRepo}
                  onChange={(event) => setSelectedRepo(event.target.value)}
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
                <label className="text-sm font-semibold text-slate-700">기준 브랜치</label>
                <input
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:outline-none focus:border-blue-400 focus:bg-white transition-all"
                  value={baseBranch}
                  onChange={(event) => setBaseBranch(event.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">새 브랜치 이름</label>
                <input
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:outline-none focus:border-blue-400 focus:bg-white transition-all"
                  value={branchName}
                  onChange={(event) => setBranchName(event.target.value)}
                  placeholder="feature/my-change"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">커밋 메시지</label>
                <input
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:outline-none focus:border-blue-400 focus:bg-white transition-all"
                  value={commitMessage}
                  onChange={(event) => setCommitMessage(event.target.value)}
                  placeholder="Add new changes"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <FilePlus2 className="w-4 h-4 text-purple-500" />
                  커밋할 파일
                </h3>
                <button
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-sm font-medium"
                  onClick={handleAddFile}
                  type="button"
                >
                  <Plus className="w-4 h-4" /> 파일 추가
                </button>
              </div>

              <div className="space-y-4">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="p-4 border border-slate-200 rounded-2xl space-y-3 bg-white shadow-sm"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:gap-3">
                      <div className="flex-1 space-y-2">
                        <label className="text-xs font-semibold text-slate-500">파일 경로</label>
                        <input
                          className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50 focus:outline-none focus:border-blue-400 focus:bg-white transition-all"
                          value={file.path}
                          onChange={(event) => handleFileChange(index, "path", event.target.value)}
                          placeholder="docs/README.md"
                        />
                      </div>
                      <button
                        className="mt-3 md:mt-6 w-full md:w-auto inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 text-sm"
                        onClick={() => handleRemoveFile(index)}
                        type="button"
                        disabled={files.length === 1}
                      >
                        <Trash2 className="w-4 h-4" />
                        제거
                      </button>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-500">파일 내용</label>
                      <textarea
                        className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:outline-none focus:border-blue-400 focus:bg-white transition-all min-h-[120px]"
                        value={file.content}
                        onChange={(event) => handleFileChange(index, "content", event.target.value)}
                        placeholder="이곳에 커밋할 내용을 입력하세요"
                      />
                    </div>
                  </div>
                ))}
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
                disabled={submitting || isSubmitDisabled || repositories.length === 0}
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
