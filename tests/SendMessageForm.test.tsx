import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { useMessageStore } from '@/entities/message';
import { useSession } from '@/entities/session';
import { SendMessageForm } from '@/features/sendMessage/ui/SendMessageForm';

beforeEach(() => {
  useSession.setState({ creds: { idInstance: '1', apiTokenInstance: 'token' } });
  useMessageStore.setState({ byChat: {}, isOffline: false });
});

describe('SendMessageForm', () => {
  it('кнопка disabled при пустом тексте', () => {
    render(<SendMessageForm chatId="test" />);
    expect(screen.getByRole('button', { name: /отправить/i })).toBeDisabled();
  });

  it('поле имеет aria-label и placeholder', () => {
    render(<SendMessageForm chatId="test" />);
    expect(screen.getByLabelText(/текст сообщения/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/введите сообщение/i)).toBeInTheDocument();
  });
});