import { beforeEach, describe, expect, it } from 'vitest';

import { useChatStore } from '@/entities/chat/model/chatStore';
import { useMessageStore } from '@/entities/message/model/messageStore';
import { useSession } from '@/entities/session';

describe('useSession', () => {
  beforeEach(() => {
    useSession.setState({ creds: null });
    useChatStore.setState({ chats: [], activeChatId: null });
    useMessageStore.setState({ byChat: {}, isOffline: false, sendingByChat: {} });
    sessionStorage.clear();
  });

  it('setCreds сохраняет креденшелы', () => {
    useSession.getState().setCreds({ idInstance: '1', apiTokenInstance: 'token' });
    expect(useSession.getState().creds).toEqual({
      idInstance: '1',
      apiTokenInstance: 'token',
    });
  });

  it('logout очищает креденшелы', () => {
    useSession.getState().setCreds({ idInstance: '1', apiTokenInstance: 'token' });
    useSession.getState().logout();
    expect(useSession.getState().creds).toBeNull();
  });

  it('logout полностью сбрасывает состояние чатов и сообщений', () => {
    useSession.getState().setCreds({ idInstance: '1', apiTokenInstance: 'token' });
    useChatStore.getState().addChat({ id: 'chat-1', title: 'Чат 1' });
    useChatStore.getState().setActive('chat-1');
    useMessageStore.getState().append({
      idMessage: 'm-1',
      chatId: 'chat-1',
      textMessage: 'hello',
      timestamp: 1,
      typeMessage: 'incoming',
    });

    useSession.getState().logout();

    expect(useSession.getState().creds).toBeNull();
    expect(useChatStore.getState().chats).toEqual([]);
    expect(useChatStore.getState().activeChatId).toBeNull();
    expect(useMessageStore.getState().byChat).toEqual({});
    expect(useMessageStore.getState().sendingByChat).toEqual({});
  });
});