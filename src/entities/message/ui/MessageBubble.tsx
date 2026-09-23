import { cn } from '@/shared/lib';
import type { IncomingMessage } from '@/shared/types';

export const MessageBubble = ({ message }: { message: IncomingMessage }) => {
  const isOutgoing = message.typeMessage === 'outgoing';
  const date = new Date(message.timestamp * 1000);

  return (
    <div
      className={cn(
        'max-w-[75%] rounded-2xl px-4 py-2 text-sm shadow-sm',
        isOutgoing
          ? 'self-end bg-slate-900 text-white'
          : 'self-start bg-white text-slate-900',
      )}
    >
      <p className="whitespace-pre-wrap break-words">{message.textMessage}</p>
      <time
        dateTime={date.toISOString()}
        className="mt-1 block text-[10px] opacity-60"
      >
        {date.toLocaleTimeString('ru-RU', {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </time>
    </div>
  );
};