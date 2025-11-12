"use client";

import { ReactNode, Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import { completeGithubOAuth } from "@/libs/client/github";
import { fetchCurrentUser } from "@/libs/client/user";

type SubmissionState = "loading" | "success" | "error";

/**
 * GitHub OAuth 인증 후 콜백에서 code/state 값을 교환하는 페이지를 렌더링합니다.
 */
export default function GithubOAuthCallbackPage() {
  return (
    <Suspense fallback={<GithubOAuthCallbackFallback />}>
      <GithubOAuthCallbackContent />
    </Suspense>
  );
}

/**
 * OAuth 콜백 화면을 위한 공통 배경과 레이아웃을 제공합니다.
 *
 * @param props.children 중앙 카드에 렌더링할 자식 요소입니다.
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
 * 검색 파라미터를 불러오는 동안 부드러운 로딩 상태를 보여줍니다.
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
 * GitHub OAuth code/state 값을 자동으로 교환하여 인증을 마무리합니다.
 */
function GithubOAuthCallbackContent() {
  const searchParams = useSearchParams();
  const code = useMemo(() => searchParams.get("code"), [searchParams]);
  const state = useMemo(() => searchParams.get("state"), [searchParams]);
  const [status, setStatus] = useState<SubmissionState>("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const submit = async () => {
      if (!code || !state) {
        setStatus("error");
        setErrorMessage(
          "필수 인증 정보가 누락되었습니다. 창을 닫고 GitHub 인증을 다시 시도해주세요."
        );
        return;
      }

      setStatus("loading");
      setErrorMessage(null);

      try {
        const user = await fetchCurrentUser();

        if (!user) {
          throw new Error(
            "사용자 정보를 확인할 수 없습니다. 다시 로그인한 뒤 시도해주세요."
          );
        }

        await completeGithubOAuth({ userId: user.id, code, state });

        if (!cancelled) {
          setStatus("success");
        }
      } catch (error) {
        if (cancelled) return;

        setStatus("error");
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "요청 처리 중 알 수 없는 오류가 발생했습니다."
        );
      }
    };

    submit();

    return () => {
      cancelled = true;
    };
  }, [code, state]);

  return (
    <GithubOAuthCallbackLayout>
      <h1 className="text-2xl font-bold text-[#1e3a8a] mb-3">GitHub 연동 완료하기</h1>
      <p className="text-sm text-[#475569] mb-6 leading-relaxed">
        잠시만 기다려주세요. GitHub에서 전달된 정보를 확인한 뒤 자동으로 연동을
        마무리합니다. 완료되면 이 창을 닫고 기존 화면에서 계속 진행하실 수
        있습니다.
      </p>

      <div className="space-y-5">
        {status === "loading" ? (
          <p className="text-sm text-[#1e293b] bg-[#eef2ff] border border-[#c7d2fe] rounded-xl px-5 py-4 leading-relaxed">
            GitHub에서 받은 정보를 확인하고 있습니다. 잠시만 기다려주세요.
          </p>
        ) : null}

        {status === "error" && errorMessage ? (
          <p className="text-sm text-[#dc2626] bg-[#fee2e2] border border-[#fecaca] rounded-xl px-4 py-3 leading-relaxed">
            {errorMessage}
          </p>
        ) : null}

        {status === "success" ? (
          <div className="bg-[#ecfdf5] border border-[#bbf7d0] text-[#047857] rounded-2xl px-5 py-4 text-sm leading-relaxed">
            인증이 성공적으로 완료되었습니다. 이 창을 닫은 뒤 기존 창으로 돌아가
            작업을 이어서 진행해주세요.
          </div>
        ) : null}
      </div>
    </GithubOAuthCallbackLayout>
  );
}
