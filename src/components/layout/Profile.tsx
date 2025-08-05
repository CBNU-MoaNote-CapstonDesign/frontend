"use client";

import { User } from "lucide-react";

export default function Profile({ name }: { name: string }) {
  // 이름의 첫 글자 추출 (없으면 ?)
  const initial = name ? name[0].toUpperCase() : "?";

  return (
    <div
      className="w-10 h-10 flex flex-col items-center justify-center group cursor-pointer"
      title="내 프로필"
    >
      {/* 원형 프로필 (이름 앞글자) */}
      <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white shadow-sm border-2 border-white transition-all duration-200 group-hover:scale-110 group-hover:shadow-md">
        {initial === "?" ? <User className="w-4 h-4" /> : initial}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent"></div>
      </div>
    </div>
  );
}
