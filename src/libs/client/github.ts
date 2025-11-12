"use client";

import { FileDTO, FileTypeDTO } from "@/types/dto";
import {
  GithubImportedRepositoryDTO,
  GithubOAuthAuthorizeResponse,
  GithubRepositoryFileDTO,
} from "@/types/github";
import { getChildrenList } from "@/libs/client/file";

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

/**
 * 전달받은 code/state 값을 교환하여 GitHub OAuth 인증을 마무리합니다.
 *
 * @param options.userId OAuth 인증을 시작한 사용자의 식별자입니다.
 * @param options.code GitHub에서 발급한 임시 Authorization code입니다.
 * @param options.state CSRF 방지를 위해 발급된 state 값입니다.
 */
export async function completeGithubOAuth(options: {
  userId: string;
  code: string;
  state: string;
}) {
  await request<null>("/api/github/oauth/callback", {
    method: "POST",
    body: JSON.stringify(options),
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

/**
 * 선택한 파일을 기준으로 GitHub 브랜치를 생성하고 커밋을 요청합니다.
 *
 * @param options 브랜치 생성과 커밋에 필요한 매개변수입니다.
 */
export async function createGithubBranchAndCommit(options: {
  userId: string;
  repositoryUrl: string;
  baseBranch: string;
  branchName: string;
  commitMessage: string;
  fileIds: string[];
}) {
  await request<null>("/api/github/branch", {
    method: "POST",
    body: JSON.stringify(options),
    parseJson: false,
  });
}

/**
 * 가져온 GitHub 저장소의 루트 파일 메타데이터를 조회합니다.
 *
 * @param userId 인증된 사용자의 식별자입니다.
 * @param repositoryName 가져온 저장소의 이름입니다.
 * @returns 루트 파일 메타데이터가 존재하면 해당 정보를 반환합니다.
 */
async function fetchGithubRepositoryRootFile(
  userId: string,
  repositoryName: string
): Promise<FileDTO | null> {
  const data = await request<FileDTO | null>(
    `/api/github/repository/file?userId=${encodeURIComponent(
      userId
    )}&repositoryName=${encodeURIComponent(repositoryName)}`,
    {
      method: "GET",
    }
  );

  if (!data) {
    return null;
  }

  return data;
}

/**
 * 파일 메타데이터를 이용해 상대 경로가 포함된 저장소 파일 목록을 생성합니다.
 *
 * @param files 백엔드에서 받아온 원본 파일 메타데이터입니다.
 * @param rootId 저장소 루트 디렉터리의 식별자입니다.
 */
function mapRepositoryFiles(
  files: FileDTO[],
  rootId: string
): GithubRepositoryFileDTO[] {
  const byParent = new Map<string | null, FileDTO[]>();

  for (const file of files) {
    const parentId = (file.dir as unknown as string | null) ?? null;
    const siblings = byParent.get(parentId) ?? [];
    siblings.push(file);
    byParent.set(parentId, siblings);
  }

  const traverse = (parentId: string, parentPath: string): GithubRepositoryFileDTO[] => {
    const children = byParent.get(parentId) ?? [];
    const result: GithubRepositoryFileDTO[] = [];

    for (const child of children) {
      const childId = String(child.id);
      const currentPath = parentPath ? `${parentPath}/${child.name}` : child.name;

      if (child.type === FileTypeDTO.DOCUMENT) {
        result.push({ id: childId, path: currentPath });
      } else if (child.type === FileTypeDTO.DIRECTORY) {
        result.push(...traverse(childId, currentPath));
      }
    }

    return result;
  };

  return traverse(rootId, "").sort((a, b) => a.path.localeCompare(b.path));
}

/**
 * 선택한 저장소에서 커밋 가능한 파일 목록을 조회합니다.
 *
 * @param user 인증된 사용자 정보입니다.
 * @param repository 조회할 가져온 저장소 정보입니다.
 * @returns 커밋 대상이 될 수 있는 저장소 파일 목록입니다.
 */
export async function listGithubRepositoryFiles(
  user: User,
  repository: GithubImportedRepositoryDTO
): Promise<GithubRepositoryFileDTO[]> {
  const root = await fetchGithubRepositoryRootFile(user.id, repository.repositoryName);

  if (!root) {
    return [];
  }

  const rootId = String(root.id);
  const directoryFiles = await getChildrenList(rootId, user, { recursive: true });

  if (!Array.isArray(directoryFiles)) {
    return [];
  }
  return mapRepositoryFiles(directoryFiles, rootId);
}
