/**
 * Extract up to `max` uppercase initials from a person's name.
 *
 * Design (see `design.md`, R4):
 *   - Trim the input; if the trimmed value is empty, return `'?'`.
 *   - Split on Unicode-aware whitespace (`/\s+/u`).
 *   - Take the first Unicode grapheme of each of the first `max` tokens.
 *   - Accept the grapheme only if its base code point matches `\p{L}`
 *     (Unicode letter). Uppercase and concatenate.
 *   - If no accepted characters were produced, return `'?'`.
 *
 * Pure: does not mutate `name`. Deterministic.
 */

/**
 * Cached grapheme segmenter. Feature-detected once at module load so we
 * neither reallocate per call nor blow up in environments without
 * `Intl.Segmenter`.
 */
const SEGMENTER: Intl.Segmenter | null = (() => {
  const IntlWithSegmenter = Intl as typeof Intl & {
    Segmenter?: typeof Intl.Segmenter;
  };
  if (typeof IntlWithSegmenter.Segmenter !== 'function') {
    return null;
  }
  try {
    return new IntlWithSegmenter.Segmenter(undefined, {
      granularity: 'grapheme',
    });
  } catch {
    return null;
  }
})();

/** Matches any Unicode letter (`\p{L}`). */
const LETTER_RE = /\p{L}/u;

/**
 * Return the first grapheme cluster of `token`, using `Intl.Segmenter`
 * when available and falling back to `Array.from(token)[0]` (which yields
 * the first Unicode code point — grapheme-aware for the common
 * precomposed cases we care about).
 */
function firstGrapheme(token: string): string | undefined {
  if (token.length === 0) {
    return undefined;
  }
  if (SEGMENTER !== null) {
    const iter = SEGMENTER.segment(token)[Symbol.iterator]();
    const next = iter.next();
    if (next.done === true) {
      return undefined;
    }
    return next.value.segment;
  }
  return Array.from(token)[0];
}

export function getInitials(name: string, max = 2): string {
  const trimmed = name.trim();
  if (trimmed === '') {
    return '?';
  }

  const tokens = trimmed.split(/\s+/u);
  const cap = Math.min(max, tokens.length);

  let acc = '';
  for (let i = 0; i < cap; i += 1) {
    const token = tokens[i];
    if (token === undefined || token === '') {
      continue;
    }
    const grapheme = firstGrapheme(token);
    if (grapheme === undefined) {
      continue;
    }
    // Base code point — strips any combining marks that may travel with
    // the grapheme cluster so the result is guaranteed to be pure
    // `\p{L}` code points after uppercasing.
    const base = Array.from(grapheme)[0];
    if (base === undefined || !LETTER_RE.test(base)) {
      continue;
    }
    acc += base.toUpperCase();
  }

  return acc === '' ? '?' : acc;
}
