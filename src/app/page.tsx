import dynamic from 'next/dynamic';

import { calculate24hRollingAverage } from '@/lib/data';
import { readHistory } from '@/lib/database';
import { daysInSeconds, hoursInSeconds } from '@/lib/time';

const Chart = dynamic(() => import('./Chart'), { ssr: false });

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
  const res = await fetch('https://api.kraken.com/0/public/OHLC?pair=XBTUSD&interval=1440', {
    // Revalidate every hour
    next: { revalidate: hoursInSeconds(1) },
  });
  if (!res.ok) {
    return { result: { XXBTZUSD: [] } };
  }

  const result = (await res.json()) as PriceApiResult;
  const daysFromBeginningOfYear = Math.floor(
    (new Date().getTime() - new Date(new Date().getFullYear(), 0, 1).getTime()) / 1000 / daysInSeconds(1)
  );

  return {
    result: {
      XXBTZUSD: result.result.XXBTZUSD.slice(-30),
    },
  };
};

const getHistoryData = async () => {
  // TODO: make start of data parametric
  const startOfYear = new Date(new Date().getFullYear(), 0, 1).getTime() / 1000;
  const records = await readHistory({
    fromTime: startOfYear,
  });
  const bucketSize = Math.floor(records.length / 150);

  return (
    calculate24hRollingAverage(records)
      // TODO: do I need a more intelligent sampling?
      .filter((_, index) => index % bucketSize === 0)
      .map((entry) => ({
        // Round the time to the hour
        time: Math.floor(entry.time / hoursInSeconds(1)) * hoursInSeconds(1),
        value: entry.value,
      }))
  );
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

export const revalidate = 3600; // 1 hour

export default async function HomePage() {
  const { appIndex, btcPrice, xAxis } = await fetchData();

  return <Chart appIndex={appIndex} btcPrice={btcPrice} xAxis={xAxis} />;
}
