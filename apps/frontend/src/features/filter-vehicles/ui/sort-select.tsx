'use client';

import { VehicleSortSchema } from '@drivewise/contracts';

import { SORT_LABELS } from '@entities/vehicle';
import { Select } from '@shared/ui';
import type { VehicleFiltersApi } from '../model/use-vehicle-filters';

export function SortSelect({ filters }: { filters: VehicleFiltersApi }) {
  return (
    <Select
      aria-label="Sort results"
      value={filters.getScalar('sort') ?? 'bestMatch'}
      onChange={(event) =>
        filters.setScalar('sort', event.target.value === 'bestMatch' ? null : event.target.value)
      }
      className="h-10 w-auto min-w-44"
    >
      {VehicleSortSchema.options.map((sort) => (
        <option key={sort} value={sort}>
          Sort: {SORT_LABELS[sort]}
        </option>
      ))}
    </Select>
  );
}
