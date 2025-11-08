"use client";
import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { ExcalidrawElement } from "@excalidraw/excalidraw/element/types";
import useDiagramSync from "@/hooks/useDiagramSync";

const ExcalidrawWrapper = dynamic(
  async () => (await import("./ExcalidrawWrapper")).default,
  {
    ssr: false,
  }
);

export default function DiagramRenderer({
  user,
  uuid,
}: {
  user: User;
  uuid: string;
}) {
  const updateRef = useRef<null | ((elements: ExcalidrawElement[]) => void)>(
    null
  );
  const [first, setFirst] = useState<boolean>(true);

  const { publish } = useDiagramSync(user, uuid, (content: string) => {
    try {
      const data = JSON.parse(content);
      console.log("sync에서 데이터가 새로 들어왔습니다");
      if (!updateRef.current) {
        console.log("update가 null");
      }
      if (updateRef.current) {
        updateRef.current(data);
      }
      setFirst(false);
    } catch (e: unknown) {
      console.log(e);
    }
  });

  return (
    <div className={"w-full h-full"} key={uuid}>
      <ExcalidrawWrapper
        setUpdate={(update: (elements: ExcalidrawElement[]) => void) => {
          updateRef.current = update;
        }}
        onChange={(elements) => {
          console.log("변경 발생한거 publish합니다.");
          if (!first) {
            const body = JSON.stringify(elements);
            publish(body);
          }
        }}
      />
    </div>
  );
}
