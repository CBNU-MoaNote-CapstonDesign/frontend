"use client"

import dynamic from "next/dynamic";

export default function ClientDiagram ({user, uuid}: { user:User, uuid: string }) {
  const DiagramRenderer = dynamic(
    () => import("@/components/diagram/DiagramRenderer"),
    { ssr: false }
  );

  return <DiagramRenderer user={user} uuid={uuid} />
}