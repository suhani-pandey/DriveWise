import { z } from 'zod';

import { UserBriefSchema } from './user';
import { VehicleSchema } from './vehicles';

export const RecommendationQuerySchema = z.object({
  prompt: z.string().min(3).max(2000),
  maxResults: z.number().int().min(1).max(10).default(4),
  /** Optional onboarding brief; when present it sharpens scoring. */
  brief: UserBriefSchema.optional(),
});
export type RecommendationQuery = z.infer<typeof RecommendationQuerySchema>;

export const RecommendationItemSchema = z.object({
  vehicle: VehicleSchema,
  score: z.number().min(0).max(1),
  reasons: z.array(z.string()),
});
export type RecommendationItem = z.infer<typeof RecommendationItemSchema>;

export const RecommendationResponseSchema = z.object({
  /** One-paragraph answer to the user's question. */
  answer: z.string(),
  results: z.array(RecommendationItemSchema),
  strategy: z.enum(['ai', 'heuristic']),
});
export type RecommendationResponse = z.infer<typeof RecommendationResponseSchema>;
