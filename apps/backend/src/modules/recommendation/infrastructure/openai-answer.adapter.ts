import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import type { RecommendationQuery } from '@drivewise/contracts';

import type { AnswerGeneratorPort, GeneratedAnswer } from '../domain/answer-generator.port';
import { HeuristicAnswerAdapter } from './heuristic-answer.adapter';
import type { ScoredVehicle } from '../domain/vehicle-scorer';

/**
 * LLM-phrased answer over the deterministic ranking. The model only writes
 * prose about vehicles the scorer already selected — it cannot invent cars.
 * Falls back to the heuristic template on any API failure.
 */
@Injectable()
export class OpenAiAnswerAdapter implements AnswerGeneratorPort {
  private readonly client: OpenAI;
  private readonly model: string;

  constructor(
    config: ConfigService,
    private readonly fallback: HeuristicAnswerAdapter,
  ) {
    this.client = new OpenAI({ apiKey: config.get<string>('OPENAI_API_KEY') });
    this.model = config.get<string>('OPENAI_MODEL') ?? 'gpt-4o-mini';
  }

  async generate(query: RecommendationQuery, ranked: ScoredVehicle[]): Promise<GeneratedAnswer> {
    if (ranked.length === 0) return this.fallback.generate(query, ranked);

    const context = ranked
      .map(
        (s) =>
          `${s.vehicle.make} ${s.vehicle.model} (${s.vehicle.year}, ${s.vehicle.condition}, ` +
          `${Math.round(s.vehicle.priceDkk / 1000)}k kr, ${s.vehicle.fuelType}` +
          `${s.vehicle.evRangeKm ? `, ${s.vehicle.evRangeKm} km range` : ''})`,
      )
      .join('; ');

    try {
      const completion = await this.client.chat.completions.create({
        model: this.model,
        max_tokens: 220,
        messages: [
          {
            role: 'system',
            content:
              'You are DriveWise, a Danish car-buying assistant. Answer in 2-3 warm, concrete sentences. ' +
              'Only discuss the provided candidate vehicles. Prices are in DKK.',
          },
          {
            role: 'user',
            content: `Question: ${query.prompt}\n\nCandidates (already ranked best first): ${context}`,
          },
        ],
      });
      const answer = completion.choices[0]?.message?.content?.trim();
      if (!answer) return this.fallback.generate(query, ranked);
      return { answer, strategy: 'ai' };
    } catch {
      return this.fallback.generate(query, ranked);
    }
  }
}
