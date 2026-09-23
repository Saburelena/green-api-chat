import { render, screen, fireEvent } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useSession } from '@/entities/session';
import { LoginForm } from '@/features/auth/ui/LoginForm';

beforeEach(() => {
  useSession.setState({ creds: null });
  sessionStorage.clear();
});

describe('LoginForm', () => {
  it('показывает ошибки при пустых полях', () => {
    const onSuccess = vi.fn();
    render(<LoginForm onSuccess={onSuccess} />);

    fireEvent.click(screen.getByRole('button', { name: /войти/i }));

    expect(screen.getByText(/укажите idInstance/i)).toBeInTheDocument();
    expect(screen.getByText(/укажите apiTokenInstance/i)).toBeInTheDocument();
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it('вызывает onSuccess при заполненных полях', () => {
    const onSuccess = vi.fn();
    render(<LoginForm onSuccess={onSuccess} />);

    fireEvent.change(screen.getByLabelText(/idInstance/i), {
      target: { value: '123' },
    });
    fireEvent.change(screen.getByLabelText(/apiTokenInstance/i), {
      target: { value: 'token' },
    });
    fireEvent.click(screen.getByRole('button', { name: /войти/i }));

    expect(onSuccess).toHaveBeenCalledOnce();
  });
});