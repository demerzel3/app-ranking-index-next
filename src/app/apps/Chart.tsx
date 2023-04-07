'use client';

import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js';
import ZoomPlugin from 'chartjs-plugin-zoom';
import { Scatter } from 'react-chartjs-2';

import { WindowHigh } from '@/components/WindowHigh';
import { EXCHANGE_META } from '@/lib/meta';
import { ExchangeName } from '@/lib/types';

type Props = {
  rankingByApp: Record<ExchangeName, { x: number; y: number }[]>;
  xAxis: { min: number; max: number };
};

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Legend, Filler, Tooltip, ZoomPlugin);

export default function Chart({ rankingByApp, xAxis }: Props) {
  return (
    <WindowHigh>
      <Scatter
        data={{
          datasets: (Object.entries(rankingByApp) as [ExchangeName, { x: number; y: number }[]][]).map(
            ([name, data]) => ({
              label: name,
              yAxisID: 'rankingScale',
              showLine: true,
              data,
              borderColor: EXCHANGE_META[name].color,
              backgroundColor: EXCHANGE_META[name].color,
            })
          ),
        }}
        options={{
          maintainAspectRatio: false,
          responsive: true,
          elements: {
            point: {
              pointStyle: false,
            },
            line: {
              cubicInterpolationMode: 'monotone',
              tension: 0.4,
            },
          },
          scales: {
            x: {
              min: xAxis.min,
              max: xAxis.max,
              ticks: {
                color: '#eeeeee',
                callback: (time) => {
                  if (typeof time !== 'number') {
                    return '';
                  }

                  return new Date(time * 1000).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  });
                },
              },
              grid: {
                color: '#343434',
              },
            },
            rankingScale: {
              axis: 'y',
              position: 'left',
              min: 0,
              max: 200,
              reverse: true,
              ticks: {
                color: '#36a2eb',
              },
              grid: {
                color: '#343434',
              },
            },
          },
          plugins: {
            legend: {
              labels: {
                color: '#eeeeee',
              },
            },
            zoom: {
              limits: {
                x: {
                  min: xAxis.min,
                  max: xAxis.max,
                },
              },
              zoom: {
                mode: 'x',
                wheel: {
                  enabled: true,
                  speed: 0.025,
                },
                pinch: {
                  enabled: true,
                },
              },
              pan: {
                mode: 'x',
                enabled: true,
              },
            },
            tooltip: {
              mode: 'x',
              intersect: false,
              callbacks: {
                title: (items) => {
                  const [item] = items;
                  const time = item.parsed.x;

                  let foundItem: Partial<Record<number, boolean>> = {};
                  items.forEach((item) => {
                    if (foundItem[item.datasetIndex]) {
                      //@ts-ignore
                      item.skip = true;
                    }
                    foundItem[item.datasetIndex] = true;
                  });

                  return new Date(time * 1000).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour12: true,
                    hour: 'numeric',
                    minute: '2-digit',
                  });
                },
                label: (item) => {
                  //@ts-ignore
                  if (item.skip || item.parsed.y === 200) {
                    // Allow only the first item for each dataset to appear on the tooltip.
                    // Skip also everything above 200.
                    return '';
                  }

                  return `${item.dataset.label} #${item.parsed.y}`;
                },
              },
            },
          },
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
