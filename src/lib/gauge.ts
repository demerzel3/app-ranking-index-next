import { getLatest24HAverage, getLatestEntry, HistoryEntry } from './database';
import { sortByRanking } from './sortByRanking';
import { ExchangeName } from './types';

type GaugeProps = {
  index: number;
  rankedExchanges: { name: ExchangeName; ranking: number | null }[];
};

export const getLatestGaugeProps = async (): Promise<GaugeProps | undefined> => {
  const [index, latestEntry] = await Promise.all([getLatest24HAverage(), getLatestEntry()]);

  if (!latestEntry) {
    console.error('Failed to retrieve the latest entry from the database');
    return undefined;
  }

  return getGaugeProps(index, latestEntry);
};

export const getGaugeProps = (indexFloat: number, entry: HistoryEntry): GaugeProps => {
  return {
    index: Math.round(indexFloat * 100),
    rankedExchanges: sortByRanking(entry.details)
      .slice(0, 5)
      .map(({ name, ranking }) => ({ name, ranking })),
  };
};

export const gaugePropsToCacheKey = ({ index, rankedExchanges }: GaugeProps) => {
  return Buffer.from(
    JSON.stringify([index, ...rankedExchanges.flatMap(({ name, ranking }) => [ranking, name])])
  ).toString('base64');
};

export const cacheKeyToGaugeProps = (cacheKey: string): GaugeProps | undefined => {
  try {
    const [index, ...rankedExchangePairs] = JSON.parse(Buffer.from(cacheKey, 'base64').toString('utf-8')) as [
      GaugeProps['index'],
      [string | number | null]
    ];

    const rankedExchanges: GaugeProps['rankedExchanges'] = [];
    while (rankedExchangePairs.length) {
      const ranking = rankedExchangePairs.shift();
      const name = rankedExchangePairs.shift();
      if (typeof ranking !== 'number' && ranking !== null) {
        throw new Error('Invalid ranking');
      }
      if (typeof name !== 'string') {
        throw new Error('Invalid name');
      }
      rankedExchanges.push({ name, ranking });
    }

    return {
      index,
      rankedExchanges,
    };
  } catch (e: unknown) {
    if (e && typeof e === 'object' && 'message' in e) {
      console.log(e.message);
    } else {
      console.log('Unable to parse cache key');
    }
    return undefined;
  }
};
