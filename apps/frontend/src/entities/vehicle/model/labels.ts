import type {
  BodyType,
  Condition,
  Drivetrain,
  FuelType,
  Region,
  SellerType,
  Transmission,
  VehicleSort,
} from '@drivewise/contracts';

/** User-facing labels for contract enums (English UI, Danish market terms). */

export const CONDITION_LABELS: Record<Condition, string> = {
  new: 'New',
  used: 'Used',
};

export const FUEL_TYPE_LABELS: Record<FuelType, string> = {
  ev: 'Electric',
  phev: 'Plug-in hybrid',
  hybrid: 'Hybrid',
  petrol: 'Petrol',
  diesel: 'Diesel',
};

export const TRANSMISSION_LABELS: Record<Transmission, string> = {
  automatic: 'Automatic',
  manual: 'Manual',
};

export const DRIVETRAIN_LABELS: Record<Drivetrain, string> = {
  fwd: 'Front-wheel drive',
  rwd: 'Rear-wheel drive',
  awd: 'All-wheel drive',
};

export const BODY_TYPE_LABELS: Record<BodyType, string> = {
  suv: 'SUV',
  crossover: 'Crossover',
  sedan: 'Sedan',
  hatchback: 'Hatchback',
  stationcar: 'Stationcar',
  fastback: 'Fastback',
  coupe: 'Coupé',
  mpv: 'MPV',
  cabriolet: 'Cabriolet',
  van: 'Van',
};

export const REGION_LABELS: Record<Region, string> = {
  hovedstaden: 'Hovedstaden',
  sjaelland: 'Sjælland',
  fyn: 'Fyn',
  syddanmark: 'Syddanmark',
  midtjylland: 'Midtjylland',
  nordjylland: 'Nordjylland',
};

export const SELLER_TYPE_LABELS: Record<SellerType, string> = {
  dealer: 'Dealer',
  private: 'Private seller',
};

export const SORT_LABELS: Record<VehicleSort, string> = {
  bestMatch: 'Best match',
  priceAsc: 'Price: low to high',
  priceDesc: 'Price: high to low',
  yearDesc: 'Newest year',
  mileageAsc: 'Lowest mileage',
  rangeDesc: 'Longest range',
  newestListed: 'Newest listings',
};
