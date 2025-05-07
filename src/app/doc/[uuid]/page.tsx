import DocumentRenderer from "@/components/document/DocumentRenderer";
import HamburgerMenu from "@/components/layout/HamburgerMenu";
import ChatMenu from "@/components/chat/ChatMenu";
import {fetchCurrentUserServerSide} from "@/libs/server/user";

export default async function DocumentPage({params}: { params: { uuid: string } }) {
  const {uuid} = await params;
  const user = await fetchCurrentUserServerSide();

  return (
    <div className={"p-5"}>
      <HamburgerMenu title={"문서 목록"}/>
      {
        user &&
          <DocumentRenderer uuid={uuid} user={user}/>
      }
      {/*<ChatMenu uuid={uuid}/>*/}
    </div>
  );
}
