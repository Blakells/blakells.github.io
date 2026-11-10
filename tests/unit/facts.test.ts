import { describe, expect, it } from 'vitest';
import { fillFacts, fillFactsDeep } from '../../src/lib/facts';
import { site } from '../../src/lib/site';

describe('fillFacts', () => {
  it('replaces known tokens with the facts from site.yaml', () => {
    expect(fillFacts('{preflightTests} tests · {preflightCi}')).toBe(`${site.preflight.tests} tests · ${site.preflight.ci}`);
    expect(fillFacts('{inferenceServer}')).toBe(site.inferenceServer);
    expect(fillFacts('{degreeStatus}')).toBe(site.degree.status);
  });

  it('leaves text without tokens alone', () => {
    expect(fillFacts('plain text, {not a token}')).toBe('plain text, {not a token}');
  });

  it('throws on an unknown token so a typo fails the build', () => {
    expect(() => fillFacts('{preflightTest}')).toThrow(/Unknown fact token \{preflightTest\}/);
  });
});

describe('fillFactsDeep', () => {
  it('fills every string in nested objects and arrays', () => {
    const filled = fillFactsDeep({ a: ['{preflightTests}', 3], b: { c: '{degreeStatus}' } });
    expect(filled).toEqual({ a: [String(site.preflight.tests), 3], b: { c: site.degree.status } });
  });
});
