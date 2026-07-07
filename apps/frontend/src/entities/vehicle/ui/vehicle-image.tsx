/* eslint-disable @next/next/no-img-element */
import type { Vehicle } from '@drivewise/contracts';

import { cn } from '@shared/lib/cn';
import { BODY_TYPE_LABELS } from '../model/labels';

/**
 * Vehicle imagery with a designed placeholder: listings without photos get a
 * calm monogram block instead of a broken image — consistent with the
 * minimal Clarity look.
 */
export function VehicleImage({
  vehicle,
  className,
}: {
  vehicle: Vehicle;
  className?: string;
}) {
  if (vehicle.imageUrl) {
    return (
      <img
        src={vehicle.imageUrl}
        alt={`${vehicle.make} ${vehicle.model}`}
        className={cn('h-full w-full rounded-lg object-cover', className)}
      />
    );
  }

  return (
    <div
      aria-hidden
      className={cn(
        'flex h-full w-full flex-col items-center justify-center gap-1 rounded-lg bg-gradient-to-br from-accent-soft to-paper',
        className,
      )}
    >
      <span className="font-display text-4xl text-accent-dark/70">
        {vehicle.make.charAt(0)}
      </span>
      <span className="text-[11px] uppercase tracking-[0.14em] text-muted">
        {BODY_TYPE_LABELS[vehicle.bodyType]}
      </span>
    </div>
  );
}
