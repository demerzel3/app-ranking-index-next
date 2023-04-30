import './noBackground.css';

import GaugeWidget from '@/components/GaugeWidget';
import { getLatest24HAverage, getLatestEntry } from '@/lib/database';

import { sortByRanking } from '../../lib/sortByRanking';

export const revalidate = 3600; // 1 hour

export default async function CurrentGaugePage() {
  const [index, latestEntry] = await Promise.all([getLatest24HAverage(), getLatestEntry()]);

  const rankedExchanges = sortByRanking(latestEntry?.details ?? []);

  return <GaugeWidget index={Math.round(index * 100)} rankedExchanges={rankedExchanges} />;
}
