"use client"
import dynamic from "next/dynamic";
import {OrderedExcalidrawElement} from "@excalidraw/excalidraw/element/types";

const ExcalidrawWrapper = dynamic(
  async () => (await import("./ExcalidrawWrapper")).default,
  {
    ssr: false,
  },
);

export default function DiagramRenderer({uuid, elements = null}: {
  uuid: string,
  elements: null | OrderedExcalidrawElement[]
}) {
  return (
    <div className={"w-full h-full"} key={uuid}>
      {
        elements === null ?
          <ExcalidrawWrapper/> :
          <ExcalidrawWrapper elements={elements}/>
      }
    </div>
  );
}