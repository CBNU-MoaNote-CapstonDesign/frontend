import { getFileTree, listDirectoryChildren } from "@/libs/client/file";
import type { FileDTO } from "@/types/dto";
import { FileTypeDTO } from "@/types/dto";
import type { UUID } from "node:crypto";

describe("file client tree loading", () => {
  const directoryType = {
    toString: () => "DIRECTORY",
  } as unknown as FileTypeDTO;
  const documentType = {
    toString: () => "DOCUMENT",
  } as unknown as FileTypeDTO;

  const owner = { id: "owner-1", name: "owner" };
  const user = { id: "user-1", name: "tester" } as User;

  beforeEach(() => {
    process.env.NEXT_PUBLIC_SERVER_URL = "https://server";
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  function mockFetchSequence(...payloads: unknown[]) {
    (global.fetch as jest.Mock).mockImplementation((input: unknown) => {
      const nextPayload = payloads.shift();
      if (nextPayload === undefined) {
        throw new Error(`Unexpected fetch call for ${String(input)}`);
      }

      return Promise.resolve({
        ok: true,
        status: 200,
        body: {},
        json: async () => nextPayload,
      } as unknown as Response);
    });
  }

  function createDirectoryDto(id: string, dir: string | null) {
    return {
      id,
      name: id,
      owner,
      type: directoryType,
      dir: dir as unknown as UUID,
      githubImported: false,
    } as unknown as FileDTO;
  }

  function createDocumentDto(id: string, dir: string) {
    return {
      id,
      name: id,
      owner,
      type: documentType,
      dir: dir as unknown as UUID,
      githubImported: false,
    } as unknown as FileDTO;
  }

  it("fetches root lazily with recursive=false", async () => {
    mockFetchSequence(
      [createDirectoryDto("root", null)],
      [createDirectoryDto("dir-1", "root"), createDocumentDto("doc-1", "root")]
    );

    const tree = await getFileTree(null, user, { recursive: false });

    expect(global.fetch).toHaveBeenNthCalledWith(
      1,
      "https://server/api/files/list?user=user-1&recursive=false",
      expect.objectContaining({ method: "GET" })
    );
    expect(global.fetch).toHaveBeenNthCalledWith(
      2,
      "https://server/api/files/list/root?user=user-1&recursive=false",
      expect.objectContaining({ method: "GET" })
    );
    expect(tree?.children).toHaveLength(2);
    const dirChild = tree?.children?.find((child) => child.id === "dir-1");
    expect(dirChild?.children).toEqual([]);
  });

  it("recursively loads nested directories when requested", async () => {
    mockFetchSequence(
      [createDirectoryDto("root", null)],
      [createDirectoryDto("dir-1", "root")],
      [createDocumentDto("doc-1", "dir-1")]
    );

    const tree = await getFileTree(null, user, { recursive: true });

    expect(global.fetch).toHaveBeenNthCalledWith(
      1,
      "https://server/api/files/list?user=user-1&recursive=true",
      expect.objectContaining({ method: "GET" })
    );
    expect(global.fetch).toHaveBeenNthCalledWith(
      2,
      "https://server/api/files/list/root?user=user-1&recursive=true",
      expect.objectContaining({ method: "GET" })
    );
    expect(global.fetch).toHaveBeenNthCalledWith(
      3,
      "https://server/api/files/list/dir-1?user=user-1&recursive=true",
      expect.objectContaining({ method: "GET" })
    );
    const directory = tree?.children?.[0];
    expect(directory?.children?.[0]?.id).toBe("doc-1");
  });

  it("loads only direct children for a directory when recursive=false", async () => {
    mockFetchSequence([
      createDirectoryDto("dir-2", "root"),
      createDocumentDto("doc-2", "dir-1"),
    ]);

    const children = await listDirectoryChildren("dir-1", user, { recursive: false });

    expect(global.fetch).toHaveBeenCalledWith(
      "https://server/api/files/list/dir-1?user=user-1&recursive=false",
      expect.objectContaining({ method: "GET" })
    );
    const directoryChild = children.find((child) => child.id === "dir-2");
    expect(directoryChild?.children).toEqual([]);
  });
});
