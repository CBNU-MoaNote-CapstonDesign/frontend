"use client";
import { MoaFile } from "@/types/file";
import {
  FileDTO,
  FileTypeDTO,
  NoteDTO,
  PermissionDTO,
  Collaborator,
} from "@/types/dto";
import { Language } from "@/types/note";
import { UUID } from "node:crypto";

const getServerUrl = () => process.env.NEXT_PUBLIC_SERVER_URL ?? "";

/**
 * 백엔드에 GET으로 API 호출하는 함수 (client-side)
 * @param location API 호출할 relative-location
 */
async function getRequest(location: string) {
  const url = `${getServerUrl()}${location}`;

  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  console.log(`getRequest[${res.status}]: ${location}`);

  if (!res.ok) {
    return null;
  }

  if (!res.body) {
    return true;
  }

  return await res.json();
}

/**
 * 백엔드에 POST로 API 호출하는 함수 (client-side)
 * @param location API 호출할 relative-location
 * @param stringifiedBody JSON stringified body
 * @return 응답 본문이 있으면 파싱된 JSON, 그렇지 않은 경우 요청 성공 여부 (true/false)
 */
async function postRequest(location: string, stringifiedBody?: string) {
  console.log("post요청 location:", location);
  console.log("post요청 body:", stringifiedBody);

  const res = await fetch(`${getServerUrl()}${location}`, {
    method: "POST",
    credentials: "include",
    body: stringifiedBody,
    headers: {
      "Content-Type": "application/json",
    },
  });

  console.log(`postRequest[${res.status}]: ${location}`);


  // 본문이 있으면 json 파싱
  const responseBody = await res.json();
  if (!responseBody)
    return res.ok;
  else
    return responseBody;
}

export interface GetFileTreeOptions {
  /**
   * 하위 디렉토리를 재귀적으로 로드할지 여부.
   * `false`일 경우 바로 아래 자식만 로드합니다.
   */
  recursive?: boolean;
}

/**
 * Normalizes raw file type values returned by the backend to the numeric enum representation.
 * 일부 API에서는 enum의 문자열 키를, 다른 API에서는 숫자 값을 반환하므로 이를 통일합니다.
 *
 * @param type 서버에서 전달된 파일 타입 값
 */
function normalizeFileType(type: FileDTO["type"] | string): FileTypeDTO {
  if (typeof type === "string") {
    const enumValue = (FileTypeDTO as Record<string, FileTypeDTO | string>)[type];
    if (typeof enumValue === "number") {
      return enumValue;
    }

    const parsed = Number.parseInt(type, 10);
    if (!Number.isNaN(parsed)) {
      return parsed as FileTypeDTO;
    }
  }

  return type as FileTypeDTO;
}

/**
 * FileDTO를 MoaFile로 변환합니다.
 * @param dto 변환할 DTO
 */
function mapDtoToMoaFile(dto: FileDTO): MoaFile {
  const fileTypeDTO = normalizeFileType(dto.type);

  return {
    id: dto.id,
    name: dto.name,
    type: fileTypeDTO,
    children: fileTypeDTO === FileTypeDTO.DIRECTORY ? [] : undefined,
    githubImported: dto.githubImported,
  } satisfies MoaFile;
}

function getParentId(dto: FileDTO) {
  return dto.dir as unknown as string | null;
}

function buildTreeFromDtos(fileDTOs: FileDTO[], parentId: string | null): MoaFile[] {
  return fileDTOs
    .filter((dto) => {
      const parent = getParentId(dto);
      return parentId === null ? parent === null : parent === parentId;
    })
    .map((dto) => {
      const node = mapDtoToMoaFile(dto);
      if (node.type === FileTypeDTO.DIRECTORY) {
        node.children = buildTreeFromDtos(fileDTOs, String(dto.id));
      }
      return node;
    });
}

export async function getChildrenList(
    directoryId: string,
    user: User,
    options?: GetFileTreeOptions
): Promise<FileDTO[]> {
  const recursive = options?.recursive ?? false;
  const location = `/api/files/list/${directoryId}?user=${user.id}&recursive=${recursive}`;
  const data = await getRequest(location);
  let fileDTOs: FileDTO[];
  try {
    fileDTOs = data as FileDTO[];
    fileDTOs.map((dto) => { dto.type = normalizeFileType(dto.type); });
  } catch {
    fileDTOs = [];
  }
  return fileDTOs;
}

