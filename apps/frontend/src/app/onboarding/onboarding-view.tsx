'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { BodyType, FuelType, UsageProfile } from '@drivewise/contracts';

import { useBriefStore } from '@entities/user';
import { BODY_TYPE_LABELS, FUEL_TYPE_LABELS } from '@entities/vehicle';
import { Button, Chip, SectionLabel, Slider } from '@shared/ui';

/**
 * Five-step brief: usage, distance, budget, body, powertrain.
 * One question per screen — the single obvious next step, per the design.
 */

const USAGE_OPTIONS: Array<{ value: UsageProfile; label: string; hint: string }> = [
  { value: 'commute', label: 'Daily commute', hint: 'Efficiency and comfort first' },
  { value: 'family', label: 'Family + road trips', hint: 'Space, safety and range' },
  { value: 'leisure', label: 'Weekend leisure', hint: 'Fun matters more than volume' },
  { value: 'business', label: 'Business / work', hint: 'Refinement and image' },
];

const BUDGET_STEPS = [100, 150, 200, 250, 300, 350, 400, 450, 500, 600, 700] as const;

const TOTAL_STEPS = 5;

export function OnboardingView() {
  const router = useRouter();
  const { brief, setBrief, completeOnboarding } = useBriefStore();
  const [step, setStep] = useState(1);

  const [usage, setUsage] = useState<UsageProfile | null>(brief.usage);
  const [annualKm, setAnnualKm] = useState(brief.annualKm ?? 20000);
  const [budgetMaxK, setBudgetMaxK] = useState(
    brief.budgetMaxDkk ? Math.round(brief.budgetMaxDkk / 1000) : 400,
  );
  const [bodyTypes, setBodyTypes] = useState<BodyType[]>(brief.bodyTypes);
  const [fuelTypes, setFuelTypes] = useState<FuelType[]>(brief.fuelTypes);

  const toggle = <T,>(list: T[], value: T): T[] =>
    list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

  const finish = () => {
    setBrief({
      usage,
      annualKm,
      budgetMinDkk: null,
      budgetMaxDkk: budgetMaxK * 1000,
      bodyTypes,
      fuelTypes,
    });
    completeOnboarding();
    router.push('/browse');
  };

  const next = () => (step === TOTAL_STEPS ? finish() : setStep(step + 1));
  const back = () => setStep(Math.max(1, step - 1));

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col justify-center py-8">
      <SectionLabel>
        Step {step} of {TOTAL_STEPS} · Your brief
      </SectionLabel>

      {step === 1 ? (
        <StepShell
          title="How will you mostly use the car?"
          subtitle="Pick the closest. We'll weight range, cabin space and acceleration accordingly."
        >
          <div className="grid gap-2 sm:grid-cols-2">
            {USAGE_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setUsage(option.value)}
                aria-pressed={usage === option.value}
                className={`hairline rounded-xl p-4 text-left transition-colors ${
                  usage === option.value
                    ? 'border-accent bg-accent-soft'
                    : 'bg-card hover:border-accent'
                }`}
              >
                <p className="font-medium">{option.label}</p>
                <p className="mt-0.5 text-xs text-muted">{option.hint}</p>
              </button>
            ))}
          </div>
        </StepShell>
      ) : null}

      {step === 2 ? (
        <StepShell
          title="How far in a year?"
          subtitle="This drives the cost calculator and range recommendations."
        >
          <Slider
            label="Annual distance"
            value={annualKm}
            onValueChange={setAnnualKm}
            min={5000}
            max={50000}
            step={1000}
            valueLabel={`${annualKm.toLocaleString('da-DK')} km`}
          />
        </StepShell>
      ) : null}

      {step === 3 ? (
        <StepShell title="What's the budget?" subtitle="Cash price ceiling, in Danish kroner.">
          <Slider
            label="Max budget"
            value={BUDGET_STEPS.indexOf(
              BUDGET_STEPS.find((b) => b >= budgetMaxK) ?? BUDGET_STEPS[BUDGET_STEPS.length - 1],
            )}
            onValueChange={(index) => setBudgetMaxK(BUDGET_STEPS[index])}
            min={0}
            max={BUDGET_STEPS.length - 1}
            step={1}
            valueLabel={`${budgetMaxK}.000 kr.`}
          />
        </StepShell>
      ) : null}

      {step === 4 ? (
        <StepShell title="Any body preference?" subtitle="Pick as many as you like — or skip.">
          <div className="flex flex-wrap gap-1.5">
            {(Object.keys(BODY_TYPE_LABELS) as BodyType[]).map((body) => (
              <Chip
                key={body}
                selected={bodyTypes.includes(body)}
                onClick={() => setBodyTypes((prev) => toggle(prev, body))}
              >
                {BODY_TYPE_LABELS[body]}
              </Chip>
            ))}
          </div>
        </StepShell>
      ) : null}

      {step === 5 ? (
        <StepShell title="And the powertrain?" subtitle="Pick as many as you like — or skip.">
          <div className="flex flex-wrap gap-1.5">
            {(Object.keys(FUEL_TYPE_LABELS) as FuelType[]).map((fuel) => (
              <Chip
                key={fuel}
                selected={fuelTypes.includes(fuel)}
                onClick={() => setFuelTypes((prev) => toggle(prev, fuel))}
              >
                {FUEL_TYPE_LABELS[fuel]}
              </Chip>
            ))}
          </div>
        </StepShell>
      ) : null}

      <div className="mt-8 flex items-center justify-between">
        <Button variant="ghost" onClick={back} disabled={step === 1}>
          Back
        </Button>
        <Button onClick={next} disabled={step === 1 && usage === null}>
          {step === TOTAL_STEPS ? 'Finish → Browse' : 'Continue'}
        </Button>
      </div>
    </div>
  );
}

function StepShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-3">
      <h1 className="font-display text-3xl sm:text-4xl">{title}</h1>
      <p className="mt-2 text-sm text-muted">{subtitle}</p>
      <div className="mt-6">{children}</div>
    </div>
  );
}
