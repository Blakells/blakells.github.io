import { describe, expect, it } from 'vitest';
import { checkResumePdf } from '../../scripts/lib/pdf-text.mjs';

const good = 'Blake Bailey\nSUMMARY\nSkills\nEXPERIENCE\nTECHNICAL PROJECTS\nEducation & Licenses';

describe('checkResumePdf', () => {
  it('accepts a two-page resume with every heading, in any case', () => {
    expect(checkResumePdf({ pages: 2, text: good })).toEqual([]);
  });

  it('rejects a PDF without text', () => {
    expect(checkResumePdf({ pages: 1, text: '  ' })).toContain('the PDF has no extractable text');
  });

  it('rejects a PDF longer than three pages', () => {
    expect(checkResumePdf({ pages: 4, text: good })).toContain('the PDF runs to 4 pages (limit 3)');
  });

  it('names each missing heading', () => {
    expect(checkResumePdf({ pages: 1, text: 'Blake Bailey' })).toContain('the PDF text lacks "Technical Projects"');
  });
});
