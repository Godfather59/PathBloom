import React, { useMemo } from 'react';
import './Modal.css';
import './RelationshipDashboard.css';

const REL_EMOJI = {
  Spouse: '💑',
  Partner: '💕',
  Fiance: '💍',
  Child: '👶',
  Sibling: '👫',
  Mother: '👩',
  Father: '👨',
  Parent: '👪',
  'Best Friend': '🤝',
  Friend: '🤝',
  King: '👑',
  Queen: '👑',
};

const REL_ORDER = ['Spouse', 'Fiance', 'Partner', 'Child', 'Sibling', 'Mother', 'Father', 'Parent', 'Best Friend', 'Friend', 'King', 'Queen'];

function statColor(value) {
  if (value >= 80) return '#4caf50';
  if (value >= 50) return '#ff9800';
  return '#f44336';
}

export function RelationshipDashboard({ person, onClose, onOpenFullManager, t = (key, fallback) => fallback || key }) {
  const stats = useMemo(() => {
    const rels = person.relationships || [];
    const alive = rels.filter(r => r.status !== 'Deceased');
    const deceased = rels.filter(r => r.status === 'Deceased');
    const counts = {};
    for (const r of alive) {
      counts[r.type] = (counts[r.type] || 0) + 1;
    }
    const totalStat = alive.reduce((sum, r) => sum + (r.stat || 50), 0);
    const avgStat = alive.length > 0 ? Math.round(totalStat / alive.length) : 0;
    const sorted = [...alive].sort((a, b) => (b.stat || 0) - (a.stat || 0));
    const strongest = sorted[0] || null;
    const weakest = sorted[sorted.length - 1] || null;
    const inConflict = alive.filter(r => r.activeConflict);
    const hasPromise = alive.filter(r => r.promise?.status === 'active');
    return { alive, deceased, counts, avgStat, strongest, weakest, sorted, inConflict, hasPromise };
  }, [person]);

  if (!person) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content dashboard-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">📊 {t('dashboard.title', 'Relationship Dashboard')}</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="modal-body">
          <div className="dashboard-summary">
            <div className="summary-card">
              <div className="summary-value">{stats.alive.length}</div>
              <div className="summary-label">{t('dashboard.alive', 'Alive')}</div>
            </div>
            {stats.deceased.length > 0 && (
              <div className="summary-card dim">
                <div className="summary-value">{stats.deceased.length}</div>
                <div className="summary-label">{t('dashboard.deceased', 'Departed')}</div>
              </div>
            )}
            <div className="summary-card">
              <div className="summary-value" style={{ color: statColor(stats.avgStat) }}>{stats.avgStat}%</div>
              <div className="summary-label">{t('dashboard.avgHealth', 'Avg Health')}</div>
            </div>
            <div className="summary-card">
              <div className="summary-value">{stats.inConflict.length}</div>
              <div className="summary-label">{t('dashboard.conflicts', 'Conflicts')}</div>
            </div>
          </div>

          {stats.alive.length === 0 ? (
            <div className="empty-state-badge" style={{ marginTop: '20px' }}>
              {t('dashboard.noRelationships', 'No relationships yet. Go make some friends!')}
            </div>
          ) : (
            <>
              {Object.entries(stats.counts).map(([type, count]) => (
                <div key={type} className="dashboard-type-row">
                  <span className="dashboard-type-label">
                    <span className="dashboard-type-emoji">{REL_EMOJI[type] || '👤'}</span>
                    {type}{count > 1 ? ` (${count})` : ''}
                  </span>
                  <div className="dashboard-type-bar-track">
                    {stats.sorted.filter(r => r.type === type && r.status !== 'Deceased').map(r => (
                      <div
                        key={r.id}
                        className="dashboard-type-bar-fill"
                        style={{
                          width: `${r.stat}%`,
                          backgroundColor: statColor(r.stat),
                        }}
                        title={`${r.name}: ${r.stat}%`}
                      />
                    ))}
                  </div>
                </div>
              ))}

              <div className="section-heading" style={{ marginTop: '16px' }}>
                {t('dashboard.allRelationships', 'All Relationships')}
              </div>

              <div className="dashboard-list">
                {stats.sorted.map(r => (
                  <div key={r.id} className="dashboard-list-item">
                    <div className="dashboard-list-left">
                      <span className="dashboard-list-emoji">{REL_EMOJI[r.type] || '👤'}</span>
                      <div>
                        <div className="dashboard-list-name">{r.name}</div>
                        <div className="dashboard-list-type">{r.type}</div>
                      </div>
                    </div>
                    <div className="dashboard-list-right">
                      <div className="dashboard-list-bar-track">
                        <div
                          className="dashboard-list-bar-fill"
                          style={{
                            width: `${r.stat}%`,
                            backgroundColor: statColor(r.stat),
                          }}
                        />
                      </div>
                      <div className="dashboard-list-pct">{r.stat}%</div>
                    </div>
                    <div className="dashboard-list-badges">
                      {r.activeConflict && <span className="badge badge-conflict" title={t('dashboard.conflictTooltip', 'Unresolved conflict')}>⚡</span>}
                      {r.promise?.status === 'active' && <span className="badge badge-promise" title={t('dashboard.promiseTooltip', 'Promise pending')}>📜</span>}
                      {r.financialArrangement && <span className="badge badge-finance" title={t('dashboard.financeTooltip', 'Shared finances')}>💰</span>}
                    </div>
                  </div>
                ))}
              </div>

              {stats.deceased.length > 0 && (
                <>
                  <div className="section-heading" style={{ marginTop: '16px' }}>
                    {t('dashboard.deceased', 'Departed')}
                  </div>
                  <div className="dashboard-list">
                    {stats.deceased.map(r => (
                      <div key={r.id} className="dashboard-list-item deceased">
                        <div className="dashboard-list-left">
                          <span className="dashboard-list-emoji">🕊️</span>
                          <div>
                            <div className="dashboard-list-name">{r.name}</div>
                            <div className="dashboard-list-type">{r.type}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}

          <div className="dashboard-actions">
            <button className="btn-primary" onClick={onOpenFullManager}>
              {t('dashboard.openManager', 'Open Full Relationship Manager')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
