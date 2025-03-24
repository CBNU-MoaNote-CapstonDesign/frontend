export default function TopBar({title}:{title:string}) {
  return <nav className="w-full bg-[#9B2C5D] text-white">
    <div className="flex items-center justify-between px-4 py-2">
      {/* 왼쪽 햄버거 버튼 */}
      <button className="text-white text-2xl focus:outline-none">
        ☰
      </button>

      {/* 문서 이름 */}
      <a className="font-bold ps-3 text-left text-white text-lg" href="#">
        {title}
      </a>

      {/* 우측 MOANOTE 로고 */}
      <div className="bg-black/50 text-white font-bold text-xl px-3 py-1 rounded">
        MOANOTE
      </div>
    </div>
  </nav>
}