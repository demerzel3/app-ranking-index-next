'use client';

import { BaseChart } from '@/components/BaseChart';
import { WindowHigh } from '@/components/WindowHigh';

type Props = {
  appIndex: { x: number; y: number }[];
  btcPrice: { x: number; y: number }[];
  xAxis: { min: number; max: number };
};

export default function Chart({ appIndex, btcPrice, xAxis }: Props) {
  return (
    <WindowHigh>
      <BaseChart
        xAxis={xAxis}
        datasets={[
          {
            label: 'App Ranking Index',
            yAxisID: 'appRankingIndexScale',
            showLine: true,
            data: appIndex,
            borderColor: '#36a2eb',
            backgroundColor: '#36a2eb',
          },
          {
            label: 'Bitcoin Price (USD)',
            yAxisID: 'btcScale',
            showLine: true,
            data: btcPrice,
            borderColor: '#FF9900',
            backgroundColor: '#FF9900',
          },
        ]}
        scales={{
          appRankingIndexScale: {
            axis: 'y',
            position: 'left',
            min: 0,
            max: 100,
            ticks: {
              color: '#36a2eb',
            },
            grid: {
              color: '#343434',
            },
          },
          btcScale: {
            axis: 'y',
            position: 'right',
            ticks: {
              color: '#FF9900',
              callback: (price) => {
                if (typeof price !== 'number') {
                  return '';
                }

                return usdFormatter.format(price);
              },
            },
            grid: {
              color: '#343434',
            },
          },
        }}
        tooltipLabel={(item) => {
          if (item.datasetIndex === 0) {
            return item.parsed.y.toFixed(0);
          } else {
            return usdFormatter.format(item.parsed.y);
          }
        }}
      />
    </WindowHigh>
  );
}

const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});
