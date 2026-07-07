import type { HTMLAttributes } from 'react';

import { cn } from '@shared/lib/cn';

/** Small uppercase tracking label ("PRICE", "YOUR BRIEF") from the design. */
export function SectionLabel({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn('text-[11px] font-medium uppercase tracking-[0.14em] text-muted', className)}
      {...props}
    />
  );
}
