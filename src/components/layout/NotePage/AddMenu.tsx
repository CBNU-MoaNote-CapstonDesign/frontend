import { BsFileEarmarkPlus, BsFolderPlus } from "react-icons/bs";

export default function AddMenu({
  onAddNote,
  onAddFolder,
  onClose,
}: {
  onAddNote: () => void;
  onAddFolder: () => void;
  onClose?: () => void;
}) {
  return (
    <div className="absolute right-0 mt-2 w-32 bg-white rounded shadow z-50 flex flex-col">
      <button
        className="flex items-center gap-2 px-4 py-2 hover:bg-[#e0f2ff] transition cursor-pointer"
        onClick={() => {
          onAddNote();
          onClose && onClose();
        }}
      >
        <BsFileEarmarkPlus className="w-5 h-5" />
        노트 추가
      </button>
      <button
        className="flex items-center gap-2 px-4 py-2 hover:bg-[#e0f2ff] transition cursor-pointer"
        onClick={() => {
          onAddFolder();
          onClose && onClose();
        }}
      >
        <BsFolderPlus className="w-5 h-5" />
        폴더 추가
      </button>
    </div>
  );
}