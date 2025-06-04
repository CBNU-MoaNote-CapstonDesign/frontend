export default async function DesignBlock() {
    return (
        <div className="w-full min-h-[260px] bg-white rounded-xl shadow px-8 py-8 flex flex-col gap-6 items-center relative">
            <div className="flex justify-between w-full max-w-3xl mx-auto">
                <div className="w-32 h-32 bg-[#d9d9d9] rounded-lg flex items-center justify-center text-2xl font-bold text-gray-400">1</div>
                <div className="w-32 h-32 bg-[#d9d9d9] rounded-lg flex items-center justify-center text-2xl font-bold text-gray-400">2</div>
                <div className="w-32 h-32 bg-[#d9d9d9] rounded-lg flex items-center justify-center text-2xl font-bold text-gray-400">3</div>
            </div>
            {/* 선 연결 (예시, 실제 디자인에 맞게 조정 가능) */}
            <svg
                width="70%"
                height={24}
                viewBox="0 0 700 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute left-1/2 -translate-x-1/2 top-[110px] hidden md:block"
                style={{ minWidth: 300, maxWidth: 700 }}
            >
                <line x1="60" y1="12" x2="340" y2="12" stroke="#888" strokeWidth="2" />
                <line x1="360" y1="12" x2="640" y2="12" stroke="#888" strokeWidth="2" />
                <circle cx="60" cy="12" r="8" fill="#bdbdbd" />
                <circle cx="340" cy="12" r="8" fill="#bdbdbd" />
                <circle cx="640" cy="12" r="8" fill="#bdbdbd" />
            </svg>
        </div>
    );
}