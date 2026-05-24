import { z } from 'zod';

export const RecommendationQuerySchema = z.object({
  prompt: z.string().min(3).max(2000),
  maxResults: z.number().int().min(1).max(20).default(5),
});
export type RecommendationQuery = z.infer<typeof RecommendationQuerySchema>;

export const RecommendationResultSchema = z.object({
  vehicleId: z.string().uuid(),
  reason: z.string(),
  score: z.number().min(0).max(1),
});
export type RecommendationResult = z.infer<typeof RecommendationResultSchema>;
