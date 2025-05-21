export default function Introduce() {
    return (
        <div className="w-full max-w-screen-xl px-4 py-20 flex flex-col gap-20">
            <div className="text-4xl md:text-5xl font-bold text-[#186370] text-left">
                글과 그림, 다양한 편집 기능으로 <br />
                자유롭게 아이디어를 펼치세요
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="bg-[#db49e8] p-8 rounded-2xl text-white shadow-md flex flex-col items-start">
                    <img src="/home_img/textedit.png" className="w-20 h-20 object-contain mb-4" alt="텍스트 편집" />
                    <h3 className="text-3xl font-semibold mb-2">텍스트 편집</h3>
                    <p className="text-xl font-medium">
                        마크다운 문법과 완벽 호환<br /><br />
                    </p>
                </div>
                <div className="bg-[#f4bfbf] p-8 rounded-2xl text-black shadow-md flex flex-col items-start">
                    <img src="/home_img/diagram.png" className="w-24 h-24 object-contain mb-4" alt="다이어그램" />
                    <h3 className="text-3xl font-semibold mb-2">다이어그램</h3>
                    <p className="text-xl font-medium">
                        손쉬운 도표 편집
                    </p>
                </div>
            </div>
        </div>
    );
}