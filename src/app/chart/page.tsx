import { readHistory } from '@/lib/database';

import { Chart } from './Chart';

const secondsInMillis = (n: number) => n * 1000;
const minutesInMillis = (n: number) => n * secondsInMillis(60);

type PriceApiResult = {
  result: {
    XXBTZUSD: [
      // Time
      number,
      // Price
      number
    ][];
  };
};

const fetchPriceData = async (): Promise<PriceApiResult> => {
  const res = await fetch('https://api.kraken.com/0/public/OHLC?pair=XBTUSD&interval=60', {
    next: { revalidate: minutesInMillis(60) },
  });
  if (!res.ok) {
    return { result: { XXBTZUSD: [] } };
  }

  return (await res.json()) as PriceApiResult;
};

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
  const [priceData, historyData] = await Promise.all([fetchPriceData(), getHistoryData()]);

  const appIndex = historyData.map((item) => ({
    x: item.time,
    y: item.value * 100,
  }));
  const btcPrice = priceData.result.XXBTZUSD.map((ohlc) => ({
    x: ohlc[0],
    y: ohlc[1],
  }));
  const xAxis = {
    min: btcPrice[0].x - 10_000,
    max: btcPrice[btcPrice.length - 1].x + 10_000,
  };

  return { appIndex, btcPrice, xAxis };
};

export default async function ChartPage() {
  const { appIndex, btcPrice, xAxis } = await fetchData();

  return <Chart appIndex={appIndex} btcPrice={btcPrice} xAxis={xAxis} />;
}
