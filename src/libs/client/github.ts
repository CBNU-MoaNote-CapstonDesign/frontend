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
 * Completes the GitHub OAuth handshake by exchanging the provided code and state.
 *
 * @param options.userId The identifier of the user who initiated the OAuth flow.
 * @param options.code The temporary authorization code from GitHub.
 * @param options.state The state value issued during authorization for CSRF protection.
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
 * Requests a new GitHub branch creation and commit for the selected files.
 *
 * @param options Parameters required to create a branch and commit.
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
 * Retrieves the list of files available for committing in the selected repository.
 *
 * @param userId The ID of the authenticated user.
 * @param repositoryUrl The GitHub repository URL to query.
 * @returns The repository files that can be committed.
 */
/**
 * Requests the root file metadata for an imported GitHub repository.
 *
 * @param userId The ID of the authenticated user.
 * @param repositoryName The name of the imported repository.
 * @returns The repository root file metadata, if available.
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
 * Builds a list of repository files with their relative paths using file metadata.
 *
 * @param files The raw file metadata retrieved from the backend.
 * @param rootId The identifier of the repository root directory.
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
 * Retrieves the list of files available for committing in the selected repository.
 *
 * @param user The authenticated user.
 * @param repository The imported repository to query.
 * @returns The repository files that can be committed.
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
  const directoryFiles = await getChildrenList(rootId, user, {recursive: true});

  if (!Array.isArray(directoryFiles)) {
    return [];
  }
  return mapRepositoryFiles(directoryFiles, rootId);
}
