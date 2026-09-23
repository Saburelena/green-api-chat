import { useEffect } from 'react';

import { useChatStore } from '@/entities/chat';
import { useMessageStore } from '@/entities/message';
import { useSession } from '@/entities/session';
import { ApiError, isAbortError } from '@/shared/api';
import type { IGreenApiClient } from '@/shared/api';
import { env } from '@/shared/config';
import { container, TOKENS } from '@/shared/di';
import { sleep } from '@/shared/lib';
import type { Notification } from '@/shared/types';

const BASE_DELAY_MS = env.pollIntervalMs;
const MAX_DELAY_MS = 60_000;

const toMessage = (n: Notification) => {
  const chatId = n.body?.senderData?.chatId;
  const text = n.body?.messageData?.textMessageData?.textMessage;
  if (!chatId || !text) return null;
  return {
    idMessage: n.body.idMessage ?? String(n.receiptId),
    chatId,
    textMessage: text,
    timestamp:
      typeof n.body.timestamp === 'number' && Number.isFinite(n.body.timestamp)
        ? n.body.timestamp
        : Math.floor(Date.now() / 1000),
    typeMessage: 'incoming' as const,
  };
};

const delayAfterError = (err: unknown, current: number): number => {
  if (err instanceof ApiError && err.kind === 'rateLimit' && err.retryAfterMs) {
    return Math.min(err.retryAfterMs, MAX_DELAY_MS);
  }
  return Math.min(current * 2, MAX_DELAY_MS);
};

export const useReceiveMessages = () => {
  const creds = useSession((s) => s.creds);
  const logout = useSession((s) => s.logout);
  const append = useMessageStore((s) => s.append);
  const setOffline = useMessageStore((s) => s.setOffline);
  const ensureChat = useChatStore((s) => s.ensureChat);

  useEffect(() => {
    if (!creds) return;

    const controller = new AbortController();
    const client = container.resolve<IGreenApiClient>(TOKENS.GreenApiClient, creds);
    let delay = BASE_DELAY_MS;

    const stopPolling = () => {
      controller.abort();
      setOffline(false);
    };

    (async () => {
      while (!controller.signal.aborted) {
        try {
          const notification = await client.receiveNotification(controller.signal);
          if (controller.signal.aborted) return;

          setOffline(false);
          if (notification && typeof notification.receiptId === 'number') {
            const removed = await client.deleteNotification(
              notification.receiptId,
              controller.signal,
            );
            if (controller.signal.aborted) return;

            if (removed) {
              const msg = toMessage(notification);
              if (msg) {
                ensureChat(msg.chatId);
                append(msg);
              }
            }
            delay = BASE_DELAY_MS;
            continue;
          }
          delay = BASE_DELAY_MS;
        } catch (err) {
          if (isAbortError(err)) return;
          if (err instanceof ApiError && err.kind === 'unauthorized') {
            logout();
            stopPolling();
            return;
          }
          if (!(err instanceof ApiError && err.kind === 'rateLimit')) {
            setOffline(true);
          }
          delay = delayAfterError(err, delay);
        }
        if (controller.signal.aborted) return;
        await sleep(delay, controller.signal).catch(() => undefined);
      }
    })();

    return () => {
      stopPolling();
    };
  }, [creds, logout, append, setOffline, ensureChat]);
};
