export default function MoaAIIntroduce() {
    return (
        // <div className="flex-grow-0 flex-shrink-0 w-[1311px] h-[753px] relative overflow-hidden absolute left-0 top-[42px]">
        //     <p className="w-[884px] h-[147px] absolute left-[115px] top-[35px] text-[64px] font-medium text-left text-black">
        //         <span className="w-[884px] h-[147px] text-[64px] font-medium text-left text-black">
        //             당신이 상상하던 모든 아이디어,{" "}
        //         </span>
        //         <br />
        //         <span className="w-[884px] h-[147px] text-[64px] font-medium text-left text-black">
        //             모아 AI와 함께 펼치세요
        //         </span>
        //     </p>
        //     <div className="w-[460px] h-[490px] absolute left-[114px] top-[234px] rounded-[20px] bg-[#db49e8]"
        //         style={{ boxShadow: "0px 4px 4px 0 rgba(0,0,0,0.25)" }} />
        //     <div className="w-[465px] h-[490px] absolute left-[736px] top-[234px] rounded-[20px] bg-[#f4bfbf]"
        //         style={{ boxShadow: "0px 4px 4px 0 rgba(0,0,0,0.25)" }} />
        //     <img
        //         src="home_img/chat.png"
        //         className="w-[111px] h-[111px] absolute left-[149px] top-[265px] object-cover"
        //     />
        //     <p className="absolute left-[306px] top-[285px] text-[64px] font-medium text-left text-white">
        //         AI 채팅
        //     </p>
        //     <p className="w-[386px] h-[234px] absolute left-[152px] top-[442px] text-[32px] font-medium text-left text-white">
        //         <span className="w-[386px] h-[234px] text-[32px] font-medium text-left text-white">
        //             자동 텍스트 완성, 자동 다이어 그램 그리기, 문서 요약..
        //         </span>
        //         <br />
        //         <br />
        //         <span className="w-[386px] h-[234px] text-[32px] font-medium text-left text-white">
        //             모아 AI와 대화하여 무엇이든지 만들 수 있습니다.
        //         </span>
        //     </p>
        //     <img
        //         src="home_img/recording.png"
        //         className="w-[120px] h-[120px] absolute left-[769px] top-[265px] object-cover"
        //     />
        //     <p className="w-56 h-[147px] absolute left-[944px] top-[266px] text-[64px] font-medium text-left text-black">
        //         AI 음성 인식
        //     </p>
        //     <p className="w-[376px] h-56 absolute left-[792px] top-[447px] text-[32px] font-medium text-left text-black">
        //         <span className="w-[376px] h-56 text-[32px] font-medium text-left text-black">
        //             회의 내용을 녹음하여 모아 AI에게 줘보세요.{" "}
        //         </span>
        //         <br />
        //         <br />
        //         <span className="w-[376px] h-56 text-[32px] font-medium text-left text-black">
        //             핵심을 요약하고 키워드를 정리해 줍니다.
        //         </span>
        //     </p>
        // </div>

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