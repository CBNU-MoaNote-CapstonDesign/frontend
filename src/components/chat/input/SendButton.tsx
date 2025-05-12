"use client"
import {FaRegPaperPlane} from "react-icons/fa";
import {useEffect, useState} from "react";
import useChatSync from "@/hooks/useChatSync";
import {fetchCurrentUser} from "@/libs/client/user";

export default function SendButton({chat, uuid}: { chat: string, uuid: string }) {
  const [me, setMe] = useState<User | null>(null);

  useEffect(() => {
    fetchCurrentUser().then((user) => {
      setMe(user);
    })
  }, []);

  const send = useChatSync(uuid);

  const handleClick = () => {
    if (me) {
      send({
        messageContent: chat,
        messageType: "chat",
        senderId: me.id
      });
    }
  }
  return (<button className={"bg-[#0051A2] flex items-center justify-center rounded-xl w-full h-full cursor-pointer border"} onClick={handleClick}>
    <FaRegPaperPlane size={24} color={"#eeeeee"}/>
  </button>);
}