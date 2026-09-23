import axios, { type AxiosInstance } from 'axios';

import { env } from '@/shared/config/env';
import type {
  Credentials,
  SendMessageRequest,
  SendMessageResponse,
  Notification,
} from '@/shared/types/greenApi';

import { ApiError } from './ApiError';
import type { IGreenApiClient } from './IGreenApiClient';

const toApiError = (err: unknown): ApiError => {
  if (!axios.isAxiosError(err)) return new ApiError('unknown');

  const status = err.response?.status;
  const retryAfterRaw = err.response?.headers?.['retry-after'];
  const retryAfter = Number(retryAfterRaw);
  const retryAfterMs =
    Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : undefined;

  if (status && status >= 500 && status < 600) {
    return new ApiError('server', status);
  }

  switch (status) {
    case 400:
      return new ApiError('validation', 400, undefined, 'Validation failed');
    case 401:
      return new ApiError('unauthorized', 401, undefined, 'Unauthorized');
    case 403:
      return new ApiError('forbidden', 403, undefined, 'Forbidden');
    case 404:
      return new ApiError('notFound', 404, undefined, 'Not found');
    case 429:
      return new ApiError('rateLimit', 429, retryAfterMs, 'Rate limit');
    case 466:
      return new ApiError('quota', 466, undefined, 'Quota exceeded');
    default:
      return new ApiError('unknown', status);
  }
};

const isValidNotification = (data: unknown): data is Notification => {
  if (!data || typeof data !== 'object') return false;
  const n = data as Record<string, unknown>;
  if (typeof n.receiptId !== 'number') return false;
  if (!n.body || typeof n.body !== 'object') return false;
  return true;
};

export class GreenApiClient implements IGreenApiClient {
  private readonly http: AxiosInstance;
  private readonly creds: Credentials;

  constructor(creds: Credentials) {
    this.creds = creds;
    this.http = axios.create({
      baseURL: env.greenApiUrl,
      timeout: 15_000,
    });

    this.http.interceptors.response.use(
      (res) => res,
      (err) => Promise.reject(toApiError(err)),
    );
  }

  private url(method: string): string {
    const { idInstance, apiTokenInstance } = this.creds;
    return `/waInstance${idInstance}/${method}/${apiTokenInstance}`;
  }

  async sendMessage(req: SendMessageRequest): Promise<SendMessageResponse> {
    const { data } = await this.http.post<SendMessageResponse>(
      this.url('sendMessage'),
      req,
    );
    if (!data || typeof data.idMessage !== 'string') {
      throw new ApiError('unknown', undefined, undefined, 'Invalid sendMessage response');
    }
    return data;
  }

  async receiveNotification(signal?: AbortSignal): Promise<Notification | null> {
    const { data } = await this.http.get<unknown>(this.url('receiveNotification'), {
      signal,
    });
    if (data === null || data === undefined) return null;
    if (!isValidNotification(data)) return null;
    return data;
  }

  async deleteNotification(receiptId: number, signal?: AbortSignal): Promise<boolean> {
    const { data } = await this.http.delete<{ result: boolean }>(
      this.url(`deleteNotification/${receiptId}`),
      { signal },
    );
    return Boolean(data?.result);
  }
}
