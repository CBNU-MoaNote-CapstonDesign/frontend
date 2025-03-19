export default function Login() {
  return (
      <div>
        <form className="flex flex-col gap-2 max-w-sm mx-auto p-4" action={"/main"}>
          <input type="text" name="username" placeholder="Username" className="border p-2 rounded" required/>
          <input type="password" name="password" placeholder="Password" className="border p-2 rounded" required/>
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">Login</button>
        </form>
      </div>)
}
