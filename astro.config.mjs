// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://blakells.dev',
  trailingSlash: 'always',
  integrations: [mdx(), sitemap()],
  // Shiki writes inline style attributes, which HTML validation rejects; code blocks are styled in global.css.
  markdown: { syntaxHighlight: false },
});
