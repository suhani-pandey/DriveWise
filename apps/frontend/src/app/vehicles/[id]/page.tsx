import type { Metadata } from 'next';

import { VehicleDetailView } from './vehicle-detail-view';

export const metadata: Metadata = { title: 'Vehicle' };

export default async function VehicleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <VehicleDetailView vehicleId={id} />;
}
