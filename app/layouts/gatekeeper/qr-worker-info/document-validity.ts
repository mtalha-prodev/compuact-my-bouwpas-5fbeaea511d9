import dayjs from 'dayjs';

export function documentValidity(date: string) {
  const now = new Date();
  const a = dayjs(now);
  const b = dayjs(date);
  const diffDays = b.diff(a, 'days');

  if (diffDays < 0) return 'expired';
  if (diffDays < 30) return 'about-to-expire';
  return 'valid';
}
