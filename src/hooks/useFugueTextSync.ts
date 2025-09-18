import { useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import {TreeNote} from "@/libs/structures/treenote";
import {Note} from "@/types/note";
import {TextNoteSegmentDTO} from "@/types/dto";
import {CRDTOperation} from "@/types/crdtOperation";

const SERVER_WS_URL = process.env.NEXT_PUBLIC_SERVER_WS_URL;

export default function useFugueTextSync(user: User, uuid: string) {
  const [treeNote, setTreeNote] = useState<TreeNote>(
    TreeNote.fromString(user.id, uuid, "loading...", "loading...")
  );
  const [document, setDocument] = useState<Note>({
    title: treeNote.title,
    id: uuid,
    content: treeNote.content,
  });

  const clientRef = useRef<Client | null>(null);
  const textNoteSegmentsRef = useRef<TextNoteSegmentDTO[]>([]);
  const treeNoteRef = useRef<TreeNote>(treeNote);

  const broadcast = (docId: string, segmentId: string, actions: CRDTOperation[]) => {
    if (clientRef.current?.connected) {
      clientRef.current.publish({
        destination: `/app/docs/text/edit/${docId}/${segmentId}`,
        body: JSON.stringify(actions),
      });
    }
  };

  const send = (actions: CRDTOperation[]) => {
    broadcast(document.id, treeNoteRef.current.id, actions);
  };

  const update = (actions: CRDTOperation[]) => {
    for (const action of actions) {
      if (action.byWho === user.id) return; // 자기 자신 액션 무시
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
  };

  const commitActions = () => {
    treeNoteRef.current.traversal();
    setDocument({
      title: treeNoteRef.current.title,
      id: uuid,
      content: treeNoteRef.current.content,
    });
    setTreeNote(treeNoteRef.current);
  };

  useEffect(() => {
    const client = new Client({
      brokerURL: `${SERVER_WS_URL}/docs`,
      reconnectDelay: 5000,
      onConnect: () => {
        client.subscribe(
          `/app/docs/text/participate/${uuid}`,
          (data) => {
            const body = JSON.parse(data.body);
            if (body?.textNoteSegments?.length > 0) {
              textNoteSegmentsRef.current = body.textNoteSegments;
              initialize(textNoteSegmentsRef.current[0]);
              client.subscribe(
                `/topic/docs/text/${uuid}/${textNoteSegmentsRef.current[0].id}`,
                (message) => {
                  const actions = JSON.parse(message.body) as CRDTOperation[];
                  update(actions);
                }
              );
            }
          },
          { participantUserId: user.id }
        );
      },
      onWebSocketError: (event) => {
        console.error("WebSocket error:", event);
      },
      onStompError: (frame) => {
        console.error("Broker error:", frame.headers["message"]);
      },
    });

    client.activate();
    clientRef.current = client;
    return () => {
      client.deactivate();
    };
  }, [uuid]);

  return { treeNoteRef, document, send, commitActions };
}