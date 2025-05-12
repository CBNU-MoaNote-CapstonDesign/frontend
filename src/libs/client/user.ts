const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

/**
 * Client-Side : 현재 로그인 된 유저 정보 가져오기
 */
export async function fetchCurrentUser() {
    const res = await fetch(`${SERVER_URL}/api/users/me`, {
        credentials: "include",
    });

    if (!res.ok) return null;

    try {
        return await res.json() as User;
    } catch {
        return null;
    }
}