import { useNavigate } from 'react-router-dom';

import { LoginForm } from '@/features/auth';
import { ROUTES } from '@/shared/config';

export const LoginPage = () => {
  const navigate = useNavigate();
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 to-slate-300 p-4">
      <LoginForm onSuccess={() => navigate(ROUTES.chat)} />
    </main>
  );
};
