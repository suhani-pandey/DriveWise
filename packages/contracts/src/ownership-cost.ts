import { z } from 'zod';

/**
 * Assumptions the user can tune with sliders. Defaults reflect typical
 * Danish figures (July 2026): electricity ~2.5 kr/kWh home charging,
 * petrol ~14 kr/l, diesel ~13 kr/l.
 */
export const OwnershipAssumptionsSchema = z.object({
  annualKm: z.number().int().min(1000).max(100000).default(20000),
  years: z.number().int().min(1).max(15).default(5),
  electricityPriceDkkPerKwh: z.number().min(0.1).max(15).default(2.5),
  petrolPriceDkkPerLiter: z.number().min(1).max(40).default(14),
  dieselPriceDkkPerLiter: z.number().min(1).max(40).default(13),
});
export type OwnershipAssumptions = z.infer<typeof OwnershipAssumptionsSchema>;

export const OwnershipCostRequestSchema = z.object({
  vehicleIds: z.array(z.string().uuid()).min(1).max(4),
  assumptions: OwnershipAssumptionsSchema.default({}),
});
export type OwnershipCostRequest = z.infer<typeof OwnershipCostRequestSchema>;

export const CostBreakdownSchema = z.object({
  depreciationDkk: z.number(),
  energyDkk: z.number(),
  insuranceDkk: z.number(),
  maintenanceDkk: z.number(),
  /** Danish periodic ownership tax (grøn ejerafgift / CO2-ejerafgift). */
  ownershipTaxDkk: z.number(),
});
export type CostBreakdown = z.infer<typeof CostBreakdownSchema>;

export const VehicleOwnershipCostSchema = z.object({
  vehicleId: z.string().uuid(),
  make: z.string(),
  model: z.string(),
  totalDkk: z.number(),
  perYearDkk: z.number(),
  perKmDkk: z.number(),
  breakdown: CostBreakdownSchema,
});
export type VehicleOwnershipCost = z.infer<typeof VehicleOwnershipCostSchema>;

export const OwnershipCostResponseSchema = z.object({
  assumptions: OwnershipAssumptionsSchema,
  costs: z.array(VehicleOwnershipCostSchema),
  cheapestVehicleId: z.string().uuid().nullable(),
  /** Total saved by choosing the cheapest over the most expensive option. */
  maxSavingsDkk: z.number(),
});
export type OwnershipCostResponse = z.infer<typeof OwnershipCostResponseSchema>;
