import type { BodyType, FuelType, UserBrief } from '@drivewise/contracts';

/**
 * Lightweight natural-language intent extraction for vehicle questions,
 * tuned for the Danish market ("under 250k", "familiebil", "EV", …).
 * Pure and unit-testable; the LLM adapter can bypass it entirely.
 */

export interface PromptIntent {
  maxPriceDkk: number | null;
  minPriceDkk: number | null;
  bodyTypes: BodyType[];
  fuelTypes: FuelType[];
  wantsLongRange: boolean;
  wantsFamily: boolean;
  wantsCity: boolean;
  wantsReliability: boolean;
  wantsCheapToRun: boolean;
  wantsUsed: boolean;
  wantsNew: boolean;
}

const BODY_KEYWORDS: Array<[RegExp, BodyType]> = [
  [/\bsuv\b/i, 'suv'],
  [/\bcrossover\b/i, 'crossover'],
  [/\bsedan\b/i, 'sedan'],
  [/\bhatchback\b/i, 'hatchback'],
  [/\b(stationcar|station wagon|estate|kombi)\b/i, 'stationcar'],
  [/\b(van|kassevogn)\b/i, 'van'],
];

const FUEL_KEYWORDS: Array<[RegExp, FuelType]> = [
  [/\b(ev|electric|elbil|el-bil)\b/i, 'ev'],
  [/\b(plug-?in|phev|opladningshybrid)\b/i, 'phev'],
  [/\bhybrid\b/i, 'hybrid'],
  [/\b(petrol|benzin|gasoline)\b/i, 'petrol'],
  [/\bdiesel\b/i, 'diesel'],
];

/** Parses "250k", "250.000", "250000 kr" style amounts into DKK. */
const parseAmountDkk = (raw: string): number => {
  const cleaned = raw.replace(/[.,\s]/g, '');
  if (/k$/i.test(raw.trim())) return Number(cleaned.replace(/k$/i, '')) * 1000;
  const value = Number(cleaned);
  return value < 10000 ? value * 1000 : value; // "350" in a car context means 350k
};

export const parsePromptIntent = (prompt: string, brief?: UserBrief): PromptIntent => {
  const under = prompt.match(/\b(?:under|below|max|op til|højst)\s+([\d.,]+\s?k?)\b/i);
  const over = prompt.match(/\b(?:over|above|min|mindst|from|fra)\s+([\d.,]+\s?k?)\b/i);

  const bodyTypes = BODY_KEYWORDS.filter(([re]) => re.test(prompt)).map(([, b]) => b);
  const fuelTypes = FUEL_KEYWORDS.filter(([re]) => re.test(prompt)).map(([, f]) => f);

  const wantsFamily = /\b(famil|kids|børn|children|room|spacious|plads)/i.test(prompt);

  return {
    maxPriceDkk: under ? parseAmountDkk(under[1]) : (brief?.budgetMaxDkk ?? null),
    minPriceDkk: over ? parseAmountDkk(over[1]) : (brief?.budgetMinDkk ?? null),
    bodyTypes: bodyTypes.length > 0 ? bodyTypes : (brief?.bodyTypes ?? []),
    fuelTypes: fuelTypes.length > 0 ? fuelTypes : (brief?.fuelTypes ?? []),
    wantsLongRange:
      /\b(long[- ]?(distance|range)|motorway|highway|langtur|rækkevidde|road ?trip)\b/i.test(
        prompt,
      ),
    wantsFamily,
    wantsCity: /\b(city|urban|byen|bykørsel|park|small)/i.test(prompt),
    wantsReliability: /\b(reliab|driftsikker|dependab|pålidelig)/i.test(prompt),
    wantsCheapToRun: /\b(cheap|billig|økonomisk|economical|low cost|budget)/i.test(prompt),
    wantsUsed: /\b(used|brugt|second[- ]?hand)\b/i.test(prompt),
    wantsNew: /\b(new|ny|fabriksny)\b/i.test(prompt),
  };
};
