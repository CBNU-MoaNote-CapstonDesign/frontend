import DocumentRenderer from "@/components/document/DocumentRenderer";

export default async function Document({params}: { params: { uuid: string } }) {
  const {uuid} = await params;
  return (
    <div className={"max-w-lg mx-auto bg-white"}>
      <DocumentRenderer uuid={uuid} />
    </div>
  );
}
