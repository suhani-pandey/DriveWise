import type {
  CostBreakdown,
  OwnershipAssumptions,
  Vehicle,
  VehicleOwnershipCost,
} from '@drivewise/contracts';

/**
 * Simplified Danish total-cost-of-ownership model. Pure and unit-tested.
 *
 * Rates are deliberately grouped as named constants so they can be tuned (or
 * replaced by a data-driven table / official CO2-ejerafgift brackets) without
 * touching the calculation shape.
 */

/** Annual declining-balance depreciation rates. */
const DEPRECIATION_RATE = { newEv: 0.16, newIce: 0.13, usedEv: 0.11, usedIce: 0.09 };

/** Yearly insurance ≈ base + share of vehicle value (typical Danish kasko). */
const INSURANCE = { baseDkkPerYear: 5000, shareOfPrice: 0.008, capDkkPerYear: 16000 };

/** Maintenance per km by fuel type; used cars cost ~20 % more to keep running. */
const MAINTENANCE_DKK_PER_KM: Record<Vehicle['fuelType'], number> = {
  ev: 0.25,
  phev: 0.4,
  hybrid: 0.35,
  petrol: 0.45,
  diesel: 0.5,
};
const USED_MAINTENANCE_MULTIPLIER = 1.2;

/**
 * Danish periodic ownership tax (CO2-ejerafgift), simplified to consumption
 * brackets. EVs pay the low base rate; diesel carries a surcharge.
 */
const OWNERSHIP_TAX = {
  evDkkPerYear: 760,
  phevDkkPerYear: 1560,
  dieselSurcharge: 1.3,
  brackets: [
    { maxLPer100Km: 4, dkkPerYear: 1060 },
    { maxLPer100Km: 5, dkkPerYear: 1560 },
    { maxLPer100Km: 6, dkkPerYear: 2600 },
    { maxLPer100Km: 7, dkkPerYear: 4000 },
    { maxLPer100Km: 8, dkkPerYear: 6100 },
    { maxLPer100Km: Infinity, dkkPerYear: 9200 },
  ],
};

/** PHEVs: share of km assumed driven on electricity (short-trip commuting). */
const PHEV_ELECTRIC_SHARE = 0.6;

const depreciation = (vehicle: Vehicle, years: number): number => {
  const rate =
    vehicle.condition === 'new'
      ? vehicle.fuelType === 'ev'
        ? DEPRECIATION_RATE.newEv
        : DEPRECIATION_RATE.newIce
      : vehicle.fuelType === 'ev'
        ? DEPRECIATION_RATE.usedEv
        : DEPRECIATION_RATE.usedIce;
  return vehicle.priceDkk * (1 - Math.pow(1 - rate, years));
};

const energy = (vehicle: Vehicle, assumptions: OwnershipAssumptions): number => {
  const totalKm = assumptions.annualKm * assumptions.years;
  const liquidPrice =
    vehicle.fuelType === 'diesel'
      ? assumptions.dieselPriceDkkPerLiter
      : assumptions.petrolPriceDkkPerLiter;

  const electricCostPer100 =
    (vehicle.consumptionKwhPer100Km ?? 0) * assumptions.electricityPriceDkkPerKwh;
  const liquidCostPer100 = (vehicle.consumptionLPer100Km ?? 0) * liquidPrice;

  switch (vehicle.fuelType) {
    case 'ev':
      return (totalKm / 100) * electricCostPer100;
    case 'phev':
      return (
        (totalKm / 100) *
        (electricCostPer100 * PHEV_ELECTRIC_SHARE +
          liquidCostPer100 * (1 - PHEV_ELECTRIC_SHARE))
      );
    default:
      return (totalKm / 100) * liquidCostPer100;
  }
};

const insurance = (vehicle: Vehicle, years: number): number =>
  Math.min(
    INSURANCE.baseDkkPerYear + vehicle.priceDkk * INSURANCE.shareOfPrice,
    INSURANCE.capDkkPerYear,
  ) * years;

const maintenance = (vehicle: Vehicle, assumptions: OwnershipAssumptions): number => {
  const perKm = MAINTENANCE_DKK_PER_KM[vehicle.fuelType];
  const multiplier = vehicle.condition === 'used' ? USED_MAINTENANCE_MULTIPLIER : 1;
  return perKm * multiplier * assumptions.annualKm * assumptions.years;
};

const ownershipTax = (vehicle: Vehicle, years: number): number => {
  if (vehicle.fuelType === 'ev') return OWNERSHIP_TAX.evDkkPerYear * years;
  if (vehicle.fuelType === 'phev') return OWNERSHIP_TAX.phevDkkPerYear * years;

  const consumption = vehicle.consumptionLPer100Km ?? 6;
  const bracket = OWNERSHIP_TAX.brackets.find((b) => consumption <= b.maxLPer100Km)!;
  const surcharge = vehicle.fuelType === 'diesel' ? OWNERSHIP_TAX.dieselSurcharge : 1;
  return bracket.dkkPerYear * surcharge * years;
};

export const calculateOwnershipCost = (
  vehicle: Vehicle,
  assumptions: OwnershipAssumptions,
): VehicleOwnershipCost => {
  const breakdown: CostBreakdown = {
    depreciationDkk: Math.round(depreciation(vehicle, assumptions.years)),
    energyDkk: Math.round(energy(vehicle, assumptions)),
    insuranceDkk: Math.round(insurance(vehicle, assumptions.years)),
    maintenanceDkk: Math.round(maintenance(vehicle, assumptions)),
    ownershipTaxDkk: Math.round(ownershipTax(vehicle, assumptions.years)),
  };
  const totalDkk =
    breakdown.depreciationDkk +
    breakdown.energyDkk +
    breakdown.insuranceDkk +
    breakdown.maintenanceDkk +
    breakdown.ownershipTaxDkk;

  return {
    vehicleId: vehicle.id,
    make: vehicle.make,
    model: vehicle.model,
    totalDkk,
    perYearDkk: Math.round(totalDkk / assumptions.years),
    perKmDkk: Number((totalDkk / (assumptions.annualKm * assumptions.years)).toFixed(2)),
    breakdown,
  };
};
