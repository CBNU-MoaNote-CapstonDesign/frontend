import { fetchCurrentUserServerSide } from "@/libs/server/user";
import DocPageClient from "./DocPageClient";

export default async function DocumentPage(props: {
  params: Promise<{ uuid: string }>;
}) {
  const uuid = (await props.params).uuid;

  const user = await fetchCurrentUserServerSide();
  if (!user) return <div>로그인 필요</div>;

  return <DocPageClient user={user} selectedNoteId={uuid} />;
}
