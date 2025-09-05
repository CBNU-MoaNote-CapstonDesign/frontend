"use client";
import useChatSync from "@/hooks/useChatSync";
import { useEffect, useState } from "react";
import { fetchCurrentUser } from "@/libs/client/user";

export default function CallBotButton({
  chat,
  uuid,
}: {
  chat: string;
  uuid: string;
}) {
  const [me, setMe] = useState<User | null>(null);

  useEffect(() => {
    fetchCurrentUser().then((user) => {
      setMe(user);
    });
  }, []);

  const send = useChatSync(uuid);

  const handleClick = () => {
    if (me) {
      send({
        messageContent: chat,
        messageType: "request-bot",
        senderId: me.id,
      });
    }
  };

  return (
    <button
      className={
        "items-center justify-center rounded-xl w-full cursor-pointer border"
      }
      onClick={handleClick}
    >
      <span className={"text-xs font-light"}>Send To AI</span>
    </button>
  );
}
