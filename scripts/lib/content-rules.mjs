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
