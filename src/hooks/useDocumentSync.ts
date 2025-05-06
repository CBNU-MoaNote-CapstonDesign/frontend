
import { useEffect, useRef } from 'react';
import {Client} from '@stomp/stompjs';
import toast from "react-hot-toast";
import debugToast from "@/libs/debugToast";
const SERVER_WS_URL = process.env.NEXT_PUBLIC_SERVER_WS_URL;
/**
 * WebSocket과 STOMP를 이용한 실시간 문서 동기화, LWW 알고리즘
 * @param uuid 문서 uuid
 * @param update stomp가 입력될 경우 content를 콜백하는 코드
 * @constructor
 */
const useDocumentSync = (uuid:string, update:(content: string)=>void) => {
  const timestampRef = useRef<number>(0);
  const clientRef = useRef<Client | null>(null);
  // TODO@ : 이 부분은 나중에 서버에서 받아온 uuid로 바꿔야함
  const docsSubWith = {
    'docId': '01968596-a431-70eb-890f-69af4abadaca',
    'userId': '01968596-a3fe-7ccf-ba92-84013b35657a'
  };
  const sync = (received:{stateId:string, timeStamp: number, value:{content:string}}) => {
    if (received.timeStamp > timestampRef.current) {
      update(received.value.content);
      timestampRef.current = received.timeStamp;
      debugToast(`received l[${timestampRef.current}] r[${received.timeStamp}] ${received.value.content}`, {position:"bottom-right"});
    }
  };
  const publish = (content: string) => {
    if (clientRef.current && clientRef.current.connected) {
      const updatedTimestamp = timestampRef.current + 1;
      clientRef.current.publish({
        destination: `/app/docs/edit/${uuid}`,
        body: JSON.stringify({stateId:docsSubWith.userId, timeStamp: updatedTimestamp, value:{content:content}}),
      });
      timestampRef.current = updatedTimestamp;
      debugToast(`publish l[${timestampRef.current}]`, {position:"bottom-right"});
    }
  };
  useEffect(() => {
    const client = new Client({
      brokerURL: `${SERVER_WS_URL}/docs`,
      reconnectDelay: 5000,
      onConnect: () => {
        if (process.env.DEBUG==='true')
          toast("연결시도 끝");
        client.subscribe(`/app/docs/${docsSubWith.docId}`, message => {
          try {
            const body = JSON.parse(message.body);
            sync(body);
          } catch {
            // body not fit
            toast.error("받은 정보의 body가 불충분함");
          }
        }, {'participantUserId': docsSubWith['userId']});
      },
      onWebSocketError: (event) => {
        toast.error("서버와의 연결이 실패하였습니다.",{position:"bottom-right"});
        console.error('WebSocket error:', event);
      },
      onStompError: (frame) => {
        toast.error("서버와 통신 도중 에러 발생",{position:"bottom-right"});
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