export default function Final() {
    return (
        // <div className="flex-grow-0 flex-shrink-0 w-[1311px] h-[854px] relative overflow-hidden">
        //     <p className="w-[866px] absolute left-[88px] top-[71px] text-8xl text-left text-black">
        //         <span className="w-[866px] text-8xl font-medium text-left text-black">모아노트</span>
        //         <span className="w-[866px] text-8xl font-light text-left text-black">와 함께 </span>
        //         <br />
        //         <span className="w-[866px] text-8xl font-light text-left text-black">
        //             여러분의 아이디어를{" "}
        //         </span>
        //         <br />
        //         <span className="w-[866px] text-8xl font-light text-left text-black">모아보세요!</span>
        //     </p>
        //     <img
        //         src="moanote_logo/logo2.png"
        //         className="w-[377px] h-[377px] absolute left-[87px] top-[426px] object-cover"
        //     />
        //     <div className="w-[349px] h-[95px] absolute left-[630px] top-[649px] overflow-hidden">
        //         <div className="w-[284px] h-[74px] absolute left-8 top-2.5 rounded-[20px] bg-black" />
        //         <p className="absolute left-[63px] top-[27px] text-4xl font-bold text-left text-white">
        //             더 알아보기 ↗
        //         </p>
        //     </div>
        // </div>
        <div className="w-full max-w-screen-xl px-4 mt-32 flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="flex flex-col gap-10">
                <p className="text-5xl md:text-6xl font-medium text-black leading-tight">
                    모아노트와 함께 <br />
                    여러분의 아이디어를 <br />
                    모아보세요!
                </p>
                <button className="mt-4 bg-black text-white px-10 py-3 text-2xl font-medium rounded-full shadow-md">
                    더 알아보기 ↗
                </button>
            </div>
            <img src="moanote_logo/logo2.png" className="w-64 md:w-80 object-contain" alt="logo2" />
        </div>
    );
}