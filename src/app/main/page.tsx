import { fetchCurrentUserServerSide } from "@/libs/server/user";

import TopNavigationBar from "@/components/layout/NotePage/TopNavigationBar"
import NoteExplorer from "@/components/layout/NotePage/NoteExplorer"
import NoteUI from "@/components/layout/NotePage/NoteUI"
// import AIChatBot from "@/components/layout/NotePage/AIChatBot"

export default async function MainPage() {
  const user = await fetchCurrentUserServerSide();

  if (!user) {
    return <div>
      로그인 필요
    </div>
  }

  return (
    <div className="flex flex-col justify-start w-full relative gap-[59px] bg-[#f0f8fe]">
      <TopNavigationBar />

      <div className="flex flex-row w-full">
        <NoteExplorer />
        <NoteUI />
      </div>

      {/* <AIChatBot /> */}
    </div>
  );
}