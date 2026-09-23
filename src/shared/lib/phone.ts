const DIGITS = /\D/g;

export const normalizePhone = (input: string): string | null => {
  const digits = input.replace(DIGITS, '');
  if (digits.length === 11 && digits.startsWith('8')) return `7${digits.slice(1)}`;
  if (digits.length === 11 && digits.startsWith('7')) return digits;
  if (digits.length === 10) return `7${digits}`;
  return null;
};

export const toChatId = (phone: string): string => `${phone}@c.us`;

export const formatChatId = (chatId: string): string => {
  const raw = chatId.replace(/@c\.us$/i, '');
  const digits = raw.replace(DIGITS, '');
  // РФ-номер: 7XXXXXXXXXX
  if (digits.length === 11 && digits.startsWith('7')) {
    const d = digits.slice(1);
    return `+7 ${d.slice(0, 3)} ${d.slice(3, 6)}-${d.slice(6, 8)}-${d.slice(8)}`;
  }

  return chatId;
};
