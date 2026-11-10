// Applies the content rules to the site's sources, the built pages and the resume PDF's text.
// Prints file, line and rule for each problem, never the matched text.
import { existsSync } from 'node:fs';
import { readdir, readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { findViolations, readableAttributes, visibleText } from './lib/content-rules.mjs';
import { pdfText } from './lib/pdf-text.mjs';

const TEXT = new Set(['.astro', '.ts', '.mjs', '.js', '.css', '.md', '.mdx', '.yaml', '.yml', '.json', '.svg', '.html', '.xml', '.txt', '.webmanifest']);
const PROSE = new Set(['.md', '.mdx', '.yaml', '.yml']);
const PDF = 'dist/blake-bailey-resume.pdf';

/** @param {string} dir @returns {AsyncGenerator<string>} */
async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else yield path;
  }
}

if (!existsSync('dist') || !existsSync(PDF)) {
  console.error('Run `npm run build` first: the check reads dist/ and the resume PDF.');
  process.exit(1);
}

/** @type {string[]} */
const problems = [];
/** @param {string} where @param {{ rule: string, message: string, line: number }[]} found */
const report = (where, found) => {
  for (const v of found) problems.push(`${where}:${v.line}: ${v.message} [${v.rule}]`);
};

let files = 0;
for (const dir of ['src', 'public']) {
  for await (const file of walk(dir)) {
    const ext = extname(file);
    if (!TEXT.has(ext)) continue;
    files++;
    report(file, findViolations(await readFile(file, 'utf8'), PROSE.has(ext) ? 'all' : 'general'));
  }
}
for await (const file of walk('dist')) {
  const ext = extname(file);
  if (!TEXT.has(ext)) continue;
  files++;
  const raw = await readFile(file, 'utf8');
  report(file, findViolations(raw, 'general'));
  if (ext === '.html') {
    report(`${file} (visible text)`, findViolations(visibleText(raw), 'prose'));
    // Descriptions, social metadata, alt text and labels are read by visitors, search and AT but
    // stripped by visibleText, so apply the prose rules to their values too.
    for (const attr of readableAttributes(raw)) {
      const found = findViolations(visibleText(attr.value), 'prose').map((v) => ({ ...v, line: attr.line }));
      report(`${file} (attribute text)`, found);
    }
  }
}
report(`${PDF} (text)`, findViolations((await pdfText(PDF)).text, 'all'));

if (problems.length > 0) {
  console.error(`Content check failed:\n${problems.join('\n')}`);
  process.exit(1);
}
console.log(`Content check passed: ${files} files and the resume PDF.`);
