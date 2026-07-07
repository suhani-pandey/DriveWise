import { Body, Controller, Post } from '@nestjs/common';
import {
  RecommendationQuerySchema,
  type RecommendationQuery,
  type RecommendationResponse,
} from '@drivewise/contracts';

import { ZodValidationPipe } from '../../../shared/pipes/zod-validation.pipe';
import { AskRecommendationUseCase } from '../application/ask-recommendation.use-case';

@Controller('recommendations')
export class RecommendationController {
  constructor(private readonly askRecommendation: AskRecommendationUseCase) {}

  @Post()
  ask(
    @Body(new ZodValidationPipe(RecommendationQuerySchema)) query: RecommendationQuery,
  ): Promise<RecommendationResponse> {
    return this.askRecommendation.execute(query);
  }
}
