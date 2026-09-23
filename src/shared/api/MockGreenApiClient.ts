import type {
  Credentials,
  Notification,
  SendMessageRequest,
  SendMessageResponse,
} from '@/shared/types/greenApi';

import type { IGreenApiClient } from './IGreenApiClient';

export class MockGreenApiClient implements IGreenApiClient {
  private readonly notifications: Notification[] = [];
  private nextReceiptId = 1;

  constructor(private readonly creds: Credentials) {}

  async sendMessage(req: SendMessageRequest): Promise<SendMessageResponse> {
    const idMessage = `mock-${this.creds.idInstance}-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`;
    const timestamp = Math.floor(Date.now() / 1000);

    this.notifications.push({
      receiptId: this.nextReceiptId++,
      body: {
        typeWebhook: 'incomingMessageReceived',
        idMessage,
        senderData: {
          chatId: req.chatId,
          senderName: 'Mock User',
        },
        messageData: {
          typeMessage: 'textMessage',
          textMessageData: {
            textMessage: req.message,
          },
        },
        timestamp,
      },
    });

    return { idMessage };
  }

  async receiveNotification(signal?: AbortSignal): Promise<Notification | null> {
    if (signal?.aborted) {
      throw new DOMException('The operation was aborted.', 'AbortError');
    }

    const next = this.notifications.shift();
    return next ?? null;
  }

  async deleteNotification(receiptId: number, signal?: AbortSignal): Promise<boolean> {
    if (signal?.aborted) {
      throw new DOMException('The operation was aborted.', 'AbortError');
    }

    return typeof receiptId === 'number' && receiptId > 0;
  }
}
