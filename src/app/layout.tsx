import type { Metadata } from "next";
import "./globals.css";
import React from "react";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "코드 포레스트",
  description: "코드 포레스트",
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
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin={"anonymous"}
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet"
        />
      </head>

      <body className={"noto-sans bg-white"}>
        <Toaster position="bottom-right" />
        {children}
      </body>
    </html>
  );
}
