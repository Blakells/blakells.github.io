import { site } from './site';

const FACTS: Record<string, string> = {
  preflightTests: String(site.preflight.tests),
  preflightCi: site.preflight.ci,
  inferenceServer: site.inferenceServer,
  degreeStatus: site.degree.status,
};

const TOKEN = /\{([a-zA-Z]+)\}/g;

/** Replace {token} placeholders with facts from site.yaml. Unknown camelCase tokens throw. */
export function fillFacts(text: string): string {
  return text.replace(TOKEN, (whole, name: string) => {
    const value = FACTS[name];
    if (value === undefined) throw new Error(`Unknown fact token ${whole}`);
    return value;
  });
}

/** fillFacts applied to every string inside a value (objects and arrays are copied). */
export function fillFactsDeep<T>(value: T): T {
  if (typeof value === 'string') return fillFacts(value) as T;
  if (Array.isArray(value)) return value.map((item) => fillFactsDeep(item)) as T;
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, fillFactsDeep(item)])) as T;
  }
  return value;
}
