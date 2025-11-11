import RepositoryAskClient from "@/app/main/ask/RepositoryAskClient";
import { fetchCurrentUserServerSide } from "@/libs/server/user";

/**
 * Server component for the repository question page that loads the authenticated user.
 * @returns Repository question page or a fallback when the user is not available.
 */
export default async function RepositoryAskPage() {
  const user = await fetchCurrentUserServerSide();

  if (!user) {
    return <div className="p-6 text-center text-slate-600">로그인이 필요합니다.</div>;
  }

  return <RepositoryAskClient user={user} />;
}