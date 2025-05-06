'use client'

import {useState} from "react";
import {NoteMeta} from "@/types/note";

export default function DocumentTitle({uuid}: { uuid: string }) {
  const [title, setTitle] = useState<string>("");
  const apiURL = process.env.NEXT_PUBLIC_API_URL + "/api/doc/meta/" + uuid;

  fetch(apiURL).then(
    (res) => {
      res.json().then((json) => {
        const meta = json as NoteMeta;
        setTitle(meta.title);
      })
    }
  )

  return <div key={title} className={" flex w-full border-b border-gray-500 text-2xl font-black mb-5 pb-5 pl-2 text-[#4B1C2D]"}>
    {title}
  </div>
}