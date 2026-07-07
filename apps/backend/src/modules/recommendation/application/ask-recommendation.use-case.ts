import { Inject, Injectable } from '@nestjs/common';
import type { RecommendationQuery, RecommendationResponse } from '@drivewise/contracts';

import {
  VEHICLE_CATALOG,
  type VehicleCatalogPort,
} from '../../../shared/domain/vehicle-catalog.port';
import {
  ANSWER_GENERATOR,
  type AnswerGeneratorPort,
} from '../domain/answer-generator.port';
import { parsePromptIntent } from '../domain/prompt-intent';
import { rankVehicles } from '../domain/vehicle-scorer';

@Injectable()
export class AskRecommendationUseCase {
  constructor(
    @Inject(VEHICLE_CATALOG) private readonly catalog: VehicleCatalogPort,
    @Inject(ANSWER_GENERATOR) private readonly answerGenerator: AnswerGeneratorPort,
  ) {}

  async execute(query: RecommendationQuery): Promise<RecommendationResponse> {
    const vehicles = await this.catalog.findAll();
    const intent = parsePromptIntent(query.prompt, query.brief);
    const ranked = rankVehicles(vehicles, intent, query.maxResults);
    const { answer, strategy } = await this.answerGenerator.generate(query, ranked);

    return {
      answer,
      strategy,
      results: ranked.map((s) => ({
        vehicle: s.vehicle,
        score: Number(s.score.toFixed(2)),
        reasons: s.reasons,
      })),
    };
  }
}
