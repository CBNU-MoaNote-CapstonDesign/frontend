'use client';

import { useRouter } from 'next/navigation';

function StartButton({ text, onClick }: { text: string, onClick: () => void }) {
    return (
        <button
            className="mt-4 bg-black text-white px-10 py-3 text-2xl font-medium rounded-full shadow-md cursor-pointer"
            onClick={onClick}>
            {text}
        </button>
    );
}

export default function Main() {
    const router = useRouter();

    // 시작하기 버튼 클릭 시 /login으로 이동(/login 페이지 미완성)
    const handleStartButtonClick = () => {
        router.push('/login');
    };

    return (
        <div className="w-full max-w-screen-xl px-4 mt-32 flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="flex flex-col gap-10">
                <p className="text-5xl md:text-6xl font-medium text-black leading-tight">
                    세상의 모든 <br />아이디어를 모아
                </p>
                <p className="text-5xl md:text-6xl font-light text-black">모아노트</p>
                <StartButton text="시작하기 →" onClick={handleStartButtonClick} />
            </div>
            <img src="home_img/memo.png" className="w-64 md:w-80 object-contain" alt="memo" />
        </div>
    );
}