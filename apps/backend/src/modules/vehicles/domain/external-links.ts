import type { Condition, ExternalLink } from '@drivewise/contracts';

/**
 * Builds outbound links for a vehicle: the manufacturer's Danish site for
 * full specs/configurator, plus Danish marketplace deep links (Bilbasen, DBA)
 * for used listings. DriveWise shows a summary and redirects here for the rest.
 */

const MANUFACTURER_SITES: Record<string, string> = {
  audi: 'https://www.audi.dk',
  bmw: 'https://www.bmw.dk',
  cupra: 'https://www.cupraofficial.dk',
  ford: 'https://www.ford.dk',
  hyundai: 'https://www.hyundai.com/dk/da',
  kia: 'https://www.kia.com/dk',
  'mercedes-benz': 'https://www.mercedes-benz.dk',
  mg: 'https://www.mgmotor.dk',
  peugeot: 'https://www.peugeot.dk',
  polestar: 'https://www.polestar.com/da-dk',
  renault: 'https://www.renault.dk',
  skoda: 'https://www.skoda.dk',
  škoda: 'https://www.skoda.dk',
  tesla: 'https://www.tesla.com/da_dk',
  toyota: 'https://www.toyota.dk',
  volkswagen: 'https://www.volkswagen.dk',
  volvo: 'https://www.volvocars.com/dk',
};

export const buildExternalLinks = (
  make: string,
  model: string,
  condition: Condition,
): ExternalLink[] => {
  const links: ExternalLink[] = [];
  const manufacturerUrl = MANUFACTURER_SITES[make.toLowerCase()];
  if (manufacturerUrl) {
    links.push({
      kind: 'manufacturer',
      label: `${make}.com`,
      url: manufacturerUrl,
    });
  }

  const query = encodeURIComponent(`${make} ${model}`);
  if (condition === 'used') {
    links.push(
      {
        kind: 'marketplace',
        label: 'Bilbasen.dk',
        url: `https://www.bilbasen.dk/brugt/bil?free=${query}`,
      },
      {
        kind: 'marketplace',
        label: 'DBA.dk',
        url: `https://www.dba.dk/soeg/?soeg=${query}`,
      },
    );
  } else {
    links.push({
      kind: 'marketplace',
      label: 'Bilbasen.dk',
      url: `https://www.bilbasen.dk/brugt/bil?free=${query}`,
    });
  }
  return links;
};
