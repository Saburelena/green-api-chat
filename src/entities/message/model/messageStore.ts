import { create } from 'zustand';

import type { IncomingMessage } from '@/shared/types';

const MAX_PER_CHAT = 200;

interface MessageState {
  byChat: Record<string, IncomingMessage[]>;
  isOffline: boolean;
  sendingByChat: Record<string, boolean>;
  append: (msg: IncomingMessage) => void;
  setOffline: (offline: boolean) => void;
  setSending: (chatId: string, sending: boolean) => void;
  reset: () => void;
}

export const useMessageStore = create<MessageState>((set) => ({
  byChat: {},
  isOffline: false,
  sendingByChat: {},
  append: (msg) =>
    set((s) => {
      const list = s.byChat[msg.chatId] ?? [];
      if (list.some((m) => m.idMessage === msg.idMessage)) return s;
      const next = [...list, msg].slice(-MAX_PER_CHAT);
      return { byChat: { ...s.byChat, [msg.chatId]: next } };
    }),
  setOffline: (offline) =>
    set((s) => (s.isOffline === offline ? s : { isOffline: offline })),
  setSending: (chatId, sending) =>
    set((s) =>
      s.sendingByChat[chatId] === sending
        ? s
        : { sendingByChat: { ...s.sendingByChat, [chatId]: sending } },
    ),
  reset: () => set({ byChat: {}, isOffline: false, sendingByChat: {} }),
}));