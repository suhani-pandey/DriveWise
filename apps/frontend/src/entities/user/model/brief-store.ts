'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { EMPTY_USER_BRIEF, type UserBrief } from '@drivewise/contracts';

interface BriefState {
  brief: UserBrief;
  onboarded: boolean;
  setBrief: (brief: Partial<UserBrief>) => void;
  completeOnboarding: () => void;
  reset: () => void;
}

/**
 * The onboarding "brief" — how the user drives and what they need.
 * Stored client-side per browser; feeds AI recommendations and pre-fills
 * the cost calculator.
 */
export const useBriefStore = create<BriefState>()(
  persist(
    (set) => ({
      brief: EMPTY_USER_BRIEF,
      onboarded: false,
      setBrief: (partial) =>
        set((state) => ({
          brief: { ...state.brief, ...partial, updatedAt: new Date().toISOString() },
        })),
      completeOnboarding: () => set({ onboarded: true }),
      reset: () => set({ brief: EMPTY_USER_BRIEF, onboarded: false }),
    }),
    { name: 'drivewise.brief' },
  ),
);
