import { render, screen } from "@testing-library/react";

import FolderTree, {
  partitionChildren,
} from "@/components/layout/NotePage/FolderTree";
import type { MoaFile } from "@/types/file";

describe("partitionChildren", () => {
  it("splits directories and documents while preserving order", () => {
    const children = [
      { id: "dir-1", name: "Directory", type: "DIRECTORY" },
      { id: "doc-1", name: "Document", type: "DOCUMENT" },
      { id: "dir-2", name: "Second Directory", type: "DIRECTORY" },
      { id: "doc-2", name: "Second Document", type: "DOCUMENT" },
    ] as unknown as MoaFile[];

    const { directories, notes } = partitionChildren(children);

    expect(directories).toEqual([
      expect.objectContaining({ id: "dir-1" }),
      expect.objectContaining({ id: "dir-2" }),
    ]);
    expect(notes).toEqual([
      expect.objectContaining({ id: "doc-1" }),
      expect.objectContaining({ id: "doc-2" }),
    ]);
  });

  it("returns empty arrays when there are no children", () => {
    const { directories, notes } = partitionChildren();

    expect(directories).toHaveLength(0);
    expect(notes).toHaveLength(0);
  });
});

describe("FolderTree", () => {
  const baseProps = {
    selectedNoteId: "",
    onToggleFolder: () => {},
    onEditFolder: () => {},
    onEditNote: () => {},
    onNoteClick: () => {},
    onContextMenu: () => {},
    loadingFolders: {},
  } as const;

  it("renders notes directly beneath their parent folder", () => {
    const tree = {
      id: "root-folder",
      name: "루트",
      type: "DIRECTORY",
      children: [
        {
          id: "note-a",
          name: "상위 노트",
          type: "DOCUMENT",
        },
        {
          id: "child-folder",
          name: "하위 폴더",
          type: "DIRECTORY",
          children: [
            {
              id: "child-note",
              name: "하위 노트",
              type: "DOCUMENT",
            },
          ],
        },
      ],
    } as unknown as MoaFile;

    render(
      <FolderTree
        file={tree}
        folderOpen={{ "root-folder": true, "child-folder": true }}
        isRoot
        {...baseProps}
      />
    );

    const parentNote = screen.getByText("상위 노트");
    const childFolder = screen.getByText("하위 폴더");

    const position = parentNote.compareDocumentPosition(childFolder);

    expect(position & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(position & Node.DOCUMENT_POSITION_PRECEDING).toBeFalsy();
  });
});