import { Inject, Injectable } from '@nestjs/common';
import type { OwnershipCostRequest, OwnershipCostResponse } from '@drivewise/contracts';

import {
  VEHICLE_CATALOG,
  type VehicleCatalogPort,
} from '../../../shared/domain/vehicle-catalog.port';
import { NotFoundError } from '../../../shared/errors/app-error';
import { calculateOwnershipCost } from '../domain/tco-calculator';

@Injectable()
export class CalculateOwnershipCostUseCase {
  constructor(@Inject(VEHICLE_CATALOG) private readonly catalog: VehicleCatalogPort) {}

  async execute(request: OwnershipCostRequest): Promise<OwnershipCostResponse> {
    const vehicles = await this.catalog.findByIds(request.vehicleIds);
    const missing = request.vehicleIds.filter((id) => !vehicles.some((v) => v.id === id));
    if (missing.length > 0) throw new NotFoundError('Vehicle', missing[0]);

    const costs = vehicles.map((v) => calculateOwnershipCost(v, request.assumptions));
    const cheapest = costs.reduce((a, b) => (a.totalDkk <= b.totalDkk ? a : b));
    const priciest = costs.reduce((a, b) => (a.totalDkk >= b.totalDkk ? a : b));

    return {
      assumptions: request.assumptions,
      costs,
      cheapestVehicleId: costs.length > 1 ? cheapest.vehicleId : null,
      maxSavingsDkk: priciest.totalDkk - cheapest.totalDkk,
    };
  }
}
