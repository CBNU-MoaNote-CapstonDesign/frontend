import DiagramRenderer from "@/components/diagram/DiagramRenderer";

export default async function Diagram({params}: { params: { uuid: string } }) {
  const {uuid} = await params;
  return (
    <div className={"max-w-4xl h-[500px] mx-auto p-5"}>
      <DiagramRenderer uuid={uuid} />
    </div>
  );
}
