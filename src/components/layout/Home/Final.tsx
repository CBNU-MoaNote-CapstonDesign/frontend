'use client';

import { useRouter } from 'next/navigation';

function SeeMoreButton({ text, onClick }: { text: string, onClick: () => void }) {
    return (
        <button
            className="mt-4 bg-black text-white px-10 py-3 text-2xl font-medium rounded-full shadow-md cursor-pointer"
            onClick={onClick}>
            {text}
        </button>
    );
}

export default function Final() {
    const router = useRouter();

    // 더 알아보기 버튼 클릭 시 /seemore으로 이동(/more 페이지 미구현)
    const handleSeeMoreButtonClick = () => {
        router.push('/seemore');
    };

    return (
        <div className="w-full max-w-screen-xl px-4 mt-32 flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="flex flex-col gap-10">
                <p className="text-5xl md:text-6xl font-medium text-black leading-tight">
                    모아노트와 함께 <br />
                    여러분의 아이디어를 <br />
                    모아보세요!
                </p>
                <SeeMoreButton text="더 알아보기" onClick={handleSeeMoreButtonClick} />
            </div>
            <img src="moanote_logo/logo2.png" className="w-64 md:w-80 object-contain" alt="logo2" />
        </div>
    );
}