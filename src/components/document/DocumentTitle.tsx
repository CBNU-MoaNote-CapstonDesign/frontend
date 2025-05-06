'use client'

export default function DocumentTitle({title}: { title: string }) {
  return <div className={" flex w-full border-b border-gray-500 text-2xl font-black mb-5 pb-5 pl-2 text-[#4B1C2D]"}>
    {title}
  </div>
}