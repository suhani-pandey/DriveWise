'use client';

import { useQuery } from '@tanstack/react-query';
import type { OwnershipAssumptions, OwnershipCostResponse } from '@drivewise/contracts';

import { apiFetch } from '@shared/api/http';

export const useOwnershipCost = (vehicleIds: string[], assumptions: OwnershipAssumptions) =>
  useQuery({
    queryKey: ['ownership-cost', [...vehicleIds].sort(), assumptions],
    queryFn: () =>
      apiFetch<OwnershipCostResponse>('/ownership-cost', {
        method: 'POST',
        body: { vehicleIds, assumptions },
      }),
    enabled: vehicleIds.length >= 1,
    placeholderData: (previous) => previous, // keep bars stable while sliders move
  });
