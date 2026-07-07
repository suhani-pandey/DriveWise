import { Inject, Injectable } from '@nestjs/common';
import type { Vehicle } from '@drivewise/contracts';

import {
  VEHICLE_CATALOG,
  type VehicleCatalogPort,
} from '../../../shared/domain/vehicle-catalog.port';
import { NotFoundError } from '../../../shared/errors/app-error';

@Injectable()
export class GetVehicleDetailUseCase {
  constructor(@Inject(VEHICLE_CATALOG) private readonly catalog: VehicleCatalogPort) {}

  async execute(id: string): Promise<Vehicle> {
    const vehicle = await this.catalog.findById(id);
    if (!vehicle) throw new NotFoundError('Vehicle', id);
    return vehicle;
  }
}
