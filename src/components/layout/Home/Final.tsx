export default function Final() {
    return (
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