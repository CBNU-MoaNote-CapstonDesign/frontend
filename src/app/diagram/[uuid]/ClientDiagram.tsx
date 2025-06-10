"use client"

import dynamic from "next/dynamic";
import TopNavigationBar from "@/components/layout/NotePage/TopNavigationBar";
import ChatMenu from "@/components/chat/ChatMenu";

export default function ClientDiagram ({user, uuid}: { user:User, uuid: string }) {
  const DiagramRenderer = dynamic(
    () => import("@/components/diagram/DiagramRenderer"),
    { ssr: false }
  );

  return <div className="flex flex-col justify-start w-full relative gap-[59px] bg-[#f0f8fe]">
    <TopNavigationBar user={user} selectedNoteId={uuid} />
    <div className="flex flex-row w-full pt-24">
      <DiagramRenderer user={user} uuid={uuid} />
    </div>
    <ChatMenu uuid={"1234"} user={user}/>
  </div>
}