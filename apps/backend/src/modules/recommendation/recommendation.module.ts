import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { RecommendationController } from './api/recommendation.controller';
import { AskRecommendationUseCase } from './application/ask-recommendation.use-case';
import { ANSWER_GENERATOR } from './domain/answer-generator.port';
import { HeuristicAnswerAdapter } from './infrastructure/heuristic-answer.adapter';
import { OpenAiAnswerAdapter } from './infrastructure/openai-answer.adapter';

@Module({
  controllers: [RecommendationController],
  providers: [
    HeuristicAnswerAdapter,
    {
      // Adapter selection is a pure config concern: with a key you get LLM
      // prose, without one the deterministic template. Same port either way.
      provide: ANSWER_GENERATOR,
      inject: [ConfigService, HeuristicAnswerAdapter],
      useFactory: (config: ConfigService, heuristic: HeuristicAnswerAdapter) =>
        config.get<string>('OPENAI_API_KEY')
          ? new OpenAiAnswerAdapter(config, heuristic)
          : heuristic,
    },
    AskRecommendationUseCase,
  ],
})
export class RecommendationModule {}
