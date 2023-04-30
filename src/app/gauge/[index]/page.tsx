import GaugeWidget from '@/components/GaugeWidget';
import { calculate24hRollingAverage } from '@/lib/data';
import { readHistory } from '@/lib/database';
import { ExchangeName } from '@/lib/types';

const getHistoryData = async () => {
  const thirtyDaysAgo = Math.floor(Date.now() / 1000) - 30 * 24 * 3600;
  const records = await readHistory({
    fromTime: thirtyDaysAgo,
  });

  return records.map((entry) => ({
    ...entry,
    // Round the time to the hour
    time: Math.floor(entry.time / 3600) * 3600,
  }));
};

const fetchData = async () => {
  const historyData = await getHistoryData();
  const rankingByApp: Record<ExchangeName, { time: number; value: number }[]> = {
    binance: [],
    bitfinex: [],
    bybit: [],
    coinbase: [],
    cryptocom: [],
    gemini: [],
    huobi: [],
    kraken: [],
    kucoin: [],
    okx: [],
  };

  historyData.forEach((item) => {
    item.details.forEach((detail) => {
      rankingByApp[detail.name].push({
        time: item.time,
        value: detail.ranking ?? 200,
      });
    });
  });

  const rankingByApp24hRollingAverage = Object.entries(rankingByApp).reduce((acc, [exchange, entries]) => {
    acc[exchange as ExchangeName] = calculate24hRollingAverage(entries).map(({ time, value }) => ({
      x: time,
      y: value,
    }));

    return acc;
  }, {} as Record<ExchangeName, { x: number; y: number }[]>);

  const xAxis = {
    min: historyData[0].time - 10_000,
    max: historyData[historyData.length - 1].time + 10_000,
  };

  return { rankingByApp: rankingByApp24hRollingAverage, xAxis };
};

export const revalidate = 3600; // 1 hour

export default async function GaugePage({ params }: { params: { index: string } }) {
  const { index } = params;
  const indexNumber = Number(index);

  console.log({ index, indexNumber });

  if (isNaN(indexNumber) || indexNumber < 0 || indexNumber > 100) {
    return null;
  }

  return (
    <GaugeWidget
      index={indexNumber}
      rankedExchanges={[
        { name: 'coinbase', ranking: 37 },
        { name: 'binance', ranking: 47 },
        { name: 'cryptocom', ranking: 49 },
        { name: 'okx', ranking: 132 },
        { name: 'kraken', ranking: null },
      ]}
    />
  );
}
