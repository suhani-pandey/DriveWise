import { z } from 'zod';

import { VehicleSchema } from './vehicles';

export const ComparisonRequestSchema = z.object({
  vehicleIds: z.array(z.string().uuid()).min(2).max(4),
});
export type ComparisonRequest = z.infer<typeof ComparisonRequestSchema>;

/**
 * One spec row in the comparison table. `bestIndex` points at the winning
 * vehicle column (null when values tie or the row isn't comparable).
 */
export const ComparisonRowSchema = z.object({
  key: z.string(),
  label: z.string(),
  values: z.array(z.string().nullable()),
  bestIndex: z.number().int().nullable(),
});
export type ComparisonRow = z.infer<typeof ComparisonRowSchema>;

export const ComparisonSectionSchema = z.object({
  title: z.string(),
  rows: z.array(ComparisonRowSchema),
});
export type ComparisonSection = z.infer<typeof ComparisonSectionSchema>;

export const ComparisonVerdictSchema = z.object({
  recommendedVehicleId: z.string().uuid().nullable(),
  text: z.string(),
  strategy: z.enum(['ai', 'heuristic']),
});
export type ComparisonVerdict = z.infer<typeof ComparisonVerdictSchema>;

export const ComparisonResultSchema = z.object({
  vehicles: z.array(VehicleSchema),
  sections: z.array(ComparisonSectionSchema),
  verdict: ComparisonVerdictSchema,
});
export type ComparisonResult = z.infer<typeof ComparisonResultSchema>;
