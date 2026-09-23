import { cn, focusRing, formatChatId } from '@/shared/lib';

import type { Chat } from '../model/chatStore';

interface ChatItemProps {
  active: boolean;
  chat: Chat;
  onClick: (id: string) => void;
}

export const ChatItem = ({ chat, active, onClick }: ChatItemProps) => (
  <button
    type="button"
    onClick={() => onClick(chat.id)}
    aria-current={active ? 'true' : undefined}
    className={cn(
      'w-full truncate rounded-xl px-3 py-2 text-left text-sm font-medium transition',
      focusRing,
      active ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100',
    )}
  >
    {formatChatId(chat.title)}
  </button>
);