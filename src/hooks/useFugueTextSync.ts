import { useCallback, useEffect, useRef, useState } from "react";
import { Client, type StompSubscription } from "@stomp/stompjs";
import {TreeNote} from "@/libs/structures/treenote";
import {Note} from "@/types/note";
import {TextNoteSegmentDTO} from "@/types/dto";
import {CRDTOperation} from "@/types/crdtOperation";

const SERVER_WS_URL = process.env.NEXT_PUBLIC_SERVER_WS_URL;

export type RemoteCaret = {
  userId: string;
  username: string;
  color: string;
  lineNumber: number;
  columnNumber: number;
};

type CaretMap = Record<string, RemoteCaret>;

const CARET_COLORS = [
  "#FF5252",
  "#FF7043",
  "#FF9800",
  "#FFC107",
  "#FFEB3B",
  "#8BC34A",
  "#4CAF50",
  "#009688",
  "#00BCD4",
  "#2196F3",
  "#3F51B5",
  "#673AB7",
  "#9C27B0",
  "#E91E63",
];

const pickRandomCaretColor = () =>
  CARET_COLORS[Math.floor(Math.random() * CARET_COLORS.length)];

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
  const caretListenersRef = useRef(new Set<(carets: CaretMap) => void>());
  const caretStateRef = useRef<CaretMap>({});
  const caretColorRef = useRef<string>(pickRandomCaretColor());
  const lastCaretPayloadRef = useRef<string | null>(null);
  const textSubscriptionRef = useRef<StompSubscription | null>(null);
  const caretSubscriptionRef = useRef<StompSubscription | null>(null);

  const broadcast = useCallback(
    (docId: string, segmentId: string, actions: CRDTOperation[]) => {
      if (clientRef.current?.connected) {
        clientRef.current.publish({
          destination: `/app/docs/text/edit/${docId}/${segmentId}`,
          body: JSON.stringify(actions),
        });
      }
    },
    []
  );

  const commitActions = useCallback(() => {
    treeNoteRef.current.traversal();
    setDocument({
      title: treeNoteRef.current.title,
      id: uuid,
      content: treeNoteRef.current.content,
    });
    setTreeNote(treeNoteRef.current);
  }, [uuid]);

  const send = useCallback(
    (actions: CRDTOperation[]) => {
      broadcast(document.id, treeNoteRef.current.id, actions);
    },
    [broadcast, document.id]
  );

  const update = useCallback(
    (actions: CRDTOperation[]) => {
      for (const action of actions) {
        if (action.byWho === user.id) return; // 자기 자신 액션 무시
        treeNoteRef.current.onAction(action);
      }
      commitActions();
    },
    [commitActions, user.id]
  );

  const subscribeToSegmentTopics = useCallback(
    (client: Client, segmentId: string) => {
      textSubscriptionRef.current?.unsubscribe();
      caretSubscriptionRef.current?.unsubscribe();

      textSubscriptionRef.current = client.subscribe(
        `/topic/docs/text/${uuid}/${segmentId}`,
        (message) => {
          const actions = JSON.parse(message.body) as CRDTOperation[];
          update(actions);
        }
      );

      caretSubscriptionRef.current = client.subscribe(
        `/topic/docs/caret/${uuid}/${segmentId}`,
        (message) => {
          try {
            const parsed = JSON.parse(message.body) as RemoteCaret & {
              Color?: string;
            };
            if (!parsed || !parsed.userId || parsed.userId === user.id) return;
            const caret: RemoteCaret = {
              userId: parsed.userId,
              username: parsed.username,
              color: parsed.color ?? parsed.Color ?? CARET_COLORS[0],
              lineNumber: parsed.lineNumber,
              columnNumber: parsed.columnNumber,
            };
            caretStateRef.current = {
              ...caretStateRef.current,
              [caret.userId]: caret,
            };
            const snapshot = { ...caretStateRef.current };
            caretListenersRef.current.forEach((listener) => listener(snapshot));
          } catch (error) {
            console.error("Failed to parse caret payload", error);
          }
        }
      );
    },
    [update, user.id, uuid]
  );

  const initialize = useCallback(
    (segment: TextNoteSegmentDTO) => {
      const initialTree = TreeNote.fromTree(
        user.id,
        segment.id,
        "tree",
        segment.rootNode,
        segment.nodes
      );
      treeNoteRef.current = initialTree;
      caretStateRef.current = {};
      setTreeNote(initialTree);
      setDocument({
        title: initialTree.title,
        id: uuid,
        content: initialTree.content,
      });
    },
    [user.id, uuid]
  );

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
              const segmentId = textNoteSegmentsRef.current[0].id;
              if (segmentId) {
                subscribeToSegmentTopics(client, segmentId);
              }
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

    clientRef.current = client;
    client.activate();
    return () => {
      client.deactivate();
    };
  }, [initialize, subscribeToSegmentTopics, update, user.id, uuid]);

  const subscribeToCarets = useCallback((listener: (carets: CaretMap) => void) => {
    caretListenersRef.current.add(listener);
    listener({...caretStateRef.current});
    return () => {
      caretListenersRef.current.delete(listener);
    };
  }, []);

  const sendCaret = useCallback(
    (lineNumber: number, columnNumber: number) => {
      if (!clientRef.current?.connected) return;
      const segmentId = treeNoteRef.current?.id;
      if (!segmentId) return;
      const payload = {
        userId: user.id,
        username: user.name,
        color: caretColorRef.current,
        lineNumber,
        columnNumber,
      };
      const serializedPayload = JSON.stringify(payload);
      if (serializedPayload === lastCaretPayloadRef.current) return;
      lastCaretPayloadRef.current = serializedPayload;
      clientRef.current.publish({
        destination: `/app/docs/text/caret/${uuid}/${segmentId}`,
        body: serializedPayload,
      });
    },
    [user.id, user.name, uuid]
  );

  return { treeNoteRef, document, send, commitActions, subscribeToCarets, sendCaret };
}