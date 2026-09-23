import type { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';

import { ContainerProvider } from './ContainerProvider';
import { ErrorBoundary } from './ErrorBoundary';

export const AppProviders = ({ children }: { children: ReactNode }) => (
  <ErrorBoundary>
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <ContainerProvider>{children}</ContainerProvider>
    </BrowserRouter>
  </ErrorBoundary>
);