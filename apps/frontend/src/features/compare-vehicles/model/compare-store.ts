'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const MAX_COMPARE = 4;

interface CompareState {
  vehicleIds: string[];
  toggle: (vehicleId: string) => void;
  remove: (vehicleId: string) => void;
  clear: () => void;
}

/** Comparison selection, persisted per browser so it survives navigation. */
export const useCompareStore = create<CompareState>()(
  persist(
    (set) => ({
      vehicleIds: [],
      toggle: (vehicleId) =>
        set((state) => ({
          vehicleIds: state.vehicleIds.includes(vehicleId)
            ? state.vehicleIds.filter((id) => id !== vehicleId)
            : state.vehicleIds.length >= MAX_COMPARE
              ? state.vehicleIds
              : [...state.vehicleIds, vehicleId],
        })),
      remove: (vehicleId) =>
        set((state) => ({ vehicleIds: state.vehicleIds.filter((id) => id !== vehicleId) })),
      clear: () => set({ vehicleIds: [] }),
    }),
    { name: 'drivewise.compare' },
  ),
);
