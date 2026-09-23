import { useState, type FormEvent } from 'react';

import { Button } from '@/shared/ui/Button';

import { useCreateChat } from '../model/useCreateChat';

export const CreateChatFormView = () => {
  const [phone, setPhone] = useState('');
  const { create, error } = useCreateChat();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (create(phone)) setPhone('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 px-3 pb-2">
      <div className="flex items-center gap-2">
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+7 999 123-45-67"
          aria-label="Номер телефона нового чата"
          inputMode="tel"
          className="flex-1 rounded-full border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
        />
        <Button type="submit" className="px-3 py-2 text-xs">
          +
        </Button>
      </div>
      {error && (
        <span role="alert" className="text-xs text-red-600">
          {error}
        </span>
      )}
    </form>
  );
};
