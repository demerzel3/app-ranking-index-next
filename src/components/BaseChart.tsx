import {
  CartesianScaleTypeRegistry,
  CategoryScale,
  Chart,
  ChartDataset,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  ScaleOptionsByType,
  Tooltip,
  TooltipItem,
} from 'chart.js';
import { DeepPartial } from 'chart.js/dist/types/utils';
import ZoomPlugin from 'chartjs-plugin-zoom';
import React from 'react';
import { Scatter } from 'react-chartjs-2';

import { secondsInMillis } from '@/lib/time';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Legend, Filler, Tooltip, ZoomPlugin);

type Props = {
  datasets: ChartDataset<'scatter', { x: number; y: number }[]>[];
  scales: {
    [key: string]: DeepPartial<ScaleOptionsByType<keyof CartesianScaleTypeRegistry>>;
  };
  xAxis: { min: number; max: number };
  tooltipLabel: (item: TooltipItem<'scatter'>) => string | void | string[];
};

export function BaseChart({ datasets, scales, xAxis, tooltipLabel }: Props) {
  return (
    <Scatter
      data={{ datasets }}
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
          ...scales,
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
            // Sort items by ranking.
            itemSort: (a, b) => a.parsed.y - b.parsed.y,
            callbacks: {
              title: (items) => {
                const time = items[0].parsed.x;

                let foundItem: Partial<Record<number, boolean>> = {};
                items.forEach((item) => {
                  if (foundItem[item.datasetIndex]) {
                    //@ts-ignore
                    item.skip = true;
                  }
                  foundItem[item.datasetIndex] = true;
                });

                return formatDate(new Date(secondsInMillis(time)));
              },
              label: (item) => {
                //@ts-ignore
                if (item.skip) {
                  // Allow only the first item for each dataset to appear on the tooltip.
                  return '';
                }

                return tooltipLabel(item);
              },
            },
          },
        },
      }}
    />
  );
}

const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour12: true,
    hour: 'numeric',
    minute: '2-digit',
  });
};
