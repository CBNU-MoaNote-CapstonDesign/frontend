import {cookies} from "next/headers";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

/**
 * Server-Side : 현재 로그인 된 유저 정보 가져오기
 */
export async function fetchCurrentUserServerSide(): Promise<User | null>{
    if (typeof window !== "undefined") {
        throw new Error("fetchServerUser must be called on the server only");
    }

    const cookie = (await cookies()).toString();

    const res = await fetch(`${SERVER_URL}/api/users/me`, {
        headers: {
            cookie,
        },
    });

    try {
        return await res.json() as User;
    } catch {
        return null;
    }
}


