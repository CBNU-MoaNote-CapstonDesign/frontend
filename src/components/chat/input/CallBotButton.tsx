export default function CallBotButton({chat, uuid}: { chat: string, uuid: string }) {
  return (<button className={"items-center justify-center rounded-xl w-full cursor-pointer border"}>
    <span className={"text-xs font-light"}>Send To AI</span>
  </button>);
}