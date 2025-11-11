import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";

import NoteExplorer from "@/components/layout/NotePage/NoteExplorer";
import type { MoaFile } from "@/types/file";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

const deferred = <T,>() => {
  let resolve!: (value: T | PromiseLike<T>) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
};

type FileModule = typeof import("@/libs/client/file");

const mockGetFileTree = jest.fn<FileModule["getFileTree"]>();
const mockListDirectoryChildren = jest.fn<
  FileModule["listDirectoryChildren"]
>();
const mockCreateFile = jest.fn<FileModule["createFile"]>();
const mockDeleteFile = jest.fn<FileModule["deleteFile"]>();
const mockEditFile = jest.fn<FileModule["editFile"]>();
const mockAddNoteSegment = jest.fn<FileModule["addNoteSegment"]>();
const mockGetSharedFiles = jest.fn<FileModule["getSharedFiles"]>();

jest.mock("@/libs/client/file", () => ({
  getFileTree: (...args: Parameters<FileModule["getFileTree"]>) =>
    mockGetFileTree(...args),
  listDirectoryChildren: (
    ...args: Parameters<FileModule["listDirectoryChildren"]>
  ) => mockListDirectoryChildren(...args),
  createFile: (...args: Parameters<FileModule["createFile"]>) =>
    mockCreateFile(...args),
  deleteFile: (...args: Parameters<FileModule["deleteFile"]>) =>
    mockDeleteFile(...args),
  editFile: (...args: Parameters<FileModule["editFile"]>) =>
    mockEditFile(...args),
  addNoteSegment: (
    ...args: Parameters<FileModule["addNoteSegment"]>
  ) => mockAddNoteSegment(...args),
  getSharedFiles: (
    ...args: Parameters<FileModule["getSharedFiles"]>
  ) => mockGetSharedFiles(...args),
}));

describe("NoteExplorer modal loading", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockGetFileTree.mockReset();
    mockListDirectoryChildren.mockReset();
    mockCreateFile.mockReset();
    mockDeleteFile.mockReset();
    mockEditFile.mockReset();
    mockAddNoteSegment.mockReset();
    mockGetSharedFiles.mockReset();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it("keeps the folder modal open after the initial tree load resolves", async () => {
    const root: MoaFile = {
      id: "root",
      name: "Root",
      type: { toString: () => "DIRECTORY" },
      children: [],
    } as unknown as MoaFile;

    const fullTree: MoaFile = {
      ...root,
      children: [
        {
          id: "child",
          name: "Child",
          type: { toString: () => "DIRECTORY" },
          children: [],
        } as unknown as MoaFile,
      ],
    } as MoaFile;

    const deferredTree = deferred<MoaFile | null>();

    mockGetFileTree.mockImplementation((file, _user, options) => {
      if (!options?.recursive) {
        return Promise.resolve(root);
      }
      return deferredTree.promise;
    });

    mockListDirectoryChildren.mockResolvedValue([]);
    mockGetSharedFiles.mockResolvedValue([]);

    render(<NoteExplorer user={{ id: "user", name: "User" }} selectedNoteId="" />);

    // Allow ensureInitialTree to resolve the non-recursive root request.
    await waitFor(() => expect(mockGetFileTree).toHaveBeenCalled());

    // Open the add menu and trigger the folder modal while the full tree is loading.
    const addButton = await screen.findByTitle("노트/폴더 추가");
    fireEvent.click(addButton);
    const folderAdd = await screen.findByText("폴더 추가");
    fireEvent.click(folderAdd.closest("button") ?? folderAdd);

    expect(screen.getByText("폴더 정보를 불러오는 중입니다")).toBeTruthy();

    // Resolve the deferred recursive tree load.
    await act(async () => {
      deferredTree.resolve(fullTree);
      await Promise.resolve();
    });

    await waitFor(() =>
      expect(screen.getByRole("heading", { name: "폴더 추가" })).toBeTruthy()
    );

    // Advance timers to ensure no second refresh closes the modal.
    await act(async () => {
      jest.advanceTimersByTime(1000);
      await Promise.resolve();
    });

    expect(screen.getByRole("heading", { name: "폴더 추가" })).toBeTruthy();
    expect(mockGetFileTree).toHaveBeenCalledTimes(2);
  });
});
