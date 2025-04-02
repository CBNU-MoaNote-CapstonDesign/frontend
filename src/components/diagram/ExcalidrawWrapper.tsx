"use client";
import { Excalidraw } from "@excalidraw/excalidraw";

import "@excalidraw/excalidraw/index.css";

const ExcalidrawWrapper: React.FC<{onChange?:()=>void}> = ({onChange}) => {
  return (
    <div className={"w-full h-full"}>
      <Excalidraw
        onChange={onChange}
      />
    </div>
  );
};
export default ExcalidrawWrapper;