import './noBackground.css';

import { redirect } from 'next/navigation';

import { gaugePropsToCacheKey, getLatestGaugeProps } from '@/lib/gauge';

export const revalidate = 3600; // 1 hour

export default async function LatestGaugePage() {
  const props = await getLatestGaugeProps();

  if (!props) {
    return null;
  }

  redirect(`/gauge/${encodeURIComponent(gaugePropsToCacheKey(props))}`);
}
