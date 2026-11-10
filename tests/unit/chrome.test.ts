import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { beforeAll, describe, expect, it } from 'vitest';
import SiteFooter from '../../src/components/SiteFooter.astro';
import SiteHeader from '../../src/components/SiteHeader.astro';

let container: AstroContainer;
beforeAll(async () => {
  container = await AstroContainer.create();
});

describe('SiteHeader', () => {
  it('links the five sections in order', async () => {
    const html = await container.renderToString(SiteHeader, { request: new Request('https://blakells.dev/') });
    const hrefs = [...html.matchAll(/<li[^>]*><a href="([^"]+)"/g)].map((m) => m[1]);
    expect(hrefs).toEqual(['/work/', '/about/', '/resume/', '/writing/', '/contact/']);
  });

  it('marks the current section, including its sub-pages', async () => {
    const html = await container.renderToString(SiteHeader, { request: new Request('https://blakells.dev/work/preflight/') });
    expect(html).toMatch(/<a href="\/work\/" aria-current="page"[^>]*>Work<\/a>/);
    expect(html).not.toMatch(/href="\/about\/" aria-current/);
  });
});

describe('SiteFooter', () => {
  it('shows the domain email, GitHub and RSS', async () => {
    const html = await container.renderToString(SiteFooter);
    expect(html).toContain('href="mailto:blake@blakells.dev"');
    expect(html).toContain('href="https://github.com/Blakells"');
    expect(html).toContain('href="/rss.xml"');
  });
});