/**
 * 디렉터리 하위의 파일 목록을 조회합니다.
 * @param directoryId 조회할 디렉터리 ID
 * @param user 유저 정보
 * @param options 조회 옵션
 */
export async function listDirectoryChildren(
  directoryId: string,
  user: User,
  options?: GetFileTreeOptions
) {
  const fileDTOs = await getChildrenList(directoryId, user, options);

  if (options?.recursive) {
    return buildTreeFromDtos(fileDTOs, directoryId);
  }

  const children: MoaFile[] = [];
  for (const fileDTO of fileDTOs) {
    if (fileDTO.id === directoryId) continue;

    const fileTypeDTO = normalizeFileType(fileDTO.type);

    if (fileTypeDTO === FileTypeDTO.DIRECTORY) {
      const childDirectory = mapDtoToMoaFile(fileDTO);
      childDirectory.children = [];
      children.push(childDirectory);
    } else if (fileTypeDTO === FileTypeDTO.DOCUMENT) {
      children.push(mapDtoToMoaFile(fileDTO));
    }
  }

  return children;
}

/**
 * MoaFile을 디렉토리 구조로 네스팅하여 반환합니다.
 * @param file 가져올 파일 (루트부터 가져오려면 null)
 * @param user 유저 정보
 * @param options 조회 옵션
 */
export async function getFileTree(
  file: MoaFile | null,
  user: User,
  options?: GetFileTreeOptions
) {
  const recursive = options?.recursive ?? true;

  try {
    if (!file) {
      const rootLocation = `/api/files/list?user=${user.id}&recursive=${recursive}`;
      const rootData = await getRequest(rootLocation);

      let rootFileDTOs: FileDTO[] = [];
      try {
        rootFileDTOs = rootData as FileDTO[];
      } catch {
        rootFileDTOs = [];
      }

      const rootDto = rootFileDTOs.find((fileDTO) => fileDTO.dir === null);
      if (!rootDto) {
        return null;
      }

      const root = mapDtoToMoaFile(rootDto);
      if (recursive) {
        root.children = buildTreeFromDtos(rootFileDTOs, String(root.id));
      } else {
        root.children = await listDirectoryChildren(root.id, user, options);
      }
      return root;
    }

    const targetFile: MoaFile = {
      id: file.id,
      name: file.name,
      type: file.type,
      githubImported: file.githubImported,
      children: [],
    };
    targetFile.children = await listDirectoryChildren(file.id, user, options);
    return targetFile;
  } catch (error: unknown) {
    console.error(error);
    return null;
  }
}

/**
 * 특정 파일 하나의 데이터 조회
 * @param fileId 조회할 파일 ID
 * @param user 유저 ID
 */
export async function getFile(fileId: string, user: User) {
  try {
    const location = `/api/files/metadata/${fileId}?user=${user.id}`;
    const data = await getRequest(location);
    if (!data) return null;

    const fileDTO = data as FileDTO;
    return {
      id: fileDTO.id,
      type: normalizeFileType(fileDTO.type),
      name: fileDTO.name,
      githubImported: fileDTO.githubImported,
    } as MoaFile;
  } catch (error: unknown) {
    console.error(error);
    return null;
  }
}

/**
 * 파일 생성, 루트에 생성할 경우 parentId는 null
 * @param name 파일명
 * @param type 파일타입
 * @param parentId 부모 폴더 ID
 * @param user 유저 ID
 */
export async function createFile(
  name: string,
  type: FileTypeDTO,
  parentId: string | null,
  user: User,
  codeLanguage?: Language | null
) {
  const location = parentId
    ? `/api/files/create/${parentId}?user=${user.id}`
    : `/api/files/create?user=${user.id}`;

  const body = codeLanguage ? {
    name,
    type,
    isCode: true,
    language: codeLanguage.value,
  } : {
    name,
    type
  };

  const result = await postRequest(location, JSON.stringify(body));
  if (!result) return null;

  const fileDTO = result as FileDTO;
  return {
    id: fileDTO.id,
    type: normalizeFileType(fileDTO.type),
    name: fileDTO.name,
  } as MoaFile;
}

/**
 * 파일 삭제
 * @param fileId 삭제할 파일 ID
 * @param user 유저 ID
 */
export async function deleteFile(fileId: string, user: User) {
  const location = `/api/files/delete/${fileId}?user=${user.id}`;
  try {
    await postRequest(location, JSON.stringify({}));
    return true;
  } catch (error: unknown) {
    console.error(error);
    return false;
  }
}

