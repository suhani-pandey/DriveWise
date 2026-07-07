'use client';

import Link from 'next/link';

import { useBriefStore } from '@entities/user';
import { BODY_TYPE_LABELS, FUEL_TYPE_LABELS } from '@entities/vehicle';
import { useSavedList } from '@features/save-vehicle';
import { SectionLabel } from '@shared/ui';

const USAGE_LABELS: Record<string, string> = {
  commute: 'Daily commute',
  family: 'Family + road trips',
  leisure: 'Weekend leisure',
  business: 'Business / work',
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-hairline py-3 last:border-b-0">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="text-right text-sm font-medium">{value}</dd>
    </div>
  );
}

export function ProfileView() {
  const { brief, onboarded } = useBriefStore();
  const { data: saved } = useSavedList();

  return (
    <div className="space-y-8">
      <header className="flex items-center gap-4">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-ink/10 font-medium">
          MK
        </span>
        <div>
          <h1 className="font-display text-3xl sm:text-4xl">Account</h1>
          <p className="text-sm text-muted">Local profile · Free plan — sign-in coming soon</p>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="hairline rounded-xl bg-card p-6">
          <div className="flex items-baseline justify-between gap-3">
            <SectionLabel>Your brief</SectionLabel>
            {brief.updatedAt ? (
              <span className="text-xs text-muted">
                Updated {new Date(brief.updatedAt).toLocaleDateString('da-DK')}
              </span>
            ) : null}
          </div>

          {onboarded ? (
            <dl className="mt-3">
              <Row label="Use" value={brief.usage ? USAGE_LABELS[brief.usage] : '—'} />
              <Row
                label="Annual km"
                value={brief.annualKm ? `${brief.annualKm.toLocaleString('da-DK')} km` : '—'}
              />
              <Row
                label="Budget"
                value={
                  brief.budgetMaxDkk
                    ? `Up to ${Math.round(brief.budgetMaxDkk / 1000)}k kr.`
                    : '—'
                }
              />
              <Row
                label="Body"
                value={
                  brief.bodyTypes.length > 0
                    ? brief.bodyTypes.map((b) => BODY_TYPE_LABELS[b]).join(', ')
                    : 'Any'
                }
              />
              <Row
                label="Powertrain"
                value={
                  brief.fuelTypes.length > 0
                    ? brief.fuelTypes.map((f) => FUEL_TYPE_LABELS[f]).join(', ')
                    : 'Any'
                }
              />
            </dl>
          ) : (
            <p className="mt-3 text-sm text-muted">
              No brief yet. Answer five quick questions and AI recommendations get sharper.
            </p>
          )}

          <Link
            href="/onboarding"
            className="mt-4 inline-block rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper"
          >
            {onboarded ? 'Update brief' : 'Create brief'}
          </Link>
        </section>

        <section className="hairline rounded-xl bg-card p-6">
          <SectionLabel>Overview</SectionLabel>
          <dl className="mt-3">
            <Row label="Saved vehicles" value={`${saved?.items.length ?? 0}`} />
            <Row label="Region" value="Denmark · DKK" />
            <Row label="Units" value="km / kWh" />
            <Row label="Language" value="English (Danish market)" />
            <Row label="Theme" value="Clarity · light" />
          </dl>
          <p className="mt-4 text-xs leading-relaxed text-muted">
            Your brief, saved list and comparison live in this browser. Account sync (Clerk)
            is on the roadmap — nothing is shared until then.
          </p>
        </section>
      </div>
    </div>
  );
}
