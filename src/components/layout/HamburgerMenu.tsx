// 더이상 사용되지 않는 컴포넌트
// NoteExplorer.tsx 컴포넌트에 햄버거 메뉴 기능이 별도로 구현되어 있음

"use client"
import {RxHamburgerMenu} from "react-icons/rx";
import {BsChevronLeft} from "react-icons/bs";
import {useRef} from "react";

const DURATION = 500;

export default function HamburgerMenu({content, title}: { content?: React.ReactNode, title?: string }) {
  const contentRef = useRef<HTMLDivElement>(null);

  const closeWithAnimation = () => {
    if (contentRef.current) {
      contentRef.current.classList.remove("translate-x-0");
      contentRef.current.classList.add("translate-x-[-100%]");
    }
  }

  const openWithAnimation = () => {
    if (contentRef.current) {
      contentRef.current.classList.remove("translate-x-[-100%]");
      contentRef.current.classList.add("translate-x-0");
    }
  }

  return (
    <div className={"fixed left-0 top-0 bottom-0"}>
      <button className={"h-[52px] p-4 cursor-pointer z-50"} onClick={() => {
        openWithAnimation();
      }}>
        <RxHamburgerMenu className={"w-full h-full"}/>
      </button>
      <div
        className={"fixed left-0 top-0 bottom-0 w-[400px] shadow-2xl bg-white" + ` translate-x-[-100%] duration-${DURATION} transition-transform`}
        ref={contentRef}>
        <div className={"flex"}>
          <div className={"fixed h-[48px] p-1 py-3 cursor-pointer"} onClick={() => {
            closeWithAnimation();
          }}>
            <BsChevronLeft className={"ms-1 w-full h-full"}/>
          </div>
          <div className={"w-full h-[48px] flex items-center justify-center"}>{title}</div>
        </div>
        {content && content}
      </div>
    </div>
  );
}