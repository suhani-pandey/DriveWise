import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { PlateLookupResult } from '@drivewise/contracts';

import {
  ExternalProviderError,
  ProviderNotConfiguredError,
} from '../../../../shared/errors/app-error';
import type { PlateLookupPort } from '../../domain/plate-lookup.port';

interface NrpladeResponse {
  data?: {
    registration?: string;
    make?: string;
    model?: string;
    variant?: string;
    first_registration_date?: string;
    fuel_type?: string;
    inspection?: { date?: string } | null;
  };
}

/**
 * Danish number-plate lookup via nrpla.de (a commercial gateway to the
 * official Motorregister/DMR data). Requires NRPLADE_API_TOKEN — get one at
 * https://nrpla.de. Without a token the endpoint returns 503 with guidance.
 */
@Injectable()
export class NrpladePlateLookupAdapter implements PlateLookupPort {
  constructor(private readonly config: ConfigService) {}

  async lookup(plate: string): Promise<PlateLookupResult> {
    const token = this.config.get<string>('NRPLADE_API_TOKEN');
    if (!token) {
      throw new ProviderNotConfiguredError(
        'Danish plate lookup (nrpla.de)',
        'Set NRPLADE_API_TOKEN in apps/backend/.env — see https://nrpla.de for a key.',
      );
    }

    const baseUrl = this.config.get<string>('NRPLADE_BASE_URL') ?? 'https://api.nrpla.de';
    const url = `${baseUrl}/${encodeURIComponent(plate)}?api_token=${encodeURIComponent(token)}`;

    let response: Response;
    try {
      response = await fetch(url, { signal: AbortSignal.timeout(10_000) });
    } catch (error) {
      throw new ExternalProviderError('nrpla.de', `request failed: ${(error as Error).message}`);
    }
    if (!response.ok) {
      throw new ExternalProviderError('nrpla.de', `responded with HTTP ${response.status}`);
    }

    const body = (await response.json()) as NrpladeResponse;
    const data = body.data ?? {};
    return {
      plate,
      make: data.make ?? null,
      model: data.model ?? null,
      variant: data.variant ?? null,
      firstRegistration: data.first_registration_date ?? null,
      fuelType: data.fuel_type ?? null,
      inspectionDueDate: data.inspection?.date ?? null,
      provider: 'nrpla.de',
    };
  }
}
