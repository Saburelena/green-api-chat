import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { MessageBubble } from '@/entities/message/ui/MessageBubble';
import type { IncomingMessage } from '@/shared/types';

const makeMessage = (overrides: Partial<IncomingMessage> = {}): IncomingMessage => ({
  idMessage: '1',
  chatId: '79991234567@c.us',
  textMessage: 'Привет',
  timestamp: 1700000000,
  typeMessage: 'incoming',
  ...overrides,
});

describe('MessageBubble', () => {
  it('рендерит текст сообщения', () => {
    render(<MessageBubble message={makeMessage()} />);
    expect(screen.getByText('Привет')).toBeInTheDocument();
  });

  it('рендерит время сообщения', () => {
    render(<MessageBubble message={makeMessage()} />);
    expect(screen.getByText(/\d{2}:\d{2}/)).toBeInTheDocument();
  });
});