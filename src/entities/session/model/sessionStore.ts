import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { useChatStore } from '@/entities/chat/model/chatStore';
import { useMessageStore } from '@/entities/message/model/messageStore';
import { sessionJSONStorage } from '@/shared/lib';
import type { Credentials } from '@/shared/types';

interface SessionState {
  creds: Credentials | null;
  setCreds: (creds: Credentials) => void;
  logout: () => void;
}

export const useSession = create<SessionState>()(
  persist(
    (set) => ({
      creds: null,
      setCreds: (creds) => set({ creds }),
      logout: () => {
        set({ creds: null });
        useChatStore.getState().reset();
        useMessageStore.getState().reset();
      },
    }),
    {
      name: 'green-api-auth',
      storage: sessionJSONStorage,
      partialize: (state) => ({ creds: state.creds }),
      version: 1,
      migrate: (persisted) => persisted as { creds: Credentials | null },
    },
  ),
);