import { Body, Controller, Post } from '@nestjs/common';
import {
  ComparisonRequestSchema,
  type ComparisonRequest,
  type ComparisonResult,
} from '@drivewise/contracts';

import { ZodValidationPipe } from '../../../shared/pipes/zod-validation.pipe';
import { CompareVehiclesUseCase } from '../application/compare-vehicles.use-case';

@Controller('comparison')
export class ComparisonController {
  constructor(private readonly compareVehicles: CompareVehiclesUseCase) {}

  @Post()
  compare(
    @Body(new ZodValidationPipe(ComparisonRequestSchema)) request: ComparisonRequest,
  ): Promise<ComparisonResult> {
    return this.compareVehicles.execute(request);
  }
}
