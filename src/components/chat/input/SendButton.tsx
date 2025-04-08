import {FaRegPaperPlane} from "react-icons/fa";

export default function CallBotButton({chat, uuid}: { chat: string, uuid: string }) {
  return (<button className={"bg-[#0051A2] flex items-center justify-center rounded-xl w-full h-full cursor-pointer border"}>
    <FaRegPaperPlane size={24} color={"#eeeeee"}/>
  </button>);
}