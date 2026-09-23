import { useEffect, useRef } from 'react';

import { useChatStore } from '@/entities/chat';
import { MessageBubble, useMessageStore } from '@/entities/message';
import { useReceiveMessages } from '@/features/receiveMessages';
import { SendMessageForm } from '@/features/sendMessage';
import { EMPTY_MESSAGES, cn, focusRing, formatChatId } from '@/shared/lib';

export const ChatWindow = () => {
  useReceiveMessages();

  const activeChatId = useChatStore((s) => s.activeChatId);
  const clearActive = useChatStore((s) => s.clearActive);
  const messages = useMessageStore((s) =>
    activeChatId ? s.byChat[activeChatId] ?? EMPTY_MESSAGES : EMPTY_MESSAGES,
  );
  const isOffline = useMessageStore((s) => s.isOffline);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, activeChatId]);

  if (!activeChatId) {
    return (
      <section className="flex flex-1 items-center justify-center text-sm text-slate-500">
        Выберите чат или создайте новый
      </section>
    );
  }

  const isEmpty = messages.length === 0;

  return (
    <section className="flex flex-1 flex-col bg-slate-50">
      <header className="flex items-center gap-2 border-b border-slate-200 bg-white/80 px-4 py-3">
        <button
          type="button"
          onClick={clearActive}
          aria-label="Назад к списку чатов"
          className={cn(
            'rounded-full p-1 text-slate-700 transition hover:bg-slate-100',
            focusRing,
            'sm:hidden',
          )}
        >
          ←
        </button>
        <h1 className="truncate text-sm font-semibold text-slate-900">
          {formatChatId(activeChatId)}
        </h1>
        {isOffline && (
          <span
            role="status"
            className="ml-auto rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800"
          >
            Нет соединения
          </span>
        )}
      </header>
      <div className="flex flex-1 flex-col gap-2 overflow-y-auto p-4">
        {isEmpty ? (
          <p className="mt-8 text-center text-sm text-slate-500">
            Нет сообщений. Начните переписку первым сообщением.
          </p>
        ) : (
          messages.map((m) => <MessageBubble key={m.idMessage} message={m} />)
        )}
        <div ref={bottomRef} />
      </div>
      <SendMessageForm chatId={activeChatId} />
    </section>
  );
};