import { z } from 'zod';

/**
 * Shared enums for the Danish vehicle market.
 * Values are stable identifiers; user-facing labels (Danish/English) live in the apps.
 */

export const ConditionSchema = z.enum(['new', 'used']);
export type Condition = z.infer<typeof ConditionSchema>;

export const FuelTypeSchema = z.enum(['ev', 'phev', 'hybrid', 'petrol', 'diesel']);
export type FuelType = z.infer<typeof FuelTypeSchema>;

export const TransmissionSchema = z.enum(['automatic', 'manual']);
export type Transmission = z.infer<typeof TransmissionSchema>;

export const DrivetrainSchema = z.enum(['fwd', 'rwd', 'awd']);
export type Drivetrain = z.infer<typeof DrivetrainSchema>;

export const BodyTypeSchema = z.enum([
  'suv',
  'crossover',
  'sedan',
  'hatchback',
  'stationcar',
  'fastback',
  'coupe',
  'mpv',
  'cabriolet',
  'van',
]);
export type BodyType = z.infer<typeof BodyTypeSchema>;

/** Danish regions as used by listing sites for seller location. */
export const RegionSchema = z.enum([
  'hovedstaden',
  'sjaelland',
  'fyn',
  'syddanmark',
  'midtjylland',
  'nordjylland',
]);
export type Region = z.infer<typeof RegionSchema>;

export const SellerTypeSchema = z.enum(['dealer', 'private']);
export type SellerType = z.infer<typeof SellerTypeSchema>;

export const ExternalLinkSchema = z.object({
  kind: z.enum(['manufacturer', 'marketplace']),
  label: z.string(),
  url: z.string().url(),
});
export type ExternalLink = z.infer<typeof ExternalLinkSchema>;

export const FacetValueSchema = z.object({
  value: z.string(),
  count: z.number().int().nonnegative(),
});
export type FacetValue = z.infer<typeof FacetValueSchema>;
