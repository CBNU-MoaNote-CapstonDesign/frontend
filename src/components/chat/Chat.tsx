import ChatInput from "@/components/chat/input/ChatInput";
import MessageList from "@/components/chat/message/MessageList";

export default function Chat({uuid}: { uuid: string }) {
  return (<div className={"flex flex-col w-full h-full p-3"}>
    <div className={"w-full text-center mt-2 mb-3"}>
      <span className={"font-bold"}>채팅</span>
    </div>
    <div className={"w-full flex flex-col overflow-y-scroll"}>
      <MessageList uuid={uuid} />
    </div>
    <div className={"mt-auto"}>
      <ChatInput uuid={uuid}/>
    </div>
  </div>);
}