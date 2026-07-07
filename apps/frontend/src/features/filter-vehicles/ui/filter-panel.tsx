'use client';

import type { BrowseFacets } from '@drivewise/contracts';

import {
  BODY_TYPE_LABELS,
  CONDITION_LABELS,
  DRIVETRAIN_LABELS,
  FUEL_TYPE_LABELS,
  REGION_LABELS,
  SELLER_TYPE_LABELS,
  TRANSMISSION_LABELS,
} from '@entities/vehicle';
import { Button, Chip, Input, SectionLabel, Select } from '@shared/ui';
import type { VehicleFiltersApi } from '../model/use-vehicle-filters';
import type { ArrayFilterKey, ScalarFilterKey } from '../model/use-vehicle-filters';

/**
 * The full Danish-market filter set: condition (new / used), budget (cash and
 * monthly leasing), year, mileage, powertrain, body, transmission, drivetrain,
 * seats, EV range, safety, seller region/type and registration-tax status.
 */

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <fieldset className="space-y-2.5 border-b border-hairline pb-5">
      <legend className="sr-only">{label}</legend>
      <SectionLabel>{label}</SectionLabel>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </fieldset>
  );
}

function ChipGroup<K extends string>({
  filters,
  filterKey,
  labels,
  counts,
}: {
  filters: VehicleFiltersApi;
  filterKey: ArrayFilterKey;
  labels: Record<K, string>;
  counts?: Map<string, number>;
}) {
  const selected = filters.getArray(filterKey);
  return (
    <>
      {(Object.keys(labels) as K[]).map((value) => {
        const count = counts?.get(value);
        return (
          <Chip
            key={value}
            selected={selected.includes(value)}
            onClick={() => filters.toggleArrayValue(filterKey, value)}
          >
            {labels[value]}
            {count !== undefined ? <span className="opacity-60">{count}</span> : null}
          </Chip>
        );
      })}
    </>
  );
}

function NumberField({
  filters,
  filterKey,
  placeholder,
  ariaLabel,
}: {
  filters: VehicleFiltersApi;
  filterKey: ScalarFilterKey;
  placeholder: string;
  ariaLabel: string;
}) {
  return (
    <Input
      type="number"
      inputMode="numeric"
      min={0}
      aria-label={ariaLabel}
      placeholder={placeholder}
      value={filters.getScalar(filterKey) ?? ''}
      onChange={(event) => filters.setScalar(filterKey, event.target.value || null)}
      className="h-10"
    />
  );
}

