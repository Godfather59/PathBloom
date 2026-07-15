import React, { useState } from 'react';
import {
  getBaseCountries,
  getCountryData,
  CABINET_POSITIONS,
  DIPLOMATIC_ACTIONS,
  executeDiplomaticAction,
  generateCabinetMember,
  getCabinetEffectiveness,
  getAvailableActions,
} from '../logic/GeoPolitics';
import {
  getMilitaryStrength,
  getWarStatus,
  getWarPhases,
  executeWarPhase,
  resolveWarEnd,
  startWar,
} from '../logic/WarSystem';
import {
  RESOLUTION_TYPES,
  proposeResolution,
  canProposeResolution,
  getUNResolutions,
  calculateUNInfluence,
} from '../logic/UnitedNations';
import { getCountryById, GOVERNMENT_TYPES } from '../logic/WorldSimulation';
import './Modal.css';

function CountryCard({ country, rel, onSelect, isSelected, myCountryName }) {
  if (!rel) {
    return null;
  }
  const isSelf = country.name === myCountryName;
  const relColor = rel.relation >= 70 ? '#4caf50' : rel.relation >= 40 ? '#ff9800' : '#f44336';
  const warColor = rel.atWar ? '#ff1744' : 'transparent';

  return (
    <div
      onClick={() => !isSelf && onSelect(country)}
      style={{
        padding: '12px',
        borderRadius: '10px',
        cursor: isSelf ? 'default' : 'pointer',
        border: `2px solid ${isSelected ? '#42a5f5' : warColor || 'rgba(255,255,255,0.08)'}`,
        background: isSelf
          ? 'rgba(33,150,243,0.08)'
          : isSelected
            ? 'rgba(33,150,243,0.15)'
            : 'rgba(255,255,255,0.03)',
        opacity: isSelf ? 0.7 : 1,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{country.name}</span>
        {rel.atWar && (
          <span
            style={{
              color: '#ff1744',
              fontSize: '0.7rem',
              fontWeight: 800,
              padding: '2px 8px',
              background: 'rgba(255,23,68,0.2)',
              borderRadius: '4px',
            }}
          >
            AT WAR
          </span>
        )}
        {rel.alliance === 'ally' && (
          <span
            style={{
              color: '#4caf50',
              fontSize: '0.7rem',
              fontWeight: 800,
              padding: '2px 8px',
              background: 'rgba(76,175,80,0.2)',
              borderRadius: '4px',
            }}
          >
            ALLY
          </span>
        )}
      </div>
      <div
        style={{
          display: 'flex',
          gap: '12px',
          marginTop: '6px',
          fontSize: '0.75rem',
          color: '#999',
        }}
      >
        <span>
          Relation: <span style={{ color: relColor, fontWeight: 600 }}>{rel.relation}</span>
        </span>
        <span>
          Tension:{' '}
          <span style={{ color: rel.tension > 50 ? '#ff9800' : '#999', fontWeight: 600 }}>
            {rel.tension}
          </span>
        </span>
        <span>
          Trade:{' '}
          <span style={{ fontWeight: 600 }}>
            {['None', 'Minor', 'Major', 'Strategic'][rel.tradeLevel] || 'None'}
          </span>
        </span>
      </div>
      <div style={{ fontSize: '0.7rem', color: '#666', marginTop: '2px' }}>
        {country.continent} · {country.government} · Power: {country.power}
      </div>
    </div>
  );
}

export function GeopoliticsModal({
  person,
  onUpdate,
  onClose,
  language = 'en',
  t = (key, fallback) => fallback || key,
}) {
  const [tab, setTab] = useState('relations');
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [actionMsg, setActionMsg] = useState(null);
  const [unTargetId, setUnTargetId] = useState(null);
  const [unResType, setUnResType] = useState(null);

  const countries = getBaseCountries();
  const myCountryName = person.country;
  const rels = person.countryRelations || {};
  const cabEff = getCabinetEffectiveness(person);

  const handleAction = (countryId, actionId) => {
    setActionMsg(null);
    onUpdate(p => {
      const result = executeDiplomaticAction(p, countryId, actionId);
      setActionMsg(result);
    });
  };

  const handleAppoint = posId => {
    onUpdate(p => {
      if (!p.cabinet) {
        p.cabinet = {};
      }
      const pos = CABINET_POSITIONS.find(x => x.id === posId);
      if (pos) {
        p.cabinet[posId] = generateCabinetMember(p, pos);
      }
    });
  };

  const handleFire = posId => {
    onUpdate(p => {
      if (p.cabinet) {
        p.cabinet[posId] = null;
      }
    });
  };

  const handlePolicyChange = (key, delta) => {
    onUpdate(p => {
      if (!p.policies) {
        p.policies = { taxRate: 30, militarySpending: 30, diplomacyBudget: 30, socialSpending: 30 };
      }
      p.policies[key] = Math.max(0, Math.min(100, (p.policies[key] || 30) + delta));
    });
  };

  const renderRelations = () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        maxHeight: '380px',
        overflowY: 'auto',
        paddingRight: '4px',
      }}
    >
      {countries.map(c => {
        const rel = rels[c.id];
        if (!rel) {
          return null;
        }
        return (
          <CountryCard
            key={c.id}
            country={c}
            rel={rel}
            myCountryName={myCountryName}
            isSelected={selectedCountry?.id === c.id}
            onSelect={country => {
              setSelectedCountry(prev => (prev?.id === country.id ? null : country));
              setActionMsg(null);
            }}
          />
        );
      })}
    </div>
  );

  const renderCountryActions = () => {
    if (!selectedCountry) {
      return null;
    }
    const rel = rels[selectedCountry.id];
    if (!rel) {
      return null;
    }
    const available = getAvailableActions(person, selectedCountry.id);
    const wsCountry = getCountryById(person.geopoliticalState, selectedCountry.id);

    const wsGov = wsCountry
      ? GOVERNMENT_TYPES[wsCountry.govType] || GOVERNMENT_TYPES.democracy
      : null;

    return (
      <div
        style={{
          marginTop: '12px',
          padding: '12px',
          borderRadius: '10px',
          background: 'rgba(33,150,243,0.08)',
          border: '1px solid rgba(33,150,243,0.2)',
        }}
      >
        {wsCountry && (
          <div
            style={{
              marginBottom: '10px',
              padding: '10px',
              borderRadius: '8px',
              background: 'rgba(255,255,255,0.03)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#ddd' }}>
                {wsCountry.name}
              </span>
              <span
                style={{
                  fontSize: '0.7rem',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  background:
                    wsCountry.stability >= 50 ? 'rgba(76,175,80,0.15)' : 'rgba(244,67,54,0.15)',
                  color: wsCountry.stability >= 50 ? '#81c784' : '#ef5350',
                  fontWeight: 700,
                }}
              >
                {wsGov?.label || wsCountry.govType}
              </span>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '4px',
                fontSize: '0.72rem',
                color: '#888',
              }}
            >
              <span>
                GDP: <span style={{ color: '#ccc' }}>${wsCountry.gdp.toFixed(0)}B</span>
              </span>
              <span>
                Pop: <span style={{ color: '#ccc' }}>{wsCountry.population.toFixed(1)}M</span>
              </span>
              <span>
                Stability:{' '}
                <span style={{ color: wsCountry.stability >= 50 ? '#81c784' : '#ff8a65' }}>
                  {Math.round(wsCountry.stability)}
                </span>
              </span>
              <span>
                Military:{' '}
                <span style={{ color: '#ff8a65' }}>{Math.round(wsCountry.militaryPower)}</span>
              </span>
              <span>
                Tech: <span style={{ color: '#ba68c8' }}>{Math.round(wsCountry.technology)}</span>
              </span>
              <span>
                Leader:{' '}
                <span style={{ color: '#ccc' }}>
                  {(wsCountry.leaderApproval || 0) >= 50 ? '✅' : '⚠️'}{' '}
                  {Math.round(wsCountry.leaderApproval)}%
                </span>
              </span>
            </div>
          </div>
        )}

        <div style={{ fontWeight: 700, marginBottom: '8px', color: '#42a5f5' }}>
          Actions: {selectedCountry.name}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {available.map(action => (
            <button
              key={action.id}
              onClick={() => handleAction(selectedCountry.id, action.id)}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.04)',
                color: '#e0e0e0',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: '0.82rem',
              }}
            >
              <div style={{ fontWeight: 600, marginBottom: '2px' }}>{action.name}</div>
              <div style={{ fontSize: '0.7rem', color: '#999' }}>{action.desc}</div>
              <div style={{ fontSize: '0.7rem', color: '#888', marginTop: '2px' }}>
                Cost: ${action.cost.toLocaleString()} · Risk: {action.risk}%
              </div>
            </button>
          ))}
          {available.length === 0 && (
            <div style={{ fontSize: '0.8rem', color: '#888', fontStyle: 'italic' }}>
              No actions available. Improve relations first.
            </div>
          )}
        </div>
        {actionMsg && (
          <div
            style={{
              marginTop: '8px',
              padding: '8px',
              borderRadius: '6px',
              fontSize: '0.8rem',
              background: actionMsg.success ? 'rgba(76,175,80,0.15)' : 'rgba(244,67,54,0.15)',
              color: actionMsg.success ? '#81c784' : '#ef5350',
            }}
          >
            {actionMsg.message}
          </div>
        )}
      </div>
    );
  };

  const renderCabinet = () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        maxHeight: '440px',
        overflowY: 'auto',
      }}
    >
      <div style={{ fontSize: '0.75rem', color: '#888', marginBottom: '4px' }}>
        Cabinet Effectiveness: <span style={{ color: '#42a5f5', fontWeight: 700 }}>{cabEff}%</span>
      </div>
      {CABINET_POSITIONS.map(pos => {
        const member = person.cabinet?.[pos.id];
        return (
          <div
            key={pos.id}
            style={{
              padding: '10px',
              borderRadius: '8px',
              background: member ? 'rgba(76,175,80,0.06)' : 'rgba(255,255,255,0.02)',
              border: `1px solid ${member ? 'rgba(76,175,80,0.15)' : 'rgba(255,255,255,0.06)'}`,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{pos.title}</div>
                {member ? (
                  <div style={{ fontSize: '0.8rem', color: '#ccc', marginTop: '2px' }}>
                    {member.name} · Eff: {member.effectiveness} · Lty: {member.loyalty} · Svc:{' '}
                    {member.yearsServed}y
                  </div>
                ) : (
                  <div style={{ fontSize: '0.75rem', color: '#888', fontStyle: 'italic' }}>
                    Vacant
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                {member ? (
                  <button
                    className="btn-danger"
                    style={{ padding: '4px 10px', fontSize: '0.7rem' }}
                    onClick={() => handleFire(pos.id)}
                  >
                    Fire
                  </button>
                ) : (
                  <button
                    className="btn-primary"
                    style={{ padding: '4px 10px', fontSize: '0.7rem' }}
                    onClick={() => handleAppoint(pos.id)}
                  >
                    Appoint
                  </button>
                )}
              </div>
            </div>
            <div style={{ fontSize: '0.7rem', color: '#777', marginTop: '4px' }}>{pos.desc}</div>
          </div>
        );
      })}
    </div>
  );

  const renderPolicies = () => {
    const policies = person.policies || {
      taxRate: 30,
      militarySpending: 30,
      diplomacyBudget: 30,
      socialSpending: 30,
    };
    const items = [
      {
        key: 'taxRate',
        label: 'Tax Rate',
        desc: 'Higher = more revenue, lower approval',
        icon: '💰',
      },
      {
        key: 'militarySpending',
        label: 'Military Spending',
        desc: 'Affects military power & global influence',
        icon: '⚔️',
      },
      {
        key: 'diplomacyBudget',
        label: 'Diplomacy Budget',
        desc: 'Affects diplomatic action costs',
        icon: '🤝',
      },
      {
        key: 'socialSpending',
        label: 'Social Programs',
        desc: 'Affects happiness & domestic approval',
        icon: '🏥',
      },
    ];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {items.map(item => (
          <div
            key={item.key}
            style={{
              padding: '12px',
              borderRadius: '8px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '4px',
              }}
            >
              <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                {item.icon} {item.label}
              </span>
              <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#42a5f5' }}>
                {policies[item.key]}%
              </span>
            </div>
            <div style={{ fontSize: '0.72rem', color: '#888', marginBottom: '8px' }}>
              {item.desc}
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                className="btn-secondary"
                style={{ padding: '4px 12px', fontSize: '0.75rem' }}
                onClick={() => handlePolicyChange(item.key, -5)}
              >
                -5
              </button>
              <button
                className="btn-secondary"
                style={{ padding: '4px 12px', fontSize: '0.75rem' }}
                onClick={() => handlePolicyChange(item.key, -1)}
              >
                -1
              </button>
              <div style={{ flex: 1 }} />
              <button
                className="btn-secondary"
                style={{ padding: '4px 12px', fontSize: '0.75rem' }}
                onClick={() => handlePolicyChange(item.key, 1)}
              >
                +1
              </button>
              <button
                className="btn-secondary"
                style={{ padding: '4px 12px', fontSize: '0.75rem' }}
                onClick={() => handlePolicyChange(item.key, 5)}
              >
                +5
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderWarRoom = () => {
    const myStrength = getMilitaryStrength(person);
    const activeWars = getWarStatus(person);

    if (activeWars.length === 0) {
      return (
        <div>
          <div
            style={{
              background: 'rgba(33,150,243,0.08)',
              borderRadius: '10px',
              padding: '14px',
              marginBottom: '12px',
            }}
          >
            <div style={{ fontWeight: 700, marginBottom: '4px' }}>
              ⚔️ Military Strength: {myStrength}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#888' }}>
              Based on country power, military spending, and cabinet effectiveness.
            </div>
          </div>
          <div style={{ fontSize: '0.85rem', color: '#888', fontStyle: 'italic', padding: '10px' }}>
            Your nation is at peace. Declare war from the World tab to begin military operations.
          </div>
        </div>
      );
    }

    return (
      <div>
        <div
          style={{
            background: 'rgba(33,150,243,0.08)',
            borderRadius: '10px',
            padding: '14px',
            marginBottom: '12px',
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: '4px' }}>
            ⚔️ Military Strength: {myStrength}
          </div>
        </div>
        {activeWars.map(war => (
          <div
            key={war.countryId}
            style={{
              background: 'rgba(244,67,54,0.08)',
              borderRadius: '10px',
              padding: '14px',
              marginBottom: '12px',
              border: '1px solid rgba(244,67,54,0.2)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontWeight: 700, color: '#ff1744' }}>⚔️ {war.targetName}</span>
              <span style={{ fontSize: '0.8rem', color: '#888' }}>Year {war.years}</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#ccc', marginBottom: '8px' }}>
              Territory: {war.territoryGained}% &bull; Casualties: {war.casualties.toLocaleString()}
            </div>
            <div
              style={{
                height: '6px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '3px',
                marginBottom: '12px',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${Math.min(100, war.territoryGained)}%`,
                  background: war.territoryGained >= 50 ? '#4caf50' : '#ff9800',
                  borderRadius: '3px',
                }}
              />
            </div>

            {war.hasPendingEvent && war.pendingEvent ? (
              <div>
                <div style={{ fontSize: '0.85rem', color: '#ffcc80', marginBottom: '8px' }}>
                  {war.pendingEvent.text}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {war.pendingEvent.choices.map((choice, i) => (
                    <button
                      key={i}
                      className="btn-primary"
                      style={{ padding: '8px', fontSize: '0.8rem' }}
                      onClick={() => {
                        const result = resolveWarEnd(person, war.countryId, choice.effect);
                        setActionMsg({ success: true, message: result.message });
                        onUpdate(fn => fn(person));
                      }}
                    >
                      {choice.text}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '8px' }}>
                  Choose your strategy for this year:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {getWarPhases(person, war.countryId).map(phase => (
                    <button
                      key={phase.id}
                      onClick={() => {
                        const result = executeWarPhase(person, war.countryId, phase.id);
                        setActionMsg({ success: result.success, message: result.message });
                        onUpdate(fn => fn(person));
                      }}
                      style={{
                        padding: '8px 10px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        background: 'rgba(255,255,255,0.04)',
                        color: '#e0e0e0',
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontSize: '0.82rem',
                      }}
                    >
                      <div style={{ fontWeight: 600 }}>{phase.name}</div>
                      <div style={{ fontSize: '0.7rem', color: '#999' }}>{phase.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {war.battles.length > 0 && (
              <details style={{ marginTop: '10px' }}>
                <summary style={{ fontSize: '0.8rem', color: '#888', cursor: 'pointer' }}>
                  Battle History ({war.battles.length})
                </summary>
                <div style={{ marginTop: '6px', fontSize: '0.75rem', color: '#666' }}>
                  {war.battles
                    .slice(-5)
                    .reverse()
                    .map((b, i) => (
                      <div key={i} style={{ padding: '2px 0' }}>
                        {b.success ? '✅' : '❌'} {b.phase} — {b.casualties.toLocaleString()}{' '}
                        casualties{b.territory > 0 ? `, +${b.territory}% territory` : ''}
                      </div>
                    ))}
                </div>
              </details>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderUN = () => {
    const countries = getBaseCountries().filter(c => c.name !== person.country);
    const influence = calculateUNInfluence(person);
    const unHistory = getUNResolutions(person);

    return (
      <div>
        <div
          style={{
            background: 'rgba(33,150,243,0.08)',
            borderRadius: '10px',
            padding: '14px',
            marginBottom: '12px',
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: '4px' }}>🏛️ UN Influence: {influence}%</div>
          <div style={{ fontSize: '0.8rem', color: '#888' }}>
            Based on country power, Security Council status, diplomacy budget, and Secretary of
            State.
          </div>
        </div>

        {!unTargetId ? (
          <div>
            <div style={{ fontWeight: 600, marginBottom: '8px', fontSize: '0.9rem' }}>
              Propose Resolution Against:
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                maxHeight: '200px',
                overflowY: 'auto',
              }}
            >
              {countries.map(c => (
                <button
                  key={c.id}
                  onClick={() => setUnTargetId(c.id)}
                  style={{
                    padding: '8px 10px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.08)',
                    background: 'rgba(255,255,255,0.03)',
                    color: '#e0e0e0',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: '0.82rem',
                  }}
                >
                  <span style={{ fontWeight: 600 }}>{c.name}</span>
                  <span style={{ fontSize: '0.7rem', color: '#888', marginLeft: '8px' }}>
                    {c.continent} &bull; {c.government}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : !unResType ? (
          <div>
            <button
              onClick={() => setUnTargetId(null)}
              style={{
                marginBottom: '12px',
                fontSize: '0.8rem',
                color: '#42a5f5',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              &larr; Select Different Country
            </button>
            <div style={{ fontWeight: 600, marginBottom: '8px', fontSize: '0.9rem' }}>
              Resolution against {getCountryData(unTargetId)?.name}:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {RESOLUTION_TYPES.map(res => {
                const canPropose = canProposeResolution(person, unTargetId, res.id);
                return (
                  <button
                    key={res.id}
                    onClick={() => setUnResType(res.id)}
                    disabled={!canPropose}
                    style={{
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255,255,255,0.1)',
                      background: canPropose ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.01)',
                      color: canPropose ? '#e0e0e0' : '#666',
                      cursor: canPropose ? 'pointer' : 'default',
                      textAlign: 'left',
                      fontSize: '0.82rem',
                      opacity: canPropose ? 1 : 0.5,
                    }}
                  >
                    <div style={{ fontWeight: 600 }}>{res.name}</div>
                    <div style={{ fontSize: '0.7rem', color: '#999' }}>{res.desc}</div>
                    <div style={{ fontSize: '0.7rem', color: '#888', marginTop: '2px' }}>
                      {res.cost > 0 ? `$${res.cost.toLocaleString()} · ` : ''}Min Influence:{' '}
                      {res.minApproval}%
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div>
            <button
              onClick={() => setUnResType(null)}
              style={{
                marginBottom: '12px',
                fontSize: '0.8rem',
                color: '#42a5f5',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              &larr; Different Resolution
            </button>
            <div
              style={{
                background: 'rgba(255,193,7,0.1)',
                borderRadius: '10px',
                padding: '14px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontWeight: 700, marginBottom: '8px' }}>
                Propose {RESOLUTION_TYPES.find(r => r.id === unResType)?.name}?
              </div>
              <div style={{ fontSize: '0.85rem', color: '#ccc', marginBottom: '12px' }}>
                Against {getCountryData(unTargetId)?.name}
              </div>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                <button
                  className="btn-primary"
                  onClick={() => {
                    const result = proposeResolution(person, unTargetId, unResType);
                    setActionMsg(result);
                    setUnTargetId(null);
                    setUnResType(null);
                    onUpdate(fn => fn(person));
                  }}
                >
                  ✅ Propose
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => {
                    setUnTargetId(null);
                    setUnResType(null);
                  }}
                >
                  ❌ Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {unHistory.length > 0 && (
          <details style={{ marginTop: '16px' }}>
            <summary style={{ fontSize: '0.8rem', color: '#888', cursor: 'pointer' }}>
              Resolution History ({unHistory.length})
            </summary>
            <div style={{ marginTop: '6px', fontSize: '0.75rem', color: '#666' }}>
              {[...unHistory].reverse().map((r, i) => (
                <div
                  key={i}
                  style={{ padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                >
                  {r.passed ? '✅' : r.vetoed ? '🚫' : '❌'} {r.type} vs {r.targetName} —{r.pctFor}%
                  for ({r.votesFor}/{r.total}){r.vetoed ? ' (VETOED)' : ''}
                </div>
              ))}
            </div>
          </details>
        )}
      </div>
    );
  };

  const renderHistory = () => {
    const history = person.diplomaticHistory || [];
    if (history.length === 0) {
      return (
        <div style={{ color: '#888', fontStyle: 'italic', padding: '20px', textAlign: 'center' }}>
          No diplomatic history yet.
        </div>
      );
    }
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          maxHeight: '400px',
          overflowY: 'auto',
        }}
      >
        {[...history].reverse().map((entry, i) => {
          const action = DIPLOMATIC_ACTIONS.find(a => a.id === entry.action);
          const country = getCountryData(entry.country);
          return (
            <div
              key={i}
              style={{
                padding: '8px 10px',
                borderRadius: '6px',
                fontSize: '0.8rem',
                background: entry.success ? 'rgba(76,175,80,0.05)' : 'rgba(244,67,54,0.05)',
              }}
            >
              <span style={{ color: entry.success ? '#81c784' : '#ef5350' }}>
                {entry.success ? '✓' : '✗'}
              </span>{' '}
              {action?.name || entry.action} → {country?.name || entry.country}
              <span style={{ color: '#666', marginLeft: '8px' }}>(age {entry.age})</span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '560px' }}>
        <div className="modal-header">
          <h2 className="modal-title">World Stage</h2>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        <div
          className="modal-header"
          style={{ margin: 0, padding: '0 0 10px 0', borderBottom: 'none', gap: '6px' }}
        >
          {[
            { id: 'relations', label: 'World', icon: '🌍' },
            { id: 'cabinet', label: 'Cabinet', icon: '👥' },
            { id: 'policies', label: 'Policies', icon: '📋' },
            { id: 'warroom', label: 'War Room', icon: '⚔️' },
            { id: 'un', label: 'UN', icon: '🏛️' },
            { id: 'history', label: 'History', icon: '📜' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => {
                setTab(t.id);
                setSelectedCountry(null);
                setActionMsg(null);
                setUnTargetId(null);
                setUnResType(null);
              }}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '8px',
                border: '1px solid',
                borderColor: tab === t.id ? '#42a5f5' : 'rgba(255,255,255,0.1)',
                background: tab === t.id ? 'rgba(33,150,243,0.2)' : 'rgba(255,255,255,0.03)',
                color: tab === t.id ? '#42a5f5' : '#aaa',
                fontWeight: 600,
                fontSize: '0.8rem',
                cursor: 'pointer',
              }}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        <div className="modal-body" style={{ paddingTop: '8px' }}>
          {tab === 'relations' && (
            <>
              {renderRelations()}
              {selectedCountry && renderCountryActions()}
            </>
          )}
          {tab === 'cabinet' && renderCabinet()}
          {tab === 'policies' && renderPolicies()}
          {tab === 'warroom' && renderWarRoom()}
          {tab === 'un' && renderUN()}
          {tab === 'history' && renderHistory()}
        </div>
      </div>
    </div>
  );
}
