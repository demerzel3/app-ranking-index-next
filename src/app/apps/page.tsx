import dynamic from 'next/dynamic';

import { readHistory } from '@/lib/database';
import { ExchangeName } from '@/lib/types';

const Chart = dynamic(() => import('./Chart'), { ssr: false });

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
  const rankingByApp: Record<ExchangeName, { x: number; y: number }[]> = {
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
        x: item.time,
        y: detail.ranking ?? 200,
      });
    });
  });

  const xAxis = {
    min: historyData[0].time - 10_000,
    max: historyData[historyData.length - 1].time + 10_000,
  };

  return { rankingByApp, xAxis };
};

export const revalidate = 3600; // 1 hour

export default async function ChartPage() {
  const { rankingByApp, xAxis } = await fetchData();

  return <Chart rankingByApp={rankingByApp} xAxis={xAxis} />;
}
