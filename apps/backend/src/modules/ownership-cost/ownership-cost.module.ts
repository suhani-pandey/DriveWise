import { Module } from '@nestjs/common';

import { OwnershipCostController } from './api/ownership-cost.controller';
import { CalculateOwnershipCostUseCase } from './application/calculate-ownership-cost.use-case';

@Module({
  controllers: [OwnershipCostController],
  providers: [CalculateOwnershipCostUseCase],
})
export class OwnershipCostModule {}
