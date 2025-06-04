import { Note } from "@/types/note";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { BsChevronLeft } from "react-icons/bs"; // 화살표 아이콘 추가

interface NoteExplorerProps {
  user: User;
  notes: Note[];
  selectedNoteId: string;
}

export default function NoteExplorer({
  user,
  notes,
  selectedNoteId,
}: NoteExplorerProps) {
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const asideRef = useRef<HTMLDivElement>(null);

  // 햄버거 버튼 클릭 시 NoteExplorer 열기
  const handleOpen = () => setOpen(true);
  // 닫기 버튼 클릭 시 NoteExplorer 닫기
  const handleClose = () => setOpen(false);

  return (
    <>
      {/* 햄버거 버튼: 닫혀있을 때만 표시 */}
      {!open && (
        <button
          className="fixed top-28 left-4 z-50 w-12 h-12 bg-white rounded-full shadow flex items-center justify-center hover:bg-[#e0f2ff] transition cursor-pointer"
          onClick={handleOpen}
          title="노트 목록 열기"
          aria-label="노트 목록 열기"
        >
          <RxHamburgerMenu className="w-7 h-7 text-[#186370]" />
        </button>
      )}

      {/* NoteExplorer 패널: open 상태일 때만 표시 */}
      {open && (
        <aside
          ref={asideRef}
          className="
            flex flex-col
            w-full max-w-xs
            h-[calc(100vh-6rem)]
            mt-24
            bg-[#e0f2ff]
            shadow-md
            rounded-r-2xl
            overflow-visible
            z-40
            transition-transform
            duration-300
            relative
          "
        >
          {/* 닫기 버튼: 우측 가운데에 < 화살표로 표시 */}
          <button
            className="absolute top-1/2 right-[-32px] z-50 w-12 h-12 bg-white rounded-full shadow flex items-center justify-center hover:bg-[#dbeafe] transition -translate-y-1/2 cursor-pointer"
            onClick={handleClose}
            title="노트 목록 닫기"
            aria-label="노트 목록 닫기"
            type="button"
          >
            <BsChevronLeft className="w-7 h-7 text-[#186370]" />
          </button>

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
                  onClick={() => router.push(`/doc/${note.id}`)}
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
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-[#888]">
                <span className="text-lg font-medium">노트가 없습니다.</span>
              </div>
            )}
          </div>
        </aside>
      )}
    </>
  );
}