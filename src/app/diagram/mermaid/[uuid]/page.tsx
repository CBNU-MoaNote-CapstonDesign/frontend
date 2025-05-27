"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { parseMermaidToExcalidraw } from "@excalidraw/mermaid-to-excalidraw";
import DiagramRenderer from "@/components/diagram/DiagramRenderer";
import {OrderedExcalidrawElement} from "@excalidraw/excalidraw/element/types";

export default function MermaidPage() {
  const { uuid } = useParams<{ uuid: string }>();
  const [elements, setElements] = useState< OrderedExcalidrawElement[]| null>(null);

  useEffect(() => {
    const fetchAndParse = async () => {
      try {
        const res = await fetch(`/api/mermaid?id=${uuid}`);
        const data = await res.json();
        const mermaid = data.mermaid;

        const { elements } = await parseMermaidToExcalidraw(mermaid);

        const mod = await import("@excalidraw/excalidraw");
        const excalidrawElements = mod.convertToExcalidrawElements(elements);

        setElements(excalidrawElements);
      } catch (err) {
        console.error("Error fetching or parsing mermaid:", err);
      }
    };

    if (uuid) {
      fetchAndParse();
    }
  }, [uuid]);

  if (!elements) return <div>Loading...</div>;

  return (
    <div className={"w-[100vw] h-[100vh]"}>
      <DiagramRenderer uuid={uuid} elements={elements} />
    </div>
  );
}
