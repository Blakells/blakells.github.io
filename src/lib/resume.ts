import { z } from 'astro/zod';
import raw from '../content/resume.yaml?raw';
import { fillFactsDeep } from './facts';
import { parseYamlData } from './yaml-data';

const Entry = z.object({
  title: z.string(),
  org: z.string().optional(),
  place: z.string().optional(),
  dates: z.string(),
  link: z.object({ label: z.string(), href: z.url() }).optional(),
  bullets: z.array(z.string()).default([]),
});

const Resume = z.object({
  summary: z.string(),
  skills: z.array(z.object({ group: z.string(), items: z.string() })).min(1),
  experience: z.array(Entry).min(1),
  projects: z.array(Entry).min(1),
  activities: z.array(z.string()).min(1),
  education: z.array(Entry).min(1),
  licenses: z.string(),
});

export type Resume = z.infer<typeof Resume>;
export type ResumeEntry = z.infer<typeof Entry>;
export const resume: Resume = fillFactsDeep(parseYamlData(raw, Resume, 'src/content/resume.yaml'));
