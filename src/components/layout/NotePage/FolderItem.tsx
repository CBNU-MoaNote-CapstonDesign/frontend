import {
  BsChevronDown,
  BsChevronRight,
  BsFolderFill,
  BsPencil,
} from "react-icons/bs";
import { MoaFile } from "@/types/file";

export default function FolderItem({
  folder,
  open,
  onToggle,
  onEdit,
  children,
}: {
  folder: MoaFile;
  open: boolean;
  onToggle: () => void;
  onEdit: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-2 ml-2">
      <div className="flex items-center gap-2 px-2 py-1 font-semibold text-[#186370] bg-[#e0e7ff] rounded select-none">
        <button
          className="flex items-center justify-center w-6 h-6 rounded transition cursor-pointer hover:bg-[#dbeafe] hover:scale-110 mr-1"
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          title={open ? "폴더 닫기" : "폴더 열기"}
          type="button"
        >
          {open ? (
            <BsChevronDown className="w-4 h-4" />
          ) : (
            <BsChevronRight className="w-4 h-4" />
          )}
        </button>
        <BsFolderFill className="w-5 h-5" />
        <span>{folder.name}</span>
        <button
          className="ml-auto p-1 rounded hover:bg-[#dbeafe] hover:scale-110 transition cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          title="폴더 수정"
          type="button"
        >
          <BsPencil className="w-4 h-4 text-[#186370]" />
        </button>
      </div>
      {open && <div className="ml-6 mt-1 space-y-1">{children}</div>}
    </div>
  );
}
