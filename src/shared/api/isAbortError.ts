import axios from 'axios';

export const isAbortError = (err: unknown): boolean => {
  if (err instanceof DOMException && err.name === 'AbortError') return true;
  if (axios.isCancel(err)) return true;
  if (axios.isAxiosError(err) && err.code === 'ERR_CANCELED') return true;
  return false;
};
