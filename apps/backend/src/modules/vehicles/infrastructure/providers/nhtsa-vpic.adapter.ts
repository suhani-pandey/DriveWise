import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { VinLookupResult } from '@drivewise/contracts';

import { ExternalProviderError } from '../../../../shared/errors/app-error';
import type { VinDecoderPort } from '../../domain/vin-decoder.port';

interface VpicDecodeResponse {
  Results?: Array<Record<string, string | null>>;
}

/**
 * NHTSA vPIC — free, keyless VIN decoding API run by the US DOT.
 * https://vpic.nhtsa.dot.gov/api/
 */
@Injectable()
export class NhtsaVpicAdapter implements VinDecoderPort {
  constructor(private readonly config: ConfigService) {}

  async decode(vin: string): Promise<VinLookupResult> {
    const baseUrl = this.config.get<string>('VPIC_BASE_URL') ?? 'https://vpic.nhtsa.dot.gov/api';
    const url = `${baseUrl}/vehicles/DecodeVinValues/${encodeURIComponent(vin)}?format=json`;

    let response: Response;
    try {
      response = await fetch(url, { signal: AbortSignal.timeout(10_000) });
    } catch (error) {
      throw new ExternalProviderError('NHTSA vPIC', `request failed: ${(error as Error).message}`);
    }
    if (!response.ok) {
      throw new ExternalProviderError('NHTSA vPIC', `responded with HTTP ${response.status}`);
    }

    const body = (await response.json()) as VpicDecodeResponse;
    const result = body.Results?.[0] ?? {};
    const orNull = (value: string | null | undefined): string | null =>
      value && value.trim().length > 0 ? value : null;

    return {
      vin,
      make: orNull(result['Make']),
      model: orNull(result['Model']),
      modelYear: orNull(result['ModelYear']),
      bodyClass: orNull(result['BodyClass']),
      fuelType: orNull(result['FuelTypePrimary']),
      provider: 'nhtsa-vpic',
    };
  }
}
