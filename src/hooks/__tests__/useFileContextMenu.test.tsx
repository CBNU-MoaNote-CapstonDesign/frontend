import { fireEvent, render, screen } from "@testing-library/react";

import useFileContextMenu from "@/hooks/useFileContextMenu";
import type { MoaFile } from "@/types/file";
import { FileTypeDTO } from "@/types/dto";

function TestComponent({ file }: { file: MoaFile }) {
  const { contextMenu, openContextMenu, closeContextMenu } = useFileContextMenu();

  return (
    <div>
      <button
        type="button"
        onClick={() => openContextMenu(file, { x: 10, y: 20 })}
      >
        open
      </button>
      <button type="button" onClick={closeContextMenu}>
        close
      </button>
      <span data-testid="status">
        {contextMenu
          ? `${contextMenu.file.id}:${contextMenu.position.x},${contextMenu.position.y}`
          : "closed"}
      </span>
    </div>
  );
}

describe("useFileContextMenu", () => {
  const file = {
    id: "file-id",
    name: "테스트 파일",
    type: FileTypeDTO.DOCUMENT,
  } as unknown as MoaFile;

  it("opens and closes the context menu state", () => {
    render(<TestComponent file={file} />);

    expect(screen.getByTestId("status").textContent).toBe("closed");

    fireEvent.click(screen.getByText("open"));
    expect(screen.getByTestId("status").textContent).toBe("file-id:10,20");

    fireEvent.click(screen.getByText("close"));
    expect(screen.getByTestId("status").textContent).toBe("closed");
  });
});