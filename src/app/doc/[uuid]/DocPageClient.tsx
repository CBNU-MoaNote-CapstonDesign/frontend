'use client';

import TopNavigationBar from "@/components/layout/NotePage/TopNavigationBar";
import NoteExplorer from "@/components/layout/NotePage/NoteExplorer";
import NoteUI from "@/components/layout/NotePage/NoteUI";
import { Note } from "@/types/note";

export default function DocPageClient({
  user,
  notes,
  selectedNoteId,
}: {
  user: User;
  notes: Note[];
  selectedNoteId: string;
}) {
  const selectedNote = notes.find(note => note.id === selectedNoteId);

  return (
    <div className="flex flex-col justify-start w-full relative gap-[59px] bg-[#f0f8fe]">
      <TopNavigationBar user={user} notes={notes} selectedNoteId={selectedNoteId} />
      <div className="flex flex-row w-full">
        <NoteExplorer
          user={user}
          notes={notes}
          selectedNoteId={selectedNoteId}
        />
        <NoteUI user={user} note={selectedNote} />
      </div>
    </div>
  );
}