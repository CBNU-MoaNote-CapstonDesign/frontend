import { fetchCurrentUserServerSide } from "@/libs/server/user";
import { fetchNotesServerSide } from "@/libs/server/note";

import TopNavigationBar from "@/components/layout/NotePage/TopNavigationBar";
import NoteExplorer from "@/components/layout/NotePage/NoteExplorer";
import NoteUI from "@/components/layout/NotePage/NoteUI";

export default async function MainPage() {
  const user = await fetchCurrentUserServerSide();

  if (!user) {
    return <div>로그인 필요</div>;
  }

  const notes = await fetchNotesServerSide(user.id);
  const noteProps = { user, notes };

  return (
    <div className="flex flex-col justify-start w-full relative gap-[59px] bg-[#f0f8fe]">
      <TopNavigationBar {...noteProps} />
      <div className="flex flex-row w-full">
        <NoteExplorer {...noteProps} />
        <NoteUI />
      </div>
    </div>
  );
}