'use client';

import { useQuery } from '@tanstack/react-query';
import type { ComparisonResult } from '@drivewise/contracts';

import { apiFetch } from '@shared/api/http';

export const useComparison = (vehicleIds: string[]) =>
  useQuery({
    queryKey: ['comparison', [...vehicleIds].sort()],
    queryFn: () =>
      apiFetch<ComparisonResult>('/comparison', {
        method: 'POST',
        body: { vehicleIds },
      }),
    enabled: vehicleIds.length >= 2,
  });
