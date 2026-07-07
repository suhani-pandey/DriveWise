import { forwardRef, type InputHTMLAttributes } from 'react';

import { cn } from '@shared/lib/cn';

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...props }, ref) {
    return (
      <input
        ref={ref}
        className={cn(
          'h-11 w-full rounded-lg bg-card px-3.5 text-sm text-ink placeholder:text-muted hairline focus:border-accent',
          className,
        )}
        {...props}
      />
    );
  },
);
