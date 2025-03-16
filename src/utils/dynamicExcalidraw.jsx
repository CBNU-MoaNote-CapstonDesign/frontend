import dynamic from "next/dynamic";

// Excalidraw 및 serializeAsJSON을 동적으로 불러오기 (SSR 비활성화)
const Excalidraw = dynamic(
    () => import("@excalidraw/excalidraw").then((mod) => mod.Excalidraw),
    { ssr: false }
);

const serializeAsJSON = dynamic(
    () => import("@excalidraw/excalidraw").then((mod) => mod.serializeAsJSON),
    { ssr: false }
);

export { Excalidraw, serializeAsJSON };