/**
 * 파일 수정
 * @param file 수정할 MoaFile 객체
 * @param parentId ""이면 그대로 두기
 * @param user 유저 ID
 */
export async function editFile(file: MoaFile, parentId: string, user: User) {
  // 파일 정보 불러오기
  const metaLocation = `/api/files/metadata/${file.id}?user=${user.id}`;
  const metadata = await getRequest(metaLocation);
  if (!metadata) return false;

  const fileDTO = metadata as FileDTO;

  if (!fileDTO) return false;

  fileDTO.type = file.type;
  fileDTO.name = file.name;
  if (parentId) {
    fileDTO.dir = parentId as UUID;
  }

  const location = `/api/files/edit/${file.id}?user=${user.id}`;
  const data = await postRequest(location, JSON.stringify(fileDTO));
  return !!data;
}

/**
 * 문서 메타데이터와 세그먼트 메타데이터 리스트 가져오기
 * @param file MoaFile 객체
 * @param user 유저 ID
 */
export async function getNoteMeta(file: MoaFile, user: User) {
  const location = `/api/notes/metadata/${file.id}?user=${user.id}`;
  const res = await fetch(`${getServerUrl()}${location}`, {
    credentials: "include",
  });

  return (await res.json()) as NoteDTO;
}

/**
 * 문서 텍스트 가져오기
 * @param file MoaFile 객체
 * @param user 유저 ID
 */
export async function getNoteText(file: MoaFile, user: User) {
  const location = `/api/notes/text/${file.id}?user=${user.id}`;
  const res = await fetch(`${getServerUrl()}${location}`, {
    credentials: "include",
  });
  const data = await res.json();

  return { note: data.note };
}

/**
 * 문서 다이어그램 가져오기
 * @param file MoaFile 객체
 * @param user 유저 ID
 */
export async function getNoteDiagram(file: MoaFile, user: User) {
  const location = `/api/notes/diagram/${file.id}?user=${user.id}`;
  const res = await fetch(`${getServerUrl()}${location}`, {
    credentials: "include",
  });

  const data = await res.json();
  return data as NoteDTO;
}

export async function invite(
  fileId: string,
  user: User,
  collaboratorName: string,
  permission: PermissionDTO
) {
  const location = `/api/files/share/${fileId}?user=${user.id}`;
  const body = {
    username: collaboratorName,
    permission: permission,
  };
  try {
    await postRequest(location, JSON.stringify(body));
    return true;
  } catch {
    return false;
  }
}

export async function getCollaborators(
  fildId: string,
  user: User
): Promise<Collaborator[]> {
  const location = `/api/files/collaborators/${fildId}?user=${user.id}`;
  try {
    const data = await getRequest(location);
    return data as Collaborator[];
  } catch {
    return [];
  }
}

/**
 * 선택한 문서의 협업자 권한을 해제합니다.
 * @param fileId 협업 해제 대상 문서 ID
 * @param user 요청을 수행하는 사용자
 * @param targetUsername 협업 해제 대상 사용자 username
 * @returns 요청 성공 여부
 */
export async function unshare(
    fileId: string,
    user: User,
    targetUsername: string
): Promise<boolean> {
  const location = `/api/files/unshare/${fileId}?user=${user.id}&targetUser=${targetUsername}`;

  try {
    const response = await fetch(`${getServerUrl()}${location}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.ok;
  } catch (error) {
    console.error("Failed to unshare collaborator", error);
    return false;
  }
}

export async function getSharedFiles(user: User): Promise<MoaFile[]> {
  const location = `/api/files/all/${user.id}`;
  try {
    const data = await getRequest(location);
    const fileDTOs = data as FileDTO[];

    console.log("공유받은 파일들 ");
    console.log(fileDTOs);

    const files: MoaFile[] = [];

    for (const fileDTO of fileDTOs) {
      if (fileDTO.owner.id == user.id) continue;
      files.push({
        id: fileDTO.id,
        name: fileDTO.name,
        type: normalizeFileType(fileDTO.type),
        githubImported: fileDTO.githubImported,
      } as MoaFile);
    }
    console.log(files);
    return files;
  } catch {
    return [];
  }
}

export async function addNoteSegment(fileId: string, type: number, user: User) {
  const location = `/api/notes/${fileId}/add/segment?user=${user.id}`;
  const body = {
    type: type,
  };
  return await postRequest(location, JSON.stringify(body));
}
