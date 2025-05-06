import Profile from "@/components/layout/Profile";
import {fetchCurrentUserServerSide} from "@/libs/user";
import {fetchNotesServerSide} from "@/libs/note";

export default async function Main() {
  const user = await fetchCurrentUserServerSide();
  if (!user) {
    return <div>
      로그인 필요
    </div>
  }

  const notes = await fetchNotesServerSide(user.id);

  return (
    <div className={"w-full p-5 flex"}>
      <div className={"me-10 rounded-2xl bg-gray-100 p-5 pb-10"}>
        <Profile name={user ? user.name : ""}/>
        <ul className={"ms-5"}>
          <li className={"cursor-pointer py-1"}>내 정보</li>
          <li className={"cursor-pointer py-1 font-bold"}>문서 목록</li>
          <li className={"cursor-pointer py-1"}>설정</li>
        </ul>
      </div>
      <div className={"w-full p-5"}>
        <h1 className={"text-3xl font-bold mb-5"}>문서 목록</h1>
        <ul>
          <li className={"flex w-full text-gray-700 font-light pb-2 border-b border-gray-500"}>
            <div className={"flex flex-1 ps-2"}>Title</div>
            <div className={"w-[80px] px-2"}>Owner</div>
            <div className={"w-[120px] text-center"}>Last Modified</div>
          </li>
          {
            notes.map((note) =>
              <li className={"w-full"} key={note.id}>
                <a className={"flex py-2 w-full overflow-ellipsis transition-all hover:bg-gray-50 hover:shadow duration-300"} href={"/doc/" + note.id}>
                  <div className={"flex flex-1 ps-2"}>{note.id /* TODO: note에 title나오면 title로 변경*/}</div>
                  <div className={"w-[80px] px-2"}>Kim</div>
                  <div className={"w-[120px] text-center"}> </div>
                </a>
              </li>
            )
          }
        </ul>
      </div>
    </div>)
}