'use client';

import Link from 'next/link';
import { useState, type FormEvent } from 'react';

import { useBriefStore } from '@entities/user';
import { formatDkkShort } from '@shared/lib/format';
import { Button, SectionLabel, Skeleton } from '@shared/ui';
import { useAskRecommendation } from '../api/recommendation-api';

const EXAMPLE_PROMPTS = [
  'Best SUV under 250k?',
  'Good family car for Denmark?',
  'Reliable hybrid car?',
  'Best EV for long-distance travel?',
];

/**
 * "Ask AI" lives right on the Browse page (per the design): describe how
 * you'll drive and get a shortlist with reasons — no separate chat page.
 */
export function AskAiPanel() {
  const [prompt, setPrompt] = useState('');
  const brief = useBriefStore((s) => s.brief);
  const ask = useAskRecommendation();

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = prompt.trim();
    if (trimmed.length < 3 || ask.isPending) return;
    ask.mutate({ prompt: trimmed, maxResults: 4, brief });
  };

  return (
    <section
      aria-label="Ask AI for a recommendation"
      className="hairline rounded-xl bg-card p-5"
    >
      <SectionLabel>Ask AI</SectionLabel>
      <p className="mt-1 font-display text-xl">Describe how you&apos;ll drive.</p>

      <form onSubmit={submit} className="mt-3 flex flex-col gap-2 sm:flex-row">
        <input
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          placeholder="e.g. Family EV for 25.000 km a year, under 400k…"
          aria-label="Describe what you need"
          className="hairline h-11 w-full rounded-full bg-paper px-4 text-sm placeholder:text-muted focus:border-accent"
        />
        <Button type="submit" disabled={ask.isPending || prompt.trim().length < 3}>
          {ask.isPending ? 'Thinking…' : 'Shortlist for me'}
        </Button>
      </form>

      {!ask.data && !ask.isPending ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {EXAMPLE_PROMPTS.map((example) => (
            <button
              key={example}
              type="button"
              onClick={() => setPrompt(example)}
              className="rounded-full bg-paper px-3 py-1 text-xs text-muted hairline hover:text-accent-dark"
            >
              {example}
            </button>
          ))}
        </div>
      ) : null}

      {ask.isPending ? (
        <div className="mt-4 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-16 w-full" />
        </div>
      ) : null}

      {ask.isError ? (
        <p role="alert" className="mt-4 text-sm text-red-700">
          Could not reach the recommendation service. Is the API running?
        </p>
      ) : null}

      {ask.data ? (
        <div className="mt-4 space-y-3">
          <p className="text-sm leading-relaxed">{ask.data.answer}</p>
          <ul className="space-y-2">
            {ask.data.results.map(({ vehicle, reasons }) => (
              <li key={vehicle.id} className="hairline rounded-lg bg-paper p-3">
                <div className="flex items-baseline justify-between gap-3">
                  <Link
                    href={`/vehicles/${vehicle.id}`}
                    className="font-medium underline-offset-4 hover:underline"
                  >
                    {vehicle.make} {vehicle.model}
                  </Link>
                  <span className="font-display text-lg">
                    {formatDkkShort(vehicle.priceDkk)}
                  </span>
                </div>
                {reasons.length > 0 ? (
                  <p className="mt-1 text-xs text-muted">{reasons.join(' · ')}</p>
                ) : null}
              </li>
            ))}
          </ul>
          <p className="text-xs text-muted">
            {ask.data.strategy === 'ai'
              ? 'Answer written by AI over DriveWise data.'
              : 'Matched with DriveWise scoring — connect an OpenAI key for richer answers.'}
          </p>
        </div>
      ) : null}
    </section>
  );
}
