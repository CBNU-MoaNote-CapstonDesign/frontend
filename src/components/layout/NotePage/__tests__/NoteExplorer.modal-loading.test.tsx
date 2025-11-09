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

const getFileTreeMock = jest.fn<FileModule["getFileTree"]>();
const listDirectoryChildrenMock = jest.fn<FileModule["listDirectoryChildren"]>();
const createFileMock = jest.fn<FileModule["createFile"]>();
const deleteFileMock = jest.fn<FileModule["deleteFile"]>();
const editFileMock = jest.fn<FileModule["editFile"]>();
const addNoteSegmentMock = jest.fn<FileModule["addNoteSegment"]>();

jest.mock("@/libs/client/file", () => ({
  getFileTree: (...args: Parameters<FileModule["getFileTree"]>) =>
    getFileTreeMock(...args),
  listDirectoryChildren: (
    ...args: Parameters<FileModule["listDirectoryChildren"]>
  ) => listDirectoryChildrenMock(...args),
  createFile: (...args: Parameters<FileModule["createFile"]>) =>
    createFileMock(...args),
  deleteFile: (...args: Parameters<FileModule["deleteFile"]>) =>
    deleteFileMock(...args),
  editFile: (...args: Parameters<FileModule["editFile"]>) =>
    editFileMock(...args),
  addNoteSegment: (
    ...args: Parameters<FileModule["addNoteSegment"]>
  ) => addNoteSegmentMock(...args),
}));

describe("NoteExplorer modal loading", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    getFileTreeMock.mockReset();
    listDirectoryChildrenMock.mockReset();
    createFileMock.mockReset();
    deleteFileMock.mockReset();
    editFileMock.mockReset();
    addNoteSegmentMock.mockReset();
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

    getFileTreeMock.mockImplementation((file, _user, options) => {
      if (!options?.recursive) {
        return Promise.resolve(root);
      }
      return deferredTree.promise;
    });

    listDirectoryChildrenMock.mockResolvedValue([]);

    render(<NoteExplorer user={{ id: "user", name: "User" }} selectedNoteId="" />);

    // Allow ensureInitialTree to resolve the non-recursive root request.
    await waitFor(() => expect(getFileTreeMock).toHaveBeenCalled());

    // Open the add menu and trigger the folder modal while the full tree is loading.
    const addButton = await screen.findByRole("button", { name: "노트/폴더 추가" });
    fireEvent.click(addButton);
    const folderAdd = await screen.findByRole("button", { name: "폴더 추가" });
    fireEvent.click(folderAdd);

    expect(
      screen.getByText("폴더 정보를 불러오는 중입니다")
    ).toBeInTheDocument();

    // Resolve the deferred recursive tree load.
    await act(async () => {
      deferredTree.resolve(fullTree);
      await Promise.resolve();
    });

    await waitFor(() =>
      expect(screen.getByRole("heading", { name: "폴더 추가" })).toBeInTheDocument()
    );

    // Advance timers to ensure no second refresh closes the modal.
    await act(async () => {
      jest.advanceTimersByTime(1000);
      await Promise.resolve();
    });

    expect(screen.getByRole("heading", { name: "폴더 추가" })).toBeInTheDocument();
    expect(getFileTreeMock).toHaveBeenCalledTimes(2);
  });
});
