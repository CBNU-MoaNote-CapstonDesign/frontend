"use client"
import useChatSync from "@/hooks/useChatSync";
import {useEffect, useState} from "react";
import {ChatMessage} from "@/types/chat";
import {User} from "@/types/user";
import SentMessage from "@/components/chat/message/SentMessage";
import ReceivedMessage from "@/components/chat/message/ReceivedMessage";
import BotMessage from "@/components/chat/message/BotMessage";
import useUserInfo from "@/hooks/useUserInfo";

function MessageBuilder({message}: { message: ChatMessage }) {
  const [me, setMe] = useState<User | null>(null);
  const [sender, setSender] = useState<User | null>(null);

  useUserInfo(message.senderId, (user) => {
    setSender(user);
  });

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

  if (!me || !sender)
    return <></>

  // 보낸 메시지, 받은 메시지 등등 분류
  if (message.messageType === 'chat') {
    if (me.uuid === message.senderId)
      return <SentMessage name={me.name} content={message.messageContent} time={""} isBotRequest={false}/>
    else
      return <ReceivedMessage name={sender.name} content={message.messageContent} time={""} isBotRequest={false}/>
  } else if (message.messageType === 'request-bot') {
    if (me.uuid === message.senderId)
      return <SentMessage name={me.name} content={message.messageContent} time={""} isBotRequest={true}/>
    else
      return <ReceivedMessage name={sender.name} content={message.messageContent} time={""} isBotRequest={true}/>
  } else {
    return <BotMessage name={"Moa Bot"} content={message.messageContent} time={""}/>
  }
}

export default function MessageList({uuid}: { uuid: string }) {
  const [messages, setMessages] = useState<Array<ChatMessage>>([]);

  const update = (messages: Array<ChatMessage>) => {
    setMessages(messages);
  }

  useChatSync(uuid, update);

  return <div>
    {
      messages.map((message) => {
        return <MessageBuilder key={message.chatId} message={message}/>;
      })
    }
  </div>
}