import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { beforeAll, describe, expect, it } from 'vitest';
import Button from '../../src/components/Button.astro';
import ChannelLabel from '../../src/components/ChannelLabel.astro';
import TraceBand from '../../src/components/TraceBand.astro';

let container: AstroContainer;
beforeAll(async () => {
  container = await AstroContainer.create();
});

describe('ChannelLabel', () => {
  it('renders the channel number and name', async () => {
    const html = await container.renderToString(ChannelLabel, { props: { channel: '02', name: 'Work' } });
    expect(html).toContain('CH·02');
    expect(html).toContain('/ Work');
  });
});

describe('TraceBand', () => {
  it('is decorative: hidden from screen readers and not focusable', async () => {
    const html = await container.renderToString(TraceBand);
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain('focusable="false"');
    expect(html).toMatch(/class="trace__line/);
  });
});

describe('Button', () => {
  it('renders a primary link button by default', async () => {
    const html = await container.renderToString(Button, { props: { href: '/work/preflight/' }, slots: { default: 'View Preflight' } });
    expect(html).toMatch(/<a[^>]+class="[^"]*button--primary/);
    expect(html).toContain('href="/work/preflight/"');
    expect(html).toContain('View Preflight');
  });

  it('renders the secondary variant', async () => {
    const html = await container.renderToString(Button, { props: { href: '/contact/', variant: 'secondary' }, slots: { default: 'Get in touch' } });
    expect(html).toMatch(/class="[^"]*button--secondary/);
  });
});
