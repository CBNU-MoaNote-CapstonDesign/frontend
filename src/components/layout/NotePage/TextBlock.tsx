'use client';

export default function TextBlock({ content }: { content: string }) {
    return (
        <div className="w-full min-h-[180px] bg-white rounded-xl shadow px-8 py-6 flex items-start">
            <p className="text-lg font-medium text-gray-800">
                {content}
            </p>
        </div>
    );
}
