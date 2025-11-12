"use client";

import { FormEvent, ReactNode, Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { completeGithubOAuth } from "@/libs/client/github";

type SubmissionState = "idle" | "loading" | "success" | "error";

/**
 * Renders a page that finalizes the GitHub OAuth handshake by exchanging the
 * received authorization code and state with the backend server.
 */
export default function GithubOAuthCallbackPage() {
  return (
    <Suspense fallback={<GithubOAuthCallbackFallback />}>
      <GithubOAuthCallbackContent />
    </Suspense>
  );
}

/**
 * Provides a consistent background and layout wrapper for the OAuth callback
 * screen.
 *
 * @param props.children The content rendered inside the central card.
 */
function GithubOAuthCallbackLayout(props: { children: ReactNode }) {
  const { children } = props;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eef2ff] via-white to-[#fce7f3] flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white shadow-xl rounded-3xl p-8 border border-[#e0e7ff]">
        {children}
      </div>
    </div>
  );
}

/**
 * Displays a gentle loading state while the search parameters become
 * available.
 */
function GithubOAuthCallbackFallback() {
  return (
    <GithubOAuthCallbackLayout>
      <h1 className="text-2xl font-bold text-[#1e3a8a] mb-3">GitHub 연동 준비중</h1>
      <p className="text-sm text-[#475569] leading-relaxed">
        인증 정보를 불러오는 중입니다. 잠시만 기다려주세요.
      </p>
    </GithubOAuthCallbackLayout>
  );
}

/**
 * Shows the GitHub OAuth completion form and handles the exchange request to
 * the backend API.
 */
function GithubOAuthCallbackContent() {
  const searchParams = useSearchParams();
  const [userId, setUserId] = useState(() => searchParams.get("userId") ?? "");
  const [code, setCode] = useState(() => searchParams.get("code") ?? "");
  const [state, setState] = useState(() => searchParams.get("state") ?? "");
  const [status, setStatus] = useState<SubmissionState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setUserId(searchParams.get("userId") ?? "");
    setCode(searchParams.get("code") ?? "");
    setState(searchParams.get("state") ?? "");
  }, [searchParams]);

  /**
   * Handles the form submission by triggering the OAuth callback exchange
   * request to the backend server.
   *
   * @param event The form submission event triggered by the user.
   */
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!userId || !code || !state) {
      setErrorMessage("필수 정보가 누락되었습니다. 입력값을 확인해주세요.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrorMessage(null);

    try {
      await completeGithubOAuth({ userId, code, state });
      setStatus("success");
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "요청 처리 중 알 수 없는 오류가 발생했습니다."
      );
    }
  };

  return (
    <GithubOAuthCallbackLayout>
      <h1 className="text-2xl font-bold text-[#1e3a8a] mb-3">GitHub 연동 완료하기</h1>
      <p className="text-sm text-[#475569] mb-6 leading-relaxed">
        GitHub 인증을 마치기 위해 발급된 code와 state 값을 확인한 뒤 전송해주세요.
        모든 정보가 유효하면 창을 닫고 기존 화면에서 계속 진행할 수 있습니다.
      </p>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-[#1e293b]" htmlFor="userId">
            사용자 ID
          </label>
          <input
            id="userId"
            name="userId"
            className="w-full rounded-xl border border-[#cbd5f5] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-transparent"
            value={userId}
            onChange={(event) => setUserId(event.target.value)}
            placeholder="사용자 ID를 입력하세요"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-[#1e293b]" htmlFor="code">
            Authorization Code
          </label>
          <textarea
            id="code"
            name="code"
            className="w-full rounded-xl border border-[#cbd5f5] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-transparent resize-none"
            value={code}
            onChange={(event) => setCode(event.target.value)}
            placeholder="GitHub에서 전달된 code 값을 입력하세요"
            rows={3}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-[#1e293b]" htmlFor="state">
            State
          </label>
          <input
            id="state"
            name="state"
            className="w-full rounded-xl border border-[#cbd5f5] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-transparent"
            value={state}
            onChange={(event) => setState(event.target.value)}
            placeholder="state 값을 입력하세요"
            required
          />
        </div>

        {status === "error" && errorMessage ? (
          <p className="text-sm text-[#dc2626] bg-[#fee2e2] border border-[#fecaca] rounded-xl px-4 py-3">
            {errorMessage}
          </p>
        ) : null}

        <button
          type="submit"
          className="w-full bg-[#4f46e5] hover:bg-[#4338ca] text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          disabled={status === "loading"}
        >
          {status === "loading" ? "전송 중..." : "정보 전송"}
        </button>
      </form>

      {status === "success" ? (
        <div className="mt-6 bg-[#ecfdf5] border border-[#bbf7d0] text-[#047857] rounded-2xl px-5 py-4 text-sm leading-relaxed">
          인증이 성공적으로 완료되었습니다. 이 창은 닫아도 좋으며, 기존 창으로
          돌아가 작업을 이어서 진행해주세요.
        </div>
      ) : null}
    </GithubOAuthCallbackLayout>
  );
}
