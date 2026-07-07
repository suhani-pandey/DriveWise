import type { SavedVehicle } from '@drivewise/contracts';

/**
 * Port for the per-user watchlist. In-memory today; swap the binding in
 * SavedVehiclesModule for a Drizzle adapter when auth + Postgres land.
 */
export const SAVED_VEHICLE_REPOSITORY = Symbol('SAVED_VEHICLE_REPOSITORY');

export interface SavedVehicleRepository {
  listByUser(userId: string): Promise<SavedVehicle[]>;
  upsert(userId: string, saved: SavedVehicle): Promise<SavedVehicle>;
  find(userId: string, vehicleId: string): Promise<SavedVehicle | null>;
  remove(userId: string, vehicleId: string): Promise<boolean>;
}
