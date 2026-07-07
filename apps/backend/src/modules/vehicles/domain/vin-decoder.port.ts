import type { VinLookupResult } from '@drivewise/contracts';

/** Port for decoding a VIN via an external provider (bound to NHTSA vPIC). */
export const VIN_DECODER = Symbol('VIN_DECODER');

export interface VinDecoderPort {
  decode(vin: string): Promise<VinLookupResult>;
}
