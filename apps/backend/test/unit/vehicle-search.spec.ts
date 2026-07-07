import { describe, expect, it } from 'vitest';
import { VehicleFilterSchema } from '@drivewise/contracts';

import {
  applyFilter,
  buildFacets,
  sortVehicles,
} from '../../src/modules/vehicles/domain/vehicle-search';
import { makeVehicle } from './fixtures';

const baseFilter = VehicleFilterSchema.parse({});

describe('applyFilter', () => {
  const vehicles = [
    makeVehicle({ make: 'Tesla', condition: 'new', fuelType: 'ev', priceDkk: 389000 }),
    makeVehicle({
      make: 'Volkswagen',
      condition: 'used',
      fuelType: 'petrol',
      priceDkk: 189000,
      mileageKm: 61000,
      evRangeKm: null,
    }),
    makeVehicle({ make: 'Škoda', condition: 'used', fuelType: 'ev', priceDkk: 219000, mileageKm: 52000 }),
  ];

  it('returns everything with an empty filter', () => {
    expect(applyFilter(vehicles, baseFilter)).toHaveLength(3);
  });

  it('filters by condition (new / used / second-hand)', () => {
    const used = applyFilter(vehicles, { ...baseFilter, conditions: ['used'] });
    expect(used).toHaveLength(2);
    expect(used.every((v) => v.condition === 'used')).toBe(true);
  });

  it('filters by price range and fuel type together', () => {
    const result = applyFilter(vehicles, {
      ...baseFilter,
      fuelTypes: ['ev'],
      priceMaxDkk: 250000,
    });
    expect(result).toHaveLength(1);
    expect(result[0].make).toBe('Škoda');
  });

  it('filters by mileage cap, treating new cars as zero-km', () => {
    const result = applyFilter(vehicles, { ...baseFilter, mileageMaxKm: 55000 });
    expect(result.map((v) => v.make).sort()).toEqual(['Tesla', 'Škoda']);
  });

  it('matches search text across make and model, ignoring diacritics', () => {
    const result = applyFilter(vehicles, { ...baseFilter, q: 'skoda' });
    expect(result).toHaveLength(1);
    expect(result[0].make).toBe('Škoda');
  });

  it('excludes vehicles without EV range when a minimum range is set', () => {
    const result = applyFilter(vehicles, { ...baseFilter, evRangeMinKm: 400 });
    expect(result.every((v) => (v.evRangeKm ?? 0) >= 400)).toBe(true);
    expect(result).toHaveLength(2);
  });
});

describe('sortVehicles', () => {
  const vehicles = [
    makeVehicle({ priceDkk: 300000, year: 2022 }),
    makeVehicle({ priceDkk: 150000, year: 2025 }),
    makeVehicle({ priceDkk: 450000, year: 2020 }),
  ];

  it('sorts by ascending price', () => {
    expect(sortVehicles(vehicles, 'priceAsc').map((v) => v.priceDkk)).toEqual([
      150000, 300000, 450000,
    ]);
  });

  it('keeps curated order for bestMatch', () => {
    expect(sortVehicles(vehicles, 'bestMatch')).toEqual(vehicles);
  });
});

describe('buildFacets', () => {
  it('counts values and computes ranges over the given set', () => {
    const facets = buildFacets([
      makeVehicle({ make: 'Kia', priceDkk: 100000, year: 2020 }),
      makeVehicle({ make: 'Kia', priceDkk: 200000, year: 2024 }),
      makeVehicle({ make: 'Tesla', priceDkk: 300000, year: 2022 }),
    ]);
    expect(facets.makes).toEqual([
      { value: 'Kia', count: 2 },
      { value: 'Tesla', count: 1 },
    ]);
    expect(facets.priceRangeDkk).toEqual({ min: 100000, max: 300000 });
    expect(facets.yearRange).toEqual({ min: 2020, max: 2024 });
  });
});
