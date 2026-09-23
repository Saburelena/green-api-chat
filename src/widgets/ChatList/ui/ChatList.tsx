import { useNavigate } from 'react-router-dom';

import { ChatItem, useChatStore } from '@/entities/chat';
import { useMessageStore } from '@/entities/message';
import { useSession } from '@/entities/session';
import { CreateChatFormView } from '@/features/createChat';
import { ROUTES } from '@/shared/config';
import { Button } from '@/shared/ui';

export const ChatList = () => {
  const chats = useChatStore((s) => s.chats);
  const activeChatId = useChatStore((s) => s.activeChatId);
  const setActive = useChatStore((s) => s.setActive);

  const isOffline = useMessageStore((s) => s.isOffline);

  const logout = useSession((s) => s.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.login, { replace: true });
  };

  return (
    <aside
      aria-label="Список чатов"
      className="flex h-full w-full flex-col border-r border-slate-200 bg-white/60"
    >
      <h2 className="px-3 py-3 text-sm font-semibold text-slate-500">Чаты</h2>

      {isOffline && (
        <div
          role="status"
          className="border-y border-amber-200 bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800"
        >
          Нет соединения
        </div>
      )}

      <CreateChatFormView />

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-2">
        {chats.length === 0 && (
          <p className="px-3 text-xs text-slate-500">Пока нет чатов</p>
        )}
        {chats.map((chat) => (
          <ChatItem
            key={chat.id}
            chat={chat}
            active={chat.id === activeChatId}
            onClick={setActive}
          />
        ))}
      </nav>

      <div className="border-t border-slate-200 p-2">
        <Button
          type="button"
          variant="ghost"
          onClick={handleLogout}
          className="w-full text-xs"
        >
          Выйти
        </Button>
      </div>
    </aside>
  );
};