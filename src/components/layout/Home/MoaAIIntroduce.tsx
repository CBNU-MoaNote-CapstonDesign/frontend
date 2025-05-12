export default function MoaAIIntroduce() {
    return (
        <div className="w-full max-w-screen-xl px-4 py-20 flex flex-col gap-20">
            <div className="text-4xl md:text-5xl font-medium text-black text-left">
                당신이 상상하던 모든 아이디어,<br />
                모아 AI와 함께 펼치세요
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="bg-[#db49e8] p-8 rounded-2xl text-white relative">
                    <img src="home_img/chat.png" className="w-20 h-20 object-contain mb-4" alt="chat" />
                    <h3 className="text-3xl font-semibold mb-2">AI 채팅</h3>
                    <p className="text-xl font-medium">
                        자동 텍스트 완성, 자동 다이어그램 그리기, 문서 요약..<br /><br />
                        모아 AI와 대화하여 무엇이든지 만들 수 있습니다.
                    </p>
                </div>
                <div className="bg-[#f4bfbf] p-8 rounded-2xl text-black relative">
                    <img src="home_img/recording.png" className="w-24 h-24 object-contain mb-4" alt="recording" />
                    <h3 className="text-3xl font-semibold mb-2">AI 음성인식</h3>
                    <p className="text-xl font-medium">
                        회의 내용을 녹음하여 모아 AI에게 줘보세요.<br /><br />
                        핵심을 요약하고 키워드를 정리해 줍니다.
                    </p>
                </div>
            </div>
        </div>
    );
}