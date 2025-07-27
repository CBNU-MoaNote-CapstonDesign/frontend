import DocumentTitle from "@/components/document/DocumentTitle";
import { useEffect, useState } from "react";
import { getFile } from "@/libs/client/file";
import { MoaFile } from "@/types/file";
import TreeBasedDocumentRenderer from "@/components/document/TreeBasedDocumentRenderer";

export default function NoteUI({
  user,
  noteId,
}: {
  user: User;
  noteId?: string;
}) {
  const [note, setNote] = useState<MoaFile | null>(null);

  useEffect(() => {
    if (noteId) {
      getFile(noteId, user).then((file) => {
        setNote(file);
      });
    }
  }, [user, noteId]);

  if (!noteId) {
    return (
      <main className="flex-1 h-[calc(100vh-6rem)] ml-0 bg-[#f8fbff] rounded-l-2xl shadow-md overflow-auto flex flex-col items-center z-30">
        <div className="w-full max-w-4xl min-h-full flex flex-col gap-8 px-8 py-10 items-center justify-center">
          <span className="text-lg text-gray-400">
            노트를 만들거나 선택하세요
          </span>
        </div>
      </main>
    );
  }

  return (
    <main
      className="
        flex-1
        h-[calc(100vh-6rem)]
        ml-0
        bg-[#f8fbff]
        rounded-l-2xl
        shadow-md
        overflow-auto
        flex
        flex-col
        items-center
        z-30
      "
    >
      <div className="w-full max-w-4xl min-h-full flex flex-col gap-8 px-8 py-10">
        <DocumentTitle title={note ? note.name : ""} />
        <TreeBasedDocumentRenderer user={user} uuid={note?.id as string} />
      </div>
    </main>
  );
}
