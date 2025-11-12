import {
  getFileTree,
  getSharedFiles,
  listDirectoryChildren,
  unshare,
} from "@/libs/client/file";
import type { FileDTO } from "@/types/dto";
import { FileTypeDTO } from "@/types/dto";
import type { UUID } from "node:crypto";

describe("file client tree loading", () => {
  const directoryType = "DIRECTORY" as unknown as FileTypeDTO;
  const documentType = "DOCUMENT" as unknown as FileTypeDTO;

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
    expect(dirChild?.type).toBe(FileTypeDTO.DIRECTORY);
    expect(dirChild?.children).toEqual([]);
  });

  it("recursively loads nested directories when requested", async () => {
    mockFetchSequence([
      createDirectoryDto("root", null),
      createDirectoryDto("dir-1", "root"),
      createDocumentDto("doc-1", "dir-1"),
    ]);

    const tree = await getFileTree(null, user, { recursive: true });

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      "https://server/api/files/list?user=user-1&recursive=true",
      expect.objectContaining({ method: "GET" })
    );
    const directory = tree?.children?.[0];
    expect(directory?.children?.[0]?.id).toBe("doc-1");
    expect(directory?.type).toBe(FileTypeDTO.DIRECTORY);
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
    expect(directoryChild?.type).toBe(FileTypeDTO.DIRECTORY);
    expect(directoryChild?.children).toEqual([]);
  });

  it("builds nested children from a single request when recursive=true", async () => {
    mockFetchSequence([
      createDirectoryDto("dir-1", "root"),
      createDirectoryDto("dir-2", "dir-1"),
      createDocumentDto("doc-2", "dir-2"),
    ]);

    const children = await listDirectoryChildren("dir-1", user, { recursive: true });

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      "https://server/api/files/list/dir-1?user=user-1&recursive=true",
      expect.objectContaining({ method: "GET" })
    );

    const nestedDirectory = children.find((child) => child.id === "dir-2");
    expect(nestedDirectory?.type).toBe(FileTypeDTO.DIRECTORY);
    expect(nestedDirectory?.children?.[0]?.id).toBe("doc-2");

    const documentChild = nestedDirectory?.children?.[0];
    expect(documentChild?.type).toBe(FileTypeDTO.DOCUMENT);
  });

  it("normalizes shared file types to enum values", async () => {
    mockFetchSequence([
      {
        id: "shared-doc",
        name: "shared",
        owner,
        type: "DOCUMENT" as unknown as FileTypeDTO,
        dir: null as unknown as UUID,
        githubImported: false,
      } as unknown as FileDTO,
    ]);

    const files = await getSharedFiles(user);

    expect(global.fetch).toHaveBeenCalledWith(
        "https://server/api/files/all/user-1",
        expect.objectContaining({ method: "GET" })
    );
    expect(files[0]?.type).toBe(FileTypeDTO.DOCUMENT);
  });
});


describe("unshare", () => {
  const originalEnv = process.env.NEXT_PUBLIC_SERVER_URL;
  const user: User = { id: "owner-id", name: "owner" };
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    process.env.NEXT_PUBLIC_SERVER_URL = "https://example.com";
    consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
  });

  afterEach(() => {
    process.env.NEXT_PUBLIC_SERVER_URL = originalEnv;
    jest.resetAllMocks();
    consoleErrorSpy.mockRestore();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (global as any).fetch;
  });

  it("sends a POST request to the unshare endpoint and resolves true for ok responses", async () => {
    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global as any).fetch = mockFetch;

    const result = await unshare("file-123", user, "target-456");

    expect(mockFetch).toHaveBeenCalledWith(
      "https://example.com/api/files/unshare/file-123?user=owner-id&targetUser=target-456",
      expect.objectContaining({
        method: "POST",
        credentials: "include",
      })
    );
    expect(result).toBe(true);
  });

  it("returns false when the request fails", async () => {
    const mockFetch = jest.fn().mockRejectedValue(new Error("network"));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global as any).fetch = mockFetch;

    const result = await unshare("file-123", user, "target-456");

    expect(result).toBe(false);
  });

  it("returns false when the server responds with a non-ok status", async () => {
    const mockFetch = jest.fn().mockResolvedValue({
      ok: false,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global as any).fetch = mockFetch;

    const result = await unshare("file-123", user, "target-456");

    expect(result).toBe(false);
  });
});