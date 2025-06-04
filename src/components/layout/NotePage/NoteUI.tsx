import DocumentTitle from "@/components/document/DocumentTitle";
import DocumentRenderer from "@/components/document/DocumentRenderer";

/* 더이상 사용하지 않는 컴포넌트
* import TitleBlock from "@/components/layout/NotePage/TitleBlock";
* import TextBlock from "@/components/layout/NotePage/TextBlock";
* import DesignBlock from "@/components/layout/NotePage/DesignBlock";
* import AIChatBot from "@/components/layout/NotePage/AIChatBot";
*/

import { Note } from "@/types/note";

export default function NoteUI({ user, note }: { user: User; note?: Note }) {
  if (!note) {
    return (
      <main className="flex-1 h-[calc(100vh-6rem)] mt-24 ml-0 bg-[#f8fbff] rounded-l-2xl shadow-md overflow-auto flex flex-col items-center z-30">
        <div className="w-full max-w-4xl min-h-full flex flex-col gap-8 px-8 py-10 items-center justify-center">
          <span className="text-lg text-gray-400">노트를 선택하세요.</span>
        </div>
      </main>
    );
  }

  return (
    <main
      className="
        flex-1
        h-[calc(100vh-6rem)]
        mt-24
        ml-0
        bg-[#f8fbff]
        rounded-l-2xl
        shadow-md
        overflow-auto
        flex
        flex-col
        items-center
        z-30
      "
    >
      <div className="w-full max-w-4xl min-h-full flex flex-col gap-8 px-8 py-10">
        {/* 노트 제목이 아직 없으므로 ID로 표시 */}
        <DocumentTitle title={note.id} />
        <DocumentRenderer user={user} uuid={note.id} />

        {/* 더이상 사용하지 않는 컴포넌트 */}
        {/* <TitleBlock title={note.id} /> */}
        {/* <DesignBlock /> */}
        {/* <AIChatBot /> */}
      </div>
    </main>
  );
}