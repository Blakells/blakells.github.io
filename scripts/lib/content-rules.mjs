/**
 * @typedef {{ id: string, message: string, pattern: RegExp, proseOnly?: boolean, allow?: (context: string) => boolean }} Rule
 * @typedef {{ rule: string, message: string, line: number }} Violation
 */

/** @type {Rule[]} */
export const RULES = [
  { id: 'personal-email', message: 'a personal Gmail address', pattern: /@gmail\.com/gi },
  { id: 'finance-size', message: "a phrase that sizes Blake's finances", pattern: /\b(?:four|five|six|seven|eight|nine|ten)-figure\b/gi },
  { id: 'money', message: 'a dollar amount', pattern: /\$\s?\d/g, proseOnly: true },
  {
    id: 'upstream-name',
    message: '"ApplyPilot" outside the credit to the upstream project',
    pattern: /ApplyPilot/g,
    allow: (context) => context.includes('Pickle-Pixel'),
  },
  { id: 'placeholder', message: 'a placeholder', pattern: /\b(?:TODO|TBD)\b|lorem ipsum/gi },
];

/**
 * Find rule matches in a text.
 * @param {string} text
 * @param {'all' | 'general' | 'prose'} which  general: rules safe for code; prose: only prose rules; all: both
 * @returns {Violation[]}
 */
export function findViolations(text, which) {
  /** @type {Violation[]} */
  const found = [];
  for (const rule of RULES) {
    if (which === 'general' && rule.proseOnly) continue;
    if (which === 'prose' && !rule.proseOnly) continue;
    for (const match of text.matchAll(rule.pattern)) {
      const at = match.index ?? 0;
      if (rule.allow?.(text.slice(Math.max(0, at - 200), at + 200))) continue;
      found.push({ rule: rule.id, message: rule.message, line: text.slice(0, at).split('\n').length });
    }
  }
  return found;
}

/**
 * One quoted attribute value and where it starts in the tag's attribute text. The opening quote
 * chooses the delimiter, so the other quote may appear inside the value.
 * @param {string} attrs
 * @param {string} attribute
 * @returns {{ value: string, index: number } | undefined}
 */
function attributeValue(attrs, attribute) {
  const match = new RegExp(`(?:^|\\s)${attribute}\\s*=\\s*(?:"([^"]*)"|'([^']*)')`, 'di').exec(attrs);
  if (!match) return undefined;
  const group = match[1] !== undefined ? 1 : 2;
  return { value: match[group], index: match.indices[group][0] };
}

/**
 * Values a visitor, search engine or assistive technology reads from HTML attributes: a page's meta
 * description, its `og:` metadata, image alt text, and title and aria-label attributes. `visibleText`
 * strips attributes, so these values need their own pass.
 * @param {string} html
 * @returns {{ value: string, line: number }[]}
 */
export function readableAttributes(html) {
  const lineOf = (index) => html.slice(0, index).split('\n').length;
  /** @type {{ value: string, line: number }[]} */
  const values = [];
  for (const match of html.matchAll(/<meta\b([^>]*)>/gid)) {
    const attrs = match[1];
    const attrsAt = match.indices[1][0];
    const name = attributeValue(attrs, 'name')?.value.toLowerCase();
    const property = attributeValue(attrs, 'property')?.value.toLowerCase();
    const content = attributeValue(attrs, 'content');
    if (!content) continue;
    if (name !== 'description' && !property?.startsWith('og:')) continue;
    values.push({ value: content.value, line: lineOf(attrsAt + content.index) });
  }
  for (const match of html.matchAll(/(?:^|\s)(?:alt|title|aria-label)\s*=\s*(?:"([^"]*)"|'([^']*)')/gid)) {
    const group = match[1] !== undefined ? 1 : 2;
    values.push({ value: match[group], line: lineOf(match.indices[group][0]) });
  }
  return values;
}

/**
 * The text a visitor sees on an HTML page: scripts, styles and tags removed, common entities decoded.
 * @param {string} html
 */
export function visibleText(html) {
  return html
    .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#36;/g, '$')
    .replace(/&amp;/g, '&');
}
