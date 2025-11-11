import { RiRobot2Line } from "react-icons/ri";

export default function SentMessage({
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
      <div className={"ms-auto mb-2 text-right"}>
        <span className={"text-xs"}>
          {time}
          &nbsp; &nbsp;
        </span>
        <span className={"font-light"}>{name}</span>
      </div>
      <div className={"p-2 ms-auto w-[90%] rounded-xl bg-gray-200 shadow-sm"}>
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
