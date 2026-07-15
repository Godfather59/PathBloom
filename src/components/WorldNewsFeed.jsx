import React from 'react';
import './Modal.css';

export function WorldNewsFeed({
  person,
  onClose,
  language = 'en',
  t = (key, fallback) => fallback || key,
}) {
  const dir = language === 'ar' ? 'rtl' : 'ltr';
  const news = Array.isArray(person?.worldNews) ? person.worldNews : [];

  const newsByAge = {};
  news.forEach(item => {
    if (!item || typeof item !== 'object') {
      return;
    }
    const age = Number(item?.age);
    if (!Number.isFinite(age)) {
      return;
    }
    if (!newsByAge[age]) {
      newsByAge[age] = [];
    }
    newsByAge[age].push(item);
  });

  const sortedAges = Object.keys(newsByAge)
    .map(Number)
    .filter(Number.isFinite)
    .sort((a, b) => b - a);

  const safeText = text => {
    if (typeof text === 'string') {
      return text.replace(/^Your\s+\S+,\s+/, '');
    }
    if (text == null) {
      return '';
    }
    return String(text);
  };

  const safeYear = item => {
    const year = Number(item?.year);
    return Number.isFinite(year) ? year : null;
  };

  let content = null;

  try {
    content = (
      <div className="modal-body">
        {news.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}></div>
            <p>
              {t('worldNews.empty', 'No news yet. As the world turns, stories will appear here.')}
            </p>
          </div>
        ) : (
          <div>
            <div
              style={{
                background: 'rgba(255,215,0,0.06)',
                border: '1px solid rgba(255,215,0,0.15)',
                borderRadius: '10px',
                padding: '12px 16px',
                marginBottom: '16px',
                fontSize: '0.85rem',
                color: '#aaa',
              }}
            >
              {t('worldNews.description', 'Notable events from the lives of those around you.')}
            </div>

            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
              {sortedAges.slice(0, 10).map(age => (
                <span
                  key={age}
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    padding: '4px 10px',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    color: '#888',
                  }}
                >
                  {t('worldNews.age', 'Age')} {age}
                </span>
              ))}
              {sortedAges.length > 10 && (
                <span style={{ color: '#666', fontSize: '0.75rem', padding: '4px 0' }}>
                  +{sortedAges.length - 10} {t('worldNews.more', 'more')}
                </span>
              )}
            </div>

            {sortedAges.map(age => {
              const ageItems = newsByAge[age] || [];
              const firstItem = ageItems[0];
              const year = safeYear(firstItem);
              return (
                <div key={age} style={{ marginBottom: '16px' }}>
                  <div
                    style={{
                      fontSize: '0.8rem',
                      color: '#666',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      marginBottom: '8px',
                      paddingBottom: '4px',
                      borderBottom: '1px solid rgba(255,255,255,0.06)',
                    }}
                  >
                    {t('worldNews.age', 'Age')} {age}
                    {year ? `  ${year}` : ''}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {ageItems.map((item, i) => {
                      const itemText = safeText(item?.text);
                      const itemType = typeof item?.type === 'string' ? item.type : 'neutral';
                      const relName = typeof item?.relName === 'string' ? item.relName : '';
                      return (
                        <div
                          key={i}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '10px',
                            padding: '8px 12px',
                            borderRadius: '8px',
                            background:
                              itemType === 'bad'
                                ? 'rgba(244,67,54,0.05)'
                                : itemType === 'good'
                                  ? 'rgba(76,175,80,0.05)'
                                  : 'rgba(255,255,255,0.02)',
                            borderLeft: `3px solid ${itemType === 'bad' ? '#f44336' : itemType === 'good' ? '#4caf50' : '#555'}`,
                          }}
                        >
                          <div
                            style={{
                              fontSize: '1.1rem',
                              width: '24px',
                              textAlign: 'center',
                              flexShrink: 0,
                              marginTop: '1px',
                            }}
                          >
                            {item?.category === 'geopolitics'
                              ? itemType === 'bad'
                                ? '⚔️'
                                : itemType === 'good'
                                  ? '🌍'
                                  : '🏛️'
                              : itemType === 'bad'
                                ? '⚠️'
                                : itemType === 'good'
                                  ? '✨'
                                  : '📰'}
                          </div>
                          <div style={{ flex: 1, fontSize: '0.9rem' }}>
                            {relName ? (
                              <span
                                style={{
                                  color: '#ffd700',
                                  fontWeight: 600,
                                  marginRight: '4px',
                                }}
                              >
                                {relName}
                              </span>
                            ) : null}
                            <span style={{ color: '#ddd' }}>{itemText}</span>
                            {item?.category === 'geopolitics' && (
                              <span
                                style={{
                                  marginLeft: '6px',
                                  fontSize: '0.65rem',
                                  padding: '1px 6px',
                                  borderRadius: '3px',
                                  background: 'rgba(33,150,243,0.15)',
                                  color: '#64b5f6',
                                  fontWeight: 700,
                                  verticalAlign: 'middle',
                                }}
                              >
                                WORLD
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  } catch (e) {
    content = (
      <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
        <p>{t('worldNews.empty', 'No news yet. As the world turns, stories will appear here.')}</p>
      </div>
    );
  }

  return (
    <div className="modal-overlay">
      <div
        className="modal-content"
        dir={dir}
        style={{ maxWidth: '650px', maxHeight: '90vh', overflow: 'auto' }}
      >
        <div className="modal-header">
          <h2 className="modal-title">{t('worldNews.title', 'World News')}</h2>
          <button className="close-btn" onClick={onClose} type="button">
            &times;
          </button>
        </div>

        {content}
      </div>
    </div>
  );
}
