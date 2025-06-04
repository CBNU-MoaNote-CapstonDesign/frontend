import { fetchCurrentUserServerSide } from "@/libs/server/user";
import { fetchNotesServerSide } from "@/libs/server/note";
import MainPageClient from "./MainPageClient";

export default async function MainPage() {
  const user = await fetchCurrentUserServerSide();

  if (!user) {
    return <div>로그인 필요</div>;
  }

  const notes = await fetchNotesServerSide(user.id);

  // selectedNoteId를 빈 문자열로 전달
  return <MainPageClient user={user} notes={notes ?? []} selectedNoteId={""} />;
}