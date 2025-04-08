"use client"
import {IoChatbubblesOutline} from "react-icons/io5";
import {IoIosCloseCircleOutline} from "react-icons/io";
import {useRef} from "react";
import Chat from "@/components/chat/Chat";

const DURATION = 500;

export default function ChatMenu({uuid}: { uuid: string }) {
  const contentRef = useRef<HTMLDivElement>(null);

  const closeWithAnimation = () => {
    if (contentRef.current) {
      contentRef.current.classList.remove("translate-x-0");
      contentRef.current.classList.add("translate-x-full");
    }
  }

  const openWithAnimation = () => {
    if (contentRef.current) {
      contentRef.current.classList.remove("translate-x-full");
      contentRef.current.classList.add("translate-x-0");
    }
  }

  return (
    <div className={"fixed bottom-0 right-0 z-50"}>
      <button className={"fixed bottom-0 right-0 p-5 cursor-pointer"} onClick={() => {
        openWithAnimation();
      }}>
        <IoChatbubblesOutline
          className={"duration-500 transition-all hover:w-[48px] hover:h-[48px] w-[32px] h-[32px]"}/>
      </button>
      <div
        className={`fixed right-0 top-0 bottom-0 w-[500px] bg-white shadow-2xl` +
          ` translate-x-full duration-${DURATION} transition-transform`}
        ref={contentRef}>

        <button className={"absolute w-[48px] h-[48px] items-center flex justify-center cursor-pointer m-1"} onClick={() => {
          closeWithAnimation();
        }}>
          <IoIosCloseCircleOutline color={"#ee3333"}
                                   className={"duration-500 transition-all hover:w-[48px] hover:h-[48px] w-[32px] h-[48px]"}/>
        </button>
        <Chat uuid={uuid}/>
      </div>

    </div>
  );
}