"use client"
import useChatSync from "@/hooks/useChatSync";
import {useEffect, useRef, useState} from "react";
import {ChatMessage} from "@/types/chat";
import SentMessage from "@/components/chat/message/SentMessage";
import ReceivedMessage from "@/components/chat/message/ReceivedMessage";
import BotMessage from "@/components/chat/message/BotMessage";

function MessageBuilder({message, user}: { message: ChatMessage, user: User}) {
  const [me, setMe] = useState<User | null>(null);
  const [sender, setSender] = useState<User | null>(null);

  useEffect(()=>{
    setMe(user);
    setSender(user);
  },[user]);

  if (!me || !sender)
    return <></>

  // 보낸 메시지, 받은 메시지 등등 분류
  if (message.messageType === 'chat') {
    if (me.id === message.senderId)
      return <SentMessage name={me.name} content={message.messageContent} time={""} isBotRequest={false}/>
    else
      return <ReceivedMessage name={message.senderName} content={message.messageContent} time={""} isBotRequest={false}/>
  } else if (message.messageType === 'request-bot') {
    if (me.id === message.senderId)
      return <SentMessage name={me.name} content={message.messageContent} time={""} isBotRequest={true}/>
    else
      return <ReceivedMessage name={message.senderName} content={message.messageContent} time={""} isBotRequest={true}/>
  } else {
    return <BotMessage name={"Moa Bot"} content={message.messageContent} time={""}/>
  }
}

export default function MessageList({uuid, user}: { uuid: string ,user:User}) {
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
            return <div key={message.chatId} ref={ref}><MessageBuilder message={message} user={user}/></div>;
        }
        return <div key={message.chatId}><MessageBuilder message={message} user={user}/></div>;
      })
    }
  </div>
}