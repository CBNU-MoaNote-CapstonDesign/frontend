import "@testing-library/jest-dom";
import { FileTypeDTO } from "@/types/dto";
import type { MoaFile } from "@/types/file";
import { findFolderById, updateFolderBranch } from "../NoteExplorer";

function createFolder(
  id: string,
  children: MoaFile[] = [],
  childrenLoaded = false
): MoaFile {
  return {
    id,
    name: id,
    type: FileTypeDTO.DIRECTORY,
    children,
    childrenLoaded,
  } as MoaFile;
}

function createDocument(id: string): MoaFile {
  return {
    id,
    name: id,
    type: FileTypeDTO.DOCUMENT,
  } as MoaFile;
}

describe("NoteExplorer tree helpers", () => {
  it("finds nested folders by id", () => {
    const targetFolder = createFolder("folder-2");
    const root = createFolder("root", [
      createDocument("doc-1"),
      createFolder("folder-1", [targetFolder]),
    ]);

    const result = findFolderById(root, "folder-2");
    expect(result).toBe(targetFolder);
  });

  it("returns updated tree when replacing a folder branch", () => {
    const nestedFolder = createFolder("folder-2", [], false);
    const root = createFolder("root", [
      createFolder("folder-1", [nestedFolder]),
      createFolder("folder-3"),
    ], true);

    const replacement = createFolder("folder-2", [createDocument("doc-2")], true);
    const updated = updateFolderBranch(root, replacement);

    const updatedTarget = findFolderById(updated, "folder-2");
    expect(updatedTarget).not.toBeNull();
    expect(updatedTarget?.children).toHaveLength(1);
    expect(updatedTarget?.childrenLoaded).toBe(true);

    const untouchedFolder = findFolderById(updated, "folder-3");
    expect(untouchedFolder).toBe(root.children?.[1]);
  });
});
