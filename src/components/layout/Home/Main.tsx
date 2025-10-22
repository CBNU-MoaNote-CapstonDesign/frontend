"use client";

import { useRouter } from "next/navigation";

function StartButton({ text, onClick }: { text: string; onClick: () => void }) {
  return (
    <button
      className="mt-6 bg-[#186370] hover:bg-[#1e7a8a] text-white px-10 py-3 text-2xl font-semibold rounded-full shadow-md transition cursor-pointer"
      onClick={onClick}
    >
      {text}
    </button>
  );
}

export default function Main() {
  const router = useRouter();

  const handleStartButtonClick = () => {
    router.push("/login");
  };

  return (
    <div className="w-full max-w-screen-xl px-4 mt-32 flex flex-col lg:flex-row items-center justify-between gap-10">
      <div className="flex flex-col gap-8">
        <p className="text-5xl md:text-6xl font-bold text-[#186370] leading-tight typing-effect">
          개발자들을 위한
          <br />
          웹 코드 에디터
        </p>
        <p className="text-5xl md:text-6xl font-light text-black typing-effect">
          코드 포레스트
        </p>
        <StartButton text="시작하기 →" onClick={handleStartButtonClick} />
      </div>
      <img
        src="/home_img/memo.png"
        className="w-64 md:w-80 object-contain drop-shadow-lg"
        alt="memo"
      />
    </div>
  );
}
