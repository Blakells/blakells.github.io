import { describe, expect, it } from 'vitest';
import { displayDate, isoDate } from '../../src/lib/format';

describe('dates', () => {
  const date = new Date('2026-11-10T00:00:00Z');
  it('formats for people in UTC', () => expect(displayDate(date)).toBe('Nov 10, 2026'));
  it('formats for <time datetime>', () => expect(isoDate(date)).toBe('2026-11-10'));
});
