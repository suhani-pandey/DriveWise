import { useQuery } from '@tanstack/react-query';
import type { BrowseFacets, BrowseVehiclesResponse, Vehicle } from '@drivewise/contracts';

import { apiFetch } from '@shared/api/http';

export const vehicleKeys = {
  all: ['vehicles'] as const,
  browse: (params: string) => ['vehicles', 'browse', params] as const,
  detail: (id: string) => ['vehicles', 'detail', id] as const,
  filterOptions: ['vehicles', 'filter-options'] as const,
};

export const fetchBrowseVehicles = (searchParams: URLSearchParams) =>
  apiFetch<BrowseVehiclesResponse>('/vehicles', { searchParams });

export const useBrowseVehicles = (searchParams: URLSearchParams) =>
  useQuery({
    queryKey: vehicleKeys.browse(searchParams.toString()),
    queryFn: () => fetchBrowseVehicles(searchParams),
    placeholderData: (previous) => previous, // keep grid stable while refetching
  });

export const useVehicle = (id: string) =>
  useQuery({
    queryKey: vehicleKeys.detail(id),
    queryFn: () => apiFetch<Vehicle>(`/vehicles/${id}`),
  });

export const useFilterOptions = () =>
  useQuery({
    queryKey: vehicleKeys.filterOptions,
    queryFn: () => apiFetch<BrowseFacets>('/vehicles/filter-options'),
    staleTime: 10 * 60_000,
  });
