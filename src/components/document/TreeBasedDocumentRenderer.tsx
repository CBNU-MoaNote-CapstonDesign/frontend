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
        destination: `/app/docs/text/edit/${docId}/${segmentId}`, // 문서 수정 API 엔드포인트
        body: JSON.stringify(actions),
      });
    }
  };

  /*
   * 현재 노트 내용을 수정한 것이 반영이 안되는 버그가 있음.
   * 아래 코드에서 로그를 출력해 보며 테스트 해본 결과 프론트엔드에서 수정 사항을 전송하는데 딱히 문제를 찾지 못했음
   */

  // 로컬 변경사항을 전송하는 함수
  // 확인 사항1: Send 로그 출력 결과 변경사항 정상적으로 전송됨
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
    treeNoteRef.current = initialTree;
    setTreeNote(initialTree);
    setDocument({
      title: initialTree.title,
      id: uuid,
      content: initialTree.content,
    });

    // 로그
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

    // 노트 수정시 수정 내용 출력 로그
    // 확인 사항2: 수정 내용 및 기록 정상적으로 출력됨
    console.log("committed treeNoteRef:", treeNoteRef.current);

    // 수정된 노트가 무엇인지 출력 로그
    // 확인 사항3: 노트 ID 이상 없음
    console.log("committed document:", document);
  };

  // 노트 불러오기
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

            // 새로고침 등 처음 접속할 때 서버로 부터 받는 데이터 출력
            // 확인 사항4: 여기서 TextNoteSegement가 빈 배열로 옴 <- 버그의 원인
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
            updateBlur={() => {
              // 편집 종료 시 마지막 diff를 한 번 더 서버에 publish
              const latestContent = treeNoteRef.current.content;
              if (latestContent !== document.content) {
                const diff = getDiff(document.content, latestContent);
                if (diff.insertedContent)
                  treeNoteRef.current.insert(
                    diff.removeFrom,
                    diff.insertedContent
                  );
                if (diff.removeLength > 0)
                  treeNoteRef.current.remove(
                    diff.removeFrom,
                    diff.removeLength
                  );

                send(
                  treeNoteRef.current.operationHistories[
                    treeNote.operationHistories.length - 1
                  ]
                );
                commitActions();
              }
              endEditing();
            }}
            updateContent={(newContent: string) => {
              const diff = getDiff(document.content, newContent);
              console.log("diff:", diff);

              if (diff.insertedContent) {
                treeNoteRef.current.insert(
                  diff.removeFrom,
                  diff.insertedContent
                );

                // INSERT이후 트리 출력
                // 확인 사항5: 로그 출력 이상없음
                console.log("after insert:", treeNoteRef.current);
              }
              if (diff.removeLength > 0) {
                treeNoteRef.current.remove(diff.removeFrom, diff.removeLength);

                // REMOVE이후 트리 출력
                // 확인 사항6: 로그 출력 이상없음
                console.log("after remove:", treeNoteRef.current);
              }

              // 현재 까지 노트 수정 기록
              // 확인 사항7: 로그 이상 없음
              console.log(
                "operationHistories:",
                treeNoteRef.current.operationHistories
              );
              const lastOp =
                treeNoteRef.current.operationHistories[
                  treeNoteRef.current.operationHistories.length - 1
                ];

              // 마지맏 수정 작업 출력
              // 확인 사항8: 로그 이상 없음
              console.log("last operation:", lastOp);

              if (lastOp) send(lastOp);
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
