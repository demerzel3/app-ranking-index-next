'use client';

import { Gauge as GaugeJs, GaugeOptions } from 'gaugeJS';
import React, { useEffect, useRef } from 'react';

type Props = {
  index: number;
};

const Gauge = ({ index }: Props) => {
  const gaugeElement = useRef(null);
  const gaugeInstance = useRef<GaugeJs>();

  useEffect(() => {
    if (!gaugeElement.current) {
      return;
    }

    const gaugeOptions: GaugeOptions = {
      angle: 0,
      lineWidth: 0.3,
      radiusScale: 0.96,
      pointer: {
        length: 0.35,
        strokeWidth: 0.05,
        color: '#eeeeee',
      },
      limitMax: true,
      limitMin: true,
      strokeColor: '#eeeeee',
      colorStart: '#eeeeee',
      colorStop: '#eeeeee',
      generateGradient: true,
      highDpiSupport: true,
      staticZones: [
        { strokeStyle: '#4472c4', min: 0, max: 10 },
        { strokeStyle: '#54989f', min: 10, max: 20 },
        { strokeStyle: '#63be7b', min: 20, max: 30 },
        { strokeStyle: '#b1d580', min: 30, max: 40 },
        { strokeStyle: '#ffeb84', min: 40, max: 60 },
        { strokeStyle: '#f6b45a', min: 60, max: 70 },
        { strokeStyle: '#ed7d31', min: 70, max: 80 },
        { strokeStyle: '#d64018', min: 80, max: 90 },
        { strokeStyle: '#c00000', min: 90, max: 100 },
      ],
    };

    const gauge = new GaugeJs(gaugeElement.current).setOptions(gaugeOptions);
    gauge.maxValue = 100;
    gauge.setMinValue(0);
    gauge.animationSpeed = 1;

    gaugeInstance.current = gauge;
  }, []);

  useEffect(() => {
    gaugeInstance.current?.set(index);
  }, [index]);

  return (
    <div style={{ display: 'flex', flexDirection: 'row', fontFamily: 'sans-serif', fontSize: 30 }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          textAlign: 'center',
          position: 'relative',
          paddingBottom: 24,
        }}
      >
        <canvas ref={gaugeElement} width={540} height={300} />
        <div>{getIndexDescription(index)}</div>
        <div
          style={{
            position: 'absolute',
            lineHeight: '30px',
            top: 24,
            right: 24,
            padding: '16px 12px',
            border: `5px solid ${getColor(index)}`,
            color: getColor(index),
            borderRadius: 36,
            minWidth: 72,
            fontWeight: 'bold',
          }}
        >
          {index}
        </div>
      </div>
    </div>
  );
};

export default Gauge;

// Borrowed from the one and only bitcoin rainbow cart.
const getIndexDescription = (index: number): string => {
  switch (true) {
    case index <= 10: // 0-10
      return 'Basically a fire sale';
    case index <= 20: // 10-20
      return 'BUY!';
    case index <= 30:
      return 'Accumulate';
    case index <= 40:
      return 'Still cheap';
    case index <= 60: // 40-60
      return 'Hold';
    case index <= 70:
      return 'Is this a bubble?';
    case index <= 80:
      return 'FOMO intensifies';
    case index <= 90:
      return 'Sell. Seriously, SELL!';
    default: // 90-100
      return 'Maximum bubble territory';
  }
};

const getColor = (index: number): string => {
  switch (true) {
    case index <= 10: // 0-10
      return '#4472c4';
    case index <= 20: // 10-20
      return '#54989f';
    case index <= 30:
      return '#63be7b';
    case index <= 40:
      return '#b1d580';
    case index <= 60: // 40-60
      return '#ffeb84';
    case index <= 70:
      return '#f6b45a';
    case index <= 80:
      return '#ed7d31';
    case index <= 90:
      return '#d64018';
    default: // 90-100
      return '#c00000';
  }
};
