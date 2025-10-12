import { MoaFile } from "@/types/file";
import { FileDTO, FileTypeDTO, NoteDTO } from "@/types/dto";
import { cookies } from "next/headers";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

/**
 * 백엔드에 Get으로 API 호출하는 함수
 * @param location API 호출할 realative-location
 */
async function getRequest(location: string) {
  const url = `${SERVER_URL}${location}`;

  const cookie = (await cookies()).toString();

  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: {
      cookie,
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
 * 백엔드에 Post로 API 호출하는 함수
 * Stringfied된 JSON BODY 필요
 * @param location API 호출할 Relative Location
 * @param stringfiedBody 담을 Body
 */
async function postRequest(location: string, stringfiedBody?: string) {
  const cookie = (await cookies()).toString();

  const res = await fetch(`${SERVER_URL}${location}`, {
    method: "POST",
    credentials: "include",
    body: stringfiedBody,
    headers: {
      cookie,
      "Content-Type": "application/json",
    },
  });

  console.log(`postRequest[${res.status}]: ${location}`);

  if (!res.ok) {
    return null;
  }

  if (!res.body) {
    return true;
  }

  return await res.json();
}

// TODO 장기적으로 백엔드에서 지원할 경우 user 삭제
/**
 * MoaFile 을 디렉토리 구조로 네스팅하여 반환
 *
 * @param fileId 자식 구조를 가져올 파일들, null 이나 ''등으로 지정 안할 경우 루트부터
 * @param user 유저 ID
 */
export async function getFileList(fileId: string | null, user: User) {
  try {
    let location = "";

    if (fileId) {
      location = `/api/files/list/${fileId}?user=${user.id}`;
    } else {
      location = `/api/files/list?user=${user.id}`; // 루트 파일
    }

    const data = await getRequest(location);

    let fileDTOs: FileDTO[] = [];

    try {
      fileDTOs = data as FileDTO[];
    } catch {
      fileDTOs = [];
    }

    const files: Array<MoaFile> = [];

    for (const fileDTO of fileDTOs) {
      if (fileDTO.type == FileTypeDTO.DIRECTORY) {
        // 디렉토리
        const children = await getFileList(fileDTO.id, user);
        files.push({
          id: fileDTO.id,
          type: fileDTO.type,
          name: fileDTO.name,
          children: children,
          githubImported: fileDTO.githubImported,
        });
      } else if (fileDTO.type == FileTypeDTO.DOCUMENT) {
        // 문서 파일
        files.push({
          id: fileDTO.id,
          name: fileDTO.name,
          type: fileDTO.type,
          githubImported: fileDTO.githubImported,
        });
      }
    }

    return files;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error);
    } else {
      console.log(String(error));
    }

    return [];
  }
}

/**
 * 특정 파일 하나의 데이터 조회
 * @param fileId 조회할 파일 id
 * @param user
 */
export async function getFile(fileId: string, user: User) {
  try {
    const location = `/api/files/metadata/${fileId}?user=${user.id}`;
    const data = await getRequest(location);
    if (!data) {
      return null;
    }
    const fileDTO = data as FileDTO;

    return {
      id: fileDTO.id,
      type: fileDTO.type,
      name: fileDTO.name,
      githubImported: fileDTO.githubImported,
    } as MoaFile;
  } catch (error: unknown) {
    console.log(error);
    return null;
  }
}

/**
 * 파일 생성, 루트에 생성할 경우 parentId는 비워둘 것
 * @param name
 * @param type
 * @param parentId
 * @param user
 */
export async function createFile(
  name: string,
  type: FileTypeDTO,
  parentId: string | null,
  user: User
) {
  let location = "";
  if (parentId) {
    location = `/api/files/create/${parentId}?user=${user.id}`;
  } else {
    location = `/api/files/create?user=${user.id}`;
  }

  const body = {
    name: name,
    type: type,
  };

  const result = await postRequest(location, JSON.stringify(body));

  if (!result) {
    return null;
  }

  const fileDTO = result as FileDTO;

  return {
    id: fileDTO.id,
    type: fileDTO.type,
    name: fileDTO.name,
    githubImported: fileDTO.githubImported,
  } as MoaFile;
}

export async function deleteFile(fileId: string, user: User) {
  const location = `/api/files/delete/${fileId}?user=${user.id}`;

  const result = await postRequest(location, JSON.stringify(null));

  return !!result;
}

/**
 * 파일 수정
 * @param file
 * @param user
 */
export async function editFile(file: MoaFile, user: User) {
  const fileDTO = await getFile(file.id, user);
  if (!fileDTO) {
    return false;
  }
  fileDTO.type = file.type;
  fileDTO.name = file.name;

  const location = `/api/files/edit/${file.id}?user=${user.id}`;
  return await postRequest(location, JSON.stringify(fileDTO));
}

/**
 * 문서의 메타데이터와 세그먼트 메타데이터 리스트 가져오기
 * @param file
 * @param user
 */
export async function getNoteMeta(file: MoaFile, user: User) {
  const location = `/api/notes/metadata/${file.id}?user=${user.id}`;

  const res = await fetch(`${SERVER_URL}${location}`, {
    credentials: "include",
  });

  return (await res.json()) as NoteDTO;
}

// TODO
/**
 * 문서의 텍스트 가져오기
 * @param file
 * @param user
 */
export async function getNoteText(file: MoaFile, user: User) {
  const location = `/api/notes/text/${file.id}?user=${user.id}`;

  const cookie = (await cookies()).toString();

  const res = await fetch(`${SERVER_URL}${location}`, {
    credentials: "include",
    headers: {
      cookie,
    },
  });

  const data = await res.json();

  return {
    note: data.note,
  };
}

// TODO
/**
 * 문서의 다이어그램을 가져오기
 * @param file
 * @param user
 */
export async function getNoteDiagram(file: MoaFile, user: User) {
  const location = `/api/notes/diagram/${file.id}?user=${user.id}`;

  const cookie = (await cookies()).toString();

  const res = await fetch(`${SERVER_URL}${location}`, {
    credentials: "include",
    headers: {
      cookie,
    },
  });

  const data = await res.json();

  return data as NoteDTO;
}
