"use client";
import {Excalidraw} from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import {OrderedExcalidrawElement} from "@excalidraw/excalidraw/element/types";

const ExcalidrawWrapper: React.FC<{
  elements?: OrderedExcalidrawElement[];
  onChange?: () => void;
}> = ({ elements, onChange }) => {

  return (
    <div className={"w-full h-full"}>
      <Excalidraw
        initialData={{
          elements,
          scrollToContent: true,
        }}
        onChange={onChange}
      />
    </div>
  );
};
export default ExcalidrawWrapper;