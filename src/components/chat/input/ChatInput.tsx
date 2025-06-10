"use client"
import ChatTextarea from "@/components/chat/input/ChatTextarea";
import SendButton from "@/components/chat/input/SendButton";
import CallBotButton from "@/components/chat/input/CallBotButton";
import {useState} from "react";

export default function ChatInput({uuid, user}:{uuid:string, user:User})
{
  const [chat, setChat] = useState<string>("");
  return <div className={"flex"}>
    <div className={"flex flex-1"}>
      <ChatTextarea setText={(text)=>{setChat(text)}}/>
    </div>
    <div className={"flex flex-col ms-3 w-20"}>
      <div className={"mb-2"}>
        <CallBotButton chat={chat} uuid={uuid}/>
      </div>
      <SendButton chat={chat} uuid={uuid} user={user}/>
    </div>
  </div>
}