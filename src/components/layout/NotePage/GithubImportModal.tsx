"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  GithubSearchRepositoryItem,
  GithubImportedRepositoryDTO,
} from "@/types/github";
import Portal from "@/components/common/Portal";
import {
  importGithubRepository,
  listImportedRepositories,
  requestGithubAuthorization,
} from "@/libs/client/github";
import { Github, Loader2, Search, X } from "lucide-react";
import toast from "react-hot-toast";

interface GithubImportModalProps {
  user: User;
  open: boolean;
  onClose: () => void;
  onImported: (repositories?: GithubImportedRepositoryDTO[]) => void;
}

async function searchRepositories(
  query: string,
  signal?: AbortSignal
): Promise<GithubSearchRepositoryItem[]> {
  if (!query.trim()) return [];

  const response = await fetch(
    `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&per_page=10`,
    {
      signal,
      headers: {
        Accept: "application/vnd.github+json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`GitHub 검색에 실패했습니다. (status: ${response.status})`);
  }

  const body = await response.json();
  const items: GithubSearchRepositoryItem[] = body.items ?? [];
  return items;
}

export default function GithubImportModal({
  user,
  open,
  onClose,
  onImported,
}: GithubImportModalProps) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<GithubSearchRepositoryItem[]>([]);
  const [authorizing, setAuthorizing] = useState(false);
  const [importingId, setImportingId] = useState<number | null>(null);
  const [controller, setController] = useState<AbortController | null>(null);

  const isOpen = open;

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setLoading(false);
      setError(null);
      setResults([]);
      setAuthorizing(false);
      setImportingId(null);
      if (controller) {
        controller.abort();
        setController(null);
      }
    }
  }, [isOpen, controller]);

  const performSearch = useCallback(
    async (keyword: string) => {
      if (!keyword.trim()) {
        setResults([]);
        return;
      }

      if (controller) {
        controller.abort();
      }

      const nextController = new AbortController();
      setController(nextController);

      try {
        setLoading(true);
        setError(null);
        const repositories = await searchRepositories(keyword, nextController.signal);
        setResults(repositories);
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        console.error(err);
        setError((err as Error).message ?? "검색 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    },
    [controller]
  );

  const handleAuthorize = useCallback(async () => {
    try {
      setAuthorizing(true);
      const response = await requestGithubAuthorization(user.id);
      window.open(response.authorizationUrl, "_blank", "noopener,noreferrer");
      toast.success("새 창에서 GitHub 인증을 완료해주세요.");
    } catch (err) {
      console.error(err);
      toast.error((err as Error).message ?? "인증 URL 생성에 실패했습니다.");
    } finally {
      setAuthorizing(false);
    }
  }, [user.id]);

  const handleImport = useCallback(
    async (repo: GithubSearchRepositoryItem) => {
      try {
        setImportingId(repo.id);
        await importGithubRepository(user.id, repo.clone_url);
        toast.success(`${repo.full_name} 저장소를 가져왔습니다.`);
        const repositories = await listImportedRepositories(user.id);
        onImported(repositories);
        onClose();
      } catch (err) {
        console.error(err);
        toast.error((err as Error).message ?? "저장소 가져오기에 실패했습니다.");
      } finally {
        setImportingId(null);
      }
    },
    [onClose, onImported, user.id]
  );

  const searchButtonDisabled = useMemo(
    () => loading || !query.trim(),
    [loading, query]
  );

  if (!isOpen) return null;

  return (
    <Portal>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999] animate-in fade-in-0 duration-200">
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl mx-4 overflow-hidden animate-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center">
                <Github className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">GitHub 저장소 가져오기</h2>
                <p className="text-sm text-slate-500">
                  연결된 계정으로 저장소를 검색하고 가져옵니다.
                </p>
              </div>
            </div>
            <button
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
              onClick={onClose}
            >
              <X className="w-4 h-4 text-slate-500" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="text-sm text-slate-600">
                먼저 GitHub 인증을 완료한 후 저장소를 검색하세요.
              </div>
              <button
                onClick={handleAuthorize}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-black text-white font-semibold hover:bg-slate-800 transition-colors disabled:opacity-60"
                disabled={authorizing}
              >
                {authorizing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Github className="w-4 h-4" />
                )}
                <span>GitHub 계정 연결</span>
              </button>
            </div>

            <div className="flex flex-col gap-3 md:flex-row">
              <div className="flex-1 flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-slate-200 bg-slate-50 focus:outline-none focus:border-blue-400 focus:bg-white transition-all"
                    placeholder="저장소 이름 또는 소유자를 입력하세요"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        performSearch(query);
                      }
                    }}
                  />
                </div>
                <button
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold shadow-sm hover:shadow-md disabled:opacity-60"
                  onClick={() => performSearch(query)}
                  disabled={searchButtonDisabled}
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "검색"
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-3 max-h-[360px] overflow-y-auto pr-2">
              {results.length === 0 && !loading ? (
                <div className="text-sm text-slate-500 text-center py-12">
                  검색 결과가 없습니다. 검색어를 입력해주세요.
                </div>
              ) : (
                results.map((repo) => (
                  <div
                    key={repo.id}
                    className="p-4 border border-slate-200 rounded-2xl hover:border-blue-300 hover:shadow-md transition-all duration-200 bg-white"
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div className="flex items-start gap-3">
                        <img
                          src={repo.owner.avatar_url}
                          alt={repo.owner.login}
                          className="w-10 h-10 rounded-full border border-slate-200"
                        />
                        <div className="space-y-1">
                          <div className="text-base font-semibold text-slate-800">
                            {repo.full_name}
                          </div>
                          {repo.description && (
                            <p className="text-sm text-slate-500 line-clamp-2">
                              {repo.description}
                            </p>
                          )}
                          <div className="text-xs text-slate-400">
                            ⭐ {repo.stargazers_count.toLocaleString()} • {repo.html_url}
                          </div>
                        </div>
                      </div>
                      <button
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold shadow-sm hover:shadow-md disabled:opacity-60"
                        onClick={() => handleImport(repo)}
                        disabled={importingId === repo.id}
                      >
                        {importingId === repo.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          "가져오기"
                        )}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
}
