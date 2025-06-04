import TopNavigationBar from "@/components/layout/Home/TopNavigationBar";
import Main from "@/components/layout/Home/Main"
import BasicIntroduce from "@/components/layout/Home/BasicIntroduce"
import MoaAIIntroduce from "@/components/layout/Home/MoaAIIntroduce"
import Footer from "@/components/layout/Home/Footer";
import ContactLinkBar from "@/components/layout/Home/ContactLinkBar"

export default function RootPage() {
  return (
    <div>
      <div className="flex flex-col justify-start items-center w-full relative gap-[59px] bg-[#f0f8fe]">
        <TopNavigationBar />
        <Main />
        <BasicIntroduce />
        <MoaAIIntroduce />
        <Footer />
        <ContactLinkBar />
      </div>
    </div>
  );
}