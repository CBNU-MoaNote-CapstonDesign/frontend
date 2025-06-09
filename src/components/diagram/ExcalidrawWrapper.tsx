"use client";
import {Excalidraw} from "@excalidraw/excalidraw";

import "@excalidraw/excalidraw/index.css";
import {ExcalidrawImperativeAPI} from "@excalidraw/excalidraw/types";

const ExcalidrawWrapper: React.FC<{
  setExcalidrawAPI: (api:ExcalidrawImperativeAPI) => void,
}> = ({setExcalidrawAPI}) => {

  return (
    <div className={"w-full h-full"}>
      <Excalidraw
        excalidrawAPI={(api) => {console.log("API 준비");setExcalidrawAPI(api)}}
      />
    </div>
  );
};
export default ExcalidrawWrapper;