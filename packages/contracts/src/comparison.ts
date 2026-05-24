import { z } from 'zod';

export const ComparisonRequestSchema = z.object({
  vehicleIds: z.array(z.string().uuid()).min(2).max(4),
});
export type ComparisonRequest = z.infer<typeof ComparisonRequestSchema>;
