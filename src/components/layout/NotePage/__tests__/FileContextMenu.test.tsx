import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import FileContextMenu from "../FileContextMenu";

describe("FileContextMenu", () => {
  it("does not render when anchor point is null", () => {
    const { container } = render(
      <FileContextMenu anchorPoint={null} onClose={jest.fn()} onShare={jest.fn()} />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("calls onShare and onClose when share button is clicked", () => {
    const handleClose = jest.fn();
    const handleShare = jest.fn();

    render(
      <FileContextMenu
        anchorPoint={{ x: 10, y: 20 }}
        onClose={handleClose}
        onShare={handleShare}
      />
    );

    const shareButton = screen.getByRole("button", { name: "파일 공유" });
    fireEvent.click(shareButton);

    expect(handleShare).toHaveBeenCalledTimes(1);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
