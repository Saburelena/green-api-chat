import { renderHook, act, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { useMessageStore } from '@/entities/message';
import { useSession } from '@/entities/session';
import { useSendMessage } from '@/features/sendMessage/model/useSendMessage';

const server = setupServer();
const CHAT_ID = '79991234567@c.us';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

beforeEach(() => {
  useSession.setState({ creds: { idInstance: '1', apiTokenInstance: 'token' } });
  useMessageStore.setState({ byChat: {}, isOffline: false, sendingByChat: {} });
});

describe('useSendMessage', () => {
  it('успешная отправка добавляет сообщение в стор', async () => {
    server.use(
      http.post('*/waInstance*/sendMessage/*', () =>
        HttpResponse.json({ idMessage: 'msg-1' }),
      ),
    );

    const { result } = renderHook(() => useSendMessage(CHAT_ID));  // ← chatId

    await act(async () => {
      const ok = await result.current.send('Привет');  // ← один аргумент
      expect(ok).toBe(true);
    });

    expect(useMessageStore.getState().byChat[CHAT_ID]).toHaveLength(1);
    expect(useMessageStore.getState().byChat[CHAT_ID][0].idMessage).toBe('msg-1');
  });

  it('401 разлогинивает пользователя', async () => {
    server.use(
      http.post('*/waInstance*/sendMessage/*', () =>
        new HttpResponse(null, { status: 401 }),
      ),
    );

    const { result } = renderHook(() => useSendMessage(CHAT_ID));

    await act(async () => {
      const ok = await result.current.send('Привет');
      expect(ok).toBe(false);
    });

    await waitFor(() => {
      expect(useSession.getState().creds).toBeNull();
    });
  });

  it('404 устанавливает error и не добавляет сообщение', async () => {
    server.use(
      http.post('*/waInstance*/sendMessage/*', () =>
        new HttpResponse(null, { status: 404 }),
      ),
    );

    const { result } = renderHook(() => useSendMessage(CHAT_ID));

    await act(async () => {
      await result.current.send('Привет');
    });

    await waitFor(() => {
      expect(result.current.error).toMatch(/инстанс не найден/i);
    });
    expect(useMessageStore.getState().byChat[CHAT_ID]).toBeUndefined();
  });
});