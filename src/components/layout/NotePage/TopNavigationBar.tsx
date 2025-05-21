'use client';

export default function TopNavigationBar() {
    // 예시 공유 편집자 프로필 배열 (실제 데이터로 대체 가능)
    const sharedUsers = [
        "/profile_img/shared_profileA.png",
        "/profile_img/shared_profileB.png",
        "/profile_img/shared_profileC.png",
        "/profile_img/shared_profileD.png",
    ];
    // 예시 본인 프로필 (실제 데이터로 대체 가능)
    const myProfile = "/profile_img/my_profile.png";

    return (
        <header className="fixed top-0 left-0 w-full h-24 bg-gradient-to-r from-[#f0f8fe] to-[#e0e7ff] z-50 flex items-center px-8 shadow-md">
            {/* 로고 및 제목 */}
            <div className="flex items-center gap-4 min-w-[200px]">
                <img
                    src="/moanote_logo/logo1.png"
                    className="w-12 h-12 object-contain"
                    alt="logo"
                />
                <span className="text-2xl font-bold text-[#186370] tracking-tight select-none">
                    모아노트
                </span>
            </div>

            {/* 중앙 블록: 문서 제목 및 블록 타입 */}
            <div className="flex-1 flex flex-col items-center">
                <span className="text-lg md:text-xl font-semibold text-[#333] mb-1 truncate max-w-[60vw]">
                    현재 문서 제목
                </span>
                <div className="flex gap-4">
                    <span
                        className="
                            px-4
                            py-1
                            rounded-full
                            bg-[#f3f4f6]
                            text-base
                            font-medium
                            text-[#7E40F9]
                            shadow-sm
                            hover:bg-[#dbeafe]
                            cursor-pointer
                            transition
                        "
                    >
                        디자인 블록
                    </span>
                    <span
                        className="
                            px-4
                            py-1
                            rounded-full
                            bg-[#f3f4f6]
                            text-base
                            font-medium
                            text-[#29E6F0]
                            shadow-sm
                            hover:bg-[#dbeafe]
                            cursor-pointer
                            transition
                        "
                    >
                        텍스트 블록
                    </span>
                </div>
            </div>

            {/* 공유자 프로필 */}
            <div className="flex items-center gap-3 mr-8 cursor-pointer">
                {sharedUsers.map((src, idx) => (
                    <img
                        key={idx}
                        src={src}
                        alt={`공유자${idx + 1}`}
                        className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover -ml-2 first:ml-0 bg-gray-200"
                        style={{ zIndex: 10 - idx }}
                    />
                ))}
            </div>

            {/* 더보기 버튼 및 본인 프로필 */}
            <div className="flex items-center gap-6 min-w-[120px] justify-end cursor-pointer">
                <button
                    className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-[#e0e7ff] transition"
                    title="더보기"
                >
                    <span className="text-2xl font-bold text-[#444] cursor-pointer">…</span>
                </button>
                <img
                    src={myProfile}
                    alt="내 프로필"
                    className="w-10 h-10 rounded-full border-2 border-[#69F179] shadow-sm object-cover bg-gray-200"
                />
            </div>
        </header>
    );
}