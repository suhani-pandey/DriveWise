'use client';

import {
  BODY_TYPE_LABELS,
  CONDITION_LABELS,
  DRIVETRAIN_LABELS,
  FUEL_TYPE_LABELS,
  REGION_LABELS,
  SELLER_TYPE_LABELS,
  TRANSMISSION_LABELS,
} from '@entities/vehicle';
import type {
  ArrayFilterKey,
  ScalarFilterKey,
  VehicleFiltersApi,
} from '../model/use-vehicle-filters';

/**
 * One-tap removal of every active filter — the user always sees why the
 * result set is narrowed and can undo any single choice.
 */

const ARRAY_LABELS: Partial<Record<ArrayFilterKey, Record<string, string>>> = {
  conditions: CONDITION_LABELS,
  fuelTypes: FUEL_TYPE_LABELS,
  bodyTypes: BODY_TYPE_LABELS,
  transmissions: TRANSMISSION_LABELS,
  drivetrains: DRIVETRAIN_LABELS,
  regions: REGION_LABELS,
  sellerTypes: SELLER_TYPE_LABELS,
};

const SCALAR_LABELS: Partial<Record<ScalarFilterKey, (value: string) => string>> = {
  priceMinDkk: (v) => `From ${Number(v).toLocaleString('da-DK')} kr.`,
  priceMaxDkk: (v) => `Up to ${Number(v).toLocaleString('da-DK')} kr.`,
  leaseMaxDkk: (v) => `Lease ≤ ${Number(v).toLocaleString('da-DK')} kr./mo`,
  yearMin: (v) => `From ${v}`,
  yearMax: (v) => `To ${v}`,
  mileageMaxKm: (v) => `≤ ${Number(v).toLocaleString('da-DK')} km`,
  seatsMin: (v) => `${v}+ seats`,
  evRangeMinKm: (v) => `Range ≥ ${v} km`,
  euroNcapMin: (v) => `NCAP ${v}+`,
  registrationTaxPaid: (v) => (v === 'true' ? 'Tax paid' : 'Without tax'),
};

function RemovableChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <button
      type="button"
      onClick={onRemove}
      className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-3 py-1 text-xs font-medium text-accent-dark transition-colors hover:bg-accent hover:text-white"
      aria-label={`Remove filter: ${label}`}
    >
      {label}
      <span aria-hidden>×</span>
    </button>
  );
}

export function ActiveFilterChips({ filters }: { filters: VehicleFiltersApi }) {
  if (filters.activeCount === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {(Object.keys(ARRAY_LABELS) as ArrayFilterKey[]).flatMap((key) =>
        filters.getArray(key).map((value) => (
          <RemovableChip
            key={`${key}-${value}`}
            label={ARRAY_LABELS[key]?.[value] ?? value}
            onRemove={() => filters.toggleArrayValue(key, value)}
          />
        )),
      )}
      {filters.getArray('makes').map((make) => (
        <RemovableChip
          key={`make-${make}`}
          label={make}
          onRemove={() => filters.toggleArrayValue('makes', make)}
        />
      ))}
      {(Object.keys(SCALAR_LABELS) as ScalarFilterKey[]).map((key) => {
        const value = filters.getScalar(key);
        if (value === null) return null;
        return (
          <RemovableChip
            key={key}
            label={SCALAR_LABELS[key]!(value)}
            onRemove={() => filters.setScalar(key, null)}
          />
        );
      })}
      <button
        type="button"
        onClick={filters.clearAll}
        className="text-xs text-muted underline underline-offset-4 hover:text-ink"
      >
        Clear all
      </button>
    </div>
  );
}
