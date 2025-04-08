import DocumentRenderer from "@/components/document/DocumentRenderer";
import HamburgerMenu from "@/components/layout/HamburgerMenu";
import ChatMenu from "@/components/chat/ChatMenu";

export default async function DocumentPage({params}: { params: { uuid: string } }) {
  const {uuid} = await params;
  return (
    <div className={"p-5"}>
      <HamburgerMenu title={"문서 목록"}/>
      <DocumentRenderer uuid={uuid} />
      <ChatMenu uuid={uuid} />
    </div>
  );
}
