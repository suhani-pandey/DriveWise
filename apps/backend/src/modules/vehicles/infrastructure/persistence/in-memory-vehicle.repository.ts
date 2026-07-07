import { Injectable } from '@nestjs/common';
import type { Vehicle } from '@drivewise/contracts';

import type { VehicleCatalogPort } from '../../../../shared/domain/vehicle-catalog.port';
import { DANISH_VEHICLES } from './danish-vehicles.seed';

/**
 * In-memory adapter for the vehicle catalog. Bound to VEHICLE_CATALOG in
 * VehiclesModule; replace the binding with a Drizzle/Postgres repository
 * (same interface) to go to a real database — no consumer changes needed.
 */
@Injectable()
export class InMemoryVehicleRepository implements VehicleCatalogPort {
  private readonly vehicles: Vehicle[] = DANISH_VEHICLES;

  async findAll(): Promise<Vehicle[]> {
    return this.vehicles;
  }

  async findById(id: string): Promise<Vehicle | null> {
    return this.vehicles.find((v) => v.id === id) ?? null;
  }

  async findByIds(ids: string[]): Promise<Vehicle[]> {
    const byId = new Map(this.vehicles.map((v) => [v.id, v]));
    return ids.flatMap((id) => {
      const vehicle = byId.get(id);
      return vehicle ? [vehicle] : [];
    });
  }
}
