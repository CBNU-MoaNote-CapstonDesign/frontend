"use client"
import useChatSync from "@/hooks/useChatSync";
import {useEffect, useState} from "react";
import {User} from "@/types/user";

export default function CallBotButton({chat, uuid}: { chat: string, uuid: string }) {
  const [me, setMe] = useState<User | null>(null);

  useEffect(() => {
    fetch("/api/auth/me", {
      method: "GET",
      credentials: "include",
    }).then((res) => {
      res.json().then((data) => {
        setMe(data);
      })
    });
  }, []);

  const send = useChatSync(uuid);

  const handleClick = () => {
    if (me) {
      send({
        content: chat,
        sender: me.uuid,
        uuid: "-",
        type: 'request-bot'
      })
    }
  }

  return (
    <button
      className={"items-center justify-center rounded-xl w-full cursor-pointer border"}
      onClick={handleClick}>
      <span className={"text-xs font-light"}>Send To AI</span>
    </button>);
}