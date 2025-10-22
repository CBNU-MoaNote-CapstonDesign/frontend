"use client";

import Link from "next/link";

function NavigationLink({ text, link }: { text: string; link: string }) {
  return (
    <Link
      href={link}
      className="cursor-pointer hover:text-[#186370] transition-colors"
    >
      {text}
    </Link>
  );
}

export default function TopNavigationBar() {
  return (
    <div className="fixed top-0 left-0 w-full h-24 bg-gradient-to-r from-[#f0f8fe] to-[#e0e7ff] z-50 flex justify-between items-center px-8 shadow-md">
      <div className="flex items-center gap-4">
        <img
          src="/moanote_logo/logo1.png"
          className="w-12 h-12 object-contain"
          alt="logo"
        />
        <p className="text-2xl md:text-4xl font-bold text-[#186370]">
          코드 포레스트
        </p>
      </div>
      <div className="hidden md:flex gap-10 text-lg font-medium text-black">
        <NavigationLink text="서비스 소개" link="#" />
        <NavigationLink text="자주 묻는 질문" link="#" />
        <NavigationLink text="새로운 소식 ↗" link="#" />
      </div>
      <div className="flex gap-6 text-lg font-medium text-black">
        <NavigationLink text="로그인" link="/login" />
        <NavigationLink text="회원가입" link="/register" />
      </div>
    </div>
  );
}
