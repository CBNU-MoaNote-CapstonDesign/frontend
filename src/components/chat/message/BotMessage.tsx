import { RiRobot2Line } from "react-icons/ri";
export default function BotMessage({name, content, time}: { name: string, content: string, time: string }) {
  return (<div className={"w-full px-2 py-5"}>
    <div className={"mb-2"}>
      <span className={"font-light"}>
        {name}&nbsp;&nbsp;<span className={"text-xs text-blue-700 font-medium"}>AI</span>
      </span>
      <span className={"text-xs"}>
        &nbsp;
        &nbsp;
        {time}
      </span>
    </div>
    <div className={"me-auto w-[90%] p-2 bg-blue-100 rounded-xl shadow-sm"}>
      <RiRobot2Line size={16} className={"mb-2"}/>
      <span>
        {content}
      </span>
    </div>
  </div>);
}