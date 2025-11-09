import { fireEvent, render, screen } from "@testing-library/react";

import FolderTree from "@/components/layout/NotePage/FolderTree";
import type { MoaFile } from "@/types/file";

describe("FolderTree context menu", () => {
  const rootFolder = {
    id: "root-folder",
    name: "루트",
    type: "DIRECTORY",
    children: [
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

  it("stops propagation so the targeted node opens the menu", () => {
    const handleContextMenu = jest.fn();

    render(
      <FolderTree
        file={rootFolder}
        selectedNoteId=""
        folderOpen={{ "root-folder": true, "child-folder": true }}
        onToggleFolder={() => {}}
        onEditFolder={() => {}}
        onEditNote={() => {}}
        onNoteClick={() => {}}
        onContextMenu={handleContextMenu}
        loadingFolders={{}}
        isRoot
      />
    );

    fireEvent.contextMenu(screen.getByText("하위 노트"));

    expect(handleContextMenu).toHaveBeenCalledTimes(1);
    expect(handleContextMenu).toHaveBeenCalledWith(
      expect.objectContaining({ id: "child-note" }),
      expect.any(Object)
    );
  });

  it("prevents ancestors from overriding folder targets", () => {
    const handleContextMenu = jest.fn();

    render(
      <FolderTree
        file={rootFolder}
        selectedNoteId=""
        folderOpen={{ "root-folder": true, "child-folder": true }}
        onToggleFolder={() => {}}
        onEditFolder={() => {}}
        onEditNote={() => {}}
        onNoteClick={() => {}}
        onContextMenu={handleContextMenu}
        loadingFolders={{}}
        isRoot
      />
    );

    fireEvent.contextMenu(screen.getByText("하위 폴더"));

    expect(handleContextMenu).toHaveBeenCalledTimes(1);
    expect(handleContextMenu).toHaveBeenCalledWith(
      expect.objectContaining({ id: "child-folder" }),
      expect.any(Object)
    );
  });
});