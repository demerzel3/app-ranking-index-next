'use client';

import { BaseChart } from '@/components/BaseChart';
import { WindowHigh } from '@/components/WindowHigh';
import { EXCHANGE_META } from '@/lib/meta';
import { ExchangeName } from '@/lib/types';

type Props = {
  rankingByApp: Record<ExchangeName, { x: number; y: number }[]>;
  xAxis: { min: number; max: number };
};

export default function Chart({ rankingByApp, xAxis }: Props) {
  return (
    <WindowHigh>
      <BaseChart
        xAxis={xAxis}
        datasets={(Object.entries(rankingByApp) as [ExchangeName, { x: number; y: number }[]][]).map(
          ([name, data]) => ({
            label: name,
            yAxisID: 'rankingScale',
            showLine: true,
            data,
            borderColor: EXCHANGE_META[name].color,
            backgroundColor: EXCHANGE_META[name].color,
          })
        )}
        scales={{
          rankingScale: {
            axis: 'y',
            position: 'left',
            min: 1,
            max: 200,
            reverse: true,
            ticks: {
              color: '#eeeeee',
              callback: (value) => (value === 1 ? '🏆' : `#${value}`),
            },
            grid: {
              color: '#343434',
            },
          },
        }}
        tooltipLabel={(item) => (item.parsed.y === 200 ? '' : `${item.dataset.label} #${item.parsed.y}`)}
      />
    </WindowHigh>
  );
}
