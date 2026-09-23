import { useState, type FormEvent } from 'react';

import { useSession } from '@/entities/session';
import { isMockMode } from '@/shared/config';
import { Button, Input } from '@/shared/ui';

export const LoginForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const setCreds = useSession((s) => s.setCreds);
  const [idInstance, setIdInstance] = useState('');
  const [apiTokenInstance, setToken] = useState('');
  const [errors, setErrors] = useState<{ id?: string; token?: string }>({});

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (isMockMode()) {
      setCreds({
        idInstance: 'mock',
        apiTokenInstance: 'mock',
      });
      onSuccess();
      return;
    }

    const next: typeof errors = {};
    if (!idInstance.trim()) next.id = 'Укажите idInstance';
    if (!apiTokenInstance.trim()) next.token = 'Укажите apiTokenInstance';
    setErrors(next);
    if (Object.keys(next).length) return;
    setCreds({
      idInstance: idInstance.trim(),
      apiTokenInstance: apiTokenInstance.trim(),
    });
    onSuccess();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-sm flex-col gap-4 rounded-2xl bg-white/80 p-6 shadow-xl backdrop-blur"
      noValidate
    >
      <h1 className="text-xl font-semibold text-slate-900">Вход в GREEN-API</h1>
      <Input
        label="idInstance"
        name="idInstance"
        value={idInstance}
        onChange={(e) => setIdInstance(e.target.value)}
        error={errors.id}
      />
      <Input
        label="apiTokenInstance"
        name="apiTokenInstance"
        type="password"
        value={apiTokenInstance}
        onChange={(e) => setToken(e.target.value)}
        error={errors.token}
      />
      <Button type="submit">Войти</Button>
    </form>
  );
};
