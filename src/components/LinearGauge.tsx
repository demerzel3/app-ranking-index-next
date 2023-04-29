import React from 'react';

type Props = {
  currentValue: number;
  height?: number;
  width?: number;
  triangleSize?: number;
};

const LinearGauge = ({ currentValue, height = 240, width = 48, triangleSize = 20 }: Props) => {
  const getPercentage = (index: number) => (100 - index) * ((height - triangleSize) / 100);

  const createGaugeDivs = () => {
    const colors = [
      { min: 0, max: 10, color: '#4472c4' },
      { min: 10, max: 20, color: '#54989f' },
      { min: 20, max: 30, color: '#63be7b' },
      { min: 30, max: 40, color: '#b1d580' },
      { min: 40, max: 60, color: '#ffeb84' },
      { min: 60, max: 70, color: '#f6b45a' },
      { min: 70, max: 80, color: '#ed7d31' },
      { min: 80, max: 90, color: '#d64018' },
      { min: 90, max: 100, color: '#c00000' },
    ];

    return colors.map((colorObj, index) => (
      <div
        key={index}
        style={{
          backgroundColor: colorObj.color,
          flex: colorObj.max - colorObj.min,
        }}
      ></div>
    ));
  };

  const arrowPosition = getPercentage(currentValue) + triangleSize / 2;

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'flex-end',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column-reverse',
          borderRadius: 8,
          overflow: 'hidden',
          width,
          height,
        }}
      >
        <div style={{ backgroundColor: '#4472c4', height: triangleSize / 2 }}></div>
        {createGaugeDivs()}
        <div style={{ backgroundColor: '#c00000', height: triangleSize / 2 }}></div>
      </div>
      <div
        style={{
          left: width,
          position: 'absolute',
          borderLeftWidth: 0,
          borderTopColor: 'transparent',
          borderBottomColor: 'transparent',
          borderRightColor: 'white',
          borderStyle: 'solid',
          borderTopWidth: `${triangleSize / 2}px`,
          borderBottomWidth: `${triangleSize / 2}px`,
          borderRightWidth: `${triangleSize}px`,
          top: `${arrowPosition - triangleSize / 2}px`,
        }}
      ></div>
    </div>
  );
};

export default LinearGauge;
