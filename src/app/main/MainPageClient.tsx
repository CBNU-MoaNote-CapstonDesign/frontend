'use client';

import { useState } from "react";
import TopNavigationBar from "@/components/layout/NotePage/TopNavigationBar";
import NoteExplorer from "@/components/layout/NotePage/NoteExplorer";
import NoteUI from "@/components/layout/NotePage/NoteUI";
import { Note } from "@/types/note";

interface MainPageClientProps {
  user: User;
  notes: Note[];
  selectedNoteId?: string;
}

export default function MainPageClient({ user, notes, selectedNoteId }: MainPageClientProps) {
  const selectedNote = notes.find(note => note.id === selectedNoteId);

  return (
    <div className="flex flex-col justify-start w-full relative gap-[59px] bg-[#f0f8fe]">
      <TopNavigationBar user={user} notes={notes} selectedNoteId={selectedNoteId ?? ""} />
      <div className="flex flex-row w-full pt-24">
        <NoteExplorer user={user} notes={notes} selectedNoteId={selectedNoteId ?? ""} />

        {/* 노트가 선택되지 않았을 때 안내 메시지 표시 */}
        {selectedNote ? (
          <NoteUI user={user} note={selectedNote} />
        ) : (
          <main className="flex-1 flex items-center justify-center text-[#888] text-xl">
            노트를 만들거나 선택하세요
          </main>
        )}
      </div>
    </div>
  );
}