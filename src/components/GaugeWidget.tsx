import { EXCHANGE_META } from '@/lib/meta';
import { ExchangeName } from '@/lib/types';

import LinearGauge from './LinearGauge';

type Props = {
  index: number;
  rankedExchanges: {
    name: ExchangeName;
    ranking: number | null;
  }[];
};

const GaugeWidget = ({ index, rankedExchanges }: Props) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          padding: 24,
          background: 'rgb(var(--background-rgb))',
          borderRadius: 24,
          color: 'rgb(var(--text-rgb))',
          minWidth: 450,
        }}
      >
        <LinearGauge currentValue={index} height={242} width={48} triangleSize={24} />
        <div style={{ flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              marginLeft: 36,
              fontSize: 28,
              fontWeight: 600,
              marginBottom: 18,
            }}
          >
            <div
              style={{
                backgroundColor: getColor(index),
                color: getTextColor(index),
                borderRadius: 12,
                minWidth: 64,
                textAlign: 'center',
                marginRight: 12,
              }}
            >
              {index}
            </div>
            {getIndexDescription(index)}
          </div>
          {rankedExchanges.slice(0, 5).map((exchange) => (
            <div
              key={exchange.name}
              style={{
                display: 'flex',
                flexDirection: 'row',
                marginLeft: 48,
                fontSize: 18,
                marginTop: 12,
              }}
            >
              <img style={{ borderRadius: 4 }} src={EXCHANGE_META[exchange.name].iconUrl} width={28} height={28} />
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgb(60, 60, 60)',
                  borderRadius: 4,
                  marginLeft: 8,
                  minWidth: 64,
                  fontSize: 14,
                  fontWeight: 500,
                  textAlign: 'center',
                }}
              >
                {exchange.ranking ? `#${exchange.ranking}` : '> #200'}
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: 8,
                  fontWeight: 300,
                }}
              >
                {EXCHANGE_META[exchange.name].displayName}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GaugeWidget;

// Borrowed from the one and only bitcoin rainbow cart.
const getIndexDescription = (index: number): string => {
  switch (true) {
    case index <= 10: // 0-10
      return 'Fire sale';
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
      return 'Sell. Srsly, SELL!';
    default: // 90-100
      return 'Defo a bubble';
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

const getTextColor = (index: number): string => {
  switch (true) {
    case index <= 10: // 0-10
      return '#dbe5f5';
    case index <= 20: // 10-20
      return '#d1f0f0';
    case index <= 30:
      return '#dff7e2';
    case index <= 40:
      return '#4e6b32';
    case index <= 60: // 40-60
      return '#7a5f2d';
    case index <= 70:
      return '#4e3c26';
    case index <= 80:
      return '#6a3d24';
    case index <= 90:
      return '#6f2015';
    default: // 90-100
      return '#540000';
  }
};
``;
