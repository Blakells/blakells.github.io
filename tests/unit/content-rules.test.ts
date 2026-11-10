import { describe, expect, it } from 'vitest';
import { findViolations, readableAttributes, visibleText } from '../../scripts/lib/content-rules.mjs';

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

describe('readableAttributes', () => {
  it('collects the attribute text visitors, search and assistive technology can read', () => {
    const html = [
      '<meta name="description" content="I save $500 a month">',
      '<meta property="og:title" content="A $300 bonus">',
      '<meta name="theme-color" content="#111316">',
      '<img alt="a $300 bonus" src="/x.png">',
      '<a title="Resume" aria-label="Open resume" href="/resume/">Resume</a>',
      '<span data-title="not an attribute to check"></span>',
    ].join('\n');
    expect(readableAttributes(html).map((v) => v.value)).toEqual([
      'I save $500 a month',
      'A $300 bonus',
      'a $300 bonus',
      'Resume',
      'Open resume',
    ]);
  });

  it('reports the line each attribute is on', () => {
    const html = '<p>one</p>\n<p>two</p>\n<img alt="a $5 fee" src="/x.png">';
    expect(readableAttributes(html)).toEqual([{ value: 'a $5 fee', line: 3 }]);
  });

  it('lets the money rule see a dollar amount in an attribute', () => {
    const html = '<meta name="description" content="I save $500 a month">';
    const found = readableAttributes(html).flatMap((v) => findViolations(visibleText(v.value), 'prose'));
    expect(found).toEqual([{ rule: 'money', message: 'a dollar amount', line: 1 }]);
  });

  it('reads a whole value that contains an apostrophe', () => {
    const html = [
      `<meta name="description" content="It's $5 a month">`,
      `<img alt="Blake's rate is $50 a month" src="/x.png">`,
      `<a title='He said "hi" for $5'>Hi</a>`,
    ].join('\n');
    expect(readableAttributes(html).map((v) => v.value)).toEqual([
      "It's $5 a month",
      "Blake's rate is $50 a month",
      'He said "hi" for $5',
    ]);
  });

  it(`lets the money rule see a dollar amount after an apostrophe`, () => {
    const html = [
      `<meta name="description" content="It's $5 a month">`,
      `<img alt="Blake's rate is $50 a month" src="/x.png">`,
    ].join('\n');
    const found = readableAttributes(html).flatMap((v) => findViolations(visibleText(v.value), 'prose'));
    expect(found.map((v) => v.rule)).toEqual(['money', 'money']);
  });
});
