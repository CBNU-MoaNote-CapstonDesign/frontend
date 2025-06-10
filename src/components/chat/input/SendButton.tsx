"use client"
import {FaRegPaperPlane} from "react-icons/fa";
import useChatSync from "@/hooks/useChatSync";

export default function SendButton({chat, uuid, user}: { chat: string, uuid: string, user:User }) {
  const send = useChatSync(uuid);

  const handleClick = () => {
    if (user) {
      send({
        messageContent: chat,
        messageType: "chat",
        senderId: user.id,
      });
    }
  }
  return (<button className={"bg-[#0051A2] flex items-center justify-center rounded-xl w-full h-full cursor-pointer border"} onClick={handleClick}>
    <FaRegPaperPlane size={24} color={"#eeeeee"}/>
  </button>);
}