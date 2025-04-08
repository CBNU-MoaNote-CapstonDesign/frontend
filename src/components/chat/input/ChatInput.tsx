import ChatTextarea from "@/components/chat/input/ChatTextarea";
import SendButton from "@/components/chat/input/SendButton";
import CallBotButton from "@/components/chat/input/CallBotButton";

export default function ChatInput({uuid}:{uuid:string})
{
  return <div className={"flex"}>
    <div className={"flex flex-1"}>
      <ChatTextarea/>
    </div>
    <div className={"flex flex-col ms-3 w-20"}>
      <div className={"mb-2"}>
        <CallBotButton chat={""} uuid={uuid}/>
      </div>
      <SendButton chat={""} uuid={uuid}/>
    </div>
  </div>
}