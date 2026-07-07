import type { ReactNode } from 'react';

/** Friendly empty state with a single recovery action — never a dead end. */
export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="hairline flex flex-col items-center gap-3 rounded-xl bg-card px-6 py-14 text-center">
      <h3 className="font-display text-2xl">{title}</h3>
      <p className="max-w-sm text-sm text-muted">{description}</p>
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}
