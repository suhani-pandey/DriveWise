import { describe, expect, it } from 'vitest';
import { OwnershipAssumptionsSchema } from '@drivewise/contracts';

import { calculateOwnershipCost } from '../../src/modules/ownership-cost/domain/tco-calculator';
import { makeVehicle } from './fixtures';

const assumptions = OwnershipAssumptionsSchema.parse({
  annualKm: 20000,
  years: 5,
  electricityPriceDkkPerKwh: 2.5,
  petrolPriceDkkPerLiter: 14,
  dieselPriceDkkPerLiter: 13,
});

describe('calculateOwnershipCost', () => {
  it('sums the breakdown into the total', () => {
    const cost = calculateOwnershipCost(makeVehicle(), assumptions);
    const { depreciationDkk, energyDkk, insuranceDkk, maintenanceDkk, ownershipTaxDkk } =
      cost.breakdown;
    expect(cost.totalDkk).toBe(
      depreciationDkk + energyDkk + insuranceDkk + maintenanceDkk + ownershipTaxDkk,
    );
    expect(cost.perYearDkk).toBe(Math.round(cost.totalDkk / 5));
  });

  it('computes EV energy from kWh consumption and electricity price', () => {
    const ev = makeVehicle({ fuelType: 'ev', consumptionKwhPer100Km: 17 });
    const cost = calculateOwnershipCost(ev, assumptions);
    // 100,000 km / 100 * 17 kWh * 2.5 kr
    expect(cost.breakdown.energyDkk).toBe(42500);
  });

  it('charges petrol cars more per km in energy than an efficient EV', () => {
    const ev = makeVehicle({ fuelType: 'ev', consumptionKwhPer100Km: 17 });
    const petrol = makeVehicle({
      fuelType: 'petrol',
      consumptionKwhPer100Km: null,
      consumptionLPer100Km: 6.5,
    });
    expect(
      calculateOwnershipCost(petrol, assumptions).breakdown.energyDkk,
    ).toBeGreaterThan(calculateOwnershipCost(ev, assumptions).breakdown.energyDkk);
  });

  it('applies the low EV ownership-tax rate', () => {
    const ev = makeVehicle({ fuelType: 'ev' });
    expect(calculateOwnershipCost(ev, assumptions).breakdown.ownershipTaxDkk).toBe(760 * 5);
  });

  it('surcharges diesel ownership tax over an equivalent petrol car', () => {
    const diesel = makeVehicle({
      fuelType: 'diesel',
      consumptionKwhPer100Km: null,
      consumptionLPer100Km: 5.5,
    });
    const petrol = makeVehicle({
      fuelType: 'petrol',
      consumptionKwhPer100Km: null,
      consumptionLPer100Km: 5.5,
    });
    expect(
      calculateOwnershipCost(diesel, assumptions).breakdown.ownershipTaxDkk,
    ).toBeGreaterThan(calculateOwnershipCost(petrol, assumptions).breakdown.ownershipTaxDkk);
  });

  it('depreciates new cars faster than used ones', () => {
    const fresh = makeVehicle({ condition: 'new', priceDkk: 300000 });
    const used = makeVehicle({ condition: 'used', priceDkk: 300000, mileageKm: 40000 });
    expect(
      calculateOwnershipCost(fresh, assumptions).breakdown.depreciationDkk,
    ).toBeGreaterThan(calculateOwnershipCost(used, assumptions).breakdown.depreciationDkk);
  });
});
