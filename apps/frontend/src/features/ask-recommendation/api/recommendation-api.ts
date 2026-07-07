'use client';

import { useMutation } from '@tanstack/react-query';
import type { RecommendationQuery, RecommendationResponse } from '@drivewise/contracts';

import { apiFetch } from '@shared/api/http';

export const useAskRecommendation = () =>
  useMutation({
    mutationFn: (query: RecommendationQuery) =>
      apiFetch<RecommendationResponse>('/recommendations', { method: 'POST', body: query }),
  });
