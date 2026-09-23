const greenApiUrl = import.meta.env.VITE_GREEN_API_URL;

if (!greenApiUrl) {
  throw new Error(
    'VITE_GREEN_API_URL is not defined. Проверьте файл .env (см. .env.example).',
  );
}

const pollIntervalMs = Number(import.meta.env.VITE_POLL_INTERVAL_MS ?? 5000);

if (!Number.isFinite(pollIntervalMs) || pollIntervalMs <= 0) {
  throw new Error(
    'VITE_POLL_INTERVAL_MS must be a positive number. Проверьте файл .env.',
  );
}

export const env = {
  greenApiUrl,
  pollIntervalMs,
} as const;
