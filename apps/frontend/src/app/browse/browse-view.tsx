'use client';

import { useState } from 'react';

import { useBrowseVehicles, useFilterOptions } from '@entities/vehicle';
import { AskAiPanel } from '@features/ask-recommendation';
import {
  ActiveFilterChips,
  FilterPanel,
  SortSelect,
  useVehicleFilters,
} from '@features/filter-vehicles';
import { Button, Input } from '@shared/ui';
import { VehicleGrid } from '@widgets/vehicle-list';

export function BrowseView() {
  const filters = useVehicleFilters();
  const { data, isLoading, isError } = useBrowseVehicles(filters.apiSearchParams);
  const { data: allFacets } = useFilterOptions();
  const [showAskAi, setShowAskAi] = useState(false);
  const [filtersOpenMobile, setFiltersOpenMobile] = useState(false);

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted">Browse</p>
        <h1 className="font-display text-4xl sm:text-5xl">Find your next car.</h1>
        <p className="max-w-xl text-sm text-muted">
          {data ? `${data.total} vehicle${data.total === 1 ? '' : 's'} match. ` : ''}
          Search by make or model, ask AI, or filter by condition, year, price and more.
        </p>
      </header>

      <div className="flex flex-wrap items-center gap-2">
        <Input
          type="search"
          aria-label="Search make or model"
          placeholder="Search make or model…"
          defaultValue={filters.getScalar('q') ?? ''}
          onChange={(event) => filters.setScalar('q', event.target.value.trim() || null)}
          className="h-10 max-w-xs rounded-full"
        />
        <Button
          variant={showAskAi ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => setShowAskAi((v) => !v)}
          aria-expanded={showAskAi}
        >
          Ask AI
        </Button>
        <Button
          variant="secondary"
          size="sm"
          className="lg:hidden"
          onClick={() => setFiltersOpenMobile((v) => !v)}
          aria-expanded={filtersOpenMobile}
        >
          Filters{filters.activeCount > 0 ? ` (${filters.activeCount})` : ''}
        </Button>
        <div className="ml-auto">
          <SortSelect filters={filters} />
        </div>
      </div>

      {showAskAi ? <AskAiPanel /> : null}

      <ActiveFilterChips filters={filters} />

      {isError ? (
        <p role="alert" className="hairline rounded-xl bg-card p-4 text-sm text-red-700">
          Could not load vehicles. Make sure the API is running on port 8000, then reload.
        </p>
      ) : null}

      <div className="flex gap-8">
        <aside
          className={
            filtersOpenMobile
              ? 'block w-full shrink-0 lg:w-64'
              : 'hidden w-64 shrink-0 lg:block'
          }
          aria-label="Filters"
        >
          <FilterPanel filters={filters} facets={allFacets ?? data?.facets} />
        </aside>

        <div className={filtersOpenMobile ? 'hidden flex-1 lg:block' : 'min-w-0 flex-1'}>
          <VehicleGrid
            vehicles={data?.items}
            isLoading={isLoading}
            onClearFilters={filters.clearAll}
          />
        </div>
      </div>
    </div>
  );
}
