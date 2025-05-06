import type { Metadata } from "next";
import "./globals.css";
import React from "react";
import {Toaster} from "react-hot-toast";

import Home from "@/components/layout/Home";

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
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin={"anonymous"}/>
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet"/>
      </head>

      <body className={"noto-sans bg-white"}>
        <Toaster position="bottom-right"/>
        <Home />
        {/* {children} */}
      </body>
    </html>
  );
}
