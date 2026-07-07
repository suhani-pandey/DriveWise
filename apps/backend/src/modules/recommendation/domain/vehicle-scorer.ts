import type { Vehicle } from '@drivewise/contracts';

import type { PromptIntent } from './prompt-intent';

/**
 * Scores vehicles against a parsed intent. Returns a 0..1 score plus
 * human-readable reasons — the reasons are the product, not just the ranking.
 */

export interface ScoredVehicle {
  vehicle: Vehicle;
  score: number;
  reasons: string[];
}

const FAMILY_BODIES = new Set(['suv', 'crossover', 'stationcar', 'mpv']);
const CITY_BODIES = new Set(['hatchback', 'crossover']);
const RELIABLE_MAKES = new Set(['Toyota', 'Kia', 'Hyundai', 'Škoda']);

export const scoreVehicle = (vehicle: Vehicle, intent: PromptIntent): ScoredVehicle => {
  let score = 0.3; // base relevance for being in the catalog
  const reasons: string[] = [];

  if (intent.maxPriceDkk !== null) {
    if (vehicle.priceDkk <= intent.maxPriceDkk) {
      score += 0.2;
      reasons.push(`Within your budget at ${Math.round(vehicle.priceDkk / 1000)}k kr.`);
    } else {
      score -= 0.35;
    }
  }
  if (intent.minPriceDkk !== null && vehicle.priceDkk < intent.minPriceDkk) {
    score -= 0.1;
  }

  if (intent.bodyTypes.length > 0) {
    if (intent.bodyTypes.includes(vehicle.bodyType)) {
      score += 0.15;
      reasons.push(`Matches the body style you asked for (${vehicle.bodyType}).`);
    } else {
      score -= 0.15;
    }
  }

  if (intent.fuelTypes.length > 0) {
    if (intent.fuelTypes.includes(vehicle.fuelType)) {
      score += 0.15;
      reasons.push(`Runs on the powertrain you want (${vehicle.fuelType.toUpperCase()}).`);
    } else {
      score -= 0.2;
    }
  }

  if (intent.wantsLongRange && vehicle.evRangeKm !== null) {
    if (vehicle.evRangeKm >= 500) {
      score += 0.15;
      reasons.push(`${vehicle.evRangeKm} km WLTP range suits long-distance driving.`);
    } else if (vehicle.evRangeKm < 400) {
      score -= 0.1;
    }
  }

  if (intent.wantsFamily) {
    if (FAMILY_BODIES.has(vehicle.bodyType) && vehicle.seats >= 5) {
      score += 0.12;
      reasons.push('Roomy family-friendly body with five seats.');
    }
    if ((vehicle.cargoLiters ?? 0) >= 500) {
      score += 0.05;
      reasons.push(`Big ${vehicle.cargoLiters} L boot for prams and luggage.`);
    }
  }

  if (intent.wantsCity && CITY_BODIES.has(vehicle.bodyType)) {
    score += 0.1;
    reasons.push('Compact footprint that is easy to park in the city.');
  }

  if (intent.wantsReliability && RELIABLE_MAKES.has(vehicle.make)) {
    score += 0.1;
    reasons.push(`${vehicle.make} has a strong reliability record.`);
  }

  if (intent.wantsCheapToRun) {
    if (vehicle.fuelType === 'ev' || vehicle.fuelType === 'hybrid') {
      score += 0.08;
      reasons.push('Low running costs per kilometre.');
    }
  }

  if (intent.wantsUsed && vehicle.condition === 'used') {
    score += 0.08;
    reasons.push('Available now as a used listing.');
  }
  if (intent.wantsNew && vehicle.condition === 'new') {
    score += 0.08;
    reasons.push('Factory new with full warranty.');
  }

  if ((vehicle.euroNcapStars ?? 0) === 5) score += 0.03;

  return {
    vehicle,
    score: Math.max(0, Math.min(1, score)),
    reasons: reasons.slice(0, 3),
  };
};

export const rankVehicles = (
  vehicles: Vehicle[],
  intent: PromptIntent,
  maxResults: number,
): ScoredVehicle[] =>
  vehicles
    .map((v) => scoreVehicle(v, intent))
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults)
    .filter((s) => s.score > 0.2);
