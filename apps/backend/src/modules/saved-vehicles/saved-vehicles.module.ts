import { Module } from '@nestjs/common';

import { SavedVehiclesController } from './api/saved-vehicles.controller';
import { SavedVehiclesService } from './application/saved-vehicles.service';
import { SAVED_VEHICLE_REPOSITORY } from './domain/saved-vehicle.repository';
import { InMemorySavedVehicleRepository } from './infrastructure/in-memory-saved-vehicle.repository';

@Module({
  controllers: [SavedVehiclesController],
  providers: [
    { provide: SAVED_VEHICLE_REPOSITORY, useClass: InMemorySavedVehicleRepository },
    SavedVehiclesService,
  ],
})
export class SavedVehiclesModule {}
