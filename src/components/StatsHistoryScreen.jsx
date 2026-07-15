import React, { useMemo, useState } from 'react';
import StatChart from './StatChart';

const STATS_CONFIG = [
  { key: 'health', label: 'stat.health', color: '#56ab2f', icon: '❤️' },
  { key: 'happiness', label: 'stat.happiness', color: '#ff9966', icon: '😊' },
  { key: 'smarts', label: 'stat.smarts', color: '#4facfe', icon: '🧠' },
  { key: 'looks', label: 'stat.looks', color: '#f093fb', icon: '✨' },
  { key: 'stress', label: 'stat.stress', color: '#ffdd00', icon: '😵' },
  { key: 'karma', label: 'stat.karma', color: '#aa4b6b', icon: '⚖️' },
  { key: 'money', label: 'stat.money', color: '#4caf50', icon: '💵' },
  { key: 'energy', label: 'stat.energy', color: '#00c9ff', icon: '⚡' },
];

export function StatsHistoryScreen({
  person,
  language = 'en',
  t = (key, fallback) => fallback || key,
  onClose,
}) {
  const [selectedStat, setSelectedStat] = useState('health');
  const [viewMode, setViewMode] = useState('single');

  const chartData = useMemo(() => {
    const history = person.statHistory || [];
    if (history.length === 0) {
      return [];
    }

    return history.map((snap, i) => ({
      label: snap.age ? `Age ${snap.age}` : `Year ${i + 1}`,
      value: snap[selectedStat] ?? 0,
    }));
  }, [person.statHistory, selectedStat]);

  const currentStatConfig = STATS_CONFIG.find(s => s.key === selectedStat);

  const allChartsData = useMemo(() => {
    const history = person.statHistory || [];
    if (history.length === 0) {
      return [];
    }

    return STATS_CONFIG.map(config => ({
      ...config,
      data: history.map((snap, i) => ({
        label: snap.age ? `Age ${snap.age}` : `Year ${i + 1}`,
        value: snap[config.key] ?? 0,
      })),
    }));
  }, [person.statHistory]);

  const tLabel = key => t(key, key);

  return (
    <div
      className="stats-history-screen"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: '#0a0a12',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 200,
        padding: '20px',
        paddingTop: 'max(60px, env(safe-area-inset-top))',
        overflowY: 'auto',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          paddingBottom: '12px',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>
          {currentStatConfig?.icon} {tLabel(currentStatConfig?.label || 'Stats History')}
        </h2>
        <button
          onClick={onClose}
          style={{
            background: 'rgba(255,255,255,0.1)',
            border: 'none',
            color: '#fff',
            padding: '8px 16px',
            borderRadius: '20px',
            cursor: 'pointer',
            fontSize: '0.9rem',
          }}
        >
          {t('common.close', 'Close')}
        </button>
      </div>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          marginBottom: '16px',
          justifyContent: 'center',
        }}
      >
        {STATS_CONFIG.map(stat => (
          <button
            key={stat.key}
            onClick={() => setSelectedStat(stat.key)}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: 'none',
              background: selectedStat === stat.key ? stat.color : 'rgba(255,255,255,0.08)',
              color: selectedStat === stat.key ? '#fff' : '#ccc',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s',
            }}
          >
            {stat.icon} {tLabel(stat.label)}
          </button>
        ))}
      </div>

      <div
        style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '20px',
          justifyContent: 'center',
        }}
      >
        <button
          onClick={() => setViewMode('single')}
          style={{
            padding: '8px 20px',
            borderRadius: '20px',
            border: 'none',
            background: viewMode === 'single' ? '#4caf50' : 'rgba(255,255,255,0.08)',
            color: viewMode === 'single' ? '#fff' : '#ccc',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          {t('stats.singleView', 'Single View')}
        </button>
        <button
          onClick={() => setViewMode('grid')}
          style={{
            padding: '8px 20px',
            borderRadius: '20px',
            border: 'none',
            background: viewMode === 'grid' ? '#4caf50' : 'rgba(255,255,255,0.08)',
            color: viewMode === 'grid' ? '#fff' : '#ccc',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          {t('stats.gridView', 'Grid View')}
        </button>
      </div>

      {chartData.length === 0 ? (
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#666',
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📊</div>
          <p>{t('stats.noData', 'No stat history yet. Age up to start tracking!')}</p>
        </div>
      ) : viewMode === 'single' ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <StatChart
            chartData={chartData}
            width={Math.min(700, window.innerWidth - 40)}
            height={350}
            color={currentStatConfig?.color || '#00c9ff'}
            label={
              currentStatConfig
                ? `${currentStatConfig.icon} ${tLabel(currentStatConfig.label)}`
                : ''
            }
            showPoints={true}
          />
          <div style={{ marginTop: '16px', textAlign: 'center', color: '#888' }}>
            <span style={{ color: '#fff', fontWeight: 700 }}>
              {chartData[chartData.length - 1]?.value ?? 0}
            </span>
            {' current • '}
            <span>Min: {Math.min(...chartData.map(d => d.value))}</span>
            {' • '}
            <span>Max: {Math.max(...chartData.map(d => d.value))}</span>
            {' • '}
            <span>
              Avg: {Math.round(chartData.reduce((a, b) => a + b.value, 0) / chartData.length)}
            </span>
          </div>
        </div>
      ) : (
        <div
          style={{
            flex: 1,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '16px',
            alignContent: 'start',
          }}
        >
          {allChartsData.map(config => (
            <div
              key={config.key}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '12px',
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '8px',
                }}
              >
                <span
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}
                >
                  {config.icon} {tLabel(config.label)}
                </span>
              </div>
              <StatChart
                chartData={config.data}
                width={320}
                height={200}
                color={config.color}
                label=""
                showPoints={false}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default StatsHistoryScreen;
