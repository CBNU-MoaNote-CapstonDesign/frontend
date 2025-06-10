"use client";
import {Excalidraw, ExcalidrawElement} from "@excalidraw/excalidraw";

import "@excalidraw/excalidraw/index.css";
import {ExcalidrawImperativeAPI} from "@excalidraw/excalidraw/types";
import {useEffect, useState} from "react";

const ExcalidrawWrapper: React.FC<{
  onChange: (elements:ExcalidrawElement[]) => void,
  setUpdate: (update: (elements: ExcalidrawElement[])=>void)=>void,
}> = ({setUpdate, onChange}) => {
  const [excalidrawAPI, setExcalidrawAPI] = useState<ExcalidrawImperativeAPI>();

  useEffect(() => {
    if (excalidrawAPI) {
      excalidrawAPI.onChange((elements)=>{
        onChange(elements as ExcalidrawElement[]);
      })

      setUpdate((elements:ExcalidrawElement[])=>{
        excalidrawAPI.updateScene(
          {
            elements: elements,
          }
        );
      })
    }
  }, [excalidrawAPI]);

  return (
    <div className={"w-full h-full"}>
      <Excalidraw
        excalidrawAPI={(api) => {console.log("API 준비");setExcalidrawAPI(api)}}
      />
    </div>
  );
};
export default ExcalidrawWrapper;