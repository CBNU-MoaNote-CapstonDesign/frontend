"use client";

import { useEffect, useRef, useState } from "react";
import type { Note } from "@/types/note";
import { TreeMarkdownEditor } from "@/components/document/TreeMarkdownEditor";
import { MarkdownRenderer } from "@/components/document/MarkdownRenderer";
import { TreeNote } from "@/libs/structures/treenote";
import getDiff from "@/libs/simpledDiff";
import type { CRDTOperation } from "@/types/crdtOperation";
import type { TextNoteSegmentDTO } from "@/types/dto";
import { Client } from "@stomp/stompjs";
import toast from "react-hot-toast";
import { Edit3, Eye } from "lucide-react";

const SERVER_WS_URL = process.env.NEXT_PUBLIC_SERVER_WS_URL;

export default function DocumentRenderer({
  user,
  uuid,
}: {
  user: User;
  uuid: string;
}) {
  const [treeNote, setTreeNote] = useState<TreeNote>(
    TreeNote.fromString(user.id, uuid, "loading...", "loading...")
  );
  const [document, setDocument] = useState<Note>({
    title: treeNote.title,
    id: uuid,
    content: treeNote.content,
  }); // 현재 문서 내용
  const [isEditing, setEditing] = useState<boolean>(false); // 현재 편집중인가?
  const [cursorPosition, setCursorPosition] = useState<number>(0); // 커서 위치
  const startEditing = () => setEditing(true);
  const endEditing = () => setEditing(false);

  const clientRef = useRef<Client | null>(null);
  const textNoteSegmentsRef = useRef<TextNoteSegmentDTO[]>([]);
  const treeNoteRef = useRef<TreeNote>(treeNote);

  /**
   * broadcast : operation을 백엔드에 전송하는 기능
   * 백엔드는 해당 operation을 채널에 접속된 모든 유저에게 전송한다.
   * @param docId
   * @param segmentId
   * @param actions CRDTOperation[] - 전송할 operation 배열
   */
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

  // 로컬 변경사항을 보내는거
  const send = (actions: CRDTOperation[]) => {
    console.log("Send ", actions);
    broadcast(document.id, treeNoteRef.current.id, actions);
  };

  // 다른데서 전파한 사항을 업데이트 하는거
  const update = (actions: CRDTOperation[]) => {
    console.log("Received actions: ", actions);
    for (const action of actions) {
      if (action.byWho === user.id) {
        console.log("Ignoring action by self");
        return; // 자신이 보낸건 무시
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
    console.log("initialized : " + initialTree.content);
    setDocument({
      ...document,
      id: uuid,
      content: initialTree.content,
    });
    treeNoteRef.current = initialTree;
    setTreeNote(treeNoteRef.current);
  };

  const commitActions = () => {
    treeNoteRef.current.traversal();
    console.log("applied : " + treeNoteRef.current.content);
    setDocument({
      ...document,
      content: treeNoteRef.current.content,
    });
    setTreeNote(treeNoteRef.current);
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
            if (body?.textNoteSegments) {
              textNoteSegmentsRef.current =
                body.textNoteSegments as TextNoteSegmentDTO[];
              initialize(textNoteSegmentsRef.current[0]);
              client.subscribe(
                `/topic/docs/text/${uuid}/${textNoteSegmentsRef.current[0].id}`,
                (message) => {
                  try {
                    const body = JSON.parse(message.body);
                    const actions = body as CRDTOperation[];
                    update(actions); // action 전달받았을 때 콜백 호출
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

      {/* 메인 콘텐츠 */}
      <div className="w-full pr-20">
        {isEditing ? (
          <TreeMarkdownEditor
            initialContent={document.content}
            updateBlur={endEditing}
            updateContent={(newContent: string) => {
              const diff = getDiff(document.content, newContent);

              if (diff.insertedContent)
                treeNoteRef.current.insert(
                  diff.removeFrom,
                  diff.insertedContent
                );
              if (diff.removeLength > 0)
                treeNoteRef.current.remove(diff.removeFrom, diff.removeLength);

              send(
                treeNoteRef.current.operationHistories[
                  treeNote.operationHistories.length - 1
                ]
              );
              commitActions();
            }}
            lastCursorPosition={cursorPosition}
            cursorHandler={setCursorPosition}
          />
        ) : (
          <MarkdownRenderer
            content={document?.content}
            startEditing={startEditing}
          />
        )}
      </div>
    </div>
  );
}
