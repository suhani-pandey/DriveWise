'use client';

import type { Vehicle } from '@drivewise/contracts';

import { VehicleCard } from '@entities/vehicle';
import { CompareToggle } from '@features/compare-vehicles';
import { SaveButton } from '@features/save-vehicle';
import { EmptyState, Skeleton } from '@shared/ui';

/** Browse result grid: cards with save + compare actions, skeletons, empty state. */
export function VehicleGrid({
  vehicles,
  isLoading,
  onClearFilters,
}: {
  vehicles: Vehicle[] | undefined;
  isLoading: boolean;
  onClearFilters?: () => void;
}) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-72" />
        ))}
      </div>
    );
  }

  if (!vehicles || vehicles.length === 0) {
    return (
      <EmptyState
        title="No vehicles match."
        description="Try removing a filter or widening the price range — the inventory updates as you adjust."
        action={
          onClearFilters ? (
            <button
              type="button"
              onClick={onClearFilters}
              className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper"
            >
              Clear all filters
            </button>
          ) : undefined
        }
      />
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {vehicles.map((vehicle) => (
        <VehicleCard
          key={vehicle.id}
          vehicle={vehicle}
          actions={
            <>
              <SaveButton vehicleId={vehicle.id} />
              <CompareToggle vehicleId={vehicle.id} />
            </>
          }
        />
      ))}
    </div>
  );
}
