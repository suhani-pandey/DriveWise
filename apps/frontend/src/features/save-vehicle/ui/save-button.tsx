'use client';

import { cn } from '@shared/lib/cn';
import { useRemoveSavedVehicle, useSaveVehicle, useSavedList } from '../api/saved-api';

/** Heart toggle: adds/removes a vehicle from the watchlist. */
export function SaveButton({ vehicleId }: { vehicleId: string }) {
  const { data } = useSavedList();
  const save = useSaveVehicle();
  const remove = useRemoveSavedVehicle();

  const saved = data?.items.some((item) => item.vehicleId === vehicleId) ?? false;
  const busy = save.isPending || remove.isPending;

  return (
    <button
      type="button"
      disabled={busy}
      aria-pressed={saved}
      aria-label={saved ? 'Remove from saved' : 'Save vehicle'}
      onClick={() =>
        saved ? remove.mutate(vehicleId) : save.mutate({ vehicleId, status: 'considering', note: null })
      }
      className={cn(
        'flex h-8 w-8 items-center justify-center rounded-full text-base transition-colors',
        saved ? 'bg-accent-soft text-accent-dark' : 'hairline bg-card text-muted hover:text-accent-dark',
        busy && 'opacity-50',
      )}
    >
      {saved ? '♥' : '♡'}
    </button>
  );
}
