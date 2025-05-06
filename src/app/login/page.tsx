export default function Login() {
  return (
    <div className={"h-[100svh] flex flex-col items-center justify-center"}>
      <div className={"text-3xl mb-5"}>
        모아노트 로그인
      </div>
      <form className="flex flex-col w-[300px] max-w-sm mx-auto p-4"
            method="POST"
            action="/api/auth/login">
        <input type="text" name="redirect" value="/main" hidden readOnly/>
        <input type="text" name="username" placeholder="Username" className="w-full mb-2 border p-2 rounded" required/>
        <input type="password" name="password" placeholder="Password" className="w-full mb-8 border p-2 rounded" required/>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded cursor-pointer">Login</button>
      </form>
    </div>)
}
