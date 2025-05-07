export default function Introduce() {
    return (
        // <div className="flex-grow-0 flex-shrink-0 w-[1311px] h-[753px] relative overflow-hidden absolute left-0 top-[42px]" >
        //     <div
        //         className="w-[540px] h-[315px] absolute left-[694px] top-[363px] rounded-[20px] bg-[#96e633]"
        //         style={{ boxShadow: "0px 4px 4px 0 rgba(0,0,0,0.25)" }}
        //     />
        //     <div
        //         className="w-[540px] h-[311px] absolute left-[71px] top-[365px] rounded-[20px] bg-[#8394f2]"
        //         style={{ boxShadow: "0px 4px 4px 0 rgba(0,0,0,0.25)" }}
        //     />
        //     <p className="absolute left-[786px] top-[551px] text-5xl font-light text-left text-black">
        //         손쉬운 도표 편집
        //     </p>
        //     <p className="absolute left-[877px] top-[410px] text-[64px] font-medium text-left text-white">
        //         다이어그램
        //     </p>
        //     <img
        //         src="home_img/diagram.png"
        //         className="w-[116px] h-[116px] absolute left-[727px] top-[387px] object-cover"
        //     />
        //     <p className="w-[449px] h-[86px] absolute left-[124px] top-[535px] text-5xl font-light text-left text-black">
        //         마크다운 문법과 완벽 호환{" "}
        //     </p>
        //     <p className="absolute left-[230px] top-[413px] text-[64px] font-medium text-left text-white">
        //         텍스트 편집
        //     </p>
        //     <img
        //         src="home_img/textedit.png"
        //         className="w-[109px] h-[109px] absolute left-[90px] top-[394px] object-cover"
        //     />
        //     <p className="w-[772px] h-[244px] absolute left-[105px] top-14 text-[64px] font-medium text-left text-black">
        //         글과 그림, 다양한 편집 기능으로 자유롭게 아이디어를 펼치세요
        //     </p>
        // </div>
        <div className="w-full max-w-screen-xl px-4 py-20 flex flex-col gap-20">
            <div className="text-4xl md:text-5xl font-medium text-black text-left">
                글과 그림, 다양한 편집 기능으로 <br/>
                자유롭게 아이디어를 펼치세요
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="bg-[#db49e8] p-8 rounded-2xl text-white relative">
                    <img src="home_img/textedit.png" className="w-20 h-20 object-contain mb-4" alt="chat" />
                    <h3 className="text-3xl font-semibold mb-2">텍스트 편집</h3>
                    <p className="text-xl font-medium">
                        마크다운 문법과 완벽 호환<br /><br />
                    </p>
                </div>
                <div className="bg-[#f4bfbf] p-8 rounded-2xl text-black relative">
                    <img src="home_img/diagram.png" className="w-24 h-24 object-contain mb-4" alt="recording" />
                    <h3 className="text-3xl font-semibold mb-2">다이어그램</h3>
                    <p className="text-xl font-medium">
                        손쉬운 도표 편집
                    </p>
                </div>
            </div>
        </div>
    );
}