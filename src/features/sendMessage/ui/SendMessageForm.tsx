import { useState, type FormEvent } from 'react';

import { Button, Spinner } from '@/shared/ui';

import { useSendMessage } from '../model/useSendMessage';

export const SendMessageForm = ({ chatId }: { chatId: string }) => {
  const [text, setText] = useState('');
  const { send, sending, error } = useSendMessage(chatId); 

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const value = text.trim();
    if (!value) return;
    const ok = await send(value); 
    if (ok) setText('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 border-t border-slate-200 p-3"
    >
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Введите сообщение…"
        aria-label="Текст сообщения"
        maxLength={4000}
        className="flex-1 rounded-full border border-slate-300 px-4 py-2 text-sm outline-none focus:border-slate-900"
      />
      <Button type="submit" disabled={sending || !text.trim()}>
        {sending ? <Spinner /> : 'Отправить'}
      </Button>
      {error && (
        <span role="alert" className="text-xs text-red-600">
          {error}
        </span>
      )}
    </form>
  );
};