import { z } from 'zod';

import { BodyTypeSchema, FuelTypeSchema } from './common';

export const UsageProfileSchema = z.enum(['commute', 'family', 'leisure', 'business']);
export type UsageProfile = z.infer<typeof UsageProfileSchema>;

/**
 * The onboarding "brief": how the user drives and what they need.
 * Used to weight recommendations and pre-fill the cost calculator.
 */
export const UserBriefSchema = z.object({
  usage: UsageProfileSchema.nullable(),
  annualKm: z.number().int().min(1000).max(100000).nullable(),
  budgetMinDkk: z.number().nonnegative().nullable(),
  budgetMaxDkk: z.number().nonnegative().nullable(),
  bodyTypes: z.array(BodyTypeSchema),
  fuelTypes: z.array(FuelTypeSchema),
  mustHaves: z.array(z.string()),
  updatedAt: z.string().datetime().nullable(),
});
export type UserBrief = z.infer<typeof UserBriefSchema>;

export const EMPTY_USER_BRIEF: UserBrief = {
  usage: null,
  annualKm: null,
  budgetMinDkk: null,
  budgetMaxDkk: null,
  bodyTypes: [],
  fuelTypes: [],
  mustHaves: [],
  updatedAt: null,
};
