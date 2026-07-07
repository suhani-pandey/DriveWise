import type {
  BrowseFacets,
  FacetValue,
  Vehicle,
  VehicleFilter,
  VehicleSort,
} from '@drivewise/contracts';

/**
 * Pure search domain logic: filtering, sorting and facet computation.
 * Deliberately free of framework/IO concerns so it is trivially unit-testable
 * and can later be pushed down into a SQL adapter behind the same contract.
 */

const normalize = (value: string): string =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

const matchesQuery = (vehicle: Vehicle, q: string): boolean => {
  const haystack = normalize(`${vehicle.make} ${vehicle.model} ${vehicle.variant ?? ''}`);
  return q
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => haystack.includes(normalize(term)));
};

const inList = <T extends string>(value: T, list?: T[]): boolean =>
  !list || list.length === 0 || list.includes(value);

export const applyFilter = (vehicles: Vehicle[], filter: VehicleFilter): Vehicle[] =>
  vehicles.filter((v) => {
    if (filter.q && !matchesQuery(v, filter.q)) return false;
    if (!inList(v.condition, filter.conditions)) return false;
    if (!inList(v.make, filter.makes)) return false;
    if (!inList(v.fuelType, filter.fuelTypes)) return false;
    if (!inList(v.bodyType, filter.bodyTypes)) return false;
    if (!inList(v.transmission, filter.transmissions)) return false;
    if (!inList(v.drivetrain, filter.drivetrains)) return false;
    if (!inList(v.region, filter.regions)) return false;
    if (!inList(v.sellerType, filter.sellerTypes)) return false;

    if (filter.priceMinDkk !== undefined && v.priceDkk < filter.priceMinDkk) return false;
    if (filter.priceMaxDkk !== undefined && v.priceDkk > filter.priceMaxDkk) return false;
    if (
      filter.leaseMaxDkk !== undefined &&
      (v.monthlyLeaseDkk === null || v.monthlyLeaseDkk > filter.leaseMaxDkk)
    )
      return false;
    if (filter.yearMin !== undefined && v.year < filter.yearMin) return false;
    if (filter.yearMax !== undefined && v.year > filter.yearMax) return false;
    if (filter.mileageMaxKm !== undefined && (v.mileageKm ?? 0) > filter.mileageMaxKm)
      return false;
    if (filter.seatsMin !== undefined && v.seats < filter.seatsMin) return false;
    if (filter.doorsMin !== undefined && v.doors < filter.doorsMin) return false;
    if (
      filter.evRangeMinKm !== undefined &&
      (v.evRangeKm === null || v.evRangeKm < filter.evRangeMinKm)
    )
      return false;
    if (
      filter.euroNcapMin !== undefined &&
      (v.euroNcapStars === null || v.euroNcapStars < filter.euroNcapMin)
    )
      return false;
    if (
      filter.registrationTaxPaid !== undefined &&
      v.registrationTaxPaid !== filter.registrationTaxPaid
    )
      return false;

    return true;
  });

const comparators: Record<VehicleSort, (a: Vehicle, b: Vehicle) => number> = {
  // Seed order is curated relevance; stable sort keeps it for 'bestMatch'.
  bestMatch: () => 0,
  priceAsc: (a, b) => a.priceDkk - b.priceDkk,
  priceDesc: (a, b) => b.priceDkk - a.priceDkk,
  yearDesc: (a, b) => b.year - a.year,
  mileageAsc: (a, b) => (a.mileageKm ?? 0) - (b.mileageKm ?? 0),
  rangeDesc: (a, b) => (b.evRangeKm ?? -1) - (a.evRangeKm ?? -1),
  newestListed: (a, b) => Date.parse(b.listedAt) - Date.parse(a.listedAt),
};

export const sortVehicles = (vehicles: Vehicle[], sort: VehicleSort): Vehicle[] =>
  [...vehicles].sort(comparators[sort]);

const countBy = (vehicles: Vehicle[], pick: (v: Vehicle) => string): FacetValue[] => {
  const counts = new Map<string, number>();
  for (const v of vehicles) {
    const key = pick(v);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => a.value.localeCompare(b.value));
};

export const buildFacets = (vehicles: Vehicle[]): BrowseFacets => {
  const prices = vehicles.map((v) => v.priceDkk);
  const years = vehicles.map((v) => v.year);
  return {
    makes: countBy(vehicles, (v) => v.make),
    fuelTypes: countBy(vehicles, (v) => v.fuelType),
    bodyTypes: countBy(vehicles, (v) => v.bodyType),
    conditions: countBy(vehicles, (v) => v.condition),
    regions: countBy(vehicles, (v) => v.region),
    priceRangeDkk: {
      min: prices.length ? Math.min(...prices) : 0,
      max: prices.length ? Math.max(...prices) : 0,
    },
    yearRange: {
      min: years.length ? Math.min(...years) : 0,
      max: years.length ? Math.max(...years) : 0,
    },
  };
};

export const paginate = <T>(items: T[], page: number, pageSize: number): T[] =>
  items.slice((page - 1) * pageSize, page * pageSize);
