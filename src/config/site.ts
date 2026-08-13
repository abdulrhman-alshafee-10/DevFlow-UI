/**
 * Central place for site-wide constants — used in metadata,
 * OpenGraph tags, footers, and headers.
 */
export const siteConfig = {
  name: 'DevFlow',
  shortName: 'DevFlow',
  description:
    'A modern, real-time project management platform for developer teams. Kanban boards, threaded comments, live updates, and an AI assistant that actually helps.',
  tagline: 'Ship software. Together. In flow.',
  url: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
  ogImage: '/og.png',
  keywords: [
    'project management',
    'kanban',
    'developer tools',
    'saas',
    'real-time collaboration',
    'next.js',
  ],
  authors: [{ name: 'DevFlow Team' }],
  creator: 'DevFlow',
  links: {
    github: 'https://github.com/devflow',
    docs: '/docs',
    twitter: 'https://twitter.com/devflow',
  },
} as const;

export type SiteConfig = typeof siteConfig;
