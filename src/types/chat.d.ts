export interface ChatMessage extends SendMessage {
  chatId: string;
  senderId: string;
  date: string;
}

export interface SendMessage {
  senderId: string; // TODO 추후 백엔드 인증 기능 활성화시 삭제
  messageType: 'bot' | 'request-bot' | 'chat';
  messageContent: string;
}
