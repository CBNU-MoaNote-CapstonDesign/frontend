import { Note } from "@/types/note";

export default function NoteItem({
  note,
  selected,
  onClick,
}: {
  note: Note;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <div
      className={`
        group
        flex items-center justify-between
        px-4 py-3
        rounded-xl
        shadow
        cursor-pointer
        transition
        ${selected ? "bg-[#dbeafe] font-bold" : "bg-white hover:bg-[#dbeafe]"}
      `}
      onClick={onClick}
    >
      <span className="text-base font-medium text-[#222] truncate">
        {note.id}
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
  );
}