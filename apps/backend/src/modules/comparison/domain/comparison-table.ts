import type { ComparisonRow, ComparisonSection, Vehicle } from '@drivewise/contracts';

/**
 * Pure builder for the side-by-side comparison table.
 * Each row declares which direction wins so the UI can highlight the best
 * value per row (green in the Clarity design).
 */

type Better = 'min' | 'max' | null;

interface RowDef {
  key: string;
  label: string;
  better: Better;
  value: (v: Vehicle) => number | null;
  format: (raw: number | null, v: Vehicle) => string | null;
}

const dkk = (n: number): string => `${new Intl.NumberFormat('da-DK').format(n)} kr.`;

const SECTIONS: Array<{ title: string; rows: RowDef[] }> = [
  {
    title: 'Price',
    rows: [
      {
        key: 'price',
        label: 'Sticker price',
        better: 'min',
        value: (v) => v.priceDkk,
        format: (raw) => (raw === null ? null : dkk(raw)),
      },
      {
        key: 'lease',
        label: 'Monthly lease',
        better: 'min',
        value: (v) => v.monthlyLeaseDkk,
        format: (raw) => (raw === null ? null : `${dkk(raw)} / mo`),
      },
    ],
  },
  {
    title: 'Range & charging',
    rows: [
      {
        key: 'range',
        label: 'WLTP range',
        better: 'max',
        value: (v) => v.evRangeKm,
        format: (raw) => (raw === null ? null : `${raw} km`),
      },
      {
        key: 'battery',
        label: 'Battery',
        better: 'max',
        value: (v) => v.batteryKwh,
        format: (raw) => (raw === null ? null : `${raw} kWh`),
      },
      {
        key: 'charge',
        label: '10 → 80 %',
        better: 'min',
        value: (v) => v.chargeMinutes10To80,
        format: (raw) => (raw === null ? null : `${raw} min`),
      },
      {
        key: 'dcPeak',
        label: 'DC peak',
        better: 'max',
        value: (v) => v.dcChargeKw,
        format: (raw) => (raw === null ? null : `${raw} kW`),
      },
      {
        key: 'consumption',
        label: 'Consumption',
        better: 'min',
        value: (v) => v.consumptionKwhPer100Km ?? v.consumptionLPer100Km,
        format: (raw, v) =>
          raw === null
            ? null
            : v.consumptionKwhPer100Km !== null
              ? `${raw} kWh/100 km`
              : `${raw} l/100 km`,
      },
    ],
  },
  {
    title: 'Performance',
    rows: [
      {
        key: 'acceleration',
        label: '0–100 km/h',
        better: 'min',
        value: (v) => v.accelerationSec0To100,
        format: (raw) => (raw === null ? null : `${raw} s`),
      },
      {
        key: 'topSpeed',
        label: 'Top speed',
        better: 'max',
        value: (v) => v.topSpeedKmh,
        format: (raw) => (raw === null ? null : `${raw} km/h`),
      },
    ],
  },
  {
    title: 'Practicality',
    rows: [
      {
        key: 'cargo',
        label: 'Cargo',
        better: 'max',
        value: (v) => v.cargoLiters,
        format: (raw) => (raw === null ? null : `${raw} L`),
      },
      {
        key: 'seats',
        label: 'Seats',
        better: 'max',
        value: (v) => v.seats,
        format: (raw) => (raw === null ? null : `${raw}`),
      },
    ],
  },
  {
    title: 'History & safety',
    rows: [
      {
        key: 'year',
        label: 'Model year',
        better: 'max',
        value: (v) => v.year,
        format: (raw) => (raw === null ? null : `${raw}`),
      },
      {
        key: 'mileage',
        label: 'Mileage',
        better: 'min',
        value: (v) => v.mileageKm,
        format: (raw, v) =>
          v.condition === 'new'
            ? 'New'
            : raw === null
              ? null
              : `${new Intl.NumberFormat('da-DK').format(raw)} km`,
      },
      {
        key: 'ncap',
        label: 'Euro NCAP',
        better: 'max',
        value: (v) => v.euroNcapStars,
        format: (raw) => (raw === null ? null : `${raw} ★`),
      },
    ],
  },
];

const bestIndexFor = (values: Array<number | null>, better: Better): number | null => {
  if (better === null) return null;
  const present = values
    .map((value, index) => ({ value, index }))
    .filter((entry): entry is { value: number; index: number } => entry.value !== null);
  if (present.length < 2) return null;

  const bestValue =
    better === 'min'
      ? Math.min(...present.map((e) => e.value))
      : Math.max(...present.map((e) => e.value));
  const winners = present.filter((e) => e.value === bestValue);
  return winners.length === 1 ? winners[0].index : null; // ties: no highlight
};

export const buildComparisonSections = (vehicles: Vehicle[]): ComparisonSection[] =>
  SECTIONS.map((section) => ({
    title: section.title,
    rows: section.rows
      .map((def): ComparisonRow => {
        const rawValues = vehicles.map((v) => def.value(v));
        return {
          key: def.key,
          label: def.label,
          values: vehicles.map((v, i) => def.format(rawValues[i], v)),
          bestIndex: bestIndexFor(rawValues, def.better),
        };
      })
      // Hide rows where no vehicle has data (e.g. EV rows for petrol-only sets).
      .filter((row) => row.values.some((value) => value !== null)),
  })).filter((section) => section.rows.length > 0);

/** Count of green "best in row" wins per vehicle — used by the verdict. */
export const countWins = (sections: ComparisonSection[], vehicleCount: number): number[] => {
  const wins = new Array<number>(vehicleCount).fill(0);
  for (const section of sections) {
    for (const row of section.rows) {
      if (row.bestIndex !== null) wins[row.bestIndex] += 1;
    }
  }
  return wins;
};
