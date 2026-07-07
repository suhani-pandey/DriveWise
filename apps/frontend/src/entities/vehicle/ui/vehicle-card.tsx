import Link from 'next/link';
import type { ReactNode } from 'react';
import type { Vehicle } from '@drivewise/contracts';

import { Badge } from '@shared/ui';
import { formatDkkShort, formatKm } from '@shared/lib/format';
import { BODY_TYPE_LABELS, CONDITION_LABELS } from '../model/labels';
import { VehicleImage } from './vehicle-image';

/**
 * Browse-grid card. Actions (save / compare) are passed in as a slot so the
 * entity stays independent of feature slices.
 */
export function VehicleCard({ vehicle, actions }: { vehicle: Vehicle; actions?: ReactNode }) {
  const manufacturerLink = vehicle.externalLinks.find((l) => l.kind === 'manufacturer');

  return (
    <article className="hairline group relative flex flex-col gap-3 rounded-xl bg-card p-4 transition-shadow hover:shadow-sm">
      <Link
        href={`/vehicles/${vehicle.id}`}
        className="absolute inset-0 z-0 rounded-xl"
        aria-label={`${vehicle.make} ${vehicle.model} — view details`}
      />

      <div className="pointer-events-none relative z-10 flex items-start justify-between gap-2">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
            {vehicle.make}
          </p>
          <h3 className="font-display text-2xl leading-tight">{vehicle.model}</h3>
        </div>
        <div className="text-right">
          <p className="font-display text-2xl leading-tight">
            {formatDkkShort(vehicle.priceDkk)}
          </p>
          <p className="text-xs text-muted">from</p>
        </div>
      </div>

      <div className="pointer-events-none relative z-10 h-36">
        <VehicleImage vehicle={vehicle} />
      </div>

      <div className="pointer-events-none relative z-10 flex flex-wrap items-center gap-1.5">
        <Badge tone={vehicle.condition === 'new' ? 'accent' : 'neutral'}>
          {CONDITION_LABELS[vehicle.condition]}
        </Badge>
        <Badge tone="outline">{vehicle.year}</Badge>
        <Badge tone="outline">{BODY_TYPE_LABELS[vehicle.bodyType]}</Badge>
        {vehicle.mileageKm !== null ? (
          <Badge tone="outline">{formatKm(vehicle.mileageKm)}</Badge>
        ) : null}
        {!vehicle.registrationTaxPaid ? <Badge tone="neutral">Excl. reg. tax</Badge> : null}
      </div>

      <div className="relative z-10 mt-auto flex items-center justify-between gap-2 border-t border-hairline pt-3">
        {manufacturerLink ? (
          <a
            href={manufacturerLink.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted underline-offset-4 hover:text-accent-dark hover:underline"
          >
            View on {manufacturerLink.label} ↗
          </a>
        ) : (
          <span />
        )}
        {actions ? <div className="flex items-center gap-1">{actions}</div> : null}
      </div>
    </article>
  );
}
