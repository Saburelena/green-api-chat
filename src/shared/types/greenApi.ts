export interface Credentials {
  idInstance: string;
  apiTokenInstance: string;
}

export interface SendMessageRequest {
  chatId: string;
  message: string;
}

export interface SendMessageResponse {
  idMessage: string;
}

export interface IncomingMessage {
  idMessage: string;
  chatId: string;
  senderName?: string;
  textMessage?: string;
  timestamp: number;
  typeMessage: 'incoming' | 'outgoing';
}

export type WebhookType =
  | 'incomingMessageReceived'
  | 'outgoingMessageStatus'
  | 'stateInstanceChanged'
  | 'incomingMessageStatus';

export interface Notification {
  receiptId: number;
  body: {
    typeWebhook: WebhookType;
    idMessage?: string;
    senderData?: { chatId: string; senderName?: string };
    messageData?: {
      typeMessage: string;
      textMessageData?: { textMessage: string };
    };
    timestamp?: number;
  };
}
