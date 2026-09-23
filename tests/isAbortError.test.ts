import { describe, expect, it } from 'vitest';

import { isAbortError } from '@/shared/api';

describe('isAbortError', () => {
  it('распознаёт DOMException с name=AbortError', () => {
    expect(isAbortError(new DOMException('aborted', 'AbortError'))).toBe(true);
  });

  it('возвращает false для обычной Error', () => {
    expect(isAbortError(new Error('oops'))).toBe(false);
  });

  it('возвращает false для null и undefined', () => {
    expect(isAbortError(null)).toBe(false);
    expect(isAbortError(undefined)).toBe(false);
  });

  it('возвращает false для строки', () => {
    expect(isAbortError('aborted')).toBe(false);
  });
});