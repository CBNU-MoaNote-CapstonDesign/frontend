export interface GithubOAuthAuthorizeResponse {
  authorizationUrl: string;
  state: string;
}

export interface GithubImportedRepositoryDTO {
  repositoryName: string;
  repositoryUrl: string;
}

export interface GithubBranchCommitFileInput {
  path: string;
  content: string;
}

export interface GithubSearchRepositoryItem {
  id: number;
  full_name: string;
  description: string | null;
  html_url: string;
  clone_url: string;
  stargazers_count: number;
  owner: {
    login: string;
    avatar_url: string;
  };
}
