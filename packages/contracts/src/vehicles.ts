import { z } from 'zod';

export const FuelTypeSchema = z.enum(['petrol', 'diesel', 'hybrid', 'ev']);
export type FuelType = z.infer<typeof FuelTypeSchema>;

export const TransmissionSchema = z.enum(['manual', 'automatic']);
export type Transmission = z.infer<typeof TransmissionSchema>;

export const VehicleSchema = z.object({
  id: z.string().uuid(),
  make: z.string().min(1),
  model: z.string().min(1),
  year: z.number().int().min(1900).max(2100),
  priceDkk: z.number().nonnegative(),
  fuelType: FuelTypeSchema,
  transmission: TransmissionSchema,
  seats: z.number().int().min(1).max(9),
  mileageKm: z.number().nonnegative().nullable(),
  evRangeKm: z.number().nonnegative().nullable(),
  bodyType: z.string(),
  safetyRating: z.number().min(0).max(5).nullable(),
  imageUrl: z.string().url().nullable(),
});
export type Vehicle = z.infer<typeof VehicleSchema>;

export const VehicleFilterSchema = z.object({
  make: z.string().optional(),
  fuelType: FuelTypeSchema.optional(),
  transmission: TransmissionSchema.optional(),
  minPriceDkk: z.number().nonnegative().optional(),
  maxPriceDkk: z.number().nonnegative().optional(),
  minYear: z.number().int().optional(),
  bodyType: z.string().optional(),
});
export type VehicleFilter = z.infer<typeof VehicleFilterSchema>;
