import { CompareTray } from '@widgets/compare-tray';
import { MobileTabBar } from './mobile-tab-bar';
import { Sidebar } from './sidebar';

/**
 * Responsive shell: persistent sidebar ≥ lg, labeled bottom tab bar below.
 * Content gets bottom padding on mobile so the tab bar never covers it.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <MobileTabBar />
      <main className="px-4 pb-24 pt-6 sm:px-6 lg:ml-60 lg:px-10 lg:pb-12">
        <div className="mx-auto max-w-content">{children}</div>
      </main>
      <CompareTray />
    </div>
  );
}
