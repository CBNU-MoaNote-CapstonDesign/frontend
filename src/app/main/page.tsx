import { fetchCurrentUserServerSide } from "@/libs/server/user";
import { getFileList } from "@/libs/server/file";
import MainPageClient from "@/app/main/MainPageClient";

export default async function MainPage() {
  const user = await fetchCurrentUserServerSide();

  if (!user) {
    return <div>로그인 필요</div>;
  }

  const fileList = await getFileList(null, user);
  console.log(fileList);

  return <MainPageClient user={user} />;
}
