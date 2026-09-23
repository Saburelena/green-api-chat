import { useCallback, useState } from 'react';

import { useMessageStore } from '@/entities/message';
import { useSession } from '@/entities/session';
import { ApiError } from '@/shared/api';
import type { IGreenApiClient } from '@/shared/api';
import { container, TOKENS } from '@/shared/di';

const errorMessage = (err: unknown): string => {
  if (!(err instanceof ApiError)) return 'Не удалось отправить сообщение';
  switch (err.kind) {
    case 'validation':
      return 'Ошибка валидации: сообщение пустое или превышает 4000 символов.';
    case 'unauthorized':
      return 'Неверный apiTokenInstance. Проверьте данные входа.';
    case 'forbidden':
      return 'Аккаунт suspended: отправка только на номера в контактах.';
    case 'notFound':
      return 'Инстанс не найден. Проверьте idInstance и apiTokenInstance.';
    case 'rateLimit':
      return 'Превышен лимит запросов. Попробуйте через минуту.';
    case 'quota':
      return 'Превышена квота тарифа MAX_DEVELOPER (3 чата/месяц).';
    case 'server':
      return 'Ошибка на стороне сервера. Попробуйте ещё раз через минуту.';
    default:
      return `Не удалось отправить сообщение${err.status ? ` (HTTP ${err.status})` : ''}.`;
  }
};

interface UseSendMessageResult {
  send: (text: string) => Promise<boolean>;
  sending: boolean;
  error: string | null;
}

export const useSendMessage = (chatId: string): UseSendMessageResult => {
  const creds = useSession((s) => s.creds);
  const logout = useSession((s) => s.logout);
  const append = useMessageStore((s) => s.append);
  const setSending = useMessageStore((s) => s.setSending);
  const sending = useMessageStore((s) => Boolean(s.sendingByChat[chatId]));
  const [error, setError] = useState<string | null>(null);

  const send = useCallback(
    async (text: string): Promise<boolean> => {
      if (!creds || !text.trim()) return false;
      setSending(chatId, true);
      setError(null);
      try {
        const client = container.resolve<IGreenApiClient>(TOKENS.GreenApiClient, creds);
        const { idMessage } = await client.sendMessage({ chatId, message: text });
        append({
          idMessage,
          chatId,
          textMessage: text,
          timestamp: Math.floor(Date.now() / 1000),
          typeMessage: 'outgoing',
        });
        return true;
      } catch (err) {
        if (err instanceof ApiError && err.kind === 'unauthorized') {
          logout();
          return false;
        }
        setError(errorMessage(err));
        return false;
      } finally {
        setSending(chatId, false);
      }
    },
    [creds, append, setSending, chatId, logout],
  );

  return { send, sending, error };
};