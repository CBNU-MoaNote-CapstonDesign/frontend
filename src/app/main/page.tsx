import {testData} from "@/__mocks__/data";
import {User} from "@/types/user";
import {cookies} from "next/headers";
import Profile from "@/components/layout/Profile";

export default async function Main() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL + "/api/auth/me";
  const documents = testData;

  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  let user: User | null = null;

  if (accessToken) {
    const res = await fetch(apiUrl, {
      headers: {
        Cookie: `accessToken=${accessToken}`
      },
      cache: 'no-store'
    });
    if (res.ok) {
      user = await res.json();
    }
  }

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
            documents.map((document) =>
              <li className={"w-full"} key={document.uuid}>
                <a className={"flex py-2 w-full overflow-ellipsis transition-all hover:bg-gray-50 hover:shadow duration-300"} href={"/doc/" + document.uuid}>
                  <div className={"flex flex-1 ps-2"}>{document.title}</div>
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