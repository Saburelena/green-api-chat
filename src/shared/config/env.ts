export const isMockMode = () =>
  import.meta.env.VITE_USE_MOCK === 'true' ||
  import.meta.env.VITE_USE_MOCK === '1' ||
  import.meta.env.VITE_USE_MOCK === 'yes';

const greenApiUrl = import.meta.env.VITE_GREEN_API_URL;
const useMock = isMockMode();

if (!useMock && !greenApiUrl) {
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
  greenApiUrl: greenApiUrl ?? 'https://mock.green-api.local',
  pollIntervalMs,
  useMock,
} as const;
