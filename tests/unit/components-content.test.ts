import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { beforeAll, describe, expect, it } from 'vitest';
import ArchiveRow from '../../src/components/ArchiveRow.astro';
import ContactStrip from '../../src/components/ContactStrip.astro';
import FactList from '../../src/components/FactList.astro';
import PostRow from '../../src/components/PostRow.astro';
import ProjectCard from '../../src/components/ProjectCard.astro';

let container: AstroContainer;
beforeAll(async () => {
  container = await AstroContainer.create();
});

describe('ProjectCard', () => {
  const props = {
    channel: '01', label: 'Open-source agent', title: 'Preflight', href: '/work/preflight/',
    summary: 'An AI agent that fills job applications.', tags: ['Python', 'Claude Code'], stat: '805 tests',
  };

  it('links the title to the project page and lists tags and the stat', async () => {
    const html = await container.renderToString(ProjectCard, { props });
    expect(html).toContain('CH·01');
    expect(html).toMatch(/<h3[^>]*><a href="\/work\/preflight\/"[^>]*>Preflight<\/a><\/h3>/);
    expect(html).toMatch(/<li[^>]*>Claude Code<\/li>/);
    expect(html).toContain('805 tests');
  });

  it('omits the stat line when there is none', async () => {
    const html = await container.renderToString(ProjectCard, { props: { ...props, stat: undefined } });
    expect(html).not.toContain('card__stat');
  });

  it('adds a named play link only for a project with a play path', async () => {
    const game = { ...props, title: 'Lantern Hollow', href: '/work/lantern-hollow-game/', play: '/lantern-hollow/' };
    expect(await container.renderToString(ProjectCard, { props: game }))
      .toMatch(/<a href="\/lantern-hollow\/"[^>]*>Play Lantern Hollow<\/a>/);
    expect(await container.renderToString(ProjectCard, { props })).not.toContain('card__play');
  });
});

describe('ArchiveRow', () => {
  const props = { title: 'Drum-Machine', year: 2020, summary: 'A drum machine in React.', stack: ['React'], repo: 'https://github.com/Blakells/Drum-Machine' };

  it('links the source with an accessible name that includes the project', async () => {
    const html = await container.renderToString(ArchiveRow, { props });
    expect(html).toContain('href="https://github.com/Blakells/Drum-Machine"');
    expect(html).toMatch(/Source<span class="visually-hidden"[^>]*> for Drum-Machine<\/span>/);
    expect(html).not.toContain('Live demo');
  });

  it('adds a live demo link only when there is one', async () => {
    const html = await container.renderToString(ArchiveRow, { props: { ...props, demo: 'https://example.netlify.app/' } });
    expect(html).toContain('href="https://example.netlify.app/"');
  });
});

describe('FactList', () => {
  it('renders label/value pairs and optional links', async () => {
    const html = await container.renderToString(FactList, {
      props: { items: [{ label: 'Based in', value: 'Florence, SC' }, { label: 'Source', value: 'github.com/Blakells/preflight', href: 'https://github.com/Blakells/preflight' }] },
    });
    expect(html).toMatch(/<dt[^>]*>Based in<\/dt>\s*<dd[^>]*>Florence, SC<\/dd>/);
    expect(html).toMatch(/<a href="https:\/\/github\.com\/Blakells\/preflight"[^>]*>github\.com\/Blakells\/preflight<\/a>/);
  });

  it('has an inline variant for meta rows', async () => {
    const html = await container.renderToString(FactList, { props: { items: [{ label: 'Year', value: '2026' }], inline: true } });
    expect(html).toContain('facts--inline');
  });
});

describe('PostRow', () => {
  it('shows the title link, a machine-readable date and the description', async () => {
    const html = await container.renderToString(PostRow, {
      props: { title: 'A post', href: '/writing/a-post/', date: new Date('2026-11-10T00:00:00Z'), description: 'What it covers.' },
    });
    expect(html).toMatch(/<a class="post__title" href="\/writing\/a-post\/"[^>]*>A post<\/a>/);
    expect(html).toMatch(/<time datetime="2026-11-10"[^>]*>Nov 10, 2026<\/time>/);
    expect(html).toContain('What it covers.');
  });
});

describe('ContactStrip', () => {
  it('shows email and GitHub by default', async () => {
    const html = await container.renderToString(ContactStrip);
    expect(html).toContain('href="mailto:blake@blakells.dev"');
    expect(html).toContain('github.com/Blakells');
    expect(html).not.toContain('tel:');
  });

  it('adds location in the full version, and never a phone number', async () => {
    const html = await container.renderToString(ContactStrip, { props: { full: true } });
    expect(html).toContain('Florence, SC');
    expect(html).not.toContain('tel:');
  });
});
