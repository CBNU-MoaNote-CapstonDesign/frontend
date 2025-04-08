"use client"
import useChatSync from "@/hooks/useChatSync";
import {useEffect, useState} from "react";
import {Message} from "@/types/chat";
import {User} from "@/types/user";
import SentMessage from "@/components/chat/message/SentMessage";
import ReceivedMessage from "@/components/chat/message/ReceivedMessage";
import BotMessage from "@/components/chat/message/BotMessage";
import useUserInfo from "@/hooks/useUserInfo";

function MessageBuilder({message}: { message: Message }) {
  const [me, setMe] = useState<User | null>(null);
  const [sender, setSender] = useState<User | null>(null);

  useUserInfo(message.sender, (user) => {
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

  if (message.type === 'user') {
    if (me.uuid === message.sender)
      return <SentMessage name={me.name} content={message.content} time={""} isBotRequest={false}/>
    else
      return <ReceivedMessage name={sender.name} content={message.content} time={""} isBotRequest={false}/>
  } else if (message.type === 'request-bot') {
    if (me.uuid === message.sender)
      return <SentMessage name={me.name} content={message.content} time={""} isBotRequest={true}/>
    else
      return <ReceivedMessage name={sender.name} content={message.content} time={""} isBotRequest={true}/>
  } else {
    return <BotMessage name={"Moa Bot"} content={message.content} time={""}/>
  }
}

export default function MessageList({uuid}: { uuid: string }) {
  const [messages, setMessages] = useState<Array<Message>>([]);

  const update = (messages: Array<Message>) => {
    setMessages(messages);
  }

  useChatSync(uuid, update);

  return <div>
    {
      messages.map((message) => {
        return <MessageBuilder key={message.uuid} message={message}/>;
      })
    }
  </div>
}