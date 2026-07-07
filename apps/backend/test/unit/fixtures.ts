import type { Vehicle } from '@drivewise/contracts';

let counter = 0;

/** Minimal valid vehicle; override only what the test cares about. */
export const makeVehicle = (overrides: Partial<Vehicle> = {}): Vehicle => {
  counter += 1;
  return {
    id: `00000000-0000-4000-8000-${String(counter).padStart(12, '0')}`,
    make: 'TestMake',
    model: `Model${counter}`,
    variant: null,
    year: 2024,
    condition: 'new',
    bodyType: 'suv',
    fuelType: 'ev',
    transmission: 'automatic',
    drivetrain: 'awd',
    priceDkk: 300000,
    monthlyLeaseDkk: null,
    registrationTaxPaid: true,
    mileageKm: null,
    seats: 5,
    doors: 5,
    evRangeKm: 450,
    batteryKwh: 75,
    chargeMinutes10To80: 28,
    dcChargeKw: 150,
    consumptionKwhPer100Km: 17,
    consumptionLPer100Km: null,
    accelerationSec0To100: 6.0,
    topSpeedKmh: 180,
    cargoLiters: 450,
    euroNcapStars: 5,
    region: 'hovedstaden',
    sellerType: 'dealer',
    imageUrl: null,
    summary: 'Test vehicle',
    pros: [],
    cons: [],
    externalLinks: [],
    listedAt: '2026-07-01T00:00:00.000Z',
    ...overrides,
  };
};