export function FilterPanel({
  filters,
  facets,
}: {
  filters: VehicleFiltersApi;
  facets?: BrowseFacets;
}) {
  const makeCounts = new Map(facets?.makes.map((f) => [f.value, f.count]) ?? []);
  const fuelCounts = new Map(facets?.fuelTypes.map((f) => [f.value, f.count]) ?? []);
  const bodyCounts = new Map(facets?.bodyTypes.map((f) => [f.value, f.count]) ?? []);

  return (
    <div className="space-y-5">
      <FilterGroup label="Condition">
        <ChipGroup filters={filters} filterKey="conditions" labels={CONDITION_LABELS} />
      </FilterGroup>

      <FilterGroup label="Make">
        {(facets?.makes ?? []).map((facet) => (
          <Chip
            key={facet.value}
            selected={filters.getArray('makes').includes(facet.value)}
            onClick={() => filters.toggleArrayValue('makes', facet.value)}
          >
            {facet.value} <span className="opacity-60">{makeCounts.get(facet.value)}</span>
          </Chip>
        ))}
      </FilterGroup>

      <FilterGroup label="Price (DKK)">
        <div className="flex w-full items-center gap-2">
          <NumberField
            filters={filters}
            filterKey="priceMinDkk"
            placeholder="Min"
            ariaLabel="Minimum price in DKK"
          />
          <span className="text-muted">–</span>
          <NumberField
            filters={filters}
            filterKey="priceMaxDkk"
            placeholder="Max"
            ariaLabel="Maximum price in DKK"
          />
        </div>
      </FilterGroup>

      <FilterGroup label="Monthly lease (max kr./mo)">
        <NumberField
          filters={filters}
          filterKey="leaseMaxDkk"
          placeholder="e.g. 4500"
          ariaLabel="Maximum monthly lease in DKK"
        />
      </FilterGroup>

      <FilterGroup label="Year">
        <div className="flex w-full items-center gap-2">
          <NumberField
            filters={filters}
            filterKey="yearMin"
            placeholder="From"
            ariaLabel="Earliest model year"
          />
          <span className="text-muted">–</span>
          <NumberField
            filters={filters}
            filterKey="yearMax"
            placeholder="To"
            ariaLabel="Latest model year"
          />
        </div>
      </FilterGroup>

      <FilterGroup label="Max mileage (km)">
        <NumberField
          filters={filters}
          filterKey="mileageMaxKm"
          placeholder="e.g. 50000"
          ariaLabel="Maximum mileage in km"
        />
      </FilterGroup>

      <FilterGroup label="Fuel">
        <ChipGroup
          filters={filters}
          filterKey="fuelTypes"
          labels={FUEL_TYPE_LABELS}
          counts={fuelCounts}
        />
      </FilterGroup>

      <FilterGroup label="Body type">
        <ChipGroup
          filters={filters}
          filterKey="bodyTypes"
          labels={BODY_TYPE_LABELS}
          counts={bodyCounts}
        />
      </FilterGroup>

      <FilterGroup label="Transmission">
        <ChipGroup filters={filters} filterKey="transmissions" labels={TRANSMISSION_LABELS} />
      </FilterGroup>

      <FilterGroup label="Drivetrain">
        <ChipGroup filters={filters} filterKey="drivetrains" labels={DRIVETRAIN_LABELS} />
      </FilterGroup>

      <FilterGroup label="Seats & safety">
        <div className="grid w-full grid-cols-2 gap-2">
          <Select
            aria-label="Minimum seats"
            value={filters.getScalar('seatsMin') ?? ''}
            onChange={(event) => filters.setScalar('seatsMin', event.target.value || null)}
          >
            <option value="">Seats: any</option>
            {[2, 4, 5, 7].map((n) => (
              <option key={n} value={n}>
                {n}+ seats
              </option>
            ))}
          </Select>
          <Select
            aria-label="Minimum Euro NCAP stars"
            value={filters.getScalar('euroNcapMin') ?? ''}
            onChange={(event) => filters.setScalar('euroNcapMin', event.target.value || null)}
          >
            <option value="">NCAP: any</option>
            <option value="4">4+ stars</option>
            <option value="5">5 stars</option>
          </Select>
        </div>
      </FilterGroup>

      <FilterGroup label="EV range (min km)">
        <NumberField
          filters={filters}
          filterKey="evRangeMinKm"
          placeholder="e.g. 400"
          ariaLabel="Minimum WLTP range in km"
        />
      </FilterGroup>

      <FilterGroup label="Region">
        <ChipGroup filters={filters} filterKey="regions" labels={REGION_LABELS} />
      </FilterGroup>

      <FilterGroup label="Seller">
        <ChipGroup filters={filters} filterKey="sellerTypes" labels={SELLER_TYPE_LABELS} />
      </FilterGroup>

      <FilterGroup label="Registration tax (afgift)">
        <Select
          aria-label="Registration tax status"
          value={filters.getScalar('registrationTaxPaid') ?? ''}
          onChange={(event) =>
            filters.setScalar('registrationTaxPaid', event.target.value || null)
          }
        >
          <option value="">Any</option>
          <option value="true">Tax paid (incl. afgift)</option>
          <option value="false">Without tax (uden afgift)</option>
        </Select>
      </FilterGroup>

      <Button variant="secondary" size="sm" onClick={filters.clearAll} className="w-full">
        Clear all filters
      </Button>
    </div>
  );
}
