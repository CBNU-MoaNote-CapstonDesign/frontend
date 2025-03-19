
export default function Home() {
    const username: string = "Minseok Kim";
    const documents: Array<{ title: string; uuid: string }> = [
        {
            title: "내 문서 1",
            uuid: "245c792b-c156-4e32-874b-eb0186a06840"
        },
        {
            title: "내 문서 2",
            uuid: "23942e5e-0399-4c08-bab5-b775938a2952"
        },
        {
            title: "내 문서 3",
            uuid: "2448cea4-66c8-488b-89af-122c3006212b"
        },
        {
            title: "내 문서 4",
            uuid: "75551b52-6d2e-4f8f-bc00-22f7447990d3"
        }
    ];

    return (
        <div>
            <div>
                환영합니다. {username} 님!
            </div>
            <h1>
                내 문서 목록
            </h1>
            <ul>
                {
                    documents.map((document)=>{
                        return <li key={document.uuid}><a href={"/doc/"+document.uuid}>{document.title}</a></li>
                    })
                }
            </ul>
        </div>)
}