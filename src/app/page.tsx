import TopNavigationBar from "@/components/layout/Home/TopNavigationBar";
import Main from "@/components/layout/Home/Main";
import BasicIntroduce from "@/components/layout/Home/BasicIntroduce";
import MoaAIIntroduce from "@/components/layout/Home/MoaAIIntroduce";
import Footer from "@/components/layout/Home/Footer";
import ContactLinkBar from "@/components/layout/Home/ContactLinkBar";
import FadeInOnView from "@/components/common/FadeInOnView";

export default function RootPage() {
  return (
    <div className="min-h-screen w-full bg-[#f0f8fe] flex flex-col items-center">
      <TopNavigationBar />
      <div className="flex flex-col items-center w-full max-w-6xl px-6 gap-[59px] mt-8">
        <FadeInOnView delay={0.35} className="w-full">
          <Main />
        </FadeInOnView>

        <BasicIntroduce />
        <MoaAIIntroduce />

        <FadeInOnView delay={0.35}>
          <Footer />
        </FadeInOnView>

        <ContactLinkBar />
      </div>
    </div>
  );
}
