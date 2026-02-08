export function formatDate(
  date: Date | string | number | undefined,
  opts: Intl.DateTimeFormatOptions = {},
) {
  if (!date) return '';

  try {
    return new Intl.DateTimeFormat('en-US', {
      month: opts.month ?? 'long',
      day: opts.day ?? 'numeric',
      year: opts.year ?? 'numeric',
      ...opts,
    }).format(new Date(date));
  } catch {
    return '';
  }
}

export function toUtcMidnightTimestamp(
  date: Date | null | undefined,
): number | null {
  if (!date) return null;

  return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
}
