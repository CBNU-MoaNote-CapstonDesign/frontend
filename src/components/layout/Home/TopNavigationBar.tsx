export default function TopNavigationBar() {
  return (
    // <div className="fixed top-0 left-0 w-full h-[116px] bg-[#f0f8fe] z-50">
    //   <div className="w-[284px] h-[100px] absolute left-[15px] top-2 overflow-hidden">
    //     <img
    //       src="moanote_logo/logo1.png"
    //       className="w-[68px] h-16 absolute left-[31px] top-[17px] object-none"
    //     />
    //     <p className="absolute left-[119px] top-8 text-4xl font-medium text-center text-[#186370]">
    //       모아노트
    //     </p>
    //   </div>
    //   <div className="w-[500px] h-[75px] absolute left-[299px] top-5 overflow-hidden">
    //     <div className="w-[140px] h-[35px] absolute left-2.5 top-[22px] overflow-hidden">
    //       <p className="absolute left-4 top-1.5 text-xl font-medium text-center text-black">
    //         서비스 소개
    //       </p>
    //     </div>
    //     <div className="w-[140px] h-[35px] absolute left-[172px] top-[22px] overflow-hidden">
    //       <p className="absolute left-0 top-1.5 text-xl font-medium text-center text-black">
    //         자주 묻는 질문
    //       </p>
    //     </div>
    //     <div className="w-[140px] h-[35px] absolute left-[334px] top-5 overflow-hidden">
    //       <p className="absolute left-2 top-1.5 text-xl font-medium text-center text-black">
    //         새로운 소식 ↗
    //       </p>
    //     </div>
    //   </div>
    //   <div className="w-[234px] h-[75px] absolute left-[1160px] top-5 overflow-hidden">
    //     <div className="w-[95px] h-[35px] absolute left-2.5 top-5 overflow-hidden">
    //       <p className="absolute left-[19px] top-1.5 text-xl font-medium text-center text-black">
    //         로그인
    //       </p>
    //     </div>
    //     <div className="w-[95px] h-[35px] absolute left-[129px] top-5 overflow-hidden">
    //       <p className="absolute left-[9px] top-1.5 text-xl font-medium text-center text-black">
    //         회원가입
    //       </p>
    //     </div>
    //   </div>
    // </div>
    <div className="fixed top-0 left-0 w-full h-28 bg-[#f0f8fe] z-50 flex justify-between items-center px-6">
      <div className="flex items-center gap-4">
        <img src="moanote_logo/logo1.png" className="w-16 h-16 object-contain" alt="logo" />
        <p className="text-2xl md:text-4xl font-medium text-[#186370]">모아노트</p>
      </div>
      <div className="hidden md:flex gap-10 text-lg font-medium text-black">
        <p className="cursor-pointer">서비스 소개</p>
        <p className="cursor-pointer">자주 묻는 질문</p>
        <p className="cursor-pointer">새로운 소식 ↗</p>
      </div>
      <div className="flex gap-6 text-lg font-medium text-black">
        <p className="cursor-pointer">로그인</p>
        <p className="cursor-pointer">회원가입</p>
      </div>
    </div>
  );
}