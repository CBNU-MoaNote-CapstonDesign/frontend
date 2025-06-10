
import { useEffect, useRef } from 'react';
import {Client} from '@stomp/stompjs';
import toast from "react-hot-toast";
import {CRDTOperation} from "@/types/crdtOperation";
import {TextNoteSegmentDTO} from "@/types/dto";

const SERVER_WS_URL = process.env.NEXT_PUBLIC_SERVER_WS_URL;
/**
 * WebSocket과 STOMP를 이용한 실시간 문서 동기화, Operation 기반
 * @param user 현재 문서를 편집하는 유저
 * @param uuid 문서 uuid
 * @param onAction 백엔드에서 받은 action(operation)이 도착했을 때 FE에서 적용하는 콜백
 * @constructor
 */
const useFugueDocumentSync = (uuid:string, onAction:(actions: CRDTOperation[])=>void, initialize:(segment: TextNoteSegmentDTO)=>void) => {
  const clientRef = useRef<Client | null>(null);
  const textNoteSegmentsRef = useRef<TextNoteSegmentDTO[]>([]);

  /**
   * broadcast : operation을 백엔드에 전송하는 기능
   * 백엔드는 해당 operation을 채널에 접속된 모든 유저에게 전송한다.
   * @param actions CRDTOperation[] - 전송할 operation 배열
   */
  const broadcast = (actions: CRDTOperation[]) => {
    if (clientRef.current && clientRef.current.connected) {
      clientRef.current.publish({
        destination: `/app/docs/tree/edit/${uuid}`,
        body: JSON.stringify(actions),
      });
    };
  };

  useEffect(() => {
    console.log("useFugueDocumentSync useEffect called");
    const client = new Client({
      brokerURL: `${SERVER_WS_URL}/docs`,
      reconnectDelay: 5000,
      onConnect: () => {
        if (process.env.DEBUG==='true')
          toast("연결시도 끝");
        client.subscribe(`/app/docs/text/participate/${uuid}`, (data) => {
          const body = JSON.parse(data.body);
          if(body?.textNoteSegments) {
            textNoteSegmentsRef.current = body.textNoteSegments as TextNoteSegmentDTO[];
            initialize(textNoteSegmentsRef.current[0]);
            client.subscribe(`/topic/docs/text/${uuid}/${textNoteSegmentsRef.current[0].id}`, (message) => {
              try {
                const body = JSON.parse(message.body);
                const actions = body as CRDTOperation[];
                onAction(actions); // action 전달받았을 때 콜백 호출
              } catch {
                toast.error("전달 받은 정보의 body가 Operation 형식이 아닙니다. : " + message.body);
              }
            });
          }
        });
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
  return { broadcast };
};
export default useFugueDocumentSync;