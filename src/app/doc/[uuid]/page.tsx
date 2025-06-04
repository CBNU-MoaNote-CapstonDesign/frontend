import { fetchCurrentUserServerSide } from "@/libs/server/user";
import { fetchNotesServerSide } from "@/libs/server/note";
import DocPageClient from "./DocPageClient";

export default async function DocumentPage(props: { params: { uuid: string } }) {
  const params = await props.params; // params를 await로 받아옴
  const uuid = params.uuid;

  const user = await fetchCurrentUserServerSide();
  if (!user) return <div>로그인 필요</div>;

  const notes = await fetchNotesServerSide(user.id);

  return <DocPageClient user={user} notes={notes ?? []} selectedNoteId={uuid} />;
}