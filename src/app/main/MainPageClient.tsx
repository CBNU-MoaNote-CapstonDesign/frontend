"use client";

import TopNavigationBar from "@/components/layout/NotePage/TopNavigationBar";
import NoteExplorer from "@/components/layout/NotePage/NoteExplorer";
import NoteUI from "@/components/layout/NotePage/NoteUI";

interface MainPageClientProps {
  user: User;
  selectedNoteId?: string;
}

export default function MainPageClient({
  user,
  selectedNoteId,
}: MainPageClientProps) {
  return (
    <div className="flex flex-col justify-start w-full relative gap-[59px] bg-[#f0f8fe]">
      <TopNavigationBar user={user} selectedNoteId={selectedNoteId ?? ""} />
      <div className="flex flex-row w-full pt-24">
        <NoteExplorer user={user} selectedNoteId={""} />
        <NoteUI user={user} noteId={selectedNoteId} />
      </div>
    </div>
  );
}
