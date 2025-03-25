"use client"

import {useEffect, useState} from "react";
import {MoaText} from "@/types/document";
import {MarkdownEditor} from "@/components/document/MarkdownEditor";
import {MarkdownRenderer} from "@/components/document/MarkdownRenderer";
import DocumentTitle from "@/components/document/DocumentTitle";

export default function DocumentRenderer({uuid}: { uuid: string }) {
  const [document, setDocument] = useState<MoaText | null>(null);
  const [isEditing, setEditing] = useState<boolean>(false);

  const setContent = (content: string) => {
    if (document) {
      const newDocument: MoaText = {
        uuid: document.uuid,
        title: document.title,
        content: content,
      }
      setDocument(newDocument);
    }
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL + "/api/doc/" + uuid;

  useEffect(() => {
    try {
      fetch(apiUrl).then((res) => {
        if (res.status == 400) {
          throw new Error(`Login required ${res.status}`);
        }

        if (!res.ok) {
          throw new Error(`Failed Document Fetching ${res.status}`);
        }

        res.json().then((json) => {
          setDocument(json as MoaText);
        })
      });
    } catch {
      // TODO : 문서를 불러올 수 없습니다. 화면에 띄우기. 별도의 error messagebox 를 만들어야 할 거 같음
    }
  }, [uuid]);

  const startEditing = () => {
    setEditing(true);
  }

  const endEditing = () => {
    setEditing(false);
  }

  return (
    <div className={"w-full"} key={uuid}>
      <DocumentTitle uuid={uuid}/>
      {
        isEditing ?
          <MarkdownEditor initialContent={document?.content} updateBlur={endEditing} updateContent={setContent}/>
          :
          <MarkdownRenderer content={document?.content} startEditing={startEditing}/>
      }
    </div>
  );
}

