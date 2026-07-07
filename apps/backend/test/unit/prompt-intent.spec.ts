import { describe, expect, it } from 'vitest';

import { parsePromptIntent } from '../../src/modules/recommendation/domain/prompt-intent';
import { rankVehicles } from '../../src/modules/recommendation/domain/vehicle-scorer';
import { makeVehicle } from './fixtures';

describe('parsePromptIntent', () => {
  it('parses "under 250k" into a DKK budget', () => {
    expect(parsePromptIntent('Best SUV under 250k?').maxPriceDkk).toBe(250000);
  });

  it('parses Danish thousands notation "under 250.000"', () => {
    expect(parsePromptIntent('god bil under 250.000 kr').maxPriceDkk).toBe(250000);
  });

  it('detects body type and fuel keywords', () => {
    const intent = parsePromptIntent('Reliable hybrid stationcar for the family');
    expect(intent.bodyTypes).toContain('stationcar');
    expect(intent.fuelTypes).toContain('hybrid');
    expect(intent.wantsFamily).toBe(true);
    expect(intent.wantsReliability).toBe(true);
  });

  it('detects long-distance needs', () => {
    expect(parsePromptIntent('Best EV for long-distance travel?').wantsLongRange).toBe(true);
  });
});

describe('rankVehicles', () => {
  it('ranks a budget-fitting SUV above an over-budget one', () => {
    const affordable = makeVehicle({ bodyType: 'suv', priceDkk: 240000 });
    const expensive = makeVehicle({ bodyType: 'suv', priceDkk: 500000 });
    const intent = parsePromptIntent('Best SUV under 250k?');
    const ranked = rankVehicles([expensive, affordable], intent, 5);
    expect(ranked[0].vehicle.id).toBe(affordable.id);
  });

  it('always returns reasons with each result', () => {
    const intent = parsePromptIntent('family EV with space under 400k');
    const ranked = rankVehicles(
      [makeVehicle({ bodyType: 'suv', cargoLiters: 600, priceDkk: 350000 })],
      intent,
      5,
    );
    expect(ranked[0].reasons.length).toBeGreaterThan(0);
  });
});
