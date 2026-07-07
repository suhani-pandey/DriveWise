import type { Metadata } from 'next';

import { SavedView } from './saved-view';

export const metadata: Metadata = { title: 'Saved' };

export default function SavedPage() {
  return <SavedView />;
}
