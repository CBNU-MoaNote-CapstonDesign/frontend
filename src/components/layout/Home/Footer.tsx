"use client";

import { useRouter } from "next/navigation";

function SeeMoreButton({
  text,
  onClick,
}: {
  text: string;
  onClick: () => void;
}) {
  return (
    <button
      className="mt-6 bg-[#186370] hover:bg-[#1e7a8a] text-white px-10 py-3 text-2xl font-semibold rounded-full shadow-md transition cursor-pointer"
      onClick={onClick}
    >
      {text}
    </button>
  );
}

export default function Footer() {
  const router = useRouter();

  // 더 알아보기 버튼 클릭 시 /seemore으로 이동(/more 페이지 미구현)
  const handleSeeMoreButtonClick = () => {
    router.push("/seemore");
  };

  return (
    <div className="w-full max-w-screen-xl px-4 mt-32 flex flex-col lg:flex-row items-center justify-between gap-10">
      <div className="flex flex-col gap-10">
        <p className="text-5xl md:text-6xl font-bold text-[#186370] leading-tight">
          코드 포레스트와 함께<br />
          즐겁게 개발해 보아요!<br />
        </p>
        <SeeMoreButton text="더 알아보기" onClick={handleSeeMoreButtonClick} />
      </div>
    </div>
  );
}
