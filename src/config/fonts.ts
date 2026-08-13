import { Inter, JetBrains_Mono, Plus_Jakarta_Sans } from 'next/font/google';

/**
 * Body / UI font — Inter is battle-tested for interfaces and has
 * excellent legibility at every size.
 */
export const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

/**
 * Display font — Plus Jakarta Sans has a slightly warmer, more
 * distinctive character that reads well at large sizes for
 * headings and marketing surfaces.
 */
export const fontDisplay = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

/**
 * Monospace — JetBrains Mono for code blocks, keyboard shortcuts,
 * and any tabular numeric UI.
 */
export const fontMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});
