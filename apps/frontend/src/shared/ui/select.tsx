import { forwardRef, type SelectHTMLAttributes } from 'react';

import { cn } from '@shared/lib/cn';

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  function Select({ className, children, ...props }, ref) {
    return (
      <select
        ref={ref}
        className={cn(
          'h-11 w-full appearance-none rounded-lg bg-card px-3.5 pr-8 text-sm text-ink hairline focus:border-accent',
          className,
        )}
        {...props}
      >
        {children}
      </select>
    );
  },
);
