import TitleBlock from "@/components/layout/NotePage/TitleBlock";
import TextBlock from "@/components/layout/NotePage/TextBlock";
import DesignBlock from "@/components/layout/NotePage/DesignBlock";
import AIChatBot from "@/components/layout/NotePage/AIChatBot";

export default function NoteUI() {
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
                <TitleBlock />
                <TextBlock />
                <DesignBlock />
                <AIChatBot />
            </div>
        </main>
    );
}