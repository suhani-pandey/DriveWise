import { z } from 'zod';

import { VehicleSchema } from './vehicles';

export const SavedStatusSchema = z.enum([
  'considering',
  'shortlist',
  'test_drive_booked',
  'stretch_budget',
]);
export type SavedStatus = z.infer<typeof SavedStatusSchema>;

export const SavedVehicleSchema = z.object({
  vehicleId: z.string().uuid(),
  status: SavedStatusSchema,
  note: z.string().max(280).nullable(),
  savedAt: z.string().datetime(),
});
export type SavedVehicle = z.infer<typeof SavedVehicleSchema>;

export const SaveVehicleRequestSchema = z.object({
  vehicleId: z.string().uuid(),
  status: SavedStatusSchema.default('considering'),
  note: z.string().max(280).nullable().default(null),
});
export type SaveVehicleRequest = z.infer<typeof SaveVehicleRequestSchema>;

export const UpdateSavedVehicleRequestSchema = z.object({
  status: SavedStatusSchema.optional(),
  note: z.string().max(280).nullable().optional(),
});
export type UpdateSavedVehicleRequest = z.infer<typeof UpdateSavedVehicleRequestSchema>;

export const SavedVehicleWithDetailsSchema = SavedVehicleSchema.extend({
  vehicle: VehicleSchema,
});
export type SavedVehicleWithDetails = z.infer<typeof SavedVehicleWithDetailsSchema>;

export const SavedListResponseSchema = z.object({
  items: z.array(SavedVehicleWithDetailsSchema),
});
export type SavedListResponse = z.infer<typeof SavedListResponseSchema>;
