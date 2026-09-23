import { beforeEach, describe, expect, it } from 'vitest';

import { useMessageStore } from '@/entities/message/model/messageStore';
import type { IncomingMessage } from '@/shared/types/greenApi';

const makeMessage = (id: string, chatId = 'c1'): IncomingMessage => ({
  idMessage: id,
  chatId,
  textMessage: `msg ${id}`,
  timestamp: 1,
  typeMessage: 'incoming',
});

describe('messageStore.append', () => {
  beforeEach(() => {
    useMessageStore.setState({ byChat: {} });
  });

  it('добавляет сообщение', () => {
    useMessageStore.getState().append(makeMessage('1'));
    expect(useMessageStore.getState().byChat['c1']).toHaveLength(1);
  });

  it('дедуплицирует по idMessage', () => {
    const { append } = useMessageStore.getState();
    append(makeMessage('1'));
    append(makeMessage('1'));
    expect(useMessageStore.getState().byChat['c1']).toHaveLength(1);
  });

  it('ограничивает размер 200 сообщениями', () => {
    const { append } = useMessageStore.getState();
    for (let i = 0; i < 250; i++) append(makeMessage(String(i)));
    expect(useMessageStore.getState().byChat['c1']).toHaveLength(200);
  });
});