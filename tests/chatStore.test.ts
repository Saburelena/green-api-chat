import { beforeEach, describe, expect, it } from 'vitest';

import { useChatStore } from '@/entities/chat/model/chatStore';

describe('chatStore', () => {
  beforeEach(() => {
    useChatStore.setState({ chats: [], activeChatId: null });
  });

  it('addChat добавляет чат', () => {
    useChatStore.getState().addChat({ id: '1', title: 'Чат 1' });
    expect(useChatStore.getState().chats).toHaveLength(1);
    expect(useChatStore.getState().chats[0]).toEqual({ id: '1', title: 'Чат 1' });
  });

  it('addChat дедуплицирует по id и не перезаписывает существующий', () => {
    const { addChat } = useChatStore.getState();
    addChat({ id: '1', title: 'Чат 1' });
    addChat({ id: '1', title: 'Чат 2' });
    expect(useChatStore.getState().chats).toHaveLength(1);
    expect(useChatStore.getState().chats[0].title).toBe('Чат 1');
  });

  it('ensureChat не дублирует существующий чат и сохраняет его title', () => {
    const { addChat, ensureChat } = useChatStore.getState();
    addChat({ id: '1', title: 'Мой чат' });
    ensureChat('1');
    expect(useChatStore.getState().chats).toHaveLength(1);
    expect(useChatStore.getState().chats[0].title).toBe('Мой чат');
  });

  it('ensureChat создаёт чат, если его нет', () => {
    useChatStore.getState().ensureChat('79991234567@c.us');
    expect(useChatStore.getState().chats).toHaveLength(1);
    expect(useChatStore.getState().chats[0].id).toBe('79991234567@c.us');
  });

  it('setActive устанавливает активный чат', () => {
    useChatStore.getState().setActive('1');
    expect(useChatStore.getState().activeChatId).toBe('1');
  });
});