import { MoaFile } from "@/types/file";
import { BsPencil } from "react-icons/bs";

export default function NoteItem({
  note,
  selected,
  onEdit,
  onClick,
}: {
  note: MoaFile;
  onEdit: () => void;
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
        {note.name}
      </span>
      <button
        className="ml-auto p-1 rounded hover:bg-[#dbeafe] hover:scale-110 transition cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          onEdit();
        }}
        title="노트 수정"
        type="button"
      >
        <BsPencil className="w-4 h-4 text-[#186370]" />
      </button>
    </div>
  );
}
