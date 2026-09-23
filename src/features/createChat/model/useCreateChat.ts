import { useState } from 'react';

import { useChatStore } from '@/entities/chat/model/chatStore';
import { normalizePhone, toChatId } from '@/shared/lib/phone';

export const useCreateChat = () => {
  const [error, setError] = useState<string | null>(null);
  const addChat = useChatStore((s) => s.addChat);
  const setActive = useChatStore((s) => s.setActive);

  const create = (rawPhone: string): boolean => {
    const normalized = normalizePhone(rawPhone);
    if (!normalized) {
      setError('Введите корректный номер телефона');
      return false;
    }
    const id = toChatId(normalized);
    addChat({ id, title: `+${normalized}` });
    setActive(id);
    setError(null);
    return true;
  };

  return { create, error };
};
