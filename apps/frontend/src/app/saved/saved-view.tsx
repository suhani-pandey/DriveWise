'use client';

import Link from 'next/link';
import type { SavedStatus } from '@drivewise/contracts';

import { VehicleImage } from '@entities/vehicle';
import { useCompareStore } from '@features/compare-vehicles';
import {
  useRemoveSavedVehicle,
  useSavedList,
  useUpdateSavedVehicle,
} from '@features/save-vehicle';
import { formatDkkShort } from '@shared/lib/format';
import { Badge, EmptyState, Select, Skeleton } from '@shared/ui';

const STATUS_LABELS: Record<SavedStatus, string> = {
  considering: 'Considering',
  shortlist: 'Shortlist · top pick',
  test_drive_booked: 'Test drive booked',
  stretch_budget: 'Stretch budget',
};

export function SavedView() {
  const { data, isLoading, isError } = useSavedList();
  const updateSaved = useUpdateSavedVehicle();
  const removeSaved = useRemoveSavedVehicle();
  const compareToggle = useCompareStore((s) => s.toggle);
  const compareClear = useCompareStore((s) => s.clear);

  const items = data?.items ?? [];

  const compareAll = () => {
    compareClear();
    items.slice(0, 4).forEach((item) => compareToggle(item.vehicleId));
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1">
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted">Saved</p>
          <h1 className="font-display text-4xl sm:text-5xl">Your shortlist.</h1>
          <p className="text-sm text-muted">
            {items.length} vehicle{items.length === 1 ? '' : 's'}. Set a status on each so the
            list stays a decision, not a pile.
          </p>
        </div>
        {items.length >= 2 ? (
          <Link
            href="/compare"
            onClick={compareAll}
            className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper"
          >
            Compare all
          </Link>
        ) : null}
      </header>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
      ) : null}

      {isError ? (
        <p role="alert" className="hairline rounded-xl bg-card p-4 text-sm text-red-700">
          Could not load your saved vehicles. Is the API running?
        </p>
      ) : null}

      {!isLoading && !isError && items.length === 0 ? (
        <EmptyState
          title="Nothing saved yet."
          description="Tap the heart on any vehicle in Browse to build your shortlist. We'll keep it here."
          action={
            <Link
              href="/browse"
              className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper"
            >
              Browse vehicles
            </Link>
          }
        />
      ) : null}

      <ul className="space-y-3">
        {items.map(({ vehicle, status, savedAt }) => (
          <li
            key={vehicle.id}
            className="hairline flex flex-col gap-4 rounded-xl bg-card p-4 sm:flex-row sm:items-center"
          >
            <Link href={`/vehicles/${vehicle.id}`} className="h-20 w-full shrink-0 sm:w-32">
              <VehicleImage vehicle={vehicle} />
            </Link>

            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
                {vehicle.make}
              </p>
              <Link
                href={`/vehicles/${vehicle.id}`}
                className="font-display text-xl underline-offset-4 hover:underline"
              >
                {vehicle.model}
              </Link>
              <div className="mt-1 flex flex-wrap items-center gap-1.5">
                <Badge tone="accent">{STATUS_LABELS[status]}</Badge>
                <span className="text-xs text-muted">
                  Saved {new Date(savedAt).toLocaleDateString('da-DK')}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <p className="font-display text-2xl">
                {formatDkkShort(vehicle.priceDkk)}
                <span className="ml-1 text-xs text-muted">from</span>
              </p>
              <Select
                aria-label={`Status for ${vehicle.make} ${vehicle.model}`}
                value={status}
                onChange={(event) =>
                  updateSaved.mutate({
                    vehicleId: vehicle.id,
                    status: event.target.value as SavedStatus,
                  })
                }
                className="h-9 w-44 text-xs"
              >
                {(Object.keys(STATUS_LABELS) as SavedStatus[]).map((value) => (
                  <option key={value} value={value}>
                    {STATUS_LABELS[value]}
                  </option>
                ))}
              </Select>
              <button
                type="button"
                onClick={() => removeSaved.mutate(vehicle.id)}
                className="text-xs text-muted underline underline-offset-4 hover:text-ink"
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
