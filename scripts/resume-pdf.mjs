// Prints the built /resume/ page to dist/blake-bailey-resume.pdf and checks the result.
// Served over HTTP, not opened as a file, so the page's root-relative stylesheets load.
import { chromium } from '@playwright/test';
import { checkResumePdf, pdfText } from './lib/pdf-text.mjs';
import { serveDir } from './lib/serve.mjs';

const OUT = 'dist/blake-bailey-resume.pdf';

const server = await serveDir('dist');
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  await page.goto(`${server.url}/resume/`, { waitUntil: 'networkidle' });
  await page.emulateMedia({ media: 'print' });
  await page.pdf({ path: OUT, preferCSSPageSize: true, printBackground: false });
} finally {
  await browser.close();
  await server.close();
}

const pdf = await pdfText(OUT);
const problems = checkResumePdf(pdf);
if (problems.length > 0) {
  console.error(`Resume PDF check failed:\n- ${problems.join('\n- ')}`);
  process.exit(1);
}
console.log(`Wrote ${OUT}: ${pdf.pages} page(s).`);
