import {cookies} from "next/headers";
import {Note} from "@/types/note";
import {NoteDTO} from "@/types/dto";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

/**
 * 특정 파일의 NoteDTO 를 불러오는 API
 *
 * @param fileId Note 데이터를 받아올 file 의 id
 * @param userId 요청을 보내는 유저의 id
 * @see NoteDTO
 */
export async function fetchNote(fileId: string, userId: string): Promise<NoteDTO | null> {
  const cookie = (await cookies()).toString();
  const res = await fetch(`${SERVER_URL}/api/notes/metadata/${fileId}?user=${userId}`, {
    method: "GET",
    credentials: "include",
    headers: {
      cookie,
      "Content-Type": "application/json"
    }
  });

  if (!res.ok) {
    return null;
  }

  return await res.json() as NoteDTO;
}

/**
 * fetchNotes
 * Client-Side
 * 해당 유저가 가진 노트 목록 가져오기
 *
 * @param userId 유저의 ID
 */
export async function fetchNotes(userId: string) {
  const res = await fetch(`${SERVER_URL}/api/notes/user/${userId}`, {
    credentials: "include",
  });

  if (!res.ok) return null;

  return await res.json();
}

/**
 * fetchNotesServerSide
 *
 * Server-Side
 * 해당 유저가 가진 노트 목록 가져오기
 *
 * @param userId 유저의 ID
 */
export async function fetchNotesServerSide(userId: string) {
  if (typeof window !== "undefined") {
    throw new Error("fetchNotesServerSide must be called on the server only");
  }

  const cookie = (await cookies()).toString();

  const res = await fetch(`${SERVER_URL}/api/notes/user/${userId}`, {
    headers: {
      cookie,
    },
  });

  if (!res.ok) return [];
  try {
    return await res.json() as Array<Note>;
  } catch {
    return [];
  }
}