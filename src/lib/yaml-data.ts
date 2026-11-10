import { parse } from 'yaml';
import type { z } from 'astro/zod';

/** Parse a YAML string and validate it, naming the file and the failing fields in the error. */
export function parseYamlData<T extends z.ZodType>(raw: string, schema: T, file: string): z.infer<T> {
  const result = schema.safeParse(parse(raw));
  if (!result.success) {
    const fields = result.error.issues.map((issue) => `${issue.path.join('.') || '(root)'}: ${issue.message}`);
    throw new Error(`${file} is invalid:\n${fields.join('\n')}`);
  }
  return result.data;
}
