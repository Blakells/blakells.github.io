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

/** One labelled line under Projects & Activities: plain text, or linked items each followed by a short note. */
const Note = z.object({
  label: z.string(),
  text: z.string().optional(),
  items: z.array(z.object({ label: z.string(), href: z.url(), note: z.string() })).default([]),
});

const Resume = z.object({
  headline: z.string(),
  availability: z.string(),
  summary: z.string(),
  education: z.array(Entry).min(1),
  skills: z.array(z.object({ group: z.string(), items: z.string() })).min(1),
  experience: z.array(Entry).min(1),
  projectNotes: z.array(Note).min(1),
});

export type Resume = z.infer<typeof Resume>;
export type ResumeEntry = z.infer<typeof Entry>;
export const resume: Resume = fillFactsDeep(parseYamlData(raw, Resume, 'src/content/resume.yaml'));
