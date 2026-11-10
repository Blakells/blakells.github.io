import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { beforeAll, describe, expect, it } from 'vitest';
import HonestNote from '../../src/components/HonestNote.astro';
import LayerTable from '../../src/components/LayerTable.astro';
import PipelineDiagram from '../../src/components/PipelineDiagram.astro';

let container: AstroContainer;
beforeAll(async () => {
  container = await AstroContainer.create();
});

describe('PipelineDiagram', () => {
  it('renders the stages as an ordered list, numbered from 01', async () => {
    const html = await container.renderToString(PipelineDiagram, {
      props: { stages: [{ name: 'discover', line: 'Finds postings.' }, { name: 'apply', line: 'Fills the form.' }] },
    });
    expect(html).toContain('<ol');
    expect(html).toMatch(/01[\s\S]*discover[\s\S]*Finds postings\.[\s\S]*02[\s\S]*apply/);
  });
});

describe('LayerTable', () => {
  it('renders a captioned table with a header row and one row per layer', async () => {
    const html = await container.renderToString(LayerTable, {
      props: { layers: [
        { layer: 'Dry-run guard', where: 'apply/helpers/dry_run_guard.js', prevents: 'The final submit leaving the browser.' },
        { layer: 'Dedupe', where: 'dedupe.py', prevents: 'Applying twice.' },
      ] },
    });
    expect(html).toContain('<caption');
    expect(html.match(/<th scope="col"/g)).toHaveLength(3);
    expect(html.match(/<tr/g)).toHaveLength(3);
    expect(html).toMatch(/<code[^>]*>apply\/helpers\/dry_run_guard\.js<\/code>/);
  });
});

describe('HonestNote', () => {
  it('is a labelled note around its content', async () => {
    const html = await container.renderToString(HonestNote, { slots: { default: '<p>Credit.</p>' } });
    expect(html).toContain('role="note"');
    expect(html).toContain('aria-label="Honest note"');
    expect(html).toContain('<p>Credit.</p>');
  });
});
