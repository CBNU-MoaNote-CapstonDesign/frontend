import { Note } from "@/types/note";
import { useRouter } from "next/navigation";

interface NoteExplorerProps {
  user: User;
  notes: Note[];
  selectedNoteId: string;
  // onSelectNote: (id: string) => void;
}

export default function NoteExplorer({
  user,
  notes,
  selectedNoteId,
  // onSelectNote,
}: NoteExplorerProps) {
  const router = useRouter();

  return (
    <aside
      className="
        flex flex-col
        w-full max-w-xs
        h-[calc(100vh-6rem)]
        mt-24
        bg-[#e0f2ff]
        shadow-md
        rounded-r-2xl
        overflow-hidden
        z-40
      "
    >
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#b6d6f2] bg-[#e0f2ff]">
        <span className="text-xl font-bold text-[#186370] tracking-tight">내 노트</span>
        <button
          className="px-3 py-1 rounded-lg bg-[#186370] text-white text-sm font-semibold hover:bg-[#1e7a8a] transition cursor-pointer"
          title="노트 추가"
        >
          +
        </button>
      </div>

      {/* 노트 목록 표시 */}
      <div className="flex-1 overflow-y-auto px-2 py-4 space-y-2">
        {notes && notes.length > 0 ? (
          notes.map((note) => (
            <div
              key={note.id}
              className={`
                group
                flex items-center justify-between
                px-4 py-3
                rounded-xl
                shadow
                cursor-pointer
                transition
                ${selectedNoteId === note.id ? "bg-[#dbeafe] font-bold" : "bg-white hover:bg-[#dbeafe]"}
              `}
              // onClick={() => onSelectNote(note.id)}
              onClick={() => router.push(`/doc/${note.id}`)} // 링크 이동
            >
              {/* 노트 제목이 아지 없으므로 ID로 표시 */}
              <span className="text-base font-medium text-[#222] truncate">
                {/* note.title */note.id}
              </span>
              <svg
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="ml-2 opacity-0 group-hover:opacity-100 transition"
              >
                <path d="M9 6l6 6-6 6" stroke="#186370" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-[#888]">
            <span className="text-lg font-medium">노트가 없습니다.</span>
          </div>
        )}
      </div>
    </aside>
  );
}