import Image from "next/image";

export default function MoaLogo() {
  return <nav className="fixed right-0 top-0">
    <div className="">
      <a href={"/main"} className={"p-2 block"}>
        <Image src={"/logo.png"} alt={""} className="h-[48px] w-auto" width={383} height={110}/>
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