import { Global, Module } from '@nestjs/common';

import { VEHICLE_CATALOG } from '../../shared/domain/vehicle-catalog.port';
import { VehiclesController } from './api/vehicles.controller';
import { BrowseVehiclesUseCase } from './application/browse-vehicles.use-case';
import { GetFilterOptionsUseCase } from './application/get-filter-options.use-case';
import { GetVehicleDetailUseCase } from './application/get-vehicle-detail.use-case';
import { LookupExternalUseCase } from './application/lookup-external.use-case';
import { PLATE_LOOKUP } from './domain/plate-lookup.port';
import { VIN_DECODER } from './domain/vin-decoder.port';
import { InMemoryVehicleRepository } from './infrastructure/persistence/in-memory-vehicle.repository';
import { NhtsaVpicAdapter } from './infrastructure/providers/nhtsa-vpic.adapter';
import { NrpladePlateLookupAdapter } from './infrastructure/providers/nrplade-plate-lookup.adapter';

/**
 * Owns the vehicle catalog. @Global so the exported VEHICLE_CATALOG binding is
 * injectable by sibling modules (comparison, ownership-cost, …) without
 * cross-module file imports — they depend only on the shared-kernel port.
 *
 * Swap InMemoryVehicleRepository for a Drizzle adapter here to move to Postgres.
 */
@Global()
@Module({
  controllers: [VehiclesController],
  providers: [
    { provide: VEHICLE_CATALOG, useClass: InMemoryVehicleRepository },
    { provide: VIN_DECODER, useClass: NhtsaVpicAdapter },
    { provide: PLATE_LOOKUP, useClass: NrpladePlateLookupAdapter },
    BrowseVehiclesUseCase,
    GetVehicleDetailUseCase,
    GetFilterOptionsUseCase,
    LookupExternalUseCase,
  ],
  exports: [VEHICLE_CATALOG],
})
export class VehiclesModule {}
