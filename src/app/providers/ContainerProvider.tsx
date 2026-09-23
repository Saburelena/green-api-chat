import type { ReactNode } from 'react';
import '@/shared/di/container';

export const ContainerProvider = ({ children }: { children: ReactNode }) => (
  <>{children}</>
);
