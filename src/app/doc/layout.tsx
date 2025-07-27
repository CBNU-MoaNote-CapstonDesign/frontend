export default function DocumentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={"flex flex-col h-screen"}>
      <div className={"flex-1 w-full m-0 p-0"}>{children}</div>
    </div>
  );
}
