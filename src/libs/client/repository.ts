"use client";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

/**
 * API response shape for repository question requests.
 */
export interface RepositoryAskResponse {
  ok: boolean;
  answer: string;
  wantFiles: string[];
}

/**
 * Parameters required to ask a repository question.
 */
export interface RepositoryAskParams {
  userId: string;
  question: string;
  repositoryUrl: string;
}

/**
 * Calls the repository ask endpoint and returns the generated answer with related files.
 * @param params Arguments containing the current user identifier, question, and repository URL.
 * @returns Parsed repository response when the request succeeds, otherwise null.
 */
export async function askRepositoryQuestion(
  params: RepositoryAskParams
): Promise<RepositoryAskResponse | null> {
  const { userId, question, repositoryUrl } = params;
  const location = `/api/repository/ask?user=${userId}`;

  try {
    const response = await fetch(`${SERVER_URL}${location}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question,
        repositoryUrl,
      }),
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as RepositoryAskResponse;
    return data;
  } catch (error) {
    console.error("Failed to call repository ask API", error);
    return null;
  }
}