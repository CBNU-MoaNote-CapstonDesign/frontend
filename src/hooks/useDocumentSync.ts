import { useEffect, useRef } from 'react';
import {Client} from '@stomp/stompjs';
import toast from "react-hot-toast";

const SERVER_WS_URL = process.env.NEXT_PUBLIC_SERVER_WS_URL;

/**
 * WebSocket과 STOMP를 이용한 실시간 문서 동기화, LLW 알고리즘
 * @param uuid 문서 uuid
 * @param update stomp가 입력될 경우 content를 콜백하는 코드
 * @constructor
 */
const useDocumentSync = (uuid:string, update:(content: string)=>void) => {
  const timestampRef = useRef<number>(0);
  const clientRef = useRef<Client | null>(null);

  const sync = (received:{timestamp:number, content: string}) => {
    if (received.timestamp > timestampRef.current) {
      update(received.content);
      timestampRef.current = received.timestamp;
      // toast(`received`, {position:"bottom-right"});
      // toast(`received l[${timestampRef.current}] r[${received.timestamp}] ${received.content}`, {position:"bottom-right"});
    }
  };

  const publish = (content: string) => {
    if (clientRef.current && clientRef.current.connected) {
      const updatedTimestamp = timestampRef.current + 1;
      clientRef.current.publish({
        destination: `/edit/${uuid}`,
        body: JSON.stringify({timestamp: updatedTimestamp, content}),
      });
      timestampRef.current = updatedTimestamp;
      // toast(`publish`, {position:"bottom-right"});
    }
  };

  useEffect(() => {
    const client = new Client({
      brokerURL: `${SERVER_WS_URL}/docs`,
      reconnectDelay: 5000,
      onConnect: () => {
        client.subscribe(`/topic/docs/${uuid}`, message => {
          try {
            const body = JSON.parse(message.body);
            sync(body);
          } catch {
            // body not fit
          }
        });
      },
      onWebSocketError: (event) => {
        toast("서버와의 연결이 실패하였습니다.",{position:"bottom-right"})
        console.error('WebSocket error:', event);
      },

      onStompError: (frame) => {
        toast("서버와 통신 도중 에러 발생",{position:"bottom-right"});
        console.error('Broker error:', frame.headers['message']);
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, [uuid]);

  return { publish };
};

export default useDocumentSync;
