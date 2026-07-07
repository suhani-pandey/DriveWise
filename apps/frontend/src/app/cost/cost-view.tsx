'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { OwnershipAssumptionsSchema, type VehicleOwnershipCost } from '@drivewise/contracts';

import { useBriefStore } from '@entities/user';
import { useBrowseVehicles } from '@entities/vehicle';
import { useOwnershipCost } from '@features/calculate-ownership-cost';
import { useCompareStore } from '@features/compare-vehicles';
import { cn } from '@shared/lib/cn';
import { formatDkk } from '@shared/lib/format';
import { EmptyState, SectionLabel, Skeleton, Slider } from '@shared/ui';

const BREAKDOWN_SEGMENTS: Array<{
  key: keyof VehicleOwnershipCost['breakdown'];
  label: string;
  className: string;
}> = [
  { key: 'depreciationDkk', label: 'Depreciation', className: 'bg-ink' },
  { key: 'energyDkk', label: 'Energy', className: 'bg-accent' },
  { key: 'insuranceDkk', label: 'Insurance', className: 'bg-accent/60' },
  { key: 'maintenanceDkk', label: 'Maintenance', className: 'bg-ink/40' },
  { key: 'ownershipTaxDkk', label: 'Tax', className: 'bg-ink/20' },
];

export function CostView() {
  const compareIds = useCompareStore((s) => s.vehicleIds);
  const brief = useBriefStore((s) => s.brief);

  // Sensible default selection: the comparison picks, or the first three EVs.
  const fallback = useBrowseVehicles(
    useMemo(() => new URLSearchParams({ pageSize: '3', fuelTypes: 'ev' }), []),
  );
  const vehicleIds =
    compareIds.length > 0 ? compareIds : (fallback.data?.items.map((v) => v.id) ?? []);

  const defaults = OwnershipAssumptionsSchema.parse({});
  const [annualKm, setAnnualKm] = useState(brief.annualKm ?? defaults.annualKm);
  const [years, setYears] = useState(defaults.years);
  const [electricityPrice, setElectricityPrice] = useState(
    defaults.electricityPriceDkkPerKwh,
  );

  const assumptions = {
    ...defaults,
    annualKm,
    years,
    electricityPriceDkkPerKwh: electricityPrice,
  };
  const { data, isLoading, isError } = useOwnershipCost(vehicleIds, assumptions);

  const maxTotal = Math.max(...(data?.costs.map((c) => c.totalDkk) ?? [1]));
  const cheapest = data?.costs.find((c) => c.vehicleId === data.cheapestVehicleId);

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
          Cost calculator
        </p>
        <h1 className="font-display text-4xl sm:text-5xl">What will it actually cost?</h1>
        <p className="text-sm text-muted">
          {years}-year total. Drag the sliders to fit your driving.
          {compareIds.length === 0
            ? ' Showing three popular EVs — add vehicles to Compare to price your own picks.'
            : ''}
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(260px,320px)_1fr]">
        <aside className="hairline h-fit space-y-6 rounded-xl bg-card p-5">
          <SectionLabel>Your driving</SectionLabel>
          <Slider
            label="Annual distance"
            value={annualKm}
            onValueChange={setAnnualKm}
            min={5000}
            max={50000}
            step={1000}
            valueLabel={`${annualKm.toLocaleString('da-DK')} km`}
          />
          <Slider
            label="Years owned"
            value={years}
            onValueChange={setYears}
            min={1}
            max={10}
            step={1}
            valueLabel={`${years} yr`}
          />
          <Slider
            label="Electricity price"
            value={electricityPrice}
            onValueChange={setElectricityPrice}
            min={1}
            max={5}
            step={0.05}
            valueLabel={`${electricityPrice.toFixed(2)} kr/kWh`}
          />

          {cheapest && data && data.maxSavingsDkk > 0 ? (
            <div className="rounded-lg bg-accent-soft p-4">
              <SectionLabel className="text-accent-dark">Best value</SectionLabel>
              <p className="mt-1 font-display text-xl text-accent-dark">
                {cheapest.make} {cheapest.model}
              </p>
              <p className="mt-1 text-sm text-accent-dark">
                Saves <strong>{formatDkk(data.maxSavingsDkk)}</strong> vs the most expensive
                option.
              </p>
            </div>
          ) : null}
        </aside>

        <section className="space-y-4">
          <SectionLabel>{years}-year total cost of ownership</SectionLabel>

          {vehicleIds.length === 0 && !fallback.isLoading ? (
            <EmptyState
              title="No vehicles selected."
              description="Add vehicles to Compare from the Browse page and they will show up here."
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

          {isLoading || fallback.isLoading ? <Skeleton className="h-64 w-full" /> : null}
          {isError ? (
            <p role="alert" className="hairline rounded-xl bg-card p-4 text-sm text-red-700">
              Could not calculate costs. Is the API running?
            </p>
          ) : null}

          {data?.costs.map((cost) => {
            const isCheapest = cost.vehicleId === data.cheapestVehicleId;
            return (
              <article key={cost.vehicleId} className="hairline rounded-xl bg-card p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h2 className="font-medium">
                    {cost.make} {cost.model}
                    {isCheapest ? (
                      <span className="ml-2 rounded-full bg-accent-soft px-2 py-0.5 text-xs font-medium text-accent-dark">
                        Cheapest
                      </span>
                    ) : null}
                  </h2>
                  <p className="font-display text-2xl tabular-nums">
                    {formatDkk(cost.totalDkk)}
                  </p>
                </div>
                <p className="mt-0.5 text-xs text-muted">
                  {formatDkk(cost.perYearDkk)} / year · {cost.perKmDkk.toFixed(2)} kr/km
                </p>

                <div
                  className="mt-3 flex h-3 w-full overflow-hidden rounded-full"
                  role="img"
                  aria-label={`Cost breakdown for ${cost.make} ${cost.model}`}
                  style={{ width: `${Math.max((cost.totalDkk / maxTotal) * 100, 12)}%` }}
                >
                  {BREAKDOWN_SEGMENTS.map((segment) => {
                    const value = cost.breakdown[segment.key];
                    if (value <= 0) return null;
                    return (
                      <div
                        key={segment.key}
                        title={`${segment.label}: ${formatDkk(value)}`}
                        className={cn('h-full', segment.className)}
                        style={{ width: `${(value / cost.totalDkk) * 100}%` }}
                      />
                    );
                  })}
                </div>

                <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1 text-xs text-muted sm:grid-cols-5">
                  {BREAKDOWN_SEGMENTS.map((segment) => (
                    <div key={segment.key} className="flex items-center gap-1.5">
                      <span
                        aria-hidden
                        className={cn('h-2 w-2 rounded-full', segment.className)}
                      />
                      <dt>{segment.label}</dt>
                      <dd className="ml-auto tabular-nums">
                        {Math.round(cost.breakdown[segment.key] / 1000)}k
                      </dd>
                    </div>
                  ))}
                </dl>
              </article>
            );
          })}

          {data ? (
            <p className="text-xs leading-relaxed text-muted">
              Estimates use a simplified Danish model: declining-balance depreciation, energy
              from WLTP consumption, typical kasko insurance, per-km maintenance and
              CO₂-ejerafgift brackets. Figures are indicative — verify with your insurer and{' '}
              <a
                href="https://skat.dk"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4"
              >
                skat.dk
              </a>
              .
            </p>
          ) : null}
        </section>
      </div>
    </div>
  );
}
