import React, { useMemo } from 'react';
import './Timeline.css';

export function LifeTimeline({ person, onClose, t = (key, fallback) => fallback || key }) {
  const events = person.history || [];

  const milestones = useMemo(() => {
    const m = [];
    for (const ev of events) {
      const txt = ev.text || '';
      if (txt.includes('graduated') || txt.includes('degree') || txt.includes('diploma'))
        m.push({ age: ev.age, icon: '🎓', text: txt, type: 'education' });
      if (txt.includes('married') || txt.includes('got married'))
        m.push({ age: ev.age, icon: '💍', text: txt, type: 'relationship' });
      if (txt.includes('divorced'))
        m.push({ age: ev.age, icon: '💔', text: txt, type: 'relationship' });
      if (txt.includes('born') || (txt.includes('child') && txt.includes('had')))
        m.push({ age: ev.age, icon: '👶', text: txt, type: 'family' });
      if (txt.includes('promoted') || (txt.includes('job') && txt.includes('got')))
        m.push({ age: ev.age, icon: '💼', text: txt, type: 'career' });
      if (txt.includes('retired'))
        m.push({ age: ev.age, icon: '🏖️', text: txt, type: 'career' });
      if ((txt.includes('bought') || txt.includes('purchased')) && (txt.includes('house') || txt.includes('car')))
        m.push({ age: ev.age, icon: '🏠', text: txt, type: 'asset' });
      if (txt.includes('arrested') || txt.includes('sentenced'))
        m.push({ age: ev.age, icon: '⛓️', text: txt, type: 'crime' });
      if (txt.includes('elected') || txt.includes('became president') || txt.includes('mayor'))
        m.push({ age: ev.age, icon: '🏛️', text: txt, type: 'politics' });
    }
    return m.sort((a, b) => a.age - b.age);
  }, [events]);

  const currentAge = person.age || 0;
  const lifelineYears = Array.from({ length: currentAge + 1 }, (_, i) => i);
  const milestoneAges = new Set(milestones.map(m => m.age));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content timeline-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">📈 {t('lifeTimeline.title', 'Life Timeline')}</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          <div className="timeline-track">
            {lifelineYears.map(year => {
              const isMilestone = milestoneAges.has(year);
              const m = isMilestone ? milestones.find(mm => mm.age === year) : null;
              return (
                <div key={year}
                  className={`timeline-year${isMilestone ? ' milestone' : ''}${year === currentAge ? ' current' : ''}`}
                >
                  <div className={`timeline-dot${isMilestone ? ' milestone' : ''}${year === currentAge ? ' current' : ''}`} />
                  <div className={`timeline-age${year === currentAge ? ' current' : ''}`}>
                    {year}{year === currentAge && ' ⬅️'}
                  </div>
                  <div className="timeline-card">
                    {m ? (
                      <div className={`event-card timeline-event-card type-${m.type || 'neutral'}`}>
                        <span style={{ marginRight: '6px' }}>{m.icon}</span>
                        <span className="event-text">{m.text.length > 60 ? m.text.slice(0, 60) + '...' : m.text}</span>
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>

          {milestones.length === 0 && (
            <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '20px 0' }}>
              {t('lifeTimeline.empty', 'No major milestones yet. Go live your life!')}
            </div>
          )}

          <div className="timeline-summary">
            {milestones.length} {t('lifeTimeline.milestones', 'milestones')}, {events.length} {t('lifeTimeline.totalEvents', 'total events')}
          </div>
        </div>
      </div>
    </div>
  );
}
