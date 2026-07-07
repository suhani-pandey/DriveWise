'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useCompareStore } from '@features/compare-vehicles';

/**
 * Sticky tray that appears once vehicles are selected for comparison —
 * the "one obvious next step" from anywhere in the app.
 */
export function CompareTray() {
  const pathname = usePathname();
  const vehicleIds = useCompareStore((s) => s.vehicleIds);
  const clear = useCompareStore((s) => s.clear);

  if (vehicleIds.length === 0 || pathname.startsWith('/compare')) return null;

  return (
    <div className="fixed inset-x-4 bottom-20 z-40 mx-auto flex max-w-md items-center justify-between gap-3 rounded-full bg-ink px-5 py-3 text-paper shadow-lg lg:bottom-6 lg:left-[calc(50%+7.5rem)] lg:-translate-x-1/2">
      <span className="text-sm">
        {vehicleIds.length} vehicle{vehicleIds.length > 1 ? 's' : ''} selected
      </span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={clear}
          className="text-xs text-paper/70 underline underline-offset-4 hover:text-paper"
        >
          Clear
        </button>
        <Link
          href="/compare"
          className="rounded-full bg-accent px-4 py-1.5 text-sm font-medium text-white hover:bg-accent-dark"
        >
          Compare{vehicleIds.length >= 2 ? ' →' : ''}
        </Link>
      </div>
    </div>
  );
}
