import { readFile } from 'node:fs/promises';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';

export const RESUME_HEADINGS = ['Blake Bailey', 'Summary', 'Experience', 'Technical Projects', 'Education'];
export const RESUME_MAX_PAGES = 3;

/**
 * The text of a PDF. Runs are joined as written, with a newline where pdf.js marks a line end,
 * and NFKC folds ligature glyphs (so "ﬂ" reads as "fl").
 * @param {string} path
 * @returns {Promise<{ pages: number, text: string }>}
 */
export async function pdfText(path) {
  const data = new Uint8Array(await readFile(path));
  const doc = await getDocument({ data, useSystemFonts: true }).promise;
  const pages = [];
  for (let n = 1; n <= doc.numPages; n++) {
    const content = await (await doc.getPage(n)).getTextContent();
    pages.push(content.items.map((item) => ('str' in item ? item.str + (item.hasEOL ? '\n' : '') : '')).join(''));
  }
  return { pages: doc.numPages, text: pages.join('\n').normalize('NFKC') };
}

/**
 * Problems with a resume PDF's extracted text; an empty list means it passes.
 * @param {{ pages: number, text: string }} pdf
 * @returns {string[]}
 */
export function checkResumePdf({ pages, text }) {
  const problems = [];
  if (!text.trim()) problems.push('the PDF has no extractable text');
  if (pages > RESUME_MAX_PAGES) problems.push(`the PDF runs to ${pages} pages (limit ${RESUME_MAX_PAGES})`);
  const lower = text.toLowerCase();
  for (const heading of RESUME_HEADINGS) {
    if (!lower.includes(heading.toLowerCase())) problems.push(`the PDF text lacks "${heading}"`);
  }
  return problems;
}
