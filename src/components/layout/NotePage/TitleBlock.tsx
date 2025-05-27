'use client';

export default function TitleBlock() {
    return (
        <div className="w-full bg-white rounded-xl shadow flex items-center px-8 py-5 mb-2">
            <p className="text-2xl md:text-3xl font-bold text-[#186370] truncate">
                문서 제목
            </p>
        </div>
    );
}