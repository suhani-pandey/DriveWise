import type { Config } from 'tailwindcss';

/**
 * "Clarity" design system: one warm paper, one ink, one quiet green.
 * Bigger type, more space, fewer rules — 1px hairlines, radius 12/20/999.
 */
const config: Config = {
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/widgets/**/*.{ts,tsx}',
    './src/features/**/*.{ts,tsx}',
    './src/entities/**/*.{ts,tsx}',
    './src/shared/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        paper: '#FBFAF6',
        ink: '#111110',
        accent: {
          DEFAULT: '#2F6A4B',
          soft: '#EAF1EC',
          dark: '#25543C',
        },
        hairline: '#E7E4DB',
        muted: '#6F6D66',
        card: '#FFFFFF',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        lg: '12px',
        xl: '20px',
      },
      maxWidth: {
        content: '1200px',
      },
    },
  },
  plugins: [],
};

export default config;
