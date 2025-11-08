import { UUID } from "node:crypto";
import { FileTypeDTO } from "@/types/dto";

export interface MoaFile {
  id: UUID;
  name: string;
  type: FileTypeDTO;
  children?: MoaFile[];
  githubImported?: boolean;
  /** 하위 파일 정보를 불러왔는지 여부 */
  childrenLoaded?: boolean;
}

export interface Segment {}
