import { RiRobot2Line } from "react-icons/ri";

export default function ReceivedMessage({
  name,
  content,
  time,
  isBotRequest,
}: {
  name: string;
  content: string;
  time: string;
  isBotRequest?: boolean;
}) {
  return (
    <div className={"w-full px-2 py-5"}>
      <div className={"mb-2"}>
        <span className={"font-light"}>{name}</span>
        <span className={"text-xs"}>
          &nbsp; &nbsp;
          {time}
        </span>
      </div>
      <div className={"me-auto w-[90%] p-2 bg-gray-50 rounded-xl shadow-sm"}>
        {isBotRequest && (
          <div className={"flex"}>
            <RiRobot2Line size={16} />
            &nbsp;
            <span className={"text-blue-700"}>AI 호출</span>
          </div>
        )}
        <span>{content}</span>
      </div>
    </div>
  );
}
