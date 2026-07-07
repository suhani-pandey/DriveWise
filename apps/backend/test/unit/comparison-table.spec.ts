import { describe, expect, it } from 'vitest';

import {
  buildComparisonSections,
  countWins,
} from '../../src/modules/comparison/domain/comparison-table';
import { makeVehicle } from './fixtures';

describe('buildComparisonSections', () => {
  const cheap = makeVehicle({ priceDkk: 200000, evRangeKm: 400, accelerationSec0To100: 7 });
  const fast = makeVehicle({ priceDkk: 400000, evRangeKm: 500, accelerationSec0To100: 4 });

  it('marks the lowest price as best (min direction)', () => {
    const sections = buildComparisonSections([cheap, fast]);
    const priceRow = sections
      .flatMap((s) => s.rows)
      .find((r) => r.key === 'price')!;
    expect(priceRow.bestIndex).toBe(0);
  });

  it('marks the highest range as best (max direction)', () => {
    const sections = buildComparisonSections([cheap, fast]);
    const rangeRow = sections.flatMap((s) => s.rows).find((r) => r.key === 'range')!;
    expect(rangeRow.bestIndex).toBe(1);
  });

  it('does not highlight ties', () => {
    const a = makeVehicle({ priceDkk: 300000 });
    const b = makeVehicle({ priceDkk: 300000 });
    const priceRow = buildComparisonSections([a, b])
      .flatMap((s) => s.rows)
      .find((r) => r.key === 'price')!;
    expect(priceRow.bestIndex).toBeNull();
  });

  it('drops EV-only rows when no vehicle has the data', () => {
    const petrolA = makeVehicle({
      fuelType: 'petrol',
      evRangeKm: null,
      batteryKwh: null,
      chargeMinutes10To80: null,
      dcChargeKw: null,
      consumptionKwhPer100Km: null,
      consumptionLPer100Km: 6,
    });
    const petrolB = makeVehicle({
      fuelType: 'petrol',
      evRangeKm: null,
      batteryKwh: null,
      chargeMinutes10To80: null,
      dcChargeKw: null,
      consumptionKwhPer100Km: null,
      consumptionLPer100Km: 7,
    });
    const rows = buildComparisonSections([petrolA, petrolB]).flatMap((s) => s.rows);
    expect(rows.find((r) => r.key === 'range')).toBeUndefined();
    expect(rows.find((r) => r.key === 'consumption')).toBeDefined();
  });

  it('labels new cars instead of showing zero mileage', () => {
    const rows = buildComparisonSections([
      makeVehicle({ condition: 'new', mileageKm: null }),
      makeVehicle({ condition: 'used', mileageKm: 42000 }),
    ]).flatMap((s) => s.rows);
    const mileageRow = rows.find((r) => r.key === 'mileage')!;
    expect(mileageRow.values[0]).toBe('New');
    expect(mileageRow.values[1]).toContain('42');
  });
});

describe('countWins', () => {
  it('tallies best-in-row wins per column', () => {
    const cheapLongRange = makeVehicle({ priceDkk: 200000, evRangeKm: 500 });
    const expensive = makeVehicle({ priceDkk: 400000, evRangeKm: 400 });
    const sections = buildComparisonSections([cheapLongRange, expensive]);
    const wins = countWins(sections, 2);
    expect(wins[0]).toBeGreaterThan(wins[1]);
  });
});
