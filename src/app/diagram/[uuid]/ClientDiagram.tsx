"use client"

import dynamic from "next/dynamic";
import TopNavigationBar from "@/components/layout/NotePage/TopNavigationBar";
import ChatMenu from "@/components/chat/ChatMenu";

export default function ClientDiagram ({user, uuid}: { user:User, uuid: string }) {
  const DiagramRenderer = dynamic(
    () => import("@/components/diagram/DiagramRenderer"),
    { ssr: false }
  );

  return <div className="w-[100vw] h-[100vh]">
      <DiagramRenderer user={user} uuid={uuid} />
    <ChatMenu uuid={uuid} user={user}/>
  </div>
}