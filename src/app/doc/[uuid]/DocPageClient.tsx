"use client";

import { useCallback, useEffect, useState } from "react";

import ChatMenu from "@/components/chat/ChatMenu";
import NoteExplorer from "@/components/layout/NotePage/NoteExplorer";
import NoteUI from "@/components/layout/NotePage/NoteUI";
import TopNavigationBar from "@/components/layout/NotePage/TopNavigationBar";

export default function DocPageClient({
  user,
  selectedNoteId,
}: {
  user: User;
  selectedNoteId: string;
}) {
  const [activeNoteId, setActiveNoteId] = useState<string>(selectedNoteId);

  useEffect(() => {
    setActiveNoteId(selectedNoteId);
  }, [selectedNoteId]);

  const handleSelectNote = useCallback((noteId: string) => {
    setActiveNoteId(noteId);

    if (typeof window !== "undefined") {
      const nextUrl = `/doc/${noteId}`;
      if (window.location.pathname !== nextUrl) {
        window.history.replaceState(null, "", nextUrl);
      }
    }
  }, []);

  const resolvedNoteId = activeNoteId || selectedNoteId;

  return (
    <div className="flex flex-col justify-start w-full relative gap-[59px] bg-[#f0f8fe]">
      <TopNavigationBar user={user} selectedNoteId={resolvedNoteId} />
      <div className="flex flex-row w-full pt-24">
        <NoteExplorer
          user={user}
          selectedNoteId={resolvedNoteId}
          onSelectNote={handleSelectNote}
        />
        <NoteUI user={user} noteId={resolvedNoteId} />
      </div>
      <ChatMenu uuid={"1234"} user={user} />
    </div>
  );
}
