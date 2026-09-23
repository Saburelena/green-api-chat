export type ApiErrorKind =
  | 'validation'
  | 'unauthorized'
  | 'forbidden'
  | 'notFound'
  | 'rateLimit'
  | 'quota'
  | 'server'
  | 'unknown';

export class ApiError extends Error {
  constructor(
    public readonly kind: ApiErrorKind,
    public readonly status?: number,
    public readonly retryAfterMs?: number,
    message?: string,
  ) {
    super(message ?? kind);
    this.name = 'ApiError';
  }
}
