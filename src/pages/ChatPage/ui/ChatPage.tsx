import { useChatStore } from '@/entities/chat';
import { cn } from '@/shared/lib';
import { ChatList } from '@/widgets/ChatList';
import { ChatWindow } from '@/widgets/ChatWindow';

export const ChatPage = () => {
  const activeChatId = useChatStore((s) => s.activeChatId);

  return (
    <main className="flex h-screen w-full overflow-hidden bg-slate-100">
      <div
        className={cn(
          'w-full flex-col sm:flex sm:w-72',
          activeChatId ? 'hidden sm:flex' : 'flex',
        )}
      >
        <ChatList />
      </div>
      <div
        className={cn('flex-1 flex-col', activeChatId ? 'flex' : 'hidden sm:flex')}
      >
        <ChatWindow />
      </div>
    </main>
  );
};