import { ExcalidrawElement } from "@excalidraw/excalidraw";
//import { AppState } from "@excalidraw/excalidraw";

export interface Diagram {
  uuid: string,
  title: string,
  elements: Array<ExcalidrawElement>
}