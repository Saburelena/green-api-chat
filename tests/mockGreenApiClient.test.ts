import { describe, expect, it } from 'vitest';

import { MockGreenApiClient } from '@/shared/api/MockGreenApiClient';

const creds = { idInstance: '100', apiTokenInstance: 'demo-token' };

describe('MockGreenApiClient', () => {
  it('отправляет сообщение и возвращает idMessage', async () => {
    const client = new MockGreenApiClient(creds);

    const result = await client.sendMessage({
      chatId: '79991234567@c.us',
      message: 'Привет из mock-режима',
    });

    expect(result.idMessage).toMatch(/^mock-/);
  });

  it('возвращает входящее уведомление после отправки', async () => {
    const client = new MockGreenApiClient(creds);

    await client.sendMessage({
      chatId: '79991234567@c.us',
      message: 'Привет из mock-режима',
    });

    const notification = await client.receiveNotification();

    expect(notification).not.toBeNull();
    expect(notification?.body.senderData?.chatId).toBe('79991234567@c.us');
    expect(notification?.body.messageData?.textMessageData?.textMessage).toBe(
      'Привет из mock-режима',
    );
  });
});
