'use client';

import type { ButtonHTMLAttributes } from 'react';

import { cn } from '@shared/lib/cn';

export interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
}

/** Toggleable pill used for multi-select filters and onboarding choices. */
export function Chip({ selected = false, className, ...props }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm transition-colors',
        selected
          ? 'bg-accent text-white'
          : 'hairline bg-card text-ink hover:border-accent hover:text-accent-dark',
        className,
      )}
      {...props}
    />
  );
}
