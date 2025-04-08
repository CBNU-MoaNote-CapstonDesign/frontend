/* TODO
 * Send Message 와 Receive Message 분리
 */

export interface Message {
  uuid: string;
  sender: string;
  type: 'bot' | 'request-bot' | 'user';
  content: string;
}