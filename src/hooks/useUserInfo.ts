import {User} from "@/types/user";
import {testUser} from "@/__mocks__/data";
import {useEffect, useState} from "react";

const useUserInfo = (uuid:string, callback: (user: User | null) => void ) => {
  const [user,setUser] = useState<User | null>(null);
  // TODO 아래 testUser 대상으로 검색하는 코드 remove, BE 연결로 대체
  useEffect(() => {
    // 이 부분 promise then 으로 바꿔야 함
    // const res = fetch(`/api/user/${uuid}`, {
    //   method: "GET",
    //   credentials: "include",
    // });
    // const data = await res.json();
    const data = testUser.find((user) => user.uuid === uuid);
    try {
      setUser(data as User);
    } catch {
      setUser(null);
    }
  },[uuid]);

  useEffect(() => {
    callback(user);
  }, [callback, user]);
}

export default useUserInfo;