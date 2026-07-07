import { z } from 'zod';

import {
  BodyTypeSchema,
  ConditionSchema,
  DrivetrainSchema,
  ExternalLinkSchema,
  FacetValueSchema,
  FuelTypeSchema,
  RegionSchema,
  SellerTypeSchema,
  TransmissionSchema,
} from './common';

export const VehicleSchema = z.object({
  id: z.string().uuid(),
  make: z.string().min(1),
  model: z.string().min(1),
  variant: z.string().nullable(),
  year: z.number().int().min(1950).max(2100),
  condition: ConditionSchema,
  bodyType: BodyTypeSchema,
  fuelType: FuelTypeSchema,
  transmission: TransmissionSchema,
  drivetrain: DrivetrainSchema,

  /** Cash price incl. Danish registration tax unless `registrationTaxPaid` is false. */
  priceDkk: z.number().nonnegative(),
  monthlyLeaseDkk: z.number().nonnegative().nullable(),
  registrationTaxPaid: z.boolean(),

  /** null for factory-new vehicles. */
  mileageKm: z.number().nonnegative().nullable(),
  seats: z.number().int().min(1).max(9),
  doors: z.number().int().min(2).max(6),

  // Electric / charging (null for non-EV where not applicable)
  evRangeKm: z.number().nonnegative().nullable(),
  batteryKwh: z.number().nonnegative().nullable(),
  chargeMinutes10To80: z.number().nonnegative().nullable(),
  dcChargeKw: z.number().nonnegative().nullable(),

  // Consumption (one of the two depending on fuel type; PHEV may have both)
  consumptionKwhPer100Km: z.number().nonnegative().nullable(),
  consumptionLPer100Km: z.number().nonnegative().nullable(),

  // Performance & practicality
  accelerationSec0To100: z.number().nonnegative().nullable(),
  topSpeedKmh: z.number().nonnegative().nullable(),
  cargoLiters: z.number().nonnegative().nullable(),

  euroNcapStars: z.number().int().min(0).max(5).nullable(),
  region: RegionSchema,
  sellerType: SellerTypeSchema,

  imageUrl: z.string().url().nullable(),
  summary: z.string(),
  pros: z.array(z.string()),
  cons: z.array(z.string()),

  /** Outbound links — manufacturer site and Danish marketplaces — for "full info" redirects. */
  externalLinks: z.array(ExternalLinkSchema),

  listedAt: z.string().datetime(),
});
export type Vehicle = z.infer<typeof VehicleSchema>;

export const VehicleSortSchema = z.enum([
  'bestMatch',
  'priceAsc',
  'priceDesc',
  'yearDesc',
  'mileageAsc',
  'rangeDesc',
  'newestListed',
]);
export type VehicleSort = z.infer<typeof VehicleSortSchema>;

/**
 * Browse filters for the Danish market: covers new, used and second-hand
 * listings (condition), cash and leasing budgets, EV specifics, and
 * Danish particulars such as registration tax status and seller region.
 */
export const VehicleFilterSchema = z.object({
  q: z.string().max(120).optional(),
  conditions: z.array(ConditionSchema).optional(),
  makes: z.array(z.string()).optional(),
  fuelTypes: z.array(FuelTypeSchema).optional(),
  bodyTypes: z.array(BodyTypeSchema).optional(),
  transmissions: z.array(TransmissionSchema).optional(),
  drivetrains: z.array(DrivetrainSchema).optional(),
  regions: z.array(RegionSchema).optional(),
  sellerTypes: z.array(SellerTypeSchema).optional(),

  priceMinDkk: z.coerce.number().nonnegative().optional(),
  priceMaxDkk: z.coerce.number().nonnegative().optional(),
  leaseMaxDkk: z.coerce.number().nonnegative().optional(),
  yearMin: z.coerce.number().int().optional(),
  yearMax: z.coerce.number().int().optional(),
  mileageMaxKm: z.coerce.number().nonnegative().optional(),
  seatsMin: z.coerce.number().int().optional(),
  doorsMin: z.coerce.number().int().optional(),
  evRangeMinKm: z.coerce.number().nonnegative().optional(),
  euroNcapMin: z.coerce.number().int().min(0).max(5).optional(),
  registrationTaxPaid: z.coerce.boolean().optional(),

  sort: VehicleSortSchema.default('bestMatch'),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(60).default(24),
});
export type VehicleFilter = z.infer<typeof VehicleFilterSchema>;
export type VehicleFilterInput = z.input<typeof VehicleFilterSchema>;

export const BrowseFacetsSchema = z.object({
  makes: z.array(FacetValueSchema),
  fuelTypes: z.array(FacetValueSchema),
  bodyTypes: z.array(FacetValueSchema),
  conditions: z.array(FacetValueSchema),
  regions: z.array(FacetValueSchema),
  priceRangeDkk: z.object({ min: z.number(), max: z.number() }),
  yearRange: z.object({ min: z.number(), max: z.number() }),
});
export type BrowseFacets = z.infer<typeof BrowseFacetsSchema>;

export const BrowseVehiclesResponseSchema = z.object({
  items: z.array(VehicleSchema),
  total: z.number().int().nonnegative(),
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1),
  facets: BrowseFacetsSchema,
});
export type BrowseVehiclesResponse = z.infer<typeof BrowseVehiclesResponseSchema>;

/** Result of decoding a VIN via an external provider (e.g. NHTSA vPIC). */
export const VinLookupResultSchema = z.object({
  vin: z.string(),
  make: z.string().nullable(),
  model: z.string().nullable(),
  modelYear: z.string().nullable(),
  bodyClass: z.string().nullable(),
  fuelType: z.string().nullable(),
  provider: z.string(),
});
export type VinLookupResult = z.infer<typeof VinLookupResultSchema>;

/** Result of a Danish number-plate lookup (Motorregister via third-party API). */
export const PlateLookupResultSchema = z.object({
  plate: z.string(),
  make: z.string().nullable(),
  model: z.string().nullable(),
  variant: z.string().nullable(),
  firstRegistration: z.string().nullable(),
  fuelType: z.string().nullable(),
  inspectionDueDate: z.string().nullable(),
  provider: z.string(),
});
export type PlateLookupResult = z.infer<typeof PlateLookupResultSchema>;
