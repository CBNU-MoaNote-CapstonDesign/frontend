import DocumentRenderer from "@/components/document/DocumentRenderer";

export default async function Document({params}: { params: { uuid: string } }) {
  const {uuid} = await params;
  return (
    <div className={"max-w-4xl mx-auto bg-white p-5 shadow-md"}>
      <DocumentRenderer uuid={uuid} />
    </div>
  );
}
