export default function Main() {
    return (
        // <div className="flex-grow-0 flex-shrink-0 w-[1311px] h-[758px] relative overflow-hidden">
        //     <div className="w-[1206px] h-[479px] absolute left-[53px] top-[79px] overflow-hidden">
        //         <p className="absolute left-[60px] top-[46px] text-8xl font-medium text-left text-black">
        //             <span className="text-8xl font-medium text-left text-black">세상의 모든 </span>
        //             <br />
        //             <span className="text-8xl font-medium text-left text-black">아이디어를 모아</span>
        //         </p>
        //         <p className="absolute left-[60px] top-80 text-8xl font-light text-left text-black">
        //             모아노트
        //         </p>
        //     </div>
        //     <div className="w-[309px] h-[73px] absolute left-[501px] top-[646px] overflow-hidden"
        //         style={{ filter: "drop-shadow(0px 4px 4px rgba(0,0,0,0.25))" }}>
        //         <svg width={250}
        //             height={63}
        //             viewBox="0 0 250 63"
        //             fill="none"
        //             xmlns="http://www.w3.org/2000/svg"
        //             className="absolute left-[29px] top-1"
        //             preserveAspectRatio="none">
        //             <path
        //                 d="M0.5 24C0.5 10.7452 11.2452 0 24.5 0H225.5C238.755 0 249.5 10.7452 249.5 24V39C249.5 52.2548 238.755 63 225.5 63H24.5C11.2452 63 0.5 52.2548 0.5 39V24Z"
        //                 fill="black" />
        //         </svg>
        //         <p className="absolute left-[76px] top-[12px] text-[32px] font-medium text-left text-white">
        //             시작하기 →
        //         </p>
        //     </div>
        //     <div className="w-[432px] h-[377px] absolute left-[810px] top-[140px] overflow-hidden">
        //         <img src="home_img/memo.png"
        //             className="w-80 h-80 absolute left-[55px] top-7 object-cover" />
        //     </div>
        // </div>
        <div className="w-full max-w-screen-xl px-4 mt-32 flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="flex flex-col gap-10">
                <p className="text-5xl md:text-6xl font-medium text-black leading-tight">
                    세상의 모든 <br />아이디어를 모아
                </p>
                <p className="text-5xl md:text-6xl font-light text-black">모아노트</p>
                <button className="mt-4 bg-black text-white px-10 py-3 text-2xl font-medium rounded-full shadow-md">
                    시작하기 →
                </button>
            </div>
            <img src="home_img/memo.png" className="w-64 md:w-80 object-contain" alt="memo" />
        </div>
    );
}