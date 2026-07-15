import React, { useState } from 'react';
import './Modal.css';

export function FamilyTreeMenu({ familyTree, onClose, t = (key, fallback) => fallback || key }) {
  const [selectedMember, setSelectedMember] = useState(null);
  const [tab, setTab] = useState('overview');
  const generationCount = familyTree.getGenerationCount();
  const patriarch = familyTree.getPatriarchMatriarch();
  const mostSuccessful = familyTree.getMostSuccessful();
  const mostFamous = familyTree.getMostFamous();
  const repRank = familyTree.getReputationRank();
  const milestones = familyTree.getUnlockedMilestones();
  const heirlooms = familyTree.getHeirlooms();
  const bonus = familyTree.getGenerationBonus();

  const formatMoney = amount => {
    if (amount >= 1000000000) {
      return `$${(amount / 1000000000).toFixed(2)}B`;
    }
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(2)}M`;
    }
    return `$${amount.toLocaleString()}`;
  };

  const renderDetail = m => {
    if (!m) {
      return null;
    }
    return (
      <div
        style={{
          background: 'rgba(255,215,0,0.08)',
          border: '1px solid rgba(255,215,0,0.3)',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '16px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px',
          }}
        >
          <h3 style={{ margin: 0, color: '#ffd700' }}>{m.name}</h3>
          <button
            style={{
              background: 'none',
              border: 'none',
              color: '#888',
              fontSize: '1.2rem',
              cursor: 'pointer',
            }}
            onClick={() => setSelectedMember(null)}
          >
            &times;
          </button>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '8px',
            fontSize: '0.9rem',
          }}
        >
          <div>
            <span style={{ color: '#888' }}>{t('family.born', 'Born:')}</span> {m.birthYear}
          </div>
          <div>
            <span style={{ color: '#888' }}>{t('family.died', 'Died:')}</span>{' '}
            {m.deathYear || t('family.living', 'Living')}
          </div>
          <div>
            <span style={{ color: '#888' }}>{t('family.age', 'Age:')}</span> {m.age}
          </div>
          <div>
            <span style={{ color: '#888' }}>{t('family.occupation', 'Occupation:')}</span>{' '}
            {m.occupation || t('family.none', 'None')}
          </div>
          <div>
            <span style={{ color: '#888' }}>{t('family.wealth', 'Wealth:')}</span>{' '}
            {formatMoney(m.peakWealth || 0)}
          </div>
          <div>
            <span style={{ color: '#888' }}>{t('family.fame', 'Fame:')}</span> {m.fame ?? 0}
          </div>
          {m.happiness != null && (
            <div>
              <span style={{ color: '#888' }}>{t('family.happiness', 'Happiness:')}</span>{' '}
              {m.happiness}/100
            </div>
          )}
          {m.health != null && (
            <div>
              <span style={{ color: '#888' }}>{t('family.health', 'Health:')}</span> {m.health}/100
            </div>
          )}
          {m.smarts != null && (
            <div>
              <span style={{ color: '#888' }}>{t('family.smarts', 'Smarts:')}</span> {m.smarts}/100
            </div>
          )}
          {m.looks != null && (
            <div>
              <span style={{ color: '#888' }}>{t('family.looks', 'Looks:')}</span> {m.looks}/100
            </div>
          )}
          <div>
            <span style={{ color: '#888' }}>{t('family.children', 'Children:')}</span>{' '}
            {m.children ?? 0}
          </div>
          {m.marriageCount != null && (
            <div>
              <span style={{ color: '#888' }}>{t('family.marriages', 'Marriages:')}</span>{' '}
              {m.marriageCount}
            </div>
          )}
          {m.royalty && (
            <div>
              <span style={{ color: '#888' }}>{t('family.royalty', 'Royalty:')}</span> {m.royalty}
            </div>
          )}
          {m.companies > 0 && (
            <div>
              <span style={{ color: '#888' }}>{t('family.companies', 'Companies:')}</span>{' '}
              {m.companies}
            </div>
          )}
          {m.achievements > 0 && (
            <div>
              <span style={{ color: '#888' }}>{t('family.achievements', 'Achievements:')}</span>{' '}
              {m.achievements}
            </div>
          )}
          {m.legacyScore != null && (
            <div>
              <span style={{ color: '#888' }}>{t('family.legacyScore', 'Legacy Score:')}</span>{' '}
              {m.legacyScore}
            </div>
          )}
        </div>
        {Array.isArray(m.traits) && m.traits.length > 0 && (
          <div style={{ marginTop: '10px' }}>
            <span style={{ color: '#888', fontSize: '0.85rem' }}>
              {t('family.traits', 'Traits:')}{' '}
            </span>
            {m.traits.map(t => (
              <span
                key={t}
                className="language-chip active"
                style={{ fontSize: '0.75rem', padding: '2px 8px' }}
              >
                {t}
              </span>
            ))}
          </div>
        )}
        {Array.isArray(m.lifeEvents) && m.lifeEvents.length > 0 && (
          <div style={{ marginTop: '10px' }}>
            <span style={{ color: '#888', fontSize: '0.85rem' }}>
              {t('family.finalYears', 'Final Years:')}{' '}
            </span>
            {m.lifeEvents.slice(0, 3).map((ev, i) => (
              <div key={i} style={{ fontSize: '0.8rem', color: '#aaa', marginTop: '4px' }}>
                {typeof ev === 'string' ? ev : ev.text || ev.message || ''}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderCard = (m, extraStyle) => {
    const isSelected = selectedMember?.id === m.id;
    return (
      <div
        key={m.id}
        className="list-item"
        style={{
          padding: '10px 14px',
          cursor: 'pointer',
          border: `2px solid ${isSelected ? '#ffd700' : 'transparent'}`,
          background: isSelected ? 'rgba(255,215,0,0.08)' : undefined,
          transition: 'all 0.2s',
          ...extraStyle,
        }}
        onClick={() => setSelectedMember(isSelected ? null : m)}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 'bold' }}>{m.name}</div>
            <div style={{ fontSize: '0.85rem', color: '#bbb', marginTop: '2px' }}>
              {m.birthYear} - {m.deathYear || t('family.present', 'Present')} ·{' '}
              {m.occupation || t('family.none', 'None')}
            </div>
          </div>
          <div
            style={{ textAlign: 'right', color: '#4caf50', fontWeight: 'bold', fontSize: '0.9rem' }}
          >
            {formatMoney(m.peakWealth || 0)}
          </div>
        </div>
      </div>
    );
  };

  const tabStyle = t => ({
    padding: '8px 16px',
    border: 'none',
    borderRadius: '8px',
    background: tab === t ? '#ffd700' : 'rgba(255,255,255,0.06)',
    color: tab === t ? '#000' : '#ccc',
    fontWeight: tab === t ? 'bold' : 'normal',
    cursor: 'pointer',
    fontSize: '0.85rem',
    transition: 'all 0.2s',
  });

  const renderOverview = () => (
    <div>
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(255,215,0,0.1), rgba(184,134,11,0.1))',
          padding: '20px',
          borderRadius: '12px',
          marginBottom: '20px',
          border: '1px solid rgba(255,215,0,0.3)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
          }}
        >
          <h3 style={{ margin: 0, fontSize: '1.2em' }}>
            {repRank.icon} {familyTree.familyName} Dynasty
          </h3>
          <span
            style={{
              background: 'rgba(255,215,0,0.15)',
              color: '#ffd700',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: 'bold',
            }}
          >
            {repRank.title}
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '0.85em', color: '#888' }}>
              {t('family.generations', 'Generations')}
            </div>
            <div style={{ fontSize: '1.8em', fontWeight: 'bold', color: '#ffd700' }}>
              {generationCount}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.85em', color: '#888' }}>
              {t('family.totalWealth', 'Total Wealth')}
            </div>
            <div style={{ fontSize: '1.8em', fontWeight: 'bold', color: '#4caf50' }}>
              {formatMoney(familyTree.getTotalFamilyWealth())}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.85em', color: '#888' }}>
              {t('family.founded', 'Founded')}
            </div>
            <div style={{ fontSize: '1.8em', fontWeight: 'bold' }}>
              {familyTree.foundedYear || 'N/A'}
            </div>
          </div>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '16px',
            marginTop: '16px',
            paddingTop: '16px',
            borderTop: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <div>
            <div style={{ fontSize: '0.85em', color: '#888' }}>
              {t('family.familyReputation', 'Family Reputation')}
            </div>
            <div style={{ fontSize: '1.2em', fontWeight: 'bold', color: '#ffd700' }}>
              {familyTree.familyReputation}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.85em', color: '#888' }}>
              {t('family.legacyScore', 'Legacy Score')}
            </div>
            <div style={{ fontSize: '1.2em', fontWeight: 'bold', color: '#4caf50' }}>
              {familyTree.getFamilyLegacyScore()}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.85em', color: '#888' }}>
              {t('family.heirlooms', 'Heirlooms')}
            </div>
            <div style={{ fontSize: '1.2em', fontWeight: 'bold', color: '#ffd700' }}>
              {heirlooms.length}
            </div>
          </div>
        </div>
      </div>

      {milestones.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h3
            style={{
              fontSize: '0.9rem',
              color: '#888',
              textTransform: 'uppercase',
              marginBottom: '12px',
            }}
          >
            {t('family.milestonesUnlocked', 'Milestones Unlocked')}
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {milestones.map(m => (
              <div
                key={m.id}
                style={{
                  background: 'rgba(255,215,0,0.08)',
                  border: '1px solid rgba(255,215,0,0.2)',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  fontSize: '0.8rem',
                }}
              >
                <span style={{ marginRight: '6px' }}>{m.icon}</span>
                <strong>{m.name}</strong>
                <div style={{ color: '#888', fontSize: '0.75rem', marginTop: '2px' }}>{m.desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {generationCount > 1 && (
        <div
          style={{
            background: 'rgba(76,175,80,0.06)',
            border: '1px solid rgba(76,175,80,0.2)',
            borderRadius: '12px',
            padding: '14px',
            marginBottom: '20px',
          }}
        >
          <h4 style={{ margin: '0 0 8px 0', fontSize: '0.9rem', color: '#4caf50' }}>
            {t('family.genBonus', 'Generation Bonus (Next Heir)')}
          </h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', fontSize: '0.85rem' }}>
            {bonus.smarts > 0 && <span>+{bonus.smarts} Smarts</span>}
            {bonus.looks > 0 && <span>+{bonus.looks} Looks</span>}
            {bonus.health > 0 && <span>+{bonus.health} Health</span>}
            {bonus.happiness > 0 && <span>+{bonus.happiness} Happiness</span>}
            {bonus.fame > 0 && <span>+{bonus.fame} Fame</span>}
            {bonus.money > 0 && <span>+{formatMoney(bonus.money)}</span>}
          </div>
        </div>
      )}

      {selectedMember && renderDetail(selectedMember)}

      {patriarch && (
        <div style={{ marginBottom: '16px' }}>
          <h3
            style={{
              fontSize: '0.9rem',
              color: '#888',
              textTransform: 'uppercase',
              marginBottom: '12px',
            }}
          >
            {t('family.founder', 'Founder')}
          </h3>
          {renderCard(patriarch, {
            border:
              selectedMember?.id === patriarch.id
                ? '2px solid #ffd700'
                : '2px solid rgba(255,215,0,0.3)',
          })}
        </div>
      )}

      {mostSuccessful && mostSuccessful.id !== patriarch?.id && (
        <div style={{ marginBottom: '16px' }}>
          <h3
            style={{
              fontSize: '0.9rem',
              color: '#888',
              textTransform: 'uppercase',
              marginBottom: '12px',
            }}
          >
            {t('family.wealthiest', 'Wealthiest')}
          </h3>
          {renderCard(mostSuccessful, { border: '2px solid rgba(76,175,80,0.3)' })}
        </div>
      )}

      {mostFamous && mostFamous.id !== patriarch?.id && mostFamous.id !== mostSuccessful?.id && (
        <div style={{ marginBottom: '16px' }}>
          <h3
            style={{
              fontSize: '0.9rem',
              color: '#888',
              textTransform: 'uppercase',
              marginBottom: '12px',
            }}
          >
            {t('family.mostFamous', 'Most Famous')}
          </h3>
          {renderCard(mostFamous, { border: '2px solid rgba(255,152,0,0.3)' })}
        </div>
      )}
    </div>
  );

  const renderMembers = () => (
    <div>
      {selectedMember && renderDetail(selectedMember)}
      <h3
        style={{
          fontSize: '0.9rem',
          color: '#888',
          textTransform: 'uppercase',
          marginBottom: '12px',
        }}
      >
        {t('family.allMembers', 'All Members')} ({generationCount})
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {[...familyTree.generations].reverse().map((gen, i) => (
          <div key={gen.id} style={{ position: 'relative' }}>
            {i < generationCount - 1 && (
              <div
                style={{
                  position: 'absolute',
                  left: '20px',
                  top: '100%',
                  width: '2px',
                  height: '6px',
                  background: 'rgba(255,215,0,0.2)',
                }}
              />
            )}
            {renderCard(gen)}
          </div>
        ))}
      </div>
    </div>
  );

  const renderHeirlooms = () => {
    if (heirlooms.length === 0) {
      return (
        <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
          <div style={{ fontSize: '2rem', marginBottom: '8px' }}>💎</div>
          <p>{t('family.noHeirlooms', 'No family heirlooms yet.')}</p>
          <p style={{ fontSize: '0.85rem', color: '#666' }}>
            {t(
              'family.heirloomsDesc',
              'Heirlooms are created when a remarkable ancestor passes away.'
            )}
          </p>
        </div>
      );
    }

    const rarityColors = {
      common: '#888',
      uncommon: '#4caf50',
      rare: '#2196f3',
      legendary: '#ffd700',
    };

    return (
      <div>
        <h3
          style={{
            fontSize: '0.9rem',
            color: '#888',
            textTransform: 'uppercase',
            marginBottom: '12px',
          }}
        >
          {t('family.familyVault', 'Family Vault')} ({heirlooms.length})
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {heirlooms.map((h, i) => (
            <div
              key={i}
              style={{
                background: 'rgba(255,215,0,0.04)',
                border: `1px solid ${rarityColors[h.rarity] || '#444'}40`,
                borderRadius: '10px',
                padding: '12px 14px',
              }}
            >
              <div
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <div>
                  <strong>{h.name}</strong>
                  <span
                    style={{
                      marginLeft: '8px',
                      fontSize: '0.7rem',
                      color: rarityColors[h.rarity] || '#888',
                      textTransform: 'uppercase',
                      fontWeight: 'bold',
                    }}
                  >
                    {h.rarity}
                  </span>
                </div>
                <div style={{ color: '#4caf50', fontSize: '0.85rem' }}>
                  {formatMoney(h.value || 0)}
                </div>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '4px' }}>
                {h.description}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '4px' }}>
                Passed from {h.inheritedFrom || 'an ancestor'} · {h.yearAcquired || 'Ancient'}
              </div>
              {h.effects && Object.keys(h.effects).length > 0 && (
                <div style={{ display: 'flex', gap: '6px', marginTop: '6px', flexWrap: 'wrap' }}>
                  {Object.entries(h.effects).map(([stat, val]) => (
                    <span
                      key={stat}
                      style={{
                        background: 'rgba(255,215,0,0.1)',
                        color: '#ffd700',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '0.7rem',
                      }}
                    >
                      +{val} {stat}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderMilestones = () => {
    const allPossible = [
      { id: 'gen2', name: 'Second Generation', desc: 'Continue the bloodline', icon: '' },
      { id: 'gen3', name: 'Third Generation', desc: 'Family tradition emerges', icon: '' },
      { id: 'gen5', name: 'Five Generations', desc: 'A true dynasty', icon: '' },
      { id: 'gen7', name: 'Seven Generations', desc: 'Centuries in the making', icon: '' },
      { id: 'gen10', name: 'Ten Generations', desc: 'Legendary bloodline', icon: '' },
      { id: 'wealth100m', name: 'Century of Wealth', desc: 'Family wealth > $100M', icon: '' },
      { id: 'wealth1b', name: 'Billionaire Dynasty', desc: 'Family wealth > $1B', icon: '' },
      { id: 'rep500', name: 'Noble House', desc: 'Family reputation > 500', icon: '' },
    ];
    const unlockedIds = new Set(milestones.map(m => m.id));

    return (
      <div>
        <h3
          style={{
            fontSize: '0.9rem',
            color: '#888',
            textTransform: 'uppercase',
            marginBottom: '12px',
          }}
        >
          {t('family.dynastyMilestones', 'Dynasty Milestones')}
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {allPossible.map(m => {
            const unlocked = unlockedIds.has(m.id);
            return (
              <div
                key={m.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  background: unlocked ? 'rgba(76,175,80,0.06)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${unlocked ? 'rgba(76,175,80,0.3)' : 'rgba(255,255,255,0.06)'}`,
                  opacity: unlocked ? 1 : 0.4,
                }}
              >
                <div style={{ fontSize: '1.3rem' }}>{unlocked ? '' : ''}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: unlocked ? 'bold' : 'normal' }}>{m.name}</div>
                  <div style={{ fontSize: '0.8rem', color: '#888' }}>{m.desc}</div>
                </div>
                {unlocked && <span style={{ color: '#4caf50', fontSize: '1.2rem' }}></span>}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="modal-overlay">
      <div
        className="modal-content"
        style={{ maxWidth: '780px', maxHeight: '90vh', overflow: 'auto' }}
      >
        <div className="modal-header">
          <h2 className="modal-title">
            {repRank.icon} {familyTree.familyName} {t('family.familyDynasty', 'Family Dynasty')}
          </h2>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="modal-body">
          {generationCount === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
              <div className="empty-state-badge">🌱</div>
              <p>{t('family.noDynasty', 'No dynasty yet. Start your legacy!')}</p>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <button
                  style={tabStyle('overview')}
                  onClick={() => {
                    setTab('overview');
                    setSelectedMember(null);
                  }}
                >
                  {t('family.overview', 'Overview')}
                </button>
                <button
                  style={tabStyle('members')}
                  onClick={() => {
                    setTab('members');
                    setSelectedMember(null);
                  }}
                >
                  {t('family.familyTree', 'Family Tree')}
                </button>
                <button
                  style={tabStyle('heirlooms')}
                  onClick={() => {
                    setTab('heirlooms');
                    setSelectedMember(null);
                  }}
                >
                  {t('family.heirlooms', 'Heirlooms')} ({heirlooms.length})
                </button>
                <button
                  style={tabStyle('milestones')}
                  onClick={() => {
                    setTab('milestones');
                    setSelectedMember(null);
                  }}
                >
                  {t('family.milestones', 'Milestones')}
                </button>
              </div>

              {tab === 'overview' && renderOverview()}
              {tab === 'members' && renderMembers()}
              {tab === 'heirlooms' && renderHeirlooms()}
              {tab === 'milestones' && renderMilestones()}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
