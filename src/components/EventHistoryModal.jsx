import React, { useMemo, useState } from 'react';
import './Timeline.css';

export function EventHistoryModal({ person, onClose, t = (key, fallback) => fallback || key }) {
  const [filter, setFilter] = useState('all');

  const getReason = event => {
    if (!event || !event.text) {
      return '';
    }
    const txt = event.text.toLowerCase();
    if (txt.includes('war') || txt.includes('battle') || txt.includes('enlist')) {
      return '⚔️ Caused by geopolitical conflict';
    }
    if (
      txt.includes('crime') ||
      txt.includes('arrest') ||
      txt.includes('prison') ||
      txt.includes('rob')
    ) {
      return '🚔 Caused by criminal activity';
    }
    if (
      txt.includes('promot') ||
      txt.includes('salary') ||
      txt.includes('hire') ||
      txt.includes('fired')
    ) {
      return '💼 Career event';
    }
    if (
      txt.includes('relation') ||
      txt.includes('friend') ||
      txt.includes('love') ||
      txt.includes('married') ||
      txt.includes('divorce') ||
      txt.includes('child')
    ) {
      return '👨‍👩‍👧‍👦 Relationship event';
    }
    if (
      txt.includes('health') ||
      txt.includes('hospital') ||
      txt.includes('disease') ||
      txt.includes('sick') ||
      txt.includes('die') ||
      txt.includes('death')
    ) {
      return '🏥 Health-related event';
    }
    if (
      txt.includes('invest') ||
      txt.includes('stock') ||
      txt.includes('money') ||
      txt.includes('bought') ||
      txt.includes('sold')
    ) {
      return '💰 Financial event';
    }
    if (
      txt.includes('school') ||
      txt.includes('college') ||
      txt.includes('university') ||
      txt.includes('degree') ||
      txt.includes('study')
    ) {
      return '📚 Education event';
    }
    if (
      txt.includes('protest') ||
      txt.includes('politics') ||
      txt.includes('vote') ||
      txt.includes('campaign') ||
      txt.includes('election')
    ) {
      return '🗳️ Political event';
    }
    if (event.type === 'good') {
      return '✅ Positive life event';
    }
    if (event.type === 'bad') {
      return '❌ Negative life event';
    }
    return '📝 Life event';
  };

  const grouped = useMemo(() => {
    const events = [...(person.history || [])].reverse();
    const decades = {};
    for (const ev of events) {
      const decade = Math.floor((ev.age || 0) / 10) * 10;
      if (!decades[decade]) {
        decades[decade] = [];
      }
      decades[decade].push(ev);
    }
    return Object.entries(decades).sort((a, b) => b[0] - a[0]);
  }, [person]);

  const filtered = useMemo(() => {
    if (filter === 'all') {
      return grouped;
    }
    return grouped
      .map(([decade, events]) => [decade, events.filter(e => e.type === filter)])
      .filter(([_, events]) => events.length > 0);
  }, [grouped, filter]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: '500px' }}
      >
        <div className="modal-header">
          <h2 className="modal-title">📜 {t('eventHistory.title', 'Event History')}</h2>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          <div className="event-history-filters">
            {['all', 'good', 'bad', 'neutral'].map(f => (
              <button
                key={f}
                className={`btn-sm ${filter === f ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setFilter(f)}
              >
                {f === 'all'
                  ? t('eventHistory.all', 'All')
                  : f === 'good'
                    ? t('eventHistory.good', 'Good')
                    : f === 'bad'
                      ? t('eventHistory.bad', 'Bad')
                      : t('eventHistory.neutral', 'Neutral')}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '40px 0' }}>
              {t('eventHistory.empty', 'No events recorded yet.')}
            </div>
          ) : (
            filtered.map(([decade, events]) => (
              <div key={decade} style={{ marginBottom: '16px' }}>
                <div className="decade-header">
                  {t('eventHistory.decade', 'Decade')} {decade}'s
                </div>
                {events.slice(0, 50).map((ev, i) => (
                  <div
                    key={ev.id || i}
                    className={`event-card type-${ev.type || 'neutral'}`}
                    style={{ marginBottom: '4px', cursor: 'default' }}
                    title={getReason(ev)}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                      }}
                    >
                      <div className="event-text" style={{ flex: 1 }}>
                        {ev.text}
                      </div>
                      <span
                        className="event-age-badge"
                        style={{ marginLeft: '8px', whiteSpace: 'nowrap' }}
                      >
                        {t('common.age', 'Age')} {ev.age}
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: '0.7rem',
                        color: 'var(--text-secondary)',
                        marginTop: '2px',
                        fontStyle: 'italic',
                      }}
                    >
                      {getReason(ev)}
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
