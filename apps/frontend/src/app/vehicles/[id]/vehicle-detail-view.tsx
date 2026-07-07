'use client';

import Link from 'next/link';

import {
  BODY_TYPE_LABELS,
  CONDITION_LABELS,
  DRIVETRAIN_LABELS,
  FUEL_TYPE_LABELS,
  REGION_LABELS,
  SELLER_TYPE_LABELS,
  TRANSMISSION_LABELS,
  VehicleImage,
  useVehicle,
} from '@entities/vehicle';
import { CompareToggle } from '@features/compare-vehicles';
import { SaveButton } from '@features/save-vehicle';
import { formatDkk, formatKm } from '@shared/lib/format';
import { Badge, EmptyState, SectionLabel, Skeleton } from '@shared/ui';

function Stat({ value, unit, label }: { value: string; unit?: string; label: string }) {
  return (
    <div className="hairline rounded-xl bg-card p-4 text-center">
      <p className="font-display text-3xl">
        {value}
        {unit ? <span className="ml-1 text-base text-muted">{unit}</span> : null}
      </p>
      <p className="mt-1 text-xs text-muted">{label}</p>
    </div>
  );
}

function SpecRow({ label, value }: { label: string; value: string | null }) {
  if (value === null) return null;
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-hairline py-2.5 last:border-b-0">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="text-sm font-medium">{value}</dd>
    </div>
  );
}

