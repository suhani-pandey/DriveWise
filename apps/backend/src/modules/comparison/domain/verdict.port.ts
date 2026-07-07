import type { ComparisonSection, ComparisonVerdict, Vehicle } from '@drivewise/contracts';

/**
 * Port for generating the comparison verdict. Bound to a heuristic adapter by
 * default; an LLM-backed adapter can replace it without touching the use case.
 */
export const VERDICT_GENERATOR = Symbol('VERDICT_GENERATOR');

export interface VerdictGeneratorPort {
  generate(vehicles: Vehicle[], sections: ComparisonSection[]): Promise<ComparisonVerdict>;
}
