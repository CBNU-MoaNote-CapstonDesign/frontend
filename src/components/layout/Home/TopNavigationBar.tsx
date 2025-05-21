'use client';

import Link from 'next/link';

function NavigationLink({ text, link }: { text: string, link: string }) {
	return (
		<Link href={link} className="cursor-pointer">{text}</Link>
	);
}

export default function TopNavigationBar() {
	return (
		<div className="fixed top-0 left-0 w-full h-28 bg-[#f0f8fe] z-50 flex justify-between items-center px-6">
			<div className="flex items-center gap-4">
				<img src="moanote_logo/logo1.png" className="w-16 h-16 object-contain" alt="logo" />
				<p className="text-2xl md:text-4xl font-medium text-[#186370]">모아노트</p>
			</div>
			<div className="hidden md:flex gap-10 text-lg font-medium text-black">
				<NavigationLink text="서비스 소개" link="#" /> {/* 페이지 미구현 */}
				<NavigationLink text="자주 묻는 질문" link="#" /> {/* 페이지 미구현 */}
				<NavigationLink text="새로운 소식 ↗" link="#" /> {/* 페이지 미구현 */}
			</div>
			<div className="flex gap-6 text-lg font-medium text-black">
				<NavigationLink text="로그인" link="/login" /> {/* 로그인 페이지 /login 미완성 */}
				<NavigationLink text="회원가입" link="/register" /> { /*회원가입 페이지 /register 미구현*/}
			</div>
		</div>
	);
}