import React, { memo } from 'react';

const SKIN_TONES = ['#ffdbac', '#e0b894', '#c68642', '#8d5524', '#5d3a1a', '#3d2b1f'];
const HAIR_COLORS = [
  '#2c1810',
  '#3d2b1f',
  '#5d4e37',
  '#8b7355',
  '#c9b99a',
  '#f5e6c8',
  '#e8b4b8',
  '#c0392b',
  '#e74c3c',
  '#f39c12',
  '#f1c40f',
  '#2ecc71',
  '#3498db',
  '#9b59b6',
  '#1abc9c',
  '#34495e',
  '#95a5a6',
];
const EYE_COLORS = [
  '#4a3728',
  '#5d4e37',
  '#8b7355',
  '#a0522d',
  '#8b4513',
  '#556b2f',
  '#2e8b57',
  '#20b2aa',
  '#4682b4',
  '#4169e1',
  '#800080',
  '#c71585',
  '#ff69b4',
  '#ff1493',
  '#dc143c',
];
const ACCESSORIES = ['none', 'glasses', 'sunglasses', 'earrings', 'hat', 'beard'];

export const MiniAvatar = memo(({ data, size = 50 }) => {
  if (!data) {
    return null;
  }

  const skinTone = SKIN_TONES[data.skinTone] || SKIN_TONES[0];
  const hairColor = HAIR_COLORS[data.hairColor] || HAIR_COLORS[0];
  const eyeColor = EYE_COLORS[data.eyeColor] || EYE_COLORS[0];
  const accessory = ACCESSORIES[data.accessory] || 'none';

  const headSize = size * 0.56;
  const bodySize = size * 0.44;

  return (
    <div
      style={{
        width: size,
        height: size,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end',
      }}
    >
      <div
        style={{
          width: headSize,
          height: headSize,
          background: skinTone,
          borderRadius: `${headSize * 0.5}px ${headSize * 0.5}px ${headSize * 0.35}px ${headSize * 0.35}px`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', gap: headSize * 0.15, marginTop: headSize * 0.15 }}>
          <div
            style={{
              width: headSize * 0.16,
              height: headSize * 0.2,
              background: '#fff',
              borderRadius: '50%',
              position: 'relative',
            }}
          >
            <div
              style={{
                width: headSize * 0.08,
                height: headSize * 0.12,
                background: eyeColor,
                borderRadius: '50%',
                position: 'absolute',
                top: headSize * 0.05,
                left: headSize * 0.03,
              }}
            />
          </div>
          <div
            style={{
              width: headSize * 0.16,
              height: headSize * 0.2,
              background: '#fff',
              borderRadius: '50%',
              position: 'relative',
            }}
          >
            <div
              style={{
                width: headSize * 0.08,
                height: headSize * 0.12,
                background: eyeColor,
                borderRadius: '50%',
                position: 'absolute',
                top: headSize * 0.05,
                left: headSize * 0.04,
              }}
            />
          </div>
        </div>
        {accessory === 'hat' && (
          <div
            style={{
              position: 'absolute',
              top: -headSize * 0.15,
              width: headSize * 0.8,
              height: headSize * 0.25,
              background: '#2c3e50',
              borderRadius: `${headSize * 0.3}px ${headSize * 0.3}px 0 0`,
            }}
          >
            <div
              style={{
                position: 'absolute',
                bottom: -headSize * 0.04,
                left: '50%',
                transform: 'translateX(-50%)',
                width: headSize * 0.9,
                height: headSize * 0.06,
                background: '#2c3e50',
                borderRadius: '0 0 4px 4px',
              }}
            />
          </div>
        )}
        {(accessory === 'glasses' || accessory === 'sunglasses') && (
          <div
            style={{
              position: 'absolute',
              top: headSize * 0.38,
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: 2,
            }}
          >
            <div
              style={{
                width: headSize * 0.24,
                height: headSize * 0.18,
                border: '1.5px solid #333',
                borderRadius: 3,
                background: accessory === 'sunglasses' ? 'rgba(0,0,0,0.7)' : 'transparent',
              }}
            />
            <div
              style={{
                width: headSize * 0.24,
                height: headSize * 0.18,
                border: '1.5px solid #333',
                borderRadius: 3,
                background: accessory === 'sunglasses' ? 'rgba(0,0,0,0.7)' : 'transparent',
              }}
            />
          </div>
        )}
        {accessory === 'beard' && (
          <div
            style={{
              position: 'absolute',
              bottom: headSize * 0.04,
              width: headSize * 0.5,
              height: headSize * 0.2,
              background: hairColor,
              clipPath: 'ellipse(100% 100% at 50% 100%)',
            }}
          />
        )}
      </div>
      <div
        style={{
          width: bodySize * 0.8,
          height: bodySize,
          background: '#4a4a6a',
          borderRadius: '0 0 4px 4px',
          marginTop: -2,
        }}
      />
    </div>
  );
});
