import { Inject, Injectable } from '@nestjs/common';
import type { BrowseVehiclesResponse, VehicleFilter } from '@drivewise/contracts';

import {
  VEHICLE_CATALOG,
  type VehicleCatalogPort,
} from '../../../shared/domain/vehicle-catalog.port';
import { applyFilter, buildFacets, paginate, sortVehicles } from '../domain/vehicle-search';

@Injectable()
export class BrowseVehiclesUseCase {
  constructor(@Inject(VEHICLE_CATALOG) private readonly catalog: VehicleCatalogPort) {}

  async execute(filter: VehicleFilter): Promise<BrowseVehiclesResponse> {
    const all = await this.catalog.findAll();
    const filtered = applyFilter(all, filter);
    const sorted = sortVehicles(filtered, filter.sort);

    return {
      items: paginate(sorted, filter.page, filter.pageSize),
      total: filtered.length,
      page: filter.page,
      pageSize: filter.pageSize,
      facets: buildFacets(filtered),
    };
  }
}
