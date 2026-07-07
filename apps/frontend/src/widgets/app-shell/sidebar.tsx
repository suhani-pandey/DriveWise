'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@shared/lib/cn';
import { NAV_ITEMS } from './nav-items';

/** Persistent left sidebar on desktop, per the Clarity direction. */
export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-hairline bg-paper px-4 py-6 lg:flex">
      <Link href="/browse" className="flex items-center gap-2.5 px-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink font-display text-lg text-paper">
          D
        </span>
        <span className="font-display text-xl">DriveWise</span>
      </Link>

      <nav aria-label="Main" className="mt-8 flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
                active
                  ? 'bg-accent-soft font-medium text-accent-dark'
                  : 'text-muted hover:bg-ink/5 hover:text-ink',
              )}
            >
              <span aria-hidden className="w-5 text-center text-base">
                {item.glyph}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-4">
        <div className="rounded-xl bg-accent-soft p-4">
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-accent-dark">
            Ask AI
          </p>
          <p className="mt-1 text-sm leading-snug text-accent-dark">
            Not sure where to start? Describe how you&apos;ll drive — right on the Browse page —
            and we&apos;ll shortlist for you.
          </p>
          <Link
            href="/browse"
            className="mt-2 inline-block text-sm font-medium text-accent-dark underline underline-offset-4"
          >
            Try it
          </Link>
        </div>

        <Link
          href="/profile"
          className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-ink/5"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink/10 text-xs font-medium">
            MK
          </span>
          <span className="text-sm leading-tight">
            Maja K.
            <span className="block text-xs text-muted">Free plan</span>
          </span>
        </Link>
      </div>
    </aside>
  );
}
