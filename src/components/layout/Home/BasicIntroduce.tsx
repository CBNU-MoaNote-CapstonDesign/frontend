import Image from "next/image";
import FadeInOnView from "@/components/common/FadeInOnView";

export default function Introduce() {
  return (
    <div className="w-full max-w-screen-xl px-4 py-20 flex flex-col gap-20">
      <FadeInOnView delay={0.35}>
        <div className="text-4xl md:text-5xl font-bold text-[#186370] text-left">
          글과 코드, 다양한 편집 기능으로 <br />
          자유롭게 개발 아이디어를 펼치세요
        </div>
      </FadeInOnView>

      <FadeInOnView delay={0.35}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="bg-[#db49e8] p-8 rounded-2xl text-white shadow-md flex flex-col items-start">
            <Image
              src="/home_img/textedit.png"
              className="w-20 h-20 object-contain mb-4"
              alt="텍스트 편집"
              width={80}
              height={80}
              priority
            />
            <h3 className="text-3xl font-semibold mb-2">텍스트 편집</h3>
            <p className="text-xl font-medium">
              마크다운 문법과 완벽 호환
              <br />
              <br />
            </p>
          </div>
          <div className="bg-[#f4bfbf] p-8 rounded-2xl text-black shadow-md flex flex-col items-start">
            <Image
              src="/home_img/code.png"
              className="w-24 h-24 object-contain mb-4"
              alt="코드 에디터"
              width={96}
              height={96}
              priority
            />
            <h3 className="text-3xl font-semibold mb-2">코드 에디터</h3>
            <p className="text-xl font-medium">전체 코드베이스를 웹 상에서 편집 및 github과 연동</p>
          </div>
        </div>
      </FadeInOnView>
    </div>
  );
}
