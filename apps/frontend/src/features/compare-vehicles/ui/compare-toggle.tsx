'use client';

import { cn } from '@shared/lib/cn';
import { MAX_COMPARE, useCompareStore } from '../model/compare-store';

/** Card action: add/remove a vehicle from the comparison selection. */
export function CompareToggle({ vehicleId }: { vehicleId: string }) {
  const vehicleIds = useCompareStore((s) => s.vehicleIds);
  const toggle = useCompareStore((s) => s.toggle);
  const selected = vehicleIds.includes(vehicleId);
  const full = !selected && vehicleIds.length >= MAX_COMPARE;

  return (
    <button
      type="button"
      onClick={() => toggle(vehicleId)}
      disabled={full}
      aria-pressed={selected}
      title={full ? `Comparison is full (max ${MAX_COMPARE})` : 'Add to comparison'}
      className={cn(
        'rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
        selected
          ? 'bg-accent text-white'
          : 'hairline bg-card text-muted hover:border-accent hover:text-accent-dark',
        full && 'cursor-not-allowed opacity-40',
      )}
    >
      {selected ? 'Comparing ✓' : 'Compare'}
    </button>
  );
}
