import {fetchNote} from "@/libs/server/note";

export default async function page() {
  let data = fetchNote()
  return (
    <div>
      <p>로그인 페이지로 이동 중...</p>
    </div>
  );
}