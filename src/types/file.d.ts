import { UUID } from "node:crypto";
import { FileTypeDTO } from "@/types/dto";

export interface MoaFile {
  id: UUID;
  name: string;
  type: FileTypeDTO;
  children?: MoaFile[];
  githubImported?: boolean;
}

export interface Segment {}
