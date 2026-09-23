import { Component, type ErrorInfo, type ReactNode } from 'react';

import { reloadPage } from '@/shared/lib';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  override state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[ErrorBoundary]', error, info);
  }

  override render(): ReactNode {
    if (this.state.hasError) {
      return (
        <main className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
          <div className="max-w-md rounded-2xl bg-white p-6 text-center shadow-xl">
            <h1 className="text-lg font-semibold text-slate-900">
              Что-то пошло не так
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Попробуйте обновить страницу. Если ошибка повторяется — напишите нам.
            </p>
            <button
              type="button"
              onClick={reloadPage}
              className="mt-4 rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white hover:bg-slate-800"
            >
              Обновить
            </button>
          </div>
        </main>
      );
    }
    return this.props.children;
  }
}