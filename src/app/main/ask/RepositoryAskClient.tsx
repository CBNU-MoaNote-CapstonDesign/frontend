"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { listImportedRepositories } from "@/libs/client/github";
import { askRepositoryQuestion } from "@/libs/client/repository";
import type { RepositoryAskResponse } from "@/libs/client/repository";
import type { GithubImportedRepositoryDTO } from "@/types/github";

interface RepositoryAskClientProps {
  user: User;
}

/**
 * Client-side page for submitting repository questions and displaying answers.
 * @param props Properties containing the authenticated user information.
 * @returns Repository question layout matching the main page aesthetics.
 */
export default function RepositoryAskClient({
  user,
}: RepositoryAskClientProps) {
  const [question, setQuestion] = useState("");
  const [repositories, setRepositories] = useState<GithubImportedRepositoryDTO[]>([]);
  const [repositoryUrl, setRepositoryUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RepositoryAskResponse | null>(null);
  const [loadingRepositories, setLoadingRepositories] = useState(false);

  /**
   * Loads repositories previously imported by the user so they can select one.
   */
  useEffect(() => {
    let mounted = true;

    const loadRepositories = async () => {
      try {
        setLoadingRepositories(true);
        const list = await listImportedRepositories(user.id);
        if (!mounted) return;
        setRepositories(list);
        if (list.length > 0) {
          setRepositoryUrl(list[0].repositoryUrl);
        }
      } catch (err) {
        console.error(err);
        if (mounted) {
          setError((err as Error).message ?? "저장소 목록을 불러오지 못했습니다.");
        }
      } finally {
        if (mounted) {
          setLoadingRepositories(false);
        }
      }
    };

    void loadRepositories();

    return () => {
      mounted = false;
    };
  }, [user.id]);

  /**
   * Handles form submission by invoking the repository ask API and storing the result.
   * @param event Form submission event from the question form.
   */
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    const trimmedQuestion = question.trim();
    const trimmedUrl = repositoryUrl.trim();

    if (!trimmedQuestion || !trimmedUrl) {
      setLoading(false);
      setError("질문과 리포지토리를 모두 선택해주세요.");
      return;
    }

    const response = await askRepositoryQuestion({
      userId: user.id,
      question: trimmedQuestion,
      repositoryUrl: trimmedUrl,
    });

    if (!response?.ok) {
      setError("답변을 가져오지 못했습니다. 다시 시도해주세요.");
      setLoading(false);
      return;
    }

    setResult(response);
    setLoading(false);
  };

  const placeholder = useMemo(
    () =>
      "프로젝트 구조나 특정 파일에 대해 궁금한 점을 입력해보세요. 예) utils 폴더 역할은 무엇인가요?",
    []
  );

  return (
    <div className="min-h-screen bg-[#f0f8fe]">
      <header className="sticky top-0 z-40 bg-gradient-to-r from-white/90 via-slate-50/90 to-white/90 backdrop-blur border-b border-slate-200">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Image
                src="/moanote_logo/logo1.png"
                alt="logo"
                className="h-10 w-10 object-contain"
                width={40}
                height={40}
                priority
              />
              <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></span>
            </div>
            <div>
              <p className="text-lg font-semibold text-slate-700">리포지토리 Q&A</p>
              <p className="text-sm text-slate-500">코드베이스에 대해 궁금한 점을 바로 확인해보세요.</p>
            </div>
          </div>
          <Link
            href="/main"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50"
          >
            노트 목록으로 돌아가기
          </Link>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-10">
        <section className="rounded-3xl border border-slate-200 bg-white/70 p-8 shadow-sm backdrop-blur">
          <h1 className="text-2xl font-bold text-slate-800">질문 생성</h1>
          <p className="mt-2 text-sm text-slate-500">
            모아노트에 연결된 저장소를 지정하고 궁금한 내용을 질문하면 LangGraph가 답변을 생성해드려요.
          </p>

          <form className="mt-6 flex flex-col gap-5" onSubmit={handleSubmit}>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-slate-600">리포지토리</span>
              <select
                value={repositoryUrl}
                onChange={(event) => setRepositoryUrl(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-inner outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-70"
                disabled={loadingRepositories || repositories.length === 0}
                required
              >
                {repositories.length === 0 ? (
                  <option value="">가져온 저장소가 없습니다. 먼저 저장소를 가져와주세요.</option>
                ) : (
                  repositories.map((repo) => (
                    <option key={repo.repositoryUrl} value={repo.repositoryUrl}>
                      {repo.repositoryName}
                    </option>
                  ))
                )}
              </select>
              {loadingRepositories && (
                <p className="text-xs text-slate-500">저장소 목록을 불러오는 중입니다...</p>
              )}
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-slate-600">질문</span>
              <textarea
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder={placeholder}
                rows={5}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-inner outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
                required
              />
            </label>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || repositories.length === 0 || loadingRepositories}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 px-6 py-3 text-base font-semibold text-white shadow-md transition hover:from-purple-600 hover:to-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent"></span>
                  답변 생성 중...
                </span>
              ) : (
                "질문하기"
              )}
            </button>
          </form>
        </section>

        {result && (
          <section className="rounded-3xl border border-blue-200 bg-gradient-to-r from-blue-50 via-white to-purple-50 p-8 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-800">LangGraph 답변</h2>
            <p className="mt-4 whitespace-pre-wrap rounded-2xl bg-white/80 p-5 text-sm leading-6 text-slate-700 shadow-inner">
              {result.answer}
            </p>

            {result.wantFiles.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-slate-600">분석한 파일</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {result.wantFiles.map((file) => (
                    <span
                      key={file}
                      className="rounded-full border border-blue-200 bg-white/80 px-3 py-1 text-xs font-medium text-blue-600 shadow-sm"
                    >
                      {file}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}