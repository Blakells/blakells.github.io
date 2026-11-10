import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    /** Shown after the channel number, for example "Open-source agent". */
    label: z.string(),
    summary: z.string(),
    /** The page's meta description. */
    description: z.string(),
    order: z.number().int(),
    year: z.number().int(),
    tags: z.array(z.string()).min(1),
    repo: z.url(),
    /** Site path of something to try, for example the game. */
    play: z.string().startsWith('/').optional(),
    /** One line under the card; may use {fact} tokens. */
    stat: z.string().optional(),
  }),
});

const earlier = defineCollection({
  loader: file('src/content/earlier-work.yaml'),
  schema: z.object({
    title: z.string(),
    order: z.number().int(),
    year: z.number().int(),
    summary: z.string(),
    stack: z.array(z.string()).min(1),
    repo: z.url(),
    demo: z.url().optional(),
  }),
});

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects, earlier, posts };
