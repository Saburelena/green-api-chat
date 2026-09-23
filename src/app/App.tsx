import type { JSX } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { useSession } from '@/entities/session';
import { ChatPage } from '@/pages/ChatPage';
import { LoginPage } from '@/pages/LoginPage';
import { ROUTES } from '@/shared/config';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const creds = useSession((s) => s.creds);
  return creds ? children : <Navigate to={ROUTES.login} replace />;
};

export const App = () => (
  <Routes>
    <Route path={ROUTES.login} element={<LoginPage />} />
    <Route
      path={ROUTES.chat}
      element={
        <ProtectedRoute>
          <ChatPage />
        </ProtectedRoute>
      }
    />
    <Route path="*" element={<Navigate to={ROUTES.chat} replace />} />
  </Routes>
);
