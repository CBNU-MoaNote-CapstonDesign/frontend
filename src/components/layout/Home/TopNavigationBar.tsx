export default function TopNavigationBar() {
	return (
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