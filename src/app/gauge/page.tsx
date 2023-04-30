import GaugeWidget from '@/components/GaugeWidget';
import { getLatest24HAverage, getLatestEntry } from '@/lib/database';

export const revalidate = 3600; // 1 hour

export default async function CurrentGaugePage() {
  const [index, latestEntry] = await Promise.all([getLatest24HAverage(), getLatestEntry()]);

  const rankedExchanges = [...(latestEntry?.details ?? [])].sort((det1, det2) => {
    if (det2.ranking === null && det1.ranking !== null) {
      return -1;
    }
    if (det1.ranking === null && det2.ranking !== null) {
      return 1;
    }
    if (det1.ranking === null && det2.ranking === null) {
      return det2.weight - det1.weight;
    }

    return det1.ranking! - det2.ranking!;
  });

  return <GaugeWidget index={Math.round(index * 100)} rankedExchanges={rankedExchanges} />;
}