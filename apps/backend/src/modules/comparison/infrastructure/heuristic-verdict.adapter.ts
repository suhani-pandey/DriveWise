import { Injectable } from '@nestjs/common';
import type { ComparisonSection, ComparisonVerdict, Vehicle } from '@drivewise/contracts';

import { countWins } from '../domain/comparison-table';
import type { VerdictGeneratorPort } from '../domain/verdict.port';

/**
 * Deterministic verdict: weighs best-in-row wins, then breaks ties on price.
 * Replace via VERDICT_GENERATOR binding with an LLM adapter for richer prose.
 */
@Injectable()
export class HeuristicVerdictAdapter implements VerdictGeneratorPort {
  async generate(
    vehicles: Vehicle[],
    sections: ComparisonSection[],
  ): Promise<ComparisonVerdict> {
    const wins = countWins(sections, vehicles.length);
    const maxWins = Math.max(...wins);
    const leaders = vehicles.filter((_, i) => wins[i] === maxWins);
    const winner = leaders.reduce((a, b) => (a.priceDkk <= b.priceDkk ? a : b));
    const winnerIndex = vehicles.indexOf(winner);

    const runnerUp = vehicles
      .filter((_, i) => i !== winnerIndex)
      .reduce((a, b) => (wins[vehicles.indexOf(a)] >= wins[vehicles.indexOf(b)] ? a : b));

    const strengths: string[] = [];
    for (const section of sections) {
      for (const row of section.rows) {
        if (row.bestIndex === winnerIndex) strengths.push(row.label.toLowerCase());
      }
    }
    const topStrengths = strengths.slice(0, 3).join(', ');

    const text =
      `The ${winner.make} ${winner.model} leads this comparison with ${wins[winnerIndex]} ` +
      `best-in-row results${topStrengths ? ` — strongest on ${topStrengths}` : ''}. ` +
      `The ${runnerUp.make} ${runnerUp.model} is the closest alternative; ` +
      `pick it if its stronger rows matter more to how you drive.`;

    return {
      recommendedVehicleId: winner.id,
      text,
      strategy: 'heuristic',
    };
  }
}
