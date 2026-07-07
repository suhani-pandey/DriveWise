import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  VehicleFilterSchema,
  type BrowseFacets,
  type BrowseVehiclesResponse,
  type PlateLookupResult,
  type Vehicle,
  type VinLookupResult,
} from '@drivewise/contracts';

import { ZodValidationPipe } from '../../../shared/pipes/zod-validation.pipe';
import { BrowseVehiclesUseCase } from '../application/browse-vehicles.use-case';
import { GetFilterOptionsUseCase } from '../application/get-filter-options.use-case';
import { GetVehicleDetailUseCase } from '../application/get-vehicle-detail.use-case';
import { LookupExternalUseCase } from '../application/lookup-external.use-case';

const ARRAY_FILTER_KEYS = [
  'conditions',
  'makes',
  'fuelTypes',
  'bodyTypes',
  'transmissions',
  'drivetrains',
  'regions',
  'sellerTypes',
] as const;

/** Accepts both `?makes=Kia,Tesla` and repeated `?makes=Kia&makes=Tesla`. */
const normalizeQuery = (query: Record<string, unknown>): Record<string, unknown> => {
  const normalized: Record<string, unknown> = { ...query };
  for (const key of ARRAY_FILTER_KEYS) {
    const value = normalized[key];
    if (typeof value === 'string') {
      normalized[key] = value.split(',').filter(Boolean);
    }
  }
  // Booleans arrive as strings from the query string.
  if (typeof normalized['registrationTaxPaid'] === 'string') {
    normalized['registrationTaxPaid'] = normalized['registrationTaxPaid'] === 'true';
  }
  return normalized;
};

@Controller('vehicles')
export class VehiclesController {
  constructor(
    private readonly browseVehicles: BrowseVehiclesUseCase,
    private readonly getVehicleDetail: GetVehicleDetailUseCase,
    private readonly getFilterOptions: GetFilterOptionsUseCase,
    private readonly lookupExternal: LookupExternalUseCase,
  ) {}

  @Get()
  browse(@Query() query: Record<string, unknown>): Promise<BrowseVehiclesResponse> {
    const filter = new ZodValidationPipe(VehicleFilterSchema).transform(normalizeQuery(query));
    return this.browseVehicles.execute(filter);
  }

  @Get('filter-options')
  filterOptions(): Promise<BrowseFacets> {
    return this.getFilterOptions.execute();
  }

  @Get('lookup/vin/:vin')
  lookupVin(@Param('vin') vin: string): Promise<VinLookupResult> {
    return this.lookupExternal.byVin(vin);
  }

  @Get('lookup/plate/:plate')
  lookupPlate(@Param('plate') plate: string): Promise<PlateLookupResult> {
    return this.lookupExternal.byPlate(plate);
  }

  @Get(':id')
  detail(@Param('id') id: string): Promise<Vehicle> {
    return this.getVehicleDetail.execute(id);
  }
}
