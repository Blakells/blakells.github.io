import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { serveDir } from '../../scripts/lib/serve.mjs';

let root = '';
let server: { url: string; close: () => Promise<void> };

beforeAll(async () => {
  root = await mkdtemp(join(tmpdir(), 'serve-'));
  await writeFile(join(root, 'index.html'), '<h1>home</h1>');
  await writeFile(join(root, '404.html'), '<h1>off track</h1>');
  await mkdir(join(root, 'work'));
  await writeFile(join(root, 'work', 'index.html'), '<h1>work</h1>');
  await writeFile(join(root, 'file.pdf'), '%PDF-1.7');
  server = await serveDir(root);
});

afterAll(async () => {
  await server.close();
  await rm(root, { recursive: true, force: true });
});

describe('serveDir', () => {
  it('serves index.html for the root and for directories', async () => {
    const home = await fetch(`${server.url}/`);
    expect(home.status).toBe(200);
    expect(home.headers.get('content-type')).toContain('text/html');
    expect(await home.text()).toBe('<h1>home</h1>');
    expect(await (await fetch(`${server.url}/work/`)).text()).toBe('<h1>work</h1>');
  });

  it('sends the right type for a PDF', async () => {
    const pdf = await fetch(`${server.url}/file.pdf`);
    expect(pdf.headers.get('content-type')).toBe('application/pdf');
  });

  it('answers a missing path with 404.html and status 404', async () => {
    const missing = await fetch(`${server.url}/nope/`);
    expect(missing.status).toBe(404);
    expect(await missing.text()).toBe('<h1>off track</h1>');
  });

  it('refuses paths outside the root', async () => {
    const escape = await fetch(`${server.url}/%2e%2e/%2e%2e/etc/passwd`);
    expect([403, 404]).toContain(escape.status);
    expect(await escape.text()).not.toContain('root:');
  });
});
