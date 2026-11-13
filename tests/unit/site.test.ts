import { describe, expect, it } from 'vitest';
import { z } from 'astro/zod';
import { parseYamlData } from '../../src/lib/yaml-data';
import { site } from '../../src/lib/site';

describe('parseYamlData', () => {
  const Schema = z.object({ name: z.string(), count: z.number().int() });

  it('returns the validated object', () => {
    expect(parseYamlData('name: x\ncount: 3\n', Schema, 'test.yaml')).toEqual({ name: 'x', count: 3 });
  });

  it('names the file and the field when validation fails', () => {
    expect(() => parseYamlData('name: x\ncount: three\n', Schema, 'test.yaml')).toThrow(/test\.yaml.*count/s);
  });
});

describe('site facts', () => {
  it('uses the domain address, never a personal mailbox', () => {
    expect(site.email).toBe('blake@blakells.dev');
  });

  it('lists LinkedIn and no phone number', () => {
    expect(site.linkedin.url).toBe('https://www.linkedin.com/in/blakells/');
    expect(site).not.toHaveProperty('phone');
  });

  it('states the inference server as built and the degree as expected', () => {
    expect(site.inferenceServer).toBe('Built a local inference server (4× RTX 6000 Pro)');
    expect(site.degree.status).toBe('Expected March 2027');
  });

  it('has a positive Preflight test count', () => {
    expect(site.preflight.tests).toBeGreaterThan(0);
  });
});
