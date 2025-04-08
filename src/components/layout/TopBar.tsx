import Image from "next/image";

export default function TopBar() {
  return <nav className="fixed w-full">
    <div className="flex w-full justify-between h-[64px]">
      <a href={"/main"} className={"flex ms-auto p-2"}>
        <Image src={"/logo.png"} alt={""} className="h-full w-auto" width={383} height={110}/>
      </a>
      {/* 오른쪽 햄버거 버튼 */}
      {/*<button className="text-white text-2xl focus:outline-none">*/}
      {/*  ☰*/}
      {/*</button>*/}

      {/*/!* 문서 이름 *!/*/}
      {/*<a className="font-bold ps-3 text-left text-white text-lg" href="#">*/}
      {/*  {title}*/}
      {/*</a>*/}
    </div>
  </nav>
}