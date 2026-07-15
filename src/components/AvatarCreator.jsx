import React, { useState } from 'react';

const SKIN_TONES = ['#ffdbac', '#e0b894', '#c68642', '#8d5524', '#5d3a1a', '#3d2b1f'];

const HAIR_STYLES = [
  { id: 'short', label: 'hair.short', icon: '👨', colorable: true },
  { id: 'long', label: 'hair.long', icon: '👩', colorable: true },
  { id: 'curly', label: 'hair.curly', icon: '🧑', colorable: true },
  { id: 'bald', label: 'hair.bald', icon: '🧑', colorable: false },
  { id: 'buzz', label: 'hair.buzz', icon: '👨', colorable: true },
  { id: 'ponytail', label: 'hair.ponytail', icon: '👩', colorable: true },
];

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

const CLOTHING_STYLES = [
  {
    id: 'casual',
    label: 'clothing.casual',
    icon: '👕',
    colors: [
      '#2c3e50',
      '#34495e',
      '#7f8c8d',
      '#e74c3c',
      '#e67e22',
      '#f39c12',
      '#27ae60',
      '#2980b9',
      '#8e44ad',
      '#c0392b',
    ],
  },
  {
    id: 'formal',
    label: 'clothing.formal',
    icon: '🤵',
    colors: ['#1a1a2e', '#2c3e50', '#0f0f23', '#4a1c1c', '#1b3a4b'],
  },
  {
    id: 'sporty',
    label: 'clothing.sporty',
    icon: '🏃',
    colors: ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#e67e22'],
  },
  {
    id: 'bohemian',
    label: 'clothing.bohemian',
    icon: '👗',
    colors: ['#8e44ad', '#d35400', '#16a085', '#27ae60', '#e91e63', '#ff5722'],
  },
];

const ACCESSORIES = [
  { id: 'none', label: 'accessories.none', icon: '❌' },
  { id: 'glasses', label: 'accessories.glasses', icon: '👓' },
  { id: 'sunglasses', label: 'accessories.sunglasses', icon: '🕶️' },
  { id: 'earrings', label: 'accessories.earrings', icon: '💍' },
  { id: 'hat', label: 'accessories.hat', icon: '🧢' },
  { id: 'beard', label: 'accessories.beard', icon: '🧔' },
];

