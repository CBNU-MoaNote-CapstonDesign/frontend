"use client"
import dynamic from "next/dynamic";

const ExcalidrawWrapper = dynamic(
  async () => (await import("./ExcalidrawWrapper")).default,
  {
    ssr: false,
  },
);

export default function DiagramRenderer({uuid}:{uuid:string}) {
  return (
    <div className={"w-full h-full"} key={uuid}>
      <ExcalidrawWrapper />
    </div>
  );
}