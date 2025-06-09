"use client"
import dynamic from "next/dynamic";
import {useEffect, useState} from "react";
import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";
import useDocumentSync from "@/hooks/useDocumentSync";


const ExcalidrawWrapper = dynamic(
  async () => (await import("./ExcalidrawWrapper")).default,
  {
    ssr: false,
  },
);

export default function DiagramRenderer({user, uuid}: { user:User, uuid: string }) {
  const [excalidrawAPI, setExcalidrawAPI] = useState<ExcalidrawImperativeAPI>();

  const {publish} = useDocumentSync( user,
    "01975535-44a6-77eb-84e5-c9b2c27f4e2b",
    (content: string) => {
      try {

        const data = JSON.parse(content);
        if(!excalidrawAPI) {
          console.log("excalidrawAPI 미준비");
        }
        if(excalidrawAPI) {
          console.log("update");
          excalidrawAPI.updateScene({
            elements :data,
            // captureUpdate: CaptureUpdateAction.IMMEDIATELY,
          });
        }
      } catch (e:unknown) {
        console.log(e);
      }
    });

  useEffect(() => {
    if (excalidrawAPI) {
      console.log("excalidrawAPI 준비완료");
      excalidrawAPI.onChange((elements) => {
        console.log("변경 발생");
        const str = JSON.stringify(elements);
        publish(str);
      })
    }
  }, [excalidrawAPI]);

  return (
    <div className={"w-full h-full"} key={uuid}>
      <ExcalidrawWrapper setExcalidrawAPI={setExcalidrawAPI}/>
    </div>
  );
}