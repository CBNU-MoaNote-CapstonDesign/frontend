export default function MainLayout({
                                         children,
                                       }: Readonly<{
  children: React.ReactNode;
}>){
  return <div className={"flex flex-col h-screen items-center"}>
    <div className={"w-full max-w-4xl m-0"}>
      {children}
    </div>
  </div>
}