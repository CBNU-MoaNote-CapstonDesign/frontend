import {testData} from "@/__mocks__/data";
import {User} from "@/types/user";
import {cookies} from "next/headers";

export default async function Home() {
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
    <div>
      <div>
        환영합니다. {user?.name} 님!
      </div>
      <h1>
        내 문서 목록
      </h1>
      <ul>
        {
          documents.map((document) => {
            return <li key={document.uuid}><a href={"/doc/" + document.uuid}>{document.title}</a></li>
          })
        }
      </ul>
    </div>)
}