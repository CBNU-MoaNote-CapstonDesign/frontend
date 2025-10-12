"use client";

import {
  GithubImportedRepositoryDTO,
  GithubOAuthAuthorizeResponse,
} from "@/types/github";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

async function parseResponseBody(response: Response) {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch (error) {
    console.error("Failed to parse response JSON", error);
    return null;
  }
}

async function request<T>(
  location: string,
  init: RequestInit & { parseJson?: boolean } = {}
): Promise<T> {
  if (!SERVER_URL) {
    throw new Error("서버 주소가 설정되지 않았습니다.");
  }

  const { parseJson = true, ...rest } = init;

  const response = await fetch(`${SERVER_URL}${location}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
    ...rest,
  });

  if (!response.ok) {
    const body = await parseResponseBody(response);
    const message =
      (body && (body.message || body.error)) ||
      `요청이 실패했습니다. (status: ${response.status})`;
    throw new Error(message);
  }

  if (!parseJson) {
    return undefined as T;
  }

  const body = await parseResponseBody(response);
  return (body ?? (null as T)) as T;
}

export async function requestGithubAuthorization(
  userId: string
): Promise<GithubOAuthAuthorizeResponse> {
  const body = JSON.stringify({ userId });
  const response = await request<GithubOAuthAuthorizeResponse>(
    "/api/github/oauth/authorize",
    {
      method: "POST",
      body,
    }
  );

  if (!response?.authorizationUrl) {
    throw new Error("Authorization URL을 생성할 수 없습니다.");
  }

  return response;
}

export async function importGithubRepository(
  userId: string,
  repositoryUrl: string
) {
  await request<null>("/api/github/import", {
    method: "POST",
    body: JSON.stringify({ userId, repositoryUrl }),
    parseJson: false,
  });
}

export async function listImportedRepositories(
  userId: string
): Promise<GithubImportedRepositoryDTO[]> {
  const data = await request<GithubImportedRepositoryDTO[]>(
    `/api/github/listImported?userId=${userId}`,
    {
      method: "GET",
    }
  );

  return data ?? [];
}

export async function fetchGithubRepository(
  userId: string,
  repositoryUrl: string,
  branchName: string
) {
  await request<null>("/api/github/fetch", {
    method: "POST",
    body: JSON.stringify({ userId, repositoryUrl, branchName }),
    parseJson: false,
  });
}

export async function createGithubBranchAndCommit(options: {
  userId: string;
  repositoryUrl: string;
  baseBranch: string;
  branchName: string;
  commitMessage: string;
  files: Record<string, string>;
}) {
  await request<null>("/api/github/branch", {
    method: "POST",
    body: JSON.stringify(options),
    parseJson: false,
  });
}
