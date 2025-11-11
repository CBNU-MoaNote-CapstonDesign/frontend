"use client";

import { useEffect, useState } from "react";
import Portal from "@/components/common/Portal";
import {
  fetchGithubRepository,
  listImportedRepositories,
} from "@/libs/client/github";
import { GithubImportedRepositoryDTO } from "@/types/github";
import { GitPullRequest, Loader2, RefreshCcw, X } from "lucide-react";
import toast from "react-hot-toast";

interface GithubFetchModalProps {
  user: User;
  open: boolean;
  onClose: () => void;
}

export default function GithubFetchModal({
  user,
  open,
  onClose,
}: GithubFetchModalProps) {
  const [repositories, setRepositories] = useState<GithubImportedRepositoryDTO[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<string>("");
  const [branchName, setBranchName] = useState("main");
  const [loadingRepos, setLoadingRepos] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setSelectedRepo("");
      setBranchName("main");
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

  const handleSubmit = async () => {
    if (!selectedRepo || !branchName.trim()) {
      setError("저장소와 브랜치를 모두 선택해주세요.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await fetchGithubRepository(user.id, selectedRepo, branchName.trim());
      toast.success("원격 저장소와 동기화했습니다.");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error((err as Error).message ?? "원격 저장소 동기화에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <Portal>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999] animate-in fade-in-0 duration-200">
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg mx-4 overflow-hidden animate-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
                <RefreshCcw className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">GitHub Fetch</h2>
                <p className="text-sm text-slate-500">원격 변경 사항을 가져옵니다.</p>
              </div>
            </div>
            <button
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
              onClick={onClose}
            >
              <X className="w-4 h-4 text-slate-500" />
            </button>
          </div>

          <div className="p-6 space-y-5">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <GitPullRequest className="w-4 h-4 text-blue-500" />
                가져올 저장소
              </label>
              <select
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:outline-none focus:border-blue-400 focus:bg-white transition-all"
                value={selectedRepo}
                onChange={(event) => setSelectedRepo(event.target.value)}
                disabled={loadingRepos || repositories.length === 0}
              >
                {repositories.length === 0 && (
                  <option value="">가져올 저장소가 없습니다. 먼저 가져오기를 실행하세요.</option>
                )}
                {repositories.map((repo) => (
                  <option key={repo.repositoryUrl} value={repo.repositoryUrl}>
                    {repo.repositoryName}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">브랜치 이름</label>
              <input
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:outline-none focus:border-blue-400 focus:bg-white transition-all"
                value={branchName}
                onChange={(event) => setBranchName(event.target.value)}
                placeholder="main"
              />
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
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold shadow-sm hover:shadow-md disabled:opacity-60"
                onClick={handleSubmit}
                disabled={submitting || repositories.length === 0}
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "동기화"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
}
