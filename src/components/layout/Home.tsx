export default function HomeTopMenu() {
  return (
    <div className="flex flex-col justify-start items-center w-full relative gap-[59px] bg-[#f0f8fe]">
      <div className="fixed top-0 left-0 w-full h-[116px] bg-[#f0f8fe] z-50">
        <div className="w-[284px] h-[100px] absolute left-[15px] top-2 overflow-hidden">
          <img
            src="moanote_logo/logo1.png"
            className="w-[68px] h-16 absolute left-[31px] top-[17px] object-none"
          />
          <p className="absolute left-[119px] top-8 text-4xl font-medium text-center text-[#186370]">
            모아노트
          </p>
        </div>
        <div className="w-[500px] h-[75px] absolute left-[299px] top-5 overflow-hidden">
          <div className="w-[140px] h-[35px] absolute left-2.5 top-[22px] overflow-hidden">
            <p className="absolute left-4 top-1.5 text-xl font-medium text-center text-black">
              서비스 소개
            </p>
          </div>
          <div className="w-[140px] h-[35px] absolute left-[172px] top-[22px] overflow-hidden">
            <p className="absolute left-0 top-1.5 text-xl font-medium text-center text-black">
              자주 묻는 질문
            </p>
          </div>
          <div className="w-[140px] h-[35px] absolute left-[334px] top-5 overflow-hidden">
            <p className="absolute left-2 top-1.5 text-xl font-medium text-center text-black">
              새로운 소식 ↗
            </p>
          </div>
        </div>
        <div className="w-[234px] h-[75px] absolute left-[1160px] top-5 overflow-hidden">
          <div className="w-[95px] h-[35px] absolute left-2.5 top-5 overflow-hidden">
            <p className="absolute left-[19px] top-1.5 text-xl font-medium text-center text-black">
              로그인
            </p>
          </div>
          <div className="w-[95px] h-[35px] absolute left-[129px] top-5 overflow-hidden">
            <p className="absolute left-[9px] top-1.5 text-xl font-medium text-center text-black">
              회원가입
            </p>
          </div>
        </div>
      </div>
      <div className="flex-grow-0 flex-shrink-0 w-[1311px] h-[758px] relative overflow-hidden">
        <div className="w-[1206px] h-[479px] absolute left-[53px] top-[79px] overflow-hidden">
          <p className="absolute left-[60px] top-[46px] text-8xl font-medium text-left text-black">
            <span className="text-8xl font-medium text-left text-black">세상의 모든 </span>
            <br />
            <span className="text-8xl font-medium text-left text-black">아이디어를 모아</span>
          </p>
          <p className="absolute left-[60px] top-80 text-8xl font-light text-left text-black">
            모아노트
          </p>
        </div>
        <div className="w-[309px] h-[73px] absolute left-[501px] top-[646px] overflow-hidden"
          style={{ filter: "drop-shadow(0px 4px 4px rgba(0,0,0,0.25))" }}>
          <svg width={250}
            height={63}
            viewBox="0 0 250 63"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-[29px] top-1"
            preserveAspectRatio="none">
            <path
              d="M0.5 24C0.5 10.7452 11.2452 0 24.5 0H225.5C238.755 0 249.5 10.7452 249.5 24V39C249.5 52.2548 238.755 63 225.5 63H24.5C11.2452 63 0.5 52.2548 0.5 39V24Z"
              fill="black" />
          </svg>
          <p className="absolute left-[76px] top-[12px] text-[32px] font-medium text-left text-white">
            시작하기 →
          </p>
        </div>
        <div className="w-[432px] h-[377px] absolute left-[810px] top-[140px] overflow-hidden">
          <img src="home_img/memo.png"
            className="w-80 h-80 absolute left-[55px] top-7 object-cover" />
        </div>
      </div>
      <div className="flex-grow-0 flex-shrink-0 w-[1311px] h-[1755px] relative">
        <div className="w-[1311px] h-[753px] absolute left-0 top-[933px] overflow-hidden">
          <p className="w-[884px] h-[147px] absolute left-[115px] top-[35px] text-[64px] font-medium text-left text-black">
            <span className="w-[884px] h-[147px] text-[64px] font-medium text-left text-black">
              당신이 상상하던 모든 아이디어,{" "}
            </span>
            <br />
            <span className="w-[884px] h-[147px] text-[64px] font-medium text-left text-black">
              모아 AI와 함께 펼치세요
            </span>
          </p>
          <div className="w-[460px] h-[490px] absolute left-[114px] top-[234px] rounded-[20px] bg-[#db49e8]" />
          <div className="w-[465px] h-[490px] absolute left-[736px] top-[234px] rounded-[20px] bg-[#f4bfbf]" />
          <img
            src="home_img/chat.png"
            className="w-[111px] h-[111px] absolute left-[149px] top-[265px] object-cover"
          />
          <p className="absolute left-[306px] top-[285px] text-[64px] font-medium text-left text-white">
            AI 채팅
          </p>
          <p className="w-[386px] h-[234px] absolute left-[152px] top-[442px] text-[32px] font-medium text-left text-white">
            <span className="w-[386px] h-[234px] text-[32px] font-medium text-left text-white">
              자동 텍스트 완성, 자동 다이어 그램 그리기, 문서 요약..
            </span>
            <br />
            <br />
            <span className="w-[386px] h-[234px] text-[32px] font-medium text-left text-white">
              모아 AI와 대화하여 무엇이든지 만들 수 있습니다.
            </span>
          </p>
          <img
            src="home_img/recording.png"
            className="w-[120px] h-[120px] absolute left-[769px] top-[265px] object-cover"
          />
          <p className="w-56 h-[147px] absolute left-[944px] top-[266px] text-[64px] font-medium text-left text-black">
            AI 음성 인식
          </p>
          <p className="w-[376px] h-56 absolute left-[792px] top-[447px] text-[32px] font-medium text-left text-black">
            <span className="w-[376px] h-56 text-[32px] font-medium text-left text-black">
              회의 내용을 녹음하여 모아 AI에게 줘보세요.{" "}
            </span>
            <br />
            <br />
            <span className="w-[376px] h-56 text-[32px] font-medium text-left text-black">
              핵심을 요약하고 키워드를 정리해 줍니다.
            </span>
          </p>
        </div>
        <div className="w-[1311px] h-[753px] absolute left-0 top-[42px]">
          <div
            className="w-[540px] h-[315px] absolute left-[694px] top-[363px] rounded-[20px] bg-[#96e633]"
            style={{ boxShadow: "0px 4px 4px 0 rgba(0,0,0,0.25)" }}
          />
          <div
            className="w-[540px] h-[311px] absolute left-[71px] top-[365px] rounded-[20px] bg-[#8394f2]"
            style={{ boxShadow: "0px 4px 4px 0 rgba(0,0,0,0.25)" }}
          />
          <p className="absolute left-[786px] top-[551px] text-5xl font-light text-left text-black">
            손쉬운 도표 편집
          </p>
          <p className="absolute left-[877px] top-[410px] text-[64px] font-medium text-left text-white">
            다이어그램
          </p>
          <img
            src="home_img/diagram.png"
            className="w-[116px] h-[116px] absolute left-[727px] top-[387px] object-cover"
          />
          <p className="w-[449px] h-[86px] absolute left-[124px] top-[535px] text-5xl font-light text-left text-black">
            마크다운 문법과 완벽 호환{" "}
          </p>
          <p className="absolute left-[230px] top-[413px] text-[64px] font-medium text-left text-white">
            텍스트 편집
          </p>
          <img
            src="home_img/textedit.png"
            className="w-[109px] h-[109px] absolute left-[90px] top-[394px] object-cover"
          />
          <p className="w-[772px] h-[244px] absolute left-[105px] top-14 text-[64px] font-medium text-left text-black">
            글과 그림, 다양한 편집 기능으로 자유롭게 아이디어를 펼치세요
          </p>
        </div>
      </div>
      <div className="flex-grow-0 flex-shrink-0 w-[1311px] h-[854px] relative overflow-hidden">
        <p className="w-[866px] absolute left-[88px] top-[71px] text-8xl text-left text-black">
          <span className="w-[866px] text-8xl font-medium text-left text-black">모아노트</span>
          <span className="w-[866px] text-8xl font-light text-left text-black">와 함께 </span>
          <br />
          <span className="w-[866px] text-8xl font-light text-left text-black">
            여러분의 아이디어를{" "}
          </span>
          <br />
          <span className="w-[866px] text-8xl font-light text-left text-black">모아보세요!</span>
        </p>
        <img
          src="moanote_logo/logo2.png"
          className="w-[377px] h-[377px] absolute left-[87px] top-[426px] object-cover"
        />
        <div className="w-[349px] h-[95px] absolute left-[630px] top-[649px] overflow-hidden">
          <div className="w-[284px] h-[74px] absolute left-8 top-2.5 rounded-[20px] bg-black" />
          <p className="absolute left-[63px] top-[27px] text-4xl font-bold text-left text-white">
            더 알아보기 ↗
          </p>
        </div>
      </div>
      <div className="flex-grow-0 flex-shrink-0 w-[767px] h-[227px] relative overflow-hidden">
        <div className="w-[124px] h-[114px] absolute left-[94.5px] top-[57px] overflow-hidden">
          <img
            src="home_img/email_icon.png"
            className="w-[100px] h-[100px] absolute left-[11.5px] top-1.5 object-cover"
          />
        </div>
        <div className="w-[121px] h-[117px] absolute left-[323.5px] top-[54px] overflow-hidden">
          <img
            src="home_img/github_icon.png"
            className="w-[100px] h-[100px] absolute left-[9.5px] top-[9px] object-cover"
          />
        </div>
        <div className="w-[129px] h-[116px] absolute left-[539.5px] top-[55px] overflow-hidden">
          <img
            src="home_img/discord_icon.png"
            className="w-[115px] h-[115px] absolute left-[4.5px] top-0 object-cover"
          />
        </div>
      </div>
    </div>);
}