export function AvatarCreator({
  initialData = {},
  onComplete,
  onCancel,
  language = 'en',
  t = (key, fallback) => fallback || key,
}) {
  const [data, setData] = useState({
    skinTone: 0,
    hairStyle: 0,
    hairColor: 0,
    eyeColor: 0,
    clothing: 0,
    clothingColor: 0,
    accessory: 0,
    ...initialData,
  });

  const tLabel = key => t(key, key);

  const skinTone = SKIN_TONES[data.skinTone];
  const hairStyle = HAIR_STYLES[data.hairStyle];
  const hairColor = HAIR_COLORS[data.hairColor];
  const eyeColor = EYE_COLORS[data.eyeColor];
  const clothing = CLOTHING_STYLES[data.clothing];
  const clothingColor =
    clothing?.colors?.[data.clothingColor] || clothing?.colors?.[0] || '#2c3e50';
  const accessory = ACCESSORIES[data.accessory];

  const getRandomData = () => ({
    skinTone: Math.floor(Math.random() * SKIN_TONES.length),
    hairStyle: Math.floor(Math.random() * HAIR_STYLES.length),
    hairColor: Math.floor(Math.random() * HAIR_COLORS.length),
    eyeColor: Math.floor(Math.random() * EYE_COLORS.length),
    clothing: Math.floor(Math.random() * CLOTHING_STYLES.length),
    clothingColor: 0,
    accessory: 0,
  });

  const getPreviewStyle = () => ({
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    borderRadius: '16px',
    padding: '40px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    position: 'relative',
    minHeight: '300px',
    border: '1px solid rgba(255,255,255,0.1)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
  });

  const getAvatarSvg = () => {
    return (
      <div
        style={{
          position: 'relative',
          width: '120px',
          height: '160px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Head */}
        <div
          style={{
            width: '80px',
            height: '90px',
            background: skinTone,
            borderRadius: '40px 40px 30px 30px',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            paddingTop: '15px',
          }}
        >
          {/* Eyes */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-around',
              width: '60px',
              marginTop: '10px',
            }}
          >
            <div
              style={{
                width: '14px',
                height: '18px',
                background: '#fff',
                borderRadius: '50% 50% 40% 60%',
                position: 'relative',
                boxShadow: 'inset -2px -2px 4px rgba(0,0,0,0.1)',
              }}
            >
              <div
                style={{
                  width: '7px',
                  height: '10px',
                  background: eyeColor,
                  borderRadius: '50%',
                  position: 'absolute',
                  top: '4px',
                  left: '3px',
                }}
              />
              <div
                style={{
                  width: '3px',
                  height: '3px',
                  background: '#fff',
                  borderRadius: '50%',
                  position: 'absolute',
                  top: '2px',
                  left: '2px',
                }}
              />
            </div>
            <div
              style={{
                width: '14px',
                height: '18px',
                background: '#fff',
                borderRadius: '50% 50% 40% 60%',
                position: 'relative',
                boxShadow: 'inset -2px -2px 4px rgba(0,0,0,0.1)',
              }}
            >
              <div
                style={{
                  width: '7px',
                  height: '10px',
                  background: eyeColor,
                  borderRadius: '50%',
                  position: 'absolute',
                  top: '4px',
                  left: '4px',
                }}
              />
              <div
                style={{
                  width: '3px',
                  height: '3px',
                  background: '#fff',
                  borderRadius: '50%',
                  position: 'absolute',
                  top: '2px',
                  left: '3px',
                }}
              />
            </div>
          </div>

          {/* Hair */}
          {hairStyle.id !== 'bald' && (
            <div
              style={{
                position: 'absolute',
                top: '-8px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '88px',
                height: '40px',
                background: hairColor,
                borderRadius:
                  hairStyle.id === 'long'
                    ? '0 0 40px 40px'
                    : hairStyle.id === 'curly'
                      ? '50% 50% 40% 40%'
                      : hairStyle.id === 'ponytail'
                        ? '20px 20px 40px 40px'
                        : '40px 40px 0 0',
                clipPath:
                  hairStyle.id === 'buzz' ? 'polygon(0 100%, 100% 100%, 100% 0, 0 0)' : 'none',
              }}
            ></div>
          )}

          {/* Glasses */}
          {(accessory.id === 'glasses' || accessory.id === 'sunglasses') && (
            <div
              style={{
                position: 'absolute',
                top: '32px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: '4px',
              }}
            >
              <div
                style={{
                  width: '22px',
                  height: '16px',
                  border: '2px solid #333',
                  borderRadius: '4px',
                  background: accessory.id === 'sunglasses' ? 'rgba(0,0,0,0.7)' : 'transparent',
                }}
              ></div>
              <div
                style={{
                  width: '22px',
                  height: '16px',
                  border: '2px solid #333',
                  borderRadius: '4px',
                  background: accessory.id === 'sunglasses' ? 'rgba(0,0,0,0.7)' : 'transparent',
                }}
              ></div>
              <div
                style={{
                  width: '8px',
                  height: '2px',
                  background: '#333',
                  marginTop: '7px',
                  marginLeft: '-2px',
                  marginRight: '-2px',
                }}
              ></div>
            </div>
          )}

          {/* Hat */}
          {accessory.id === 'hat' && (
            <div
              style={{
                position: 'absolute',
                top: '-20px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '70px',
                height: '24px',
                background: '#2c3e50',
                borderRadius: '30px 30px 0 0',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  bottom: '-4px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '80px',
                  height: '6px',
                  background: '#2c3e50',
                  borderRadius: '0 0 40px 40px',
                }}
              ></div>
            </div>
          )}

          {/* Beard */}
          {accessory.id === 'beard' && (
            <div
              style={{
                position: 'absolute',
                bottom: '0',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '50px',
                height: '20px',
                background: hairColor,
                clipPath: 'ellipse(100% 100% at 50% 100%)',
              }}
            ></div>
          )}

          {/* Earrings */}
          {accessory.id === 'earrings' && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '100px',
                position: 'absolute',
                top: '50px',
              }}
            >
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  background: '#ffd700',
                  borderRadius: '50%',
                  boxShadow: '0 0 4px #ffd700',
                }}
              ></div>
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  background: '#ffd700',
                  borderRadius: '50%',
                  boxShadow: '0 0 4px #ffd700',
                }}
              ></div>
            </div>
          )}
        </div>

        {/* Body */}
        <div
          style={{
            width: '60px',
            height: '70px',
            background: clothingColor,
            borderRadius: '0 0 20px 20px',
            marginTop: '-5px',
            position: 'relative',
          }}
        >
          {clothing.id === 'formal' && (
            <div
              style={{
                position: 'absolute',
                top: '10px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '0',
                height: '0',
                borderLeft: '10px solid transparent',
                borderRight: '10px solid transparent',
                borderBottom: '20px solid #fff',
              }}
            ></div>
          )}
          {clothing.id === 'sporty' && (
            <div
              style={{
                position: 'absolute',
                top: '5px',
                left: '0',
                right: '0',
                height: '20px',
                background: 'rgba(255,255,255,0.1)',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <div
                style={{ width: '20px', height: '3px', background: '#fff', margin: '0 4px' }}
              ></div>
              <div
                style={{ width: '20px', height: '3px', background: '#fff', margin: '0 4px' }}
              ></div>
              <div
                style={{ width: '20px', height: '3px', background: '#fff', margin: '0 4px' }}
              ></div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.95)',
        zIndex: 500,
        display: 'flex',
        flexDirection: 'column',
        padding: '20px',
        paddingTop: 'max(60px, env(safe-area-inset-top))',
        overflowY: 'auto',
      }}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      <div
        style={{
          maxWidth: '600px',
          margin: '0 auto',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '1.5rem' }}>{tLabel('avatar.creator')}</h2>
          <button
            onClick={onCancel}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              color: '#fff',
              padding: '8px 16px',
              borderRadius: '20px',
              cursor: 'pointer',
            }}
          >
            {t('common.cancel', 'Cancel')}
          </button>
        </div>

        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <div
            style={{
              flex: 1,
              minWidth: '280px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <div style={getPreviewStyle()}>{getAvatarSvg()}</div>
            <button
              onClick={() => setData(getRandomData())}
              style={{
                padding: '12px 24px',
                background: '#6c5ce7',
                color: '#fff',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '1rem',
              }}
            >
              🎲 {tLabel('avatar.randomize')}
            </button>
          </div>

          <div
            style={{
              flex: 1,
              minWidth: '280px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <div
              style={{
                background: 'rgba(255,255,255,0.03)',
                padding: '20px',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.05)',
              }}
            >
              <h4 style={{ margin: '0 0 16px', color: '#ffe7a1' }}>
                {tLabel('avatar.appearance')}
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
                    {tLabel('avatar.skinTone')}
                  </label>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {SKIN_TONES.map((tone, i) => (
                      <button
                        key={i}
                        aria-label={`${tLabel('avatar.skinTone')} ${i + 1}`}
                        aria-pressed={data.skinTone === i}
                        onClick={() => setData(d => ({ ...d, skinTone: i }))}
                        style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '50%',
                          background: tone,
                          border:
                            data.skinTone === i ? '3px solid #ffe7a1' : '2px solid transparent',
                          cursor: 'pointer',
                          transition: 'transform 0.1s',
                          transform: data.skinTone === i ? 'scale(1.1)' : 'scale(1)',
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
                    {tLabel('avatar.hairStyle')}
                  </label>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {HAIR_STYLES.map((style, i) => (
                      <button
                        key={style.id}
                        onClick={() =>
                          setData(d => ({
                            ...d,
                            hairStyle: i,
                            hairColor: style.colorable ? d.hairColor : 0,
                          }))
                        }
                        style={{
                          padding: '8px 16px',
                          borderRadius: '8px',
                          background:
                            data.hairStyle === i
                              ? HAIR_COLORS[data.hairColor]
                              : 'rgba(255,255,255,0.08)',
                          color: data.hairStyle === i ? '#000' : '#fff',
                          border: 'none',
                          cursor: 'pointer',
                          fontWeight: 600,
                          fontSize: '0.9rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        {style.icon} {tLabel(style.label)}
                      </button>
                    ))}
                  </div>
                </div>

                {hairStyle.colorable && (
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
                      {tLabel('avatar.hairColor')}
                    </label>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {HAIR_COLORS.map((color, i) => (
                        <button
                          key={i}
                          aria-label={`${tLabel('avatar.hairColor')} ${i + 1}`}
                          aria-pressed={data.hairColor === i}
                          onClick={() => setData(d => ({ ...d, hairColor: i }))}
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            background: color,
                            border:
                              data.hairColor === i ? '3px solid #ffe7a1' : '2px solid transparent',
                            cursor: 'pointer',
                            transform: data.hairColor === i ? 'scale(1.1)' : 'scale(1)',
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
                    {tLabel('avatar.eyeColor')}
                  </label>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {EYE_COLORS.map((color, i) => (
                      <button
                        key={i}
                        aria-label={`${tLabel('avatar.eyeColor')} ${i + 1}`}
                        aria-pressed={data.eyeColor === i}
                        onClick={() => setData(d => ({ ...d, eyeColor: i }))}
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          background: color,
                          border:
                            data.eyeColor === i ? '3px solid #ffe7a1' : '2px solid transparent',
                          cursor: 'pointer',
                          transform: data.eyeColor === i ? 'scale(1.1)' : 'scale(1)',
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div
              style={{
                background: 'rgba(255,255,255,0.03)',
                padding: '20px',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.05)',
                marginTop: '16px',
              }}
            >
              <h4 style={{ margin: '0 0 16px', color: '#ffe7a1' }}>{tLabel('avatar.clothing')}</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
                    {tLabel('avatar.style')}
                  </label>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {CLOTHING_STYLES.map((style, i) => (
                      <button
                        key={style.id}
                        onClick={() => setData(d => ({ ...d, clothing: i, clothingColor: 0 }))}
                        style={{
                          padding: '10px 16px',
                          borderRadius: '8px',
                          background:
                            data.clothing === i
                              ? clothing?.colors[data.clothingColor]
                              : 'rgba(255,255,255,0.08)',
                          color: data.clothing === i ? '#fff' : '#fff',
                          border: 'none',
                          cursor: 'pointer',
                          fontWeight: 600,
                          fontSize: '0.9rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        {style.icon} {tLabel(style.label)}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
                    {tLabel('avatar.clothingColor')}
                  </label>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {clothing?.colors?.map((color, i) => (
                      <button
                        key={i}
                        aria-label={`${tLabel('avatar.clothingColor')} ${i + 1}`}
                        aria-pressed={data.clothingColor === i}
                        onClick={() => setData(d => ({ ...d, clothingColor: i }))}
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          background: color,
                          border:
                            data.clothingColor === i
                              ? '3px solid #ffe7a1'
                              : '2px solid transparent',
                          cursor: 'pointer',
                          transform: data.clothingColor === i ? 'scale(1.1)' : 'scale(1)',
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div
              style={{
                background: 'rgba(255,255,255,0.03)',
                padding: '20px',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.05)',
                marginTop: '16px',
              }}
            >
              <h4 style={{ margin: '0 0 16px', color: '#ffe7a1' }}>
                {tLabel('avatar.accessories')}
              </h4>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {ACCESSORIES.map((acc, i) => (
                  <button
                    key={acc.id}
                    onClick={() => setData(d => ({ ...d, accessory: i }))}
                    style={{
                      padding: '12px 20px',
                      borderRadius: '12px',
                      background: data.accessory === i ? '#6c5ce7' : 'rgba(255,255,255,0.08)',
                      color: data.accessory === i ? '#fff' : '#ccc',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: 600,
                      fontSize: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      minWidth: '100px',
                    }}
                  >
                    {acc.icon} {tLabel(acc.label)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '24px' }}>
        <button
          onClick={onCancel}
          style={{
            padding: '16px 32px',
            background: 'rgba(255,255,255,0.1)',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '1.1rem',
            fontWeight: 600,
            minWidth: '160px',
          }}
        >
          {t('common.cancel', 'Cancel')}
        </button>
        <button
          onClick={() => onComplete(data)}
          style={{
            padding: '16px 32px',
            background: 'linear-gradient(135deg, #6c5ce7, #a29bfe)',
            color: '#fff',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '1.1rem',
            fontWeight: 700,
            minWidth: '160px',
            boxShadow: '0 4px 15px rgba(108, 92, 231, 0.4)',
          }}
        >
          {tLabel('avatar.confirm')}
        </button>
      </div>
    </div>
  );
}

export default AvatarCreator;
