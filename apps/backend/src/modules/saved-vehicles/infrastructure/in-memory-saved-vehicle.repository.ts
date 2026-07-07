import { Injectable } from '@nestjs/common';
import type { SavedVehicle } from '@drivewise/contracts';

import type { SavedVehicleRepository } from '../domain/saved-vehicle.repository';

@Injectable()
export class InMemorySavedVehicleRepository implements SavedVehicleRepository {
  private readonly byUser = new Map<string, Map<string, SavedVehicle>>();

  private userMap(userId: string): Map<string, SavedVehicle> {
    let map = this.byUser.get(userId);
    if (!map) {
      map = new Map();
      this.byUser.set(userId, map);
    }
    return map;
  }

  async listByUser(userId: string): Promise<SavedVehicle[]> {
    return [...this.userMap(userId).values()].sort(
      (a, b) => Date.parse(b.savedAt) - Date.parse(a.savedAt),
    );
  }

  async upsert(userId: string, saved: SavedVehicle): Promise<SavedVehicle> {
    this.userMap(userId).set(saved.vehicleId, saved);
    return saved;
  }

  async find(userId: string, vehicleId: string): Promise<SavedVehicle | null> {
    return this.userMap(userId).get(vehicleId) ?? null;
  }

  async remove(userId: string, vehicleId: string): Promise<boolean> {
    return this.userMap(userId).delete(vehicleId);
  }
}
