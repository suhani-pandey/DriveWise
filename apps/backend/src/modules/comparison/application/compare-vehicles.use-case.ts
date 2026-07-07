import { Inject, Injectable } from '@nestjs/common';
import type { ComparisonRequest, ComparisonResult } from '@drivewise/contracts';

import {
  VEHICLE_CATALOG,
  type VehicleCatalogPort,
} from '../../../shared/domain/vehicle-catalog.port';
import { NotFoundError } from '../../../shared/errors/app-error';
import { buildComparisonSections } from '../domain/comparison-table';
import { VERDICT_GENERATOR, type VerdictGeneratorPort } from '../domain/verdict.port';

@Injectable()
export class CompareVehiclesUseCase {
  constructor(
    @Inject(VEHICLE_CATALOG) private readonly catalog: VehicleCatalogPort,
    @Inject(VERDICT_GENERATOR) private readonly verdictGenerator: VerdictGeneratorPort,
  ) {}

  async execute(request: ComparisonRequest): Promise<ComparisonResult> {
    const vehicles = await this.catalog.findByIds(request.vehicleIds);
    const missing = request.vehicleIds.filter((id) => !vehicles.some((v) => v.id === id));
    if (missing.length > 0) throw new NotFoundError('Vehicle', missing[0]);

    const sections = buildComparisonSections(vehicles);
    const verdict = await this.verdictGenerator.generate(vehicles, sections);
    return { vehicles, sections, verdict };
  }
}
