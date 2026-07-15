import React, { useState } from 'react';
import './Modal.css';

const TRAITS = ['Athletic', 'Genius', 'Charismatic', 'Musical', 'Reckless', 'Resilient', 'Fertile'];

export function GodModeMenu({ person, onUpdate, onClose, t = (key, fallback) => fallback || key }) {
  const [stats, setStats] = useState({
    money: person.money,
    happiness: person.happiness,
    health: person.health,
    smarts: person.smarts,
    looks: person.looks,
    karma: person.karma || 50,
    stress: person.stress || 0,
    fame: person.fame || 0,
    notoriety: person.notoriety || 0,
    energy: person.energy ?? 100,
  });
  const [newAge, setNewAge] = useState(person.age);

  const handleChange = (field, value) => {
    setStats(prev => ({ ...prev, [field]: Number(value) }));
  };

  const apply = fn => {
    onUpdate(fn);
    onClose();
  };

  const maxAll = () =>
    setStats({
      money: 999999999,
      happiness: 100,
      health: 100,
      smarts: 100,
      looks: 100,
      karma: 100,
      stress: 0,
      fame: 100,
      notoriety: 0,
      energy: 100,
    });

  const sectionStyle = {
    background: 'rgba(255,215,0,0.05)',
    borderRadius: '12px',
    padding: '12px',
    marginBottom: '12px',
    border: '1px solid rgba(255,215,0,0.1)',
  };

  return (
    <div className="modal-overlay">
      <div
        className="modal-content"
        style={{ borderColor: '#ffd700', boxShadow: '0 0 30px rgba(255, 215, 0, 0.3)' }}
      >
        <div className="modal-header">
          <h2 className="modal-title" style={{ color: '#ffd700' }}>
            {t('godmode.title', '⚡ God Mode')}
          </h2>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>
        <div
          className="modal-body"
          style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
        >
          {/* Quick Actions */}
          <div style={sectionStyle}>
            <div style={{ fontWeight: 700, marginBottom: '8px', color: '#ffd700' }}>
              {t('godmode.quickActions', 'Quick Actions')}
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                className="btn-secondary"
                style={{ flex: 1, fontSize: '0.8rem', padding: '10px' }}
                onClick={maxAll}
              >
                {t('godmode.maxAll', 'Max All')}
              </button>
              <button
                className="btn-secondary"
                style={{
                  flex: 1,
                  fontSize: '0.8rem',
                  padding: '10px',
                  background: 'rgba(0,200,83,0.2)',
                }}
                onClick={() =>
                  apply(p => {
                    p.money += 1000000;
                    p.logEvent(t('godmode.eventPlus1M', 'God Mode: +$1M'), 'good');
                  })
                }
              >
                {t('godmode.plus1M', '+$1M')}
              </button>
              <button
                className="btn-secondary"
                style={{
                  flex: 1,
                  fontSize: '0.8rem',
                  padding: '10px',
                  background: 'rgba(0,200,83,0.2)',
                }}
                onClick={() =>
                  apply(p => {
                    p.money += 10000000;
                    p.logEvent(t('godmode.eventPlus10M', 'God Mode: +$10M'), 'good');
                  })
                }
              >
                {t('godmode.plus10M', '+$10M')}
              </button>
              <button
                className="btn-secondary"
                style={{
                  flex: 1,
                  fontSize: '0.8rem',
                  padding: '10px',
                  background: 'rgba(255,65,108,0.2)',
                }}
                onClick={() =>
                  apply(p => {
                    p.notoriety = 0;
                    p.isInPrison = false;
                    p.prisonSentence = 0;
                    p.logEvent(t('godmode.eventClearedCrimes', 'God Mode: Cleared crimes'), 'good');
                  })
                }
              >
                {t('godmode.clearCrime', 'Clear Crime')}
              </button>
              <button
                className="btn-secondary"
                style={{
                  flex: 1,
                  fontSize: '0.8rem',
                  padding: '10px',
                  background: 'rgba(79,172,254,0.2)',
                }}
                onClick={() =>
                  apply(p => {
                    p.health = 100;
                    p.age = Math.min(p.age, 30);
                    p.stress = 0;
                    p.logEvent(t('godmode.eventRejuvenated', 'God Mode: Rejuvenated'), 'good');
                  })
                }
              >
                {t('godmode.rejuvenate', 'Rejuvenate')}
              </button>
            </div>
          </div>

          {/* Stats */}
          <div style={sectionStyle}>
            <div style={{ fontWeight: 700, marginBottom: '8px', color: '#ffd700' }}>
              {t('godmode.stats', 'Stats')}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label style={{ fontSize: '0.75rem' }}>{t('godmode.money', 'Money ($)')}</label>
                <input
                  type="number"
                  value={stats.money}
                  onChange={e => handleChange('money', e.target.value)}
                  className="text-input"
                  style={{ width: '100%' }}
                />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label style={{ fontSize: '0.75rem' }}>{t('godmode.happiness', 'Happiness')}</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={stats.happiness}
                  onChange={e => handleChange('happiness', e.target.value)}
                  style={{ width: '100%' }}
                />
                <span style={{ fontSize: '0.7rem', float: 'right' }}>{stats.happiness}%</span>
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label style={{ fontSize: '0.75rem' }}>{t('godmode.health', 'Health')}</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={stats.health}
                  onChange={e => handleChange('health', e.target.value)}
                  style={{ width: '100%' }}
                />
                <span style={{ fontSize: '0.7rem', float: 'right' }}>{stats.health}%</span>
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label style={{ fontSize: '0.75rem' }}>{t('godmode.smarts', 'Smarts')}</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={stats.smarts}
                  onChange={e => handleChange('smarts', e.target.value)}
                  style={{ width: '100%' }}
                />
                <span style={{ fontSize: '0.7rem', float: 'right' }}>{stats.smarts}%</span>
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label style={{ fontSize: '0.75rem' }}>{t('godmode.looks', 'Looks')}</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={stats.looks}
                  onChange={e => handleChange('looks', e.target.value)}
                  style={{ width: '100%' }}
                />
                <span style={{ fontSize: '0.7rem', float: 'right' }}>{stats.looks}%</span>
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label style={{ fontSize: '0.75rem' }}>{t('godmode.stress', 'Stress')}</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={stats.stress}
                  onChange={e => handleChange('stress', e.target.value)}
                  style={{ width: '100%' }}
                />
                <span style={{ fontSize: '0.7rem', float: 'right' }}>{stats.stress}%</span>
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label style={{ fontSize: '0.75rem' }}>{t('godmode.fame', 'Fame')}</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={stats.fame}
                  onChange={e => handleChange('fame', e.target.value)}
                  style={{ width: '100%' }}
                />
                <span style={{ fontSize: '0.7rem', float: 'right' }}>{stats.fame}%</span>
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label style={{ fontSize: '0.75rem' }}>{t('godmode.energy', 'Energy')}</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={stats.energy}
                  onChange={e => handleChange('energy', e.target.value)}
                  style={{ width: '100%' }}
                />
                <span style={{ fontSize: '0.7rem', float: 'right' }}>{stats.energy}%</span>
              </div>
            </div>
          </div>

          {/* Traits */}
          <div style={sectionStyle}>
            <div style={{ fontWeight: 700, marginBottom: '8px', color: '#ffd700' }}>
              {t('godmode.traits', 'Traits')}
            </div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {TRAITS.map(trait => {
                const has = (person.traits || []).includes(trait);
                return (
                  <button
                    key={trait}
                    className={`language-chip ${has ? 'active' : ''}`}
                    style={{ fontSize: '0.75rem', padding: '6px 10px' }}
                    onClick={() =>
                      apply(p => {
                        if (!Array.isArray(p.traits)) {
                          p.traits = [];
                        }
                        if (p.traits.includes(trait)) {
                          p.traits = p.traits.filter(t => t !== trait);
                        } else {
                          p.traits.push(trait);
                        }
                        p.logEvent(
                          t('godmode.eventToggledTrait', `God Mode: Toggled trait ${trait}`),
                          'neutral'
                        );
                      })
                    }
                  >
                    {has ? t('godmode.active', '✓ ') : t('godmode.inactive', '+ ')}
                    {trait}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Age & Education */}
          <div style={sectionStyle}>
            <div style={{ fontWeight: 700, marginBottom: '8px', color: '#ffd700' }}>
              {t('godmode.ageAndEducation', 'Age & Education')}
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <label style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                {t('godmode.setAge', 'Set Age:')}
              </label>
              <input
                type="number"
                value={newAge}
                onChange={e => setNewAge(Number(e.target.value))}
                style={{
                  width: '70px',
                  padding: '4px',
                  borderRadius: '6px',
                  border: '1px solid rgba(255,215,0,0.3)',
                  background: 'rgba(0,0,0,0.3)',
                  color: '#fff',
                }}
              />
              <button
                className="btn-secondary"
                style={{ fontSize: '0.75rem', padding: '6px 12px' }}
                onClick={() =>
                  apply(p => {
                    p.age = newAge;
                    p.logEvent(
                      t('godmode.eventAgeSet', `God Mode: Age set to ${newAge}`),
                      'neutral'
                    );
                  })
                }
              >
                {t('godmode.apply', 'Apply')}
              </button>
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
              <button
                className="btn-secondary"
                style={{ flex: 1, fontSize: '0.75rem', padding: '8px' }}
                onClick={() =>
                  apply(p => {
                    if (!Array.isArray(p.degrees)) {
                      p.degrees = [];
                    }
                    const allDegrees = [
                      'High School Diploma',
                      'Bachelor of Science',
                      'Master of Science',
                      'PhD',
                      'Medical Degree',
                      'Law Degree',
                    ];
                    allDegrees.forEach(d => {
                      if (!p.degrees.some(x => x.name === d)) {
                        p.degrees.push({ name: d, type: d, year: p.age });
                      }
                    });
                    if (!p.educationHistory) {
                      p.educationHistory = [];
                    }
                    ['High School', 'University', 'Medical School'].forEach(e => {
                      if (!p.educationHistory.includes(e)) {
                        p.educationHistory.push(e);
                      }
                    });
                    p.logEvent(
                      t('godmode.eventAllDegrees', 'God Mode: All degrees granted'),
                      'good'
                    );
                  })
                }
              >
                {t('godmode.allDegrees', 'All Degrees')}
              </button>
              <button
                className="btn-secondary"
                style={{ flex: 1, fontSize: '0.75rem', padding: '8px' }}
                onClick={() =>
                  apply(p => {
                    if (!Array.isArray(p.languages)) {
                      p.languages = ['English'];
                    }
                    const langs = [
                      'Spanish',
                      'French',
                      'German',
                      'Mandarin',
                      'Japanese',
                      'Arabic',
                      'Portuguese',
                      'Russian',
                      'Italian',
                      'Korean',
                    ];
                    langs.forEach(l => {
                      if (!p.languages.includes(l)) {
                        p.languages.push(l);
                      }
                    });
                    p.logEvent(
                      t('godmode.eventAllLanguages', 'God Mode: All languages learned'),
                      'good'
                    );
                  })
                }
              >
                {t('godmode.allLanguages', 'All Languages')}
              </button>
            </div>
          </div>

          {/* Apply */}
          <button
            className="btn-primary"
            onClick={() =>
              apply(p => {
                p.money = stats.money;
                p.happiness = stats.happiness;
                p.health = stats.health;
                p.smarts = stats.smarts;
                p.looks = stats.looks;
                p.karma = stats.karma;
                p.stress = stats.stress;
                p.fame = stats.fame;
                p.notoriety = stats.notoriety;
                p.energy = stats.energy;
                p.logEvent(
                  t('godmode.eventAlterReality', 'GOD MODE ACTIVATED: Reality has been altered.'),
                  'good'
                );
              })
            }
            style={{
              background: 'linear-gradient(45deg, #ffd700, #ffa500)',
              color: 'black',
              fontWeight: 'bold',
            }}
          >
            {t('godmode.alterReality', '⚡ Alter Reality')}
          </button>
        </div>
      </div>
    </div>
  );
}
