import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { localJSONStorage } from '@/shared/lib';

export interface Chat {
  id: string;
  title: string;
}

interface ChatState {
  chats: Chat[];
  activeChatId: string | null;
  addChat: (chat: Chat) => void;
  setActive: (id: string) => void;
  clearActive: () => void;
  reset: () => void;
  ensureChat: (id: string) => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      chats: [],
      activeChatId: null,
      addChat: (chat) =>
        set((s) =>
          s.chats.some((c) => c.id === chat.id) ? s : { chats: [...s.chats, chat] },
        ),
      setActive: (id) => set({ activeChatId: id }),
      clearActive: () => set({ activeChatId: null }),
      reset: () => set({ chats: [], activeChatId: null }),
      ensureChat: (id) =>
        set((s) =>
          s.chats.some((c) => c.id === id)
            ? s
            : { chats: [...s.chats, { id, title: id }] },
        ),
    }),
    {
      name: 'green-api-chats',
      storage: localJSONStorage,
      partialize: (state) => ({ chats: state.chats }),
      version: 1,
      migrate: (persisted) => persisted as { chats: Chat[] },
    },
  ),
);