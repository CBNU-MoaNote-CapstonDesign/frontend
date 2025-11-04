import { UUID } from "node:crypto";
import { FileTypeDTO, SegmentDTO } from "@/types/dto";

export interface MoaFile {
  id: UUID;
  name: string;
  type: FileTypeDTO;
  children?: MoaFile[];
  githubImported?: boolean;
}

export type Segment = SegmentDTO;
