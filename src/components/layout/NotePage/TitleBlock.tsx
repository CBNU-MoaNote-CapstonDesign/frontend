// 더이상 사용하지 않는 컴포넌트
// 대신 components/document/DocumentTitle.tsx 사용
'use client';

export default function TitleBlock({ title }: { title: string }) {
    return (
        <div className="w-full bg-white rounded-xl shadow flex items-center px-8 py-5 mb-2">
            <p className="text-2xl md:text-3xl font-bold text-[#186370] truncate">
                {title}
            </p>
        </div>
    );
}