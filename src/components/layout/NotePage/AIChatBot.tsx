'use client';

export default function AIChatBot() {
    return (
        <button
            className="
                fixed
                bottom-8
                right-8
                w-16
                h-16
                rounded-full
                bg-gradient-to-br from-[#e0f8ff] to-[#b6eaff]
                shadow-xl
                flex
                items-center
                justify-center
                z-50
                hover:scale-110
                transition
                cursor-pointer
            "
            title="모아 AI 챗봇 열기"
            aria-label="모아 AI 챗봇 열기"
        >
            <img
                src="/icon/chatbot.png"
                alt="모아 AI"
                className="w-10 h-10 object-contain"
            />
        </button>
    );
}