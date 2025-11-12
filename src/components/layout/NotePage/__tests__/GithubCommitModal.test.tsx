import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";

import GithubCommitModal from "@/components/layout/NotePage/GithubCommitModal";

jest.mock("@/components/common/Portal", () => ({
  __esModule: true,
  default: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

const mockCreateGithubBranchAndCommit = jest.fn();
const mockListGithubRepositoryFiles = jest.fn();
const mockListImportedRepositories = jest.fn();

jest.mock("@/libs/client/github", () => ({
  createGithubBranchAndCommit: (
    ...args: Parameters<typeof mockCreateGithubBranchAndCommit>
  ) => mockCreateGithubBranchAndCommit(...args),
  listGithubRepositoryFiles: (
    ...args: Parameters<typeof mockListGithubRepositoryFiles>
  ) => mockListGithubRepositoryFiles(...args),
  listImportedRepositories: (
    ...args: Parameters<typeof mockListImportedRepositories>
  ) => mockListImportedRepositories(...args),
}));

jest.mock("react-hot-toast", () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

import toast from "react-hot-toast";

const toastMocked = toast as unknown as { success: jest.Mock; error: jest.Mock };

describe("GithubCommitModal", () => {
  beforeEach(() => {
    mockCreateGithubBranchAndCommit.mockReset();
    mockListGithubRepositoryFiles.mockReset();
    mockListImportedRepositories.mockReset();
    toastMocked.success.mockReset();
    toastMocked.error.mockReset();
  });

  it("filters repository files by search term and submits selected file IDs", async () => {
    mockListImportedRepositories.mockResolvedValue([
      { repositoryName: "frontend", repositoryUrl: "https://github.com/example/frontend" },
    ]);
    mockListGithubRepositoryFiles.mockResolvedValue([
      { id: "file-1", path: "src/index.ts" },
      { id: "file-2", path: "src/utils/helpers.ts" },
    ]);
    mockCreateGithubBranchAndCommit.mockResolvedValue(undefined);

    const onClose = jest.fn();

    render(
      <GithubCommitModal
        user={{ id: "user-1", name: "User" } as User}
        open
        onClose={onClose}
      />
    );

    await waitFor(() => expect(mockListImportedRepositories).toHaveBeenCalled());
    await waitFor(() => expect(mockListGithubRepositoryFiles).toHaveBeenCalled());

    expect(screen.getByText("src/index.ts")).toBeTruthy();
    expect(screen.getByText("src/utils/helpers.ts")).toBeTruthy();

    const searchInput = screen.getByPlaceholderText("파일 이름 또는 경로 검색");
    fireEvent.change(searchInput, { target: { value: "helpers" } });

    await waitFor(() => {
      expect(screen.getByText("src/utils/helpers.ts")).toBeTruthy();
      expect(screen.queryByText("src/index.ts")).toBeNull();
    });

    fireEvent.click(screen.getByText("src/utils/helpers.ts"));

    fireEvent.change(screen.getByLabelText("새 브랜치 이름"), {
      target: { value: "feature/search" },
    });
    fireEvent.change(screen.getByLabelText("커밋 메시지"), {
      target: { value: "Add filtered commit" },
    });

    fireEvent.click(screen.getByRole("button", { name: "브랜치 생성" }));

    await waitFor(() => expect(mockCreateGithubBranchAndCommit).toHaveBeenCalled());

    expect(mockCreateGithubBranchAndCommit).toHaveBeenCalledWith({
      userId: "user-1",
      repositoryUrl: "https://github.com/example/frontend",
      baseBranch: "main",
      branchName: "feature/search",
      commitMessage: "Add filtered commit",
      fileIds: ["file-2"],
    });
    expect(onClose).toHaveBeenCalled();
    expect(toastMocked.success).toHaveBeenCalled();
  });
});
