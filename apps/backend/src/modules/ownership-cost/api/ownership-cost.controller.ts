import { Body, Controller, Post } from '@nestjs/common';
import {
  OwnershipCostRequestSchema,
  type OwnershipCostRequest,
  type OwnershipCostResponse,
} from '@drivewise/contracts';

import { ZodValidationPipe } from '../../../shared/pipes/zod-validation.pipe';
import { CalculateOwnershipCostUseCase } from '../application/calculate-ownership-cost.use-case';

@Controller('ownership-cost')
export class OwnershipCostController {
  constructor(private readonly calculateOwnershipCost: CalculateOwnershipCostUseCase) {}

  @Post()
  calculate(
    @Body(new ZodValidationPipe(OwnershipCostRequestSchema)) request: OwnershipCostRequest,
  ): Promise<OwnershipCostResponse> {
    return this.calculateOwnershipCost.execute(request);
  }
}
