"use client";

import { useEffect, useRef, useState } from "react";
import type { Note } from "@/types/note";
import { TreeMarkdownEditor } from "@/components/document/TreeMarkdownEditor";
import { MarkdownRenderer } from "@/components/document/MarkdownRenderer";
import { TreeNote } from "@/libs/structures/treenote";
import getDiff from "@/libs/simpledDiff";
import { CRDTOperation } from "@/types/crdtOperation";
import { TextNoteSegmentDTO } from "@/types/dto";
import { Client } from "@stomp/stompjs";
import toast from "react-hot-toast";
import { SelectionRange } from "@/types/selectionRange";
import { Edit3, Eye } from "lucide-react";

const SERVER_WS_URL = process.env.NEXT_PUBLIC_SERVER_WS_URL;

export default function DocumentRenderer({ user, uuid }: { user: User, uuid: string }) {
  const [treeNote, setTreeNote] = useState<TreeNote>(
    TreeNote.fromString(user.id, uuid, "loading...", "loading...")
  );
  const [document, setDocument] = useState<Note>({
    title: treeNote.title,
    id: uuid,
    content: treeNote.content,
  });
  const [isEditing, setEditing] = useState<boolean>(false);
  const [cursorPosition, setCursorPosition] = useState<SelectionRange>({ baseOffset: 0, extentOffset: 0 });

  const startEditing = () => setEditing(true);
  const endEditing = () => setEditing(false);

  const clientRef = useRef<Client | null>(null);
  const textNoteSegmentsRef = useRef<TextNoteSegmentDTO[]>([]);
  const treeNoteRef = useRef<TreeNote>(treeNote);

  const broadcast = (
    docId: string,
    segmentId: string,
    actions: CRDTOperation[]
  ) => {
    if (clientRef.current && clientRef.current.connected) {
      clientRef.current.publish({
        destination: `/app/docs/text/edit/${docId}/${segmentId}`,
        body: JSON.stringify(actions),
      });
    }
  };

  const send = (actions: CRDTOperation[]) => {
    console.log("Send ", actions);
    broadcast(document.id, treeNoteRef.current.id, actions);
  };

  const update = (actions: CRDTOperation[]) => {
    console.log("Received actions: ", actions);
    for (const action of actions) {
      if (action.byWho === user.id) {
        console.log("Ignoring action by self");
        return;
      }
      treeNoteRef.current.onAction(action);
    }
    commitActions();
  };

  const initialize = (segment: TextNoteSegmentDTO) => {
    const initialTree = TreeNote.fromTree(
      user.id,
      segment.id,
      "tree",
      segment.rootNode,
      segment.nodes
    );
    treeNoteRef.current = initialTree;
    setTreeNote(initialTree);
    setDocument({
      title: initialTree.title,
      id: uuid,
      content: initialTree.content,
    });

    console.log("initialized treeNoteRef:", treeNoteRef.current);
    console.log("initialized document:", document);
  };

  const commitActions = () => {
    treeNoteRef.current.traversal();
    setDocument({
      title: treeNoteRef.current.title,
      id: uuid,
      content: treeNoteRef.current.content,
    });
    setTreeNote(treeNoteRef.current);

    console.log("committed treeNoteRef:", treeNoteRef.current);
    console.log("committed document:", document);
  };

  useEffect(() => {
    console.log("useFugueDocumentSync useEffect called");
    const client = new Client({
      brokerURL: `${SERVER_WS_URL}/docs`,
      reconnectDelay: 5000,
      onConnect: () => {
        if (process.env.DEBUG === "true") toast("연결시도 끝");
        console.log(`/app/docs/text/participate/${uuid}`);
        client.subscribe(
          `/app/docs/text/participate/${uuid}`,
          (data) => {
            const body = JSON.parse(data.body);

            console.log("서버로 부터 받은 초기 노트 데이터:", body);

            if (body?.textNoteSegments && body.textNoteSegments.length > 0) {
              textNoteSegmentsRef.current =
                body.textNoteSegments as TextNoteSegmentDTO[];
              initialize(textNoteSegmentsRef.current[0]);
              client.subscribe(
                `/topic/docs/text/${uuid}/${textNoteSegmentsRef.current[0].id}`,
                (message) => {
                  try {
                    const body = JSON.parse(message.body);
                    const actions = body as CRDTOperation[];
                    update(actions);
                  } catch {
                    toast.error(
                      "전달 받은 정보의 body가 Operation 형식이 아닙니다. : " +
                        message.body
                    );
                  }
                }
              );
            }
          },
          { participantUserId: user.id }
        );
      },
      onWebSocketError: (event) => {
        toast.error("서버와의 연결이 실패하였습니다.", {
          position: "bottom-right",
        });
        console.error("WebSocket error:", event);
      },
      onStompError: (frame) => {
        toast.error("서버와 통신 도중 에러 발생", { position: "bottom-right" });
        console.error("Broker error:", frame.headers["message"]);
      },
    });
    client.activate();
    clientRef.current = client;
    return () => {
      client.deactivate();
    };
  }, [uuid]);

  return (
    <div
      className={`
        w-full bg-gradient-to-br from-white via-slate-50 to-white rounded-2xl shadow-sm border border-slate-100 px-8 py-6 flex items-start transition-all duration-300 ease-in-out relative overflow-hidden group
        ${
          !isEditing
            ? "hover:shadow-lg hover:border-slate-200 hover:bg-gradient-to-br hover:from-blue-50 hover:via-white hover:to-slate-50 cursor-pointer"
            : "shadow-lg border-blue-200 bg-gradient-to-br from-blue-50 via-white to-slate-50"
        }
      `}
      key={treeNoteRef.current.id}
      onClick={() => {
        if (!isEditing) startEditing();
      }}
    >
      {/* 상태 표시 아이콘 */}
      <div className="absolute top-4 right-4 opacity-60 transition-opacity duration-200 group-hover:opacity-100">
        {isEditing ? (
          <div className="flex items-center gap-2 text-blue-600">
            <Edit3 className="w-4 h-4" />
            <span className="text-xs font-medium">편집 중</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-slate-500">
            <Eye className="w-4 h-4" />
            <span className="text-xs font-medium">읽기 모드</span>
          </div>
        )}
      </div>

      {/* 장식적 요소 */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

      {isEditing ? (
        <TreeMarkdownEditor
          initialContent={document.content}
          updateContent={(newContent: string) => {
            const diff = getDiff(document.content, newContent);
            if (!diff) return;

            if (diff.insertedContent)
              treeNoteRef.current.insert(diff.removeFrom, diff.insertedContent);
            if (diff.removeLength > 0)
              treeNoteRef.current.remove(diff.removeFrom, diff.removeLength);

            send(treeNoteRef.current.operationHistories[treeNoteRef.current.operationHistories.length - 1]);
            commitActions();
          }}
          lastCursorPosition={cursorPosition}
          cursorHandler={setCursorPosition}
          onBlur={() => {
            endEditing();
          }}
        />
      ) : (
        <MarkdownRenderer
          content={document?.content}
          startEditing={startEditing}
        />
      )}
    </div>
  );
}