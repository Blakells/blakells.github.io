import { describe, expect, it } from 'vitest';
import { findViolations, visibleText } from '../../scripts/lib/content-rules.mjs';

const ids = (text: string, rules: 'all' | 'general' | 'prose' = 'all') => findViolations(text, rules).map((v) => v.rule);

describe('findViolations', () => {
  it('flags any Gmail address', () => {
    expect(ids('write to someone' + '@gmail.com today')).toEqual(['personal-email']);
    expect(ids('write to blake@blakells.dev')).toEqual([]);
  });

  it('flags phrases that size finances, but not ordinary words', () => {
    expect(ids('a six-figure result')).toEqual(['finance-size']);
    expect(ids('configure the figure; project-figure class')).toEqual([]);
  });

  it('flags dollar amounts in prose only', () => {
    expect(ids('it cost $5 a month')).toEqual(['money']);
    expect(ids('it cost $5 a month', 'general')).toEqual([]);
    expect(ids('$ preflight apply --dry-run')).toEqual([]);
  });

  it('allows "ApplyPilot" only next to the credit to Pickle-Pixel', () => {
    expect(ids('Preflight began from ApplyPilot 0.3.0 by Pickle-Pixel')).toEqual([]);
    expect(ids('I built ApplyPilot')).toEqual(['upstream-name']);
  });

  it('flags placeholders', () => {
    expect(ids('TODO: write this')).toEqual(['placeholder']);
    expect(ids('Lorem ipsum dolor')).toEqual(['placeholder']);
  });

  it('reports the line number of each match', () => {
    expect(findViolations('ok\nok\nTBD', 'all')).toEqual([{ rule: 'placeholder', message: 'a placeholder', line: 3 }]);
  });

  it('runs only the prose rules when asked', () => {
    expect(ids('$5 and TODO', 'prose')).toEqual(['money']);
  });
});

describe('visibleText', () => {
  it('drops scripts, styles and tags and decodes common entities', () => {
    const html = '<style>.a{}</style><p>Fish &amp; chips</p><script>var x = "$5";</script>';
    expect(visibleText(html).trim()).toBe('Fish & chips');
  });
});