export function VehicleDetailView({ vehicleId }: { vehicleId: string }) {
  const { data: vehicle, isLoading, isError } = useVehicle(vehicleId);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-1/2" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (isError || !vehicle) {
    return (
      <EmptyState
        title="Vehicle not found."
        description="It may have been removed from the inventory."
        action={
          <Link
            href="/browse"
            className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper"
          >
            Back to Browse
          </Link>
        }
      />
    );
  }

  const manufacturer = vehicle.externalLinks.find((l) => l.kind === 'manufacturer');
  const marketplaces = vehicle.externalLinks.filter((l) => l.kind === 'marketplace');

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-sm text-muted">
          <Link href="/browse" className="hover:text-ink hover:underline">
            Vehicles
          </Link>
          {' · '}
          {vehicle.make}
        </p>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-4xl sm:text-5xl">{vehicle.model}</h1>
            <p className="mt-1 text-sm text-muted">
              {vehicle.year} · {vehicle.variant ?? CONDITION_LABELS[vehicle.condition]} ·{' '}
              {BODY_TYPE_LABELS[vehicle.bodyType]} · Quick overview — full specs on the
              manufacturer&apos;s site
            </p>
          </div>
          <div className="flex items-center gap-2">
            <SaveButton vehicleId={vehicle.id} />
            <CompareToggle vehicleId={vehicle.id} />
            {manufacturer ? (
              <a
                href={manufacturer.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper hover:bg-black"
              >
                View on {manufacturer.label} ↗
              </a>
            ) : null}
          </div>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="h-72 lg:h-96">
          <VehicleImage vehicle={vehicle} className="rounded-xl" />
        </div>

        <div className="hairline flex flex-col gap-4 rounded-xl bg-card p-6">
          <div>
            <SectionLabel>Starting at</SectionLabel>
            <p className="mt-1 font-display text-4xl">{formatDkk(vehicle.priceDkk)}</p>
            {vehicle.monthlyLeaseDkk !== null ? (
              <p className="mt-1 text-sm text-muted">
                or {formatDkk(vehicle.monthlyLeaseDkk)} / month lease
              </p>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-1.5">
            <Badge tone={vehicle.condition === 'new' ? 'accent' : 'neutral'}>
              {CONDITION_LABELS[vehicle.condition]}
            </Badge>
            {vehicle.mileageKm !== null ? (
              <Badge tone="outline">{formatKm(vehicle.mileageKm)}</Badge>
            ) : null}
            <Badge tone="outline">{SELLER_TYPE_LABELS[vehicle.sellerType]}</Badge>
            <Badge tone="outline">{REGION_LABELS[vehicle.region]}</Badge>
            {!vehicle.registrationTaxPaid ? (
              <Badge tone="neutral">Excl. registration tax</Badge>
            ) : null}
          </div>

          <div className="grid grid-cols-3 gap-2">
            {vehicle.evRangeKm !== null ? (
              <Stat value={`${vehicle.evRangeKm}`} unit="km" label="WLTP range" />
            ) : vehicle.consumptionLPer100Km !== null ? (
              <Stat
                value={`${vehicle.consumptionLPer100Km}`}
                unit="l"
                label="per 100 km"
              />
            ) : null}
            {vehicle.accelerationSec0To100 !== null ? (
              <Stat value={`${vehicle.accelerationSec0To100}`} unit="s" label="0–100 km/h" />
            ) : null}
            {vehicle.cargoLiters !== null ? (
              <Stat value={`${vehicle.cargoLiters}`} unit="L" label="Cargo" />
            ) : null}
          </div>

          <div className="mt-auto rounded-lg bg-accent-soft p-3 text-sm text-accent-dark">
            Full specs, trims, colors and configurator live on the manufacturer&apos;s site.
            {manufacturer ? (
              <a
                href={manufacturer.url}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-1 font-medium underline underline-offset-4"
              >
                Open {manufacturer.label} ↗
              </a>
            ) : null}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section className="space-y-4">
          <div>
            <SectionLabel>Overview</SectionLabel>
            <p className="mt-2 leading-relaxed">{vehicle.summary}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="hairline rounded-xl bg-card p-5">
              <SectionLabel className="text-accent-dark">What&apos;s good</SectionLabel>
              <ul className="mt-2 space-y-1.5 text-sm">
                {vehicle.pros.map((pro) => (
                  <li key={pro} className="flex gap-2">
                    <span aria-hidden className="text-accent">
                      +
                    </span>
                    {pro}
                  </li>
                ))}
              </ul>
            </div>
            <div className="hairline rounded-xl bg-card p-5">
              <SectionLabel>To consider</SectionLabel>
              <ul className="mt-2 space-y-1.5 text-sm">
                {vehicle.cons.map((con) => (
                  <li key={con} className="flex gap-2">
                    <span aria-hidden className="text-muted">
                      −
                    </span>
                    {con}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="hairline rounded-xl bg-card p-6">
          <SectionLabel>Key specs</SectionLabel>
          <dl className="mt-2">
            <SpecRow label="Fuel" value={FUEL_TYPE_LABELS[vehicle.fuelType]} />
            <SpecRow label="Transmission" value={TRANSMISSION_LABELS[vehicle.transmission]} />
            <SpecRow label="Drivetrain" value={DRIVETRAIN_LABELS[vehicle.drivetrain]} />
            <SpecRow
              label="Battery"
              value={vehicle.batteryKwh !== null ? `${vehicle.batteryKwh} kWh` : null}
            />
            <SpecRow
              label="10 → 80 %"
              value={
                vehicle.chargeMinutes10To80 !== null
                  ? `${vehicle.chargeMinutes10To80} min`
                  : null
              }
            />
            <SpecRow
              label="DC charging"
              value={vehicle.dcChargeKw !== null ? `${vehicle.dcChargeKw} kW` : null}
            />
            <SpecRow
              label="Consumption"
              value={
                vehicle.consumptionKwhPer100Km !== null
                  ? `${vehicle.consumptionKwhPer100Km} kWh/100 km`
                  : vehicle.consumptionLPer100Km !== null
                    ? `${vehicle.consumptionLPer100Km} l/100 km`
                    : null
              }
            />
            <SpecRow
              label="Top speed"
              value={vehicle.topSpeedKmh !== null ? `${vehicle.topSpeedKmh} km/h` : null}
            />
            <SpecRow label="Seats / doors" value={`${vehicle.seats} / ${vehicle.doors}`} />
            <SpecRow
              label="Euro NCAP"
              value={vehicle.euroNcapStars !== null ? `${vehicle.euroNcapStars} ★` : null}
            />
          </dl>

          <p className="mt-4 text-xs leading-relaxed text-muted">
            This is a summary for comparison. For full technical specs, trims and pricing, see
            the official site
            {marketplaces.length > 0 ? ' — or find live listings on the marketplaces below.' : '.'}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {vehicle.externalLinks.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hairline rounded-full bg-paper px-3.5 py-1.5 text-xs font-medium hover:border-accent hover:text-accent-dark"
              >
                {link.label} ↗
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
