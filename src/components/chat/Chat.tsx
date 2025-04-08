import ChatInput from "@/components/chat/input/ChatInput";
import SentMessage from "@/components/chat/message/SentMessage";
import ReceivedMessage from "@/components/chat/message/ReceivedMessage";
import BotMessage from "@/components/chat/message/BotMessage";

export default function Chat({uuid}: { uuid: string }) {
  return (<div className={"flex flex-col w-full h-full p-3"}>
    <div className={"w-full text-center mt-2 mb-3"}>
      <span className={"font-bold"}>채팅</span>
    </div>
    <div className={"w-full flex flex-col overflow-y-scroll"}>
      <SentMessage name={"김민석"} content={"테스트 메시지"} time={"2024-04-08 오후 01:43"} isBotRequest={false}/>
      <ReceivedMessage name={"사재헌"} content={"MoaBot! 채팅창에다가 테스트 메시지라고 출력해줄래?"} time={"04월 8일 오전 11:32"} isBotRequest={true}/>
      <BotMessage name={"Moa Bot"} content={"테스트 메시지"} time={"오후 1:38"}/>
      <ReceivedMessage name={"손의현"} content={"테스트 메시지"} time={"오후 1:38"}/>
      <ReceivedMessage name={"손의현"} content={"테스트 메시지"} time={"오후 1:38"}/>
      <ReceivedMessage name={"손의현"} content={"테스트 메시지"} time={"오후 1:38"}/>
      <ReceivedMessage name={"손의현"} content={"테스트 메시지"} time={"오후 1:38"}/>
      <ReceivedMessage name={"손의현"} content={"테스트 메시지"} time={"오후 1:38"}/>
      <ReceivedMessage name={"손의현"} content={"테스트 메시지"} time={"오후 1:38"}/>

    </div>
    <div className={"mt-auto"}>
      <ChatInput uuid={uuid}/>
    </div>
  </div>);
}