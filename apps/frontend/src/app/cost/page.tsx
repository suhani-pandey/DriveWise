import type { Metadata } from 'next';

import { CostView } from './cost-view';

export const metadata: Metadata = { title: 'Cost calculator' };

export default function CostPage() {
  return <CostView />;
}
