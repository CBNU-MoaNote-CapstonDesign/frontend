"use client";

export default function DocumentTitle({ title }: { title: string }) {
  return (
    <div className="w-full bg-white rounded-xl shadow flex items-center px-8 py-5 mb-2">
      <p className="text-2xl md:text-3xl font-bold text-[#186370] truncate">
        {title}
      </p>
    </div>
  );
}
