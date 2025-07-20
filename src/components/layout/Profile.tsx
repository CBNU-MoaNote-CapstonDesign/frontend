// 현재 사용되지 않는 컴포넌트

export default function Profile({ name }: { name: string }) {
  // 이름의 첫 글자 추출 (없으면 ?)
  const initial = name ? name[0].toUpperCase() : "?";

  return (
    <div
      className="w-12 h-12 flex flex-col items-center justify-center group"
      title="내 프로필"
    >
      {/* 원형 프로필 (이름 앞글자) */}
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#7E40F9] to-[#186370] flex items-center justify-center text-xl font-bold text-white shadow border-2 border-white transition hover:scale-110">
        {initial}
      </div>
    </div>
  );
}