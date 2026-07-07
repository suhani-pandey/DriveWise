import { Inject, Injectable } from '@nestjs/common';
import type { PlateLookupResult, VinLookupResult } from '@drivewise/contracts';

import { PLATE_LOOKUP, type PlateLookupPort } from '../domain/plate-lookup.port';
import { VIN_DECODER, type VinDecoderPort } from '../domain/vin-decoder.port';

/** Lookups against external registries: VIN (NHTSA vPIC) and Danish plates. */
@Injectable()
export class LookupExternalUseCase {
  constructor(
    @Inject(VIN_DECODER) private readonly vinDecoder: VinDecoderPort,
    @Inject(PLATE_LOOKUP) private readonly plateLookup: PlateLookupPort,
  ) {}

  async byVin(vin: string): Promise<VinLookupResult> {
    return this.vinDecoder.decode(vin);
  }

  async byPlate(plate: string): Promise<PlateLookupResult> {
    return this.plateLookup.lookup(plate);
  }
}
