export const TOKENS = {
  GreenApiClient: Symbol.for('GreenApiClient'),
} as const;

export type TokenKey = keyof typeof TOKENS;
