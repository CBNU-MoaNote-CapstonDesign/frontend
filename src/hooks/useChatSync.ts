/* TODO
 * 1. receive / send 기능 쪼개기
 * 2. send 할 때는 프론트는 오직 content 만 보내도록 하고, uuid, sender, date, time 은 백엔드에서 처리하도록 설계 (보안 이슈)
 */
import {useEffect, useRef} from 'react';
import {SendMessage, ChatMessage} from '@/types/chat';
import {Client} from '@stomp/stompjs';
import toast from "react-hot-toast";

const SERVER_WS_URL = process.env.NEXT_PUBLIC_SERVER_WS_URL;

/**
 * WebSocket과 STOMP를 이용한 실시간 채팅 동기화
 * @param uuid 문서 uuid
 * @param update stomp에 새로운 채팅이 들어왔을 때 업데이트 하는 함수
 * @constructor
 */
const useChatSync = (uuid: string, update?: (messages: Array<ChatMessage>) => void): ((message: SendMessage) => (void)) => {
    const clientRef = useRef<Client | null>(null);
    const messagesRef = useRef<Array<ChatMessage>>([]);

    const receive = (message: ChatMessage) => {
      if (messagesRef.current) {
        // 기존 메시지 목록
        const current = messagesRef.current;

        // 동일 chatId 가진 메시지가 있는지 확인
        const existingIndex = current.findIndex(m => m.chatId === message.chatId);

        let updatedMessages;

        if (existingIndex !== -1) {
          // 이미 존재 → 해당 위치를 새로운 메시지로 대체
          updatedMessages = [
            ...current.slice(0, existingIndex),
            message,
            ...current.slice(existingIndex + 1)
          ];
        } else {
          // 존재하지 않음 → 맨 뒤에 추가
          updatedMessages = [...current, message];
        }

        messagesRef.current = updatedMessages;
        if (update) update(updatedMessages);
      }
    };

    const send = (message: SendMessage) => {
      if (clientRef.current && clientRef.current.connected) {
        clientRef.current.publish({
          destination: `/app/chat/channel/${uuid}`,
          body: JSON.stringify(message),
        });
      }
    }

    useEffect(() => {
      const client = new Client({
        brokerURL: `${SERVER_WS_URL}/docs`,
        reconnectDelay: 5000,
        onConnect: () => {
          client.subscribe(`/topic/chat/channel/${uuid}`, message => {
            try {
              const body = JSON.parse(message.body);
              receive(body);
            } catch {
              // body not fit
            }
          });
        },
        onWebSocketError: (event) => {
          toast("서버와의 연결이 실패하였습니다.", {position: "bottom-right"})
          console.error('WebSocket error:', event);
        },

        onStompError: (frame) => {
          toast("서버와 통신 도중 에러 발생", {position: "bottom-right"});
          console.error('Broker error:', frame.headers['message']);
        },
      });

      client.activate();
      clientRef.current = client;

      return () => {
        client.deactivate();
      };
    }, [uuid]);

    return send;
  }
;

export default useChatSync;