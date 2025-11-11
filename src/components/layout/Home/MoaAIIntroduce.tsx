import Image from "next/image";
import FadeInOnView from "@/components/common/FadeInOnView";

export default function MoaAIIntroduce() {
  return (
    <div className="w-full max-w-screen-xl px-4 py-20 flex flex-col gap-20">
      <FadeInOnView delay={0.35}>
        <div className="text-4xl md:text-5xl font-bold text-[#186370] text-left">
          당신이 상상하던 모든 개발 아이디어,
          <br />
          AI와 함께 펼치세요
        </div>
      </FadeInOnView>

      <FadeInOnView delay={0.35}>
        <div className="flex justify-center px-4">
          {/* 가운데 정렬 + 카드 max-width 지정 */}
          <div className="grid grid-cols-1 place-items-center w-full">
            <div className="w-full max-w-xl md:max-w-2xl bg-[#db49e8] p-8 md:p-10 rounded-2xl text-white shadow-md flex flex-col items-start">
              <Image
                src="/home_img/chat.png"
                className="w-20 h-20 object-contain mb-4"
                alt="AI 코드 베이스 탐색"
                width={80}
                height={80}
                priority
              />
              <h3 className="text-3xl font-semibold mb-2">AI 코드 베이스 탐색</h3>
              <p className="text-xl font-medium">
                다른 사람이 작성한 코드를 이해하기 어려웠던 경험이 있나요? 코드 포레스트 AI에 질문하세요!
                <br />
                <br />
                코드 포레스트 AI는 코드 베이스를 분석하여, 코드의 로직, 오류 등을 매우 정확하게 찾아서 설명해 줍니다..
              </p>
            </div>
          </div>
        </div>
      </FadeInOnView>
    </div>
  );
}
