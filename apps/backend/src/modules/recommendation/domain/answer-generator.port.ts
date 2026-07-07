import type { RecommendationQuery } from '@drivewise/contracts';

import type { ScoredVehicle } from './vehicle-scorer';

/**
 * Port for phrasing the final answer. Heuristic adapter templates a paragraph;
 * the OpenAI adapter writes one. The ranking itself stays deterministic.
 */
export const ANSWER_GENERATOR = Symbol('ANSWER_GENERATOR');

export interface GeneratedAnswer {
  answer: string;
  strategy: 'ai' | 'heuristic';
}

export interface AnswerGeneratorPort {
  generate(query: RecommendationQuery, ranked: ScoredVehicle[]): Promise<GeneratedAnswer>;
}
