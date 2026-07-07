'use client';

import Link from 'next/link';

import { useComparison, useCompareStore } from '@features/compare-vehicles';
import { cn } from '@shared/lib/cn';
import { formatDkkShort } from '@shared/lib/format';
import { EmptyState, SectionLabel, Skeleton } from '@shared/ui';

export function CompareView() {
  const vehicleIds = useCompareStore((s) => s.vehicleIds);
  const remove = useCompareStore((s) => s.remove);
  const { data, isLoading, isError } = useComparison(vehicleIds);

  if (vehicleIds.length < 2) {
    return (
      <div className="space-y-6">
        <Header subtitle="Pick at least two vehicles to compare side-by-side." />
        <EmptyState
          title={vehicleIds.length === 0 ? 'Nothing to compare yet.' : 'Add one more vehicle.'}
          description='Use the "Compare" button on any vehicle card in Browse — green highlights the best value in each row.'
          action={
            <Link
              href="/browse"
              className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper"
            >
              Browse vehicles
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Header subtitle={`${vehicleIds.length} contenders. Green highlights the best in each row.`} />

      {isLoading ? <Skeleton className="h-96 w-full" /> : null}
      {isError ? (
        <p role="alert" className="hairline rounded-xl bg-card p-4 text-sm text-red-700">
          Could not load the comparison. Is the API running?
        </p>
      ) : null}

      {data ? (
        <>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead>
                <tr>
                  <th className="w-40 py-3 text-left align-bottom" scope="col">
                    <span className="sr-only">Specification</span>
                  </th>
                  {data.vehicles.map((vehicle) => (
                    <th key={vehicle.id} className="px-3 py-3 text-left align-bottom" scope="col">
                      <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
                        {vehicle.make}
                      </p>
                      <Link
                        href={`/vehicles/${vehicle.id}`}
                        className="font-display text-xl leading-tight underline-offset-4 hover:underline"
                      >
                        {vehicle.model}
                      </Link>
                      <p className="text-xs font-normal text-muted">
                        {vehicle.variant ?? `${vehicle.year}`} ·{' '}
                        {formatDkkShort(vehicle.priceDkk)}
                      </p>
                      <button
                        type="button"
                        onClick={() => remove(vehicle.id)}
                        className="mt-1 text-xs font-normal text-muted underline underline-offset-4 hover:text-ink"
                      >
                        Remove
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.sections.map((section) => (
                  <SectionRows key={section.title} section={section} />
                ))}
              </tbody>
            </table>
          </div>

          <aside className="hairline rounded-xl bg-card p-5">
            <SectionLabel className="text-accent-dark">AI verdict</SectionLabel>
            <p className="mt-2 leading-relaxed">{data.verdict.text}</p>
            {data.verdict.recommendedVehicleId ? (
              <Link
                href={`/vehicles/${data.verdict.recommendedVehicleId}`}
                className="mt-3 inline-block rounded-full bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-dark"
              >
                Open verdict pick →
              </Link>
            ) : null}
          </aside>
        </>
      ) : null}
    </div>
  );
}

function Header({ subtitle }: { subtitle: string }) {
  return (
    <header className="space-y-1">
      <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted">Compare</p>
      <h1 className="font-display text-4xl sm:text-5xl">Side-by-side.</h1>
      <p className="text-sm text-muted">{subtitle}</p>
    </header>
  );
}

function SectionRows({
  section,
}: {
  section: { title: string; rows: Array<{ key: string; label: string; values: Array<string | null>; bestIndex: number | null }> };
}) {
  return (
    <>
      <tr>
        <th
          colSpan={section.rows[0] ? section.rows[0].values.length + 1 : 1}
          scope="colgroup"
          className="pb-2 pt-6 text-left"
        >
          <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
            {section.title}
          </span>
        </th>
      </tr>
      {section.rows.map((row) => (
        <tr key={row.key} className="border-t border-hairline">
          <th scope="row" className="py-3 pr-4 text-left font-normal text-muted">
            {row.label}
          </th>
          {row.values.map((value, index) => (
            <td
              key={index}
              className={cn(
                'px-3 py-3 tabular-nums',
                row.bestIndex === index && 'bg-accent-soft font-medium text-accent-dark',
              )}
            >
              {value ?? '—'}
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
