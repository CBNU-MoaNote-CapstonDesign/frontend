"use client"
import useChatSync from "@/hooks/useChatSync";
import {useEffect, useRef, useState} from "react";
import {ChatMessage} from "@/types/chat";
import {User} from "@/types/user";
import SentMessage from "@/components/chat/message/SentMessage";
import ReceivedMessage from "@/components/chat/message/ReceivedMessage";
import BotMessage from "@/components/chat/message/BotMessage";
import {fetchCurrentUser} from "@/libs/user";

function MessageBuilder({message}: { message: ChatMessage}) {
  const [me, setMe] = useState<User | null>(null);
  const [sender, setSender] = useState<User | null>(null);

  fetchCurrentUser().then((user) => {
    setMe(user);
    setSender(user);
  })

  if (!me || !sender)
    return <></>

  // 보낸 메시지, 받은 메시지 등등 분류
  if (message.messageType === 'chat') {
    if (me.id === message.senderId)
      return <SentMessage name={me.name} content={message.messageContent} time={""} isBotRequest={false}/>
    else
      return <ReceivedMessage name={sender.name} content={message.messageContent} time={""} isBotRequest={false}/>
  } else if (message.messageType === 'request-bot') {
    if (me.id === message.senderId)
      return <SentMessage name={me.name} content={message.messageContent} time={""} isBotRequest={true}/>
    else
      return <ReceivedMessage name={sender.name} content={message.messageContent} time={""} isBotRequest={true}/>
  } else {
    return <BotMessage name={"Moa Bot"} content={message.messageContent} time={""}/>
  }
}

export default function MessageList({uuid}: { uuid: string }) {
    const ref =  useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Array<ChatMessage>>([]);

  useEffect(()=>{
      if (ref.current)
          ref.current.scrollIntoView();
  },[messages]);

  const update = (messages: Array<ChatMessage>) => {
    setMessages(messages);
  }

  useChatSync(uuid, update);

  return <div>
    {
      messages.map((message,index) => {
        if (index === messages.length-1) {
            return <div key={message.chatId} ref={ref}><MessageBuilder message={message}/></div>;
        }
        return <div key={message.chatId}><MessageBuilder message={message}/></div>;
      })
    }
  </div>
}