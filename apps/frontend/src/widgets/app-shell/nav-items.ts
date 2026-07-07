export interface NavItem {
  href: string;
  label: string;
  /** Simple glyph — the Clarity design avoids icon noise. */
  glyph: string;
}

export const NAV_ITEMS: NavItem[] = [
  { href: '/browse', label: 'Browse', glyph: '⌕' },
  { href: '/compare', label: 'Compare', glyph: '⇄' },
  { href: '/cost', label: 'Cost', glyph: 'kr' },
  { href: '/saved', label: 'Saved', glyph: '♡' },
  { href: '/profile', label: 'Profile', glyph: '◎' },
];
