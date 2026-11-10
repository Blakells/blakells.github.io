import { readFile } from 'node:fs/promises';
import { chromium } from '@playwright/test';
import { parse } from 'yaml';

const site = parse(await readFile('src/data/site.yaml', 'utf8'));
const lap =
  'M0 33 C 26 33 38 27 62 25 H 96 C 120 25 130 9 158 9 H 190 C 212 9 220 30 248 30 H 286 ' +
  'C 310 30 318 3 350 3 H 376 C 400 3 410 23 436 23 H480';
const escape = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;');

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
  body { margin: 0; width: 1200px; height: 630px; box-sizing: border-box; padding: 0 96px;
    display: grid; align-content: center; background: #111316; color: #b0b5bc;
    background-image: radial-gradient(70% 80% at 85% 0%, rgba(255,91,31,.12), rgba(255,91,31,0) 60%);
    font-family: ui-sans-serif, -apple-system, 'Segoe UI', system-ui, sans-serif; }
  .label { font: 500 20px ui-monospace, Menlo, monospace; letter-spacing: .18em; text-transform: uppercase; color: #868c94; }
  .label b { color: #ff5b1f; font-weight: 500; }
  svg { width: 100%; height: 110px; margin: 28px 0 36px; }
  h1 { margin: 0; font-size: 92px; letter-spacing: -.02em; color: #f5f3ee; font-weight: 650; }
  .role { margin-top: 18px; font: 500 26px ui-monospace, Menlo, monospace; letter-spacing: .14em; text-transform: uppercase; color: #ff5b1f; }
  .url { margin-top: 40px; font: 500 24px ui-monospace, Menlo, monospace; }
</style></head><body>
  <div class="label"><b>CH·00</b> / Portfolio</div>
  <svg viewBox="0 0 480 46" preserveAspectRatio="none">
    <path d="M0 40 H480" stroke="#2b3138" stroke-dasharray="2 6" fill="none" vector-effect="non-scaling-stroke"/>
    <path d="${lap}" stroke="#ff5b1f" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>
  </svg>
  <h1>${escape(site.name)}</h1>
  <div class="role">${escape(site.role)}</div>
  <div class="url">${new URL(site.url).host}</div>
</body></html>`;

const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  await page.setContent(html);
  await page.screenshot({ path: 'public/og.png' });
} finally {
  await browser.close();
}
console.log('Wrote public/og.png');
