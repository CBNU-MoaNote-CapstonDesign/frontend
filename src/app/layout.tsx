import type { Metadata } from "next";
import "./globals.css";
import React from "react";
import { Toaster } from "react-hot-toast";

import TopNavigationBar from "@/components/layout/Home/TopNavigationBar";
import Main from "@/components/layout/Home/Main"
import BasicIntroduce from "@/components/layout/Home/BasicIntroduce"
import MoaAIIntroduce from "@/components/layout/Home/MoaAIIntroduce"
import Final from "@/components/layout/Home/Final"
import ContactLink from "@/components/layout/Home/ContactLink"

export const metadata: Metadata = {
	title: "모아노트",
	description: "세상의 모든 아이디어를 모아, 모아노트",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<head>
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin={"anonymous"} />
				<link href="https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
			</head>

			<body className={"noto-sans bg-white"}>
				<div className="flex flex-col justify-start items-center w-full relative gap-[59px] bg-[#f0f8fe]">
					<Toaster position="bottom-right" />
					<TopNavigationBar />
					<Main />
					<BasicIntroduce />
					<MoaAIIntroduce />
					<Final />
					<ContactLink />

					{/* {children} */}
				</div>
			</body>
		</html>
	);
}