import { ExcalidrawElement } from "@excalidraw/excalidraw/element/types";
// import { AppState } from "@excalidraw/excalidraw";

export interface Diagram {
  uuid: string;
  title: string;
  elements: Array<ExcalidrawElement>;
}
