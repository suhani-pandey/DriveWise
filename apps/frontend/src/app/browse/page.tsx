import type { Metadata } from 'next';
import { Suspense } from 'react';

import { BrowseView } from './browse-view';

export const metadata: Metadata = { title: 'Browse' };

export default function BrowsePage() {
  return (
    <Suspense>
      <BrowseView />
    </Suspense>
  );
}
