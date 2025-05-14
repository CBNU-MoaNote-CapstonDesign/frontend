import { fetchCurrentUserServerSide } from "@/libs/server/user";
import { redirect } from "next/navigation";

const LOGIN_URL = process.env.NEXT_PUBLIC_LOGIN_URL;

export default async function LoginPage() {

  const user = await fetchCurrentUserServerSide();

  if (!user) {
    // 미로그인시 백엔드 로그인 페이지로 이동
    if (LOGIN_URL)
      redirect(LOGIN_URL);
  } else {
    // 로그인 되어있으면 /main 으로 이동
    redirect("/main");
  }

  return (
    <div>
      <p>로그인 페이지로 이동 중...</p>
    </div>
  );
}