'use client';

import { useState } from "react";
import TopNavigationBar from "@/components/layout/NotePage/TopNavigationBar";
import NoteExplorer from "@/components/layout/NotePage/NoteExplorer";
import NoteUI from "@/components/layout/NotePage/NoteUI";
import { Note } from "@/types/note";

interface MainPageClientProps {
  user: User;
  notes: Note[];
}

export default function MainPageClient({ user, notes }: MainPageClientProps) {
  const [selectedNoteId, setSelectedNoteId] = useState(
    notes && notes.length > 0 ? notes[0].id : ""
  );
  const selectedNote = notes.find(note => note.id === selectedNoteId);

  return (
    <div className="flex flex-col justify-start w-full relative gap-[59px] bg-[#f0f8fe]">
      <TopNavigationBar user={user} notes={notes} selectedNoteId={selectedNoteId} />

      <div className="flex flex-row w-full">
        <NoteExplorer
          user={user}
          notes={notes}
          selectedNoteId={selectedNoteId}
          onSelectNote={setSelectedNoteId}
        />

        <NoteUI user={user} note={selectedNote} />
      </div>
    </div>
  );
}