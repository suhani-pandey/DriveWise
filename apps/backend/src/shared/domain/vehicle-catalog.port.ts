import type { Vehicle } from '@drivewise/contracts';

/**
 * Shared-kernel port: read access to the vehicle catalog.
 *
 * The vehicles module owns the binding (currently an in-memory adapter seeded
 * with Danish-market data; swap for a Drizzle/Postgres adapter without touching
 * consumers). Other modules (comparison, ownership-cost, recommendation,
 * saved-vehicles) depend only on this token + interface, which keeps the
 * "no cross-module imports" rule intact.
 */
export const VEHICLE_CATALOG = Symbol('VEHICLE_CATALOG');

export interface VehicleCatalogPort {
  findAll(): Promise<Vehicle[]>;
  findById(id: string): Promise<Vehicle | null>;
  findByIds(ids: string[]): Promise<Vehicle[]>;
}
