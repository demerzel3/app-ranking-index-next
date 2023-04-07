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

type Props = {
  appIndex: { x: number; y: number }[];
  btcPrice: { x: number; y: number }[];
  xAxis: { min: number; max: number };
};

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Legend, Filler, Tooltip, ZoomPlugin);

export default function Chart({ appIndex, btcPrice, xAxis }: Props) {
  return (
    <WindowHigh>
      <Scatter
        data={{
          datasets: [
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
          ],
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

                  let foundIndexItem = false;
                  let foundPriceItem = false;
                  items.forEach((item) => {
                    if (item.datasetIndex === 0) {
                      if (foundIndexItem) {
                        //@ts-ignore
                        item.skip = true;
                      }
                      foundIndexItem = true;
                    } else if (item.datasetIndex === 1) {
                      if (foundPriceItem) {
                        //@ts-ignore
                        item.skip = true;
                      }
                      foundPriceItem = true;
                    }
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
                  if (item.skip) {
                    // Allow only the first item for each dataset to appear on the tooltip.
                    return '';
                  }

                  if (item.datasetIndex === 0) {
                    return item.parsed.y.toFixed(0);
                  } else {
                    return usdFormatter.format(item.parsed.y);
                  }
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
