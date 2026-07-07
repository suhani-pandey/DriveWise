import type { Metadata } from 'next';

import { OnboardingView } from './onboarding-view';

export const metadata: Metadata = { title: 'Your brief' };

export default function OnboardingPage() {
  return <OnboardingView />;
}
