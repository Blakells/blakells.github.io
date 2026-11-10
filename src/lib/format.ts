const DISPLAY = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });

/** "Nov 10, 2026" */
export function displayDate(date: Date): string {
  return DISPLAY.format(date);
}

/** "2026-11-10", for <time datetime>. */
export function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}
