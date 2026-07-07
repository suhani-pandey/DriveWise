import { Module } from '@nestjs/common';

import { ComparisonController } from './api/comparison.controller';
import { CompareVehiclesUseCase } from './application/compare-vehicles.use-case';
import { VERDICT_GENERATOR } from './domain/verdict.port';
import { HeuristicVerdictAdapter } from './infrastructure/heuristic-verdict.adapter';

@Module({
  controllers: [ComparisonController],
  providers: [
    { provide: VERDICT_GENERATOR, useClass: HeuristicVerdictAdapter },
    CompareVehiclesUseCase,
  ],
})
export class ComparisonModule {}
