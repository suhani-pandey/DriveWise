import { Injectable } from '@nestjs/common';
import type { RecommendationQuery } from '@drivewise/contracts';

import type { AnswerGeneratorPort, GeneratedAnswer } from '../domain/answer-generator.port';
import type { ScoredVehicle } from '../domain/vehicle-scorer';

/** Template-based answer used when no OPENAI_API_KEY is configured. */
@Injectable()
export class HeuristicAnswerAdapter implements AnswerGeneratorPort {
  async generate(
    _query: RecommendationQuery,
    ranked: ScoredVehicle[],
  ): Promise<GeneratedAnswer> {
    if (ranked.length === 0) {
      return {
        answer:
          'Nothing in the current inventory fits that brief. Try widening the budget or relaxing a requirement — or browse with filters instead.',
        strategy: 'heuristic',
      };
    }

    const [top, ...rest] = ranked;
    const topName = `${top.vehicle.make} ${top.vehicle.model}`;
    const alternatives = rest
      .slice(0, 2)
      .map((s) => `${s.vehicle.make} ${s.vehicle.model}`)
      .join(' and ');

    const topReason = top.reasons[0] ? ` ${top.reasons[0]}` : '';
    const answer =
      `Based on what you described, the ${topName} is the strongest match.${topReason}` +
      (alternatives ? ` Also worth a look: ${alternatives}.` : '') +
      ' Open a card for the full breakdown, or add them to Compare.';

    return { answer, strategy: 'heuristic' };
  }
}
