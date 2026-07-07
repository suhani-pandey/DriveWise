import type { Metadata, Viewport } from 'next';
import { Geist, Source_Serif_4 } from 'next/font/google';

import { AppShell } from '@widgets/app-shell';
import { Providers } from './providers';
import './globals.css';

const display = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const body = Geist({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'DriveWise — find your next car',
    template: '%s · DriveWise',
  },
  description:
    'Browse, compare and understand vehicles on the Danish market — new and used — with AI-powered guidance.',
};

export const viewport: Viewport = {
  themeColor: '#FBFAF6',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="min-h-screen">
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
