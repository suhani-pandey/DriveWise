import type { HTMLAttributes } from 'react';

import { cn } from '@shared/lib/cn';

type Tone = 'neutral' | 'accent' | 'outline';

const toneClasses: Record<Tone, string> = {
  neutral: 'bg-ink/5 text-ink',
  accent: 'bg-accent-soft text-accent-dark',
  outline: 'hairline text-muted',
};

export function Badge({
  tone = 'neutral',
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
        toneClasses[tone],
        className,
      )}
      {...props}
    />
  );
}
