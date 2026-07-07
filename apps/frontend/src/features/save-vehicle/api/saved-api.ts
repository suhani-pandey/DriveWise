'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type {
  SaveVehicleRequest,
  SavedListResponse,
  UpdateSavedVehicleRequest,
} from '@drivewise/contracts';

import { getAnonUserId } from '@shared/api/anon-user';
import { apiFetch } from '@shared/api/http';

const savedKeys = { list: ['saved-vehicles'] as const };

const userHeaders = () => ({ 'x-user-id': getAnonUserId() });

export const useSavedList = () =>
  useQuery({
    queryKey: savedKeys.list,
    queryFn: () => apiFetch<SavedListResponse>('/saved-vehicles', { headers: userHeaders() }),
  });

export const useSaveVehicle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: SaveVehicleRequest) =>
      apiFetch('/saved-vehicles', { method: 'PUT', body: request, headers: userHeaders() }),
    onSettled: () => queryClient.invalidateQueries({ queryKey: savedKeys.list }),
  });
};

export const useUpdateSavedVehicle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      vehicleId,
      ...request
    }: UpdateSavedVehicleRequest & { vehicleId: string }) =>
      apiFetch(`/saved-vehicles/${vehicleId}`, {
        method: 'PATCH',
        body: request,
        headers: userHeaders(),
      }),
    onSettled: () => queryClient.invalidateQueries({ queryKey: savedKeys.list }),
  });
};

export const useRemoveSavedVehicle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (vehicleId: string) =>
      apiFetch(`/saved-vehicles/${vehicleId}`, { method: 'DELETE', headers: userHeaders() }),
    onSettled: () => queryClient.invalidateQueries({ queryKey: savedKeys.list }),
  });
};
