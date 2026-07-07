import type { PlateLookupResult } from '@drivewise/contracts';

/**
 * Port for Danish number-plate lookups against Motorregister data.
 * Bound to the nrpla.de adapter; requires NRPLADE_API_TOKEN.
 */
export const PLATE_LOOKUP = Symbol('PLATE_LOOKUP');

export interface PlateLookupPort {
  lookup(plate: string): Promise<PlateLookupResult>;
}
