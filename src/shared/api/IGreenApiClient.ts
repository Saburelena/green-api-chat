import type {
  SendMessageRequest,
  SendMessageResponse,
  Notification,
} from '@/shared/types/greenApi';

export interface IGreenApiClient {
  sendMessage(req: SendMessageRequest): Promise<SendMessageResponse>;
  receiveNotification(signal?: AbortSignal): Promise<Notification | null>;
  deleteNotification(receiptId: number, signal?: AbortSignal): Promise<boolean>;
}
