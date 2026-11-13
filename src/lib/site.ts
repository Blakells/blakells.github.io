import { z } from 'astro/zod';
import raw from '../data/site.yaml?raw';
import { parseYamlData } from './yaml-data';

const Site = z.object({
  name: z.string(),
  role: z.string(),
  tagline: z.string(),
  url: z.url(),
  email: z.email(),
  github: z.object({ handle: z.string(), url: z.url() }),
  linkedin: z.object({ handle: z.string(), url: z.url() }),
  location: z.string(),
  work: z.string(),
  inferenceServer: z.string(),
  degree: z.object({ name: z.string(), school: z.string(), status: z.string() }),
  preflight: z.object({ repo: z.url(), tests: z.number().int().positive(), ci: z.string() }),
});

export type Site = z.infer<typeof Site>;
export const site: Site = parseYamlData(raw, Site, 'src/data/site.yaml');
