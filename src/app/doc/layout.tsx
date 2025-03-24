import TopBar from "@/components/layout/TopBar";

export default function DocumentLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>){
  return <div className={"flex flex-col h-screen"}>
    <TopBar title={"test"}/>
    <div className={"flex-1 w-full bg-gray-200"}>
      {children}
    </div>
  </div>
}