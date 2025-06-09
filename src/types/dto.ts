import {UUID} from "node:crypto";

export interface FileDTO {
  id: UUID,
  name: string,
  owner: {id: UUID, name: string},
  type: FileTypeDTO,
  dir: UUID,
}

export enum FileTypeDTO {
  DOCUMENT,
  DIRECTORY,
}

export interface NoteDTO {
  file: FileDTO,
  segments: SegmentDTO[],
}

export interface SegmentDTO {
  id: UUID,
  type: "text" | "diagram",
}

export interface TextNoteSegmentDTO  {
  id: UUID,
  rootNode: TreeNodeDTO,
  nodes: TreeNodeDTO[]
}

export interface DiagramNoteSegment {
  id: UUID,
  state: LWWStateDTO,
}

export interface TreeNodeDTO {
  node: string,
  parentId: UUID,
  value: string,
}

export interface LWWStateDTO {
  timestamp: number,
  id: UUID,
  value : {content: string},
}




