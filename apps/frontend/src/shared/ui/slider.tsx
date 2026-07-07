'use client';

import { useId, type InputHTMLAttributes } from 'react';

import { cn } from '@shared/lib/cn';

export interface SliderProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'onChange'> {
  label: string;
  valueLabel: string;
  value: number;
  onValueChange: (value: number) => void;
}

/** Labelled range slider matching the cost-calculator design. */
export function Slider({
  label,
  valueLabel,
  value,
  onValueChange,
  className,
  ...props
}: SliderProps) {
  const id = useId();
  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm text-muted">
          {label}
        </label>
        <span className="text-sm font-medium tabular-nums">{valueLabel}</span>
      </div>
      <input
        id={id}
        type="range"
        value={value}
        onChange={(event) => onValueChange(Number(event.target.value))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-hairline accent-accent"
        {...props}
      />
    </div>
  );
}
