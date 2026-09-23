import { describe, expect, it } from 'vitest';

import { normalizePhone, toChatId } from '@/shared/lib/phone';

describe('normalizePhone', () => {
  it('нормализует 8XXXXXXXXXX в 7XXXXXXXXXX', () => {
    expect(normalizePhone('8 999 123-45-67')).toBe('79991234567');
  });

  it('оставляет 7XXXXXXXXXX', () => {
    expect(normalizePhone('+7 (999) 123-45-67')).toBe('79991234567');
  });

  it('добавляет 7 к 10-значному номеру', () => {
    expect(normalizePhone('9991234567')).toBe('79991234567');
  });

  it('возвращает null для мусора', () => {
    expect(normalizePhone('abc')).toBeNull();
  });

  it('формирует chatId', () => {
    expect(toChatId('79991234567')).toBe('79991234567@c.us');
  });
});