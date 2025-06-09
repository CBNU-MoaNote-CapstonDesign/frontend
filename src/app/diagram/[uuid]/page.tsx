import {fetchCurrentUserServerSide} from "@/libs/server/user";
import ClientDiagram from "@/app/diagram/[uuid]/ClientDiagram";

export default async function Diagram({params}: { params: { uuid: string } }) {
  const {uuid} = await params;

  const user = await fetchCurrentUserServerSide();
  if (!user) return <div>로그인 필요</div>;

  return (
    <div className={"max-w-4xl h-[500px] mx-auto p-5"}>
      <ClientDiagram user={user} uuid={uuid}/>
    </div>
  );
}
