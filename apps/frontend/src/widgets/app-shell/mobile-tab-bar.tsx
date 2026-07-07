'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@shared/lib/cn';
import { NAV_ITEMS } from './nav-items';

/** Labeled bottom tab bar on mobile, per the Clarity direction. */
export function MobileTabBar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-30 flex border-t border-hairline bg-paper/95 backdrop-blur lg:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {NAV_ITEMS.map((item) => {
        const active = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] transition-colors',
              active ? 'font-medium text-accent-dark' : 'text-muted',
            )}
          >
            <span aria-hidden className="text-base leading-none">
              {item.glyph}
            </span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
