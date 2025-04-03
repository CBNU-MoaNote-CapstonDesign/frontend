"use client"

import { useEffect } from "react";

export default function Toast({ message, onDone, color }: { message: string; onDone: () => void; color: string }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDone();
    }, 1000);

    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className={"bg-["+color+"] text-white px-4 py-2 rounded-full shadow transition-all duration-300"}>
      {message}
    </div>
  );
}
