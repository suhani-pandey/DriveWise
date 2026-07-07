import { Inject, Injectable } from '@nestjs/common';
import type {
  SaveVehicleRequest,
  SavedListResponse,
  SavedVehicle,
  UpdateSavedVehicleRequest,
} from '@drivewise/contracts';

import {
  VEHICLE_CATALOG,
  type VehicleCatalogPort,
} from '../../../shared/domain/vehicle-catalog.port';
import { NotFoundError } from '../../../shared/errors/app-error';
import {
  SAVED_VEHICLE_REPOSITORY,
  type SavedVehicleRepository,
} from '../domain/saved-vehicle.repository';

/** Watchlist use cases: list, save, annotate, remove. */
@Injectable()
export class SavedVehiclesService {
  constructor(
    @Inject(SAVED_VEHICLE_REPOSITORY) private readonly repository: SavedVehicleRepository,
    @Inject(VEHICLE_CATALOG) private readonly catalog: VehicleCatalogPort,
  ) {}

  async list(userId: string): Promise<SavedListResponse> {
    const saved = await this.repository.listByUser(userId);
    const vehicles = await this.catalog.findByIds(saved.map((s) => s.vehicleId));
    const byId = new Map(vehicles.map((v) => [v.id, v]));

    return {
      items: saved.flatMap((entry) => {
        const vehicle = byId.get(entry.vehicleId);
        return vehicle ? [{ ...entry, vehicle }] : []; // drop stale references
      }),
    };
  }

  async save(userId: string, request: SaveVehicleRequest): Promise<SavedVehicle> {
    const vehicle = await this.catalog.findById(request.vehicleId);
    if (!vehicle) throw new NotFoundError('Vehicle', request.vehicleId);

    return this.repository.upsert(userId, {
      vehicleId: request.vehicleId,
      status: request.status,
      note: request.note,
      savedAt: new Date().toISOString(),
    });
  }

  async update(
    userId: string,
    vehicleId: string,
    request: UpdateSavedVehicleRequest,
  ): Promise<SavedVehicle> {
    const existing = await this.repository.find(userId, vehicleId);
    if (!existing) throw new NotFoundError('Saved vehicle', vehicleId);

    return this.repository.upsert(userId, {
      ...existing,
      status: request.status ?? existing.status,
      note: request.note !== undefined ? request.note : existing.note,
    });
  }

  async remove(userId: string, vehicleId: string): Promise<void> {
    const removed = await this.repository.remove(userId, vehicleId);
    if (!removed) throw new NotFoundError('Saved vehicle', vehicleId);
  }
}
