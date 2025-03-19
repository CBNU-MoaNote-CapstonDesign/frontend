const testData = [
    {
        title: "내 문서 1",
        uuid: "245c792b-c156-4e32-874b-eb0186a06840",
        content: "문서1의 내용"
    },
    {
        title: "내 문서 2",
        uuid: "23942e5e-0399-4c08-bab5-b775938a2952",
        content: "문서2의 내용"
    },
    {
        title: "내 문서 3",
        uuid: "2448cea4-66c8-488b-89af-122c3006212b",
        content: "문서3의 내용"
    },
    {
        title: "내 문서 4",
        uuid: "75551b52-6d2e-4f8f-bc00-22f7447990d3",
        content: "문서4의 내용"
    }];

function getDocumentFromUUID(uuid:string):{title:string, uuid:string, content:string}|null {
    const document = testData.find((document)=>(uuid == document.uuid));
    if(document)
        return document
    else
        return null;
}

export default function Document({ params }: { params: { uuid: string }}) {
    const uuid = params.uuid
    const document = getDocumentFromUUID(uuid);
    if(!document)
        return <div>
            해당 문서가 없습니다.
        </div>
    return <div>
        <h1>제목 : {document.title}</h1>
        <div>
            내용 : {document.content}
        </div>
    </div>;
}