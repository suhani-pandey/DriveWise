import { Inject, Injectable } from '@nestjs/common';
import type { BrowseFacets } from '@drivewise/contracts';

import {
  VEHICLE_CATALOG,
  type VehicleCatalogPort,
} from '../../../shared/domain/vehicle-catalog.port';
import { buildFacets } from '../domain/vehicle-search';

/** Facets over the whole inventory — used to build the browse filter panel. */
@Injectable()
export class GetFilterOptionsUseCase {
  constructor(@Inject(VEHICLE_CATALOG) private readonly catalog: VehicleCatalogPort) {}

  async execute(): Promise<BrowseFacets> {
    return buildFacets(await this.catalog.findAll());
  }
}
