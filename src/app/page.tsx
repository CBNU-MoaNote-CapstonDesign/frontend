"use client";

import dynamic from "next/dynamic";

// `App` 컴포넌트를 동적으로 불러오기 (SSR 비활성화)
const App = dynamic(() => import("../components/App"), {
  ssr: false, // 서버 사이드 렌더링 비활성화
});

export default function Home() {
  return <App />;
}
