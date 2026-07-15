import React, { useState } from 'react';
import { CAREER_SKILL_TREES, getTreeIdForJob, getCareerEffects } from '../logic/CareerSkillTree';
import './Modal.css';

function NodeCard({ node, specId, level, availablePoints, canAfford, prereqsMet, onLevelUp }) {
  const key = `${specId}_${node.id}`;
  const isMaxed = level >= node.maxLevel;
  const canLevel = prereqsMet && canAfford && !isMaxed;
  const isLocked = !prereqsMet;
  const cost = node.costPerLevel;

  const effectText = [];
  if (node.effects) {
    if (node.effects.salaryMult) {
      effectText.push(`+${(node.effects.salaryMult * 100).toFixed(0)}% salary`);
    }
    if (node.effects.stressReduction) {
      effectText.push(`-${node.effects.stressReduction} stress`);
    }
    if (node.effects.happiness) {
      effectText.push(`+${node.effects.happiness} happiness`);
    }
    if (node.effects.fame) {
      effectText.push(`+${node.effects.fame} fame`);
    }
    if (node.effects.promotionChance) {
      effectText.push(`+${(node.effects.promotionChance * 100).toFixed(0)}% promo`);
    }
    if (node.effects.raiseBonus) {
      effectText.push(`+${(node.effects.raiseBonus * 100).toFixed(0)}% raises`);
    }
  }

  return (
    <div
      style={{
        background: isLocked ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.04)',
        border: `1px solid ${isMaxed ? '#4caf50' : isLocked ? 'rgba(255,255,255,0.06)' : canLevel ? 'rgba(33,150,243,0.3)' : 'rgba(255,255,255,0.08)'}`,
        borderRadius: '10px',
        padding: '12px',
        opacity: isLocked ? 0.45 : 1,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '4px',
        }}
      >
        <div
          style={{ fontWeight: 700, fontSize: '0.95rem', color: isMaxed ? '#4caf50' : '#e0e0e0' }}
        >
          {node.name}
          {isMaxed ? ' (Max)' : ''}
        </div>
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
          {Array.from({ length: node.maxLevel }, (_, i) => (
            <div
              key={i}
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: i < level ? '#4caf50' : 'rgba(255,255,255,0.15)',
                border: i < level ? '2px solid #66bb6a' : '2px solid rgba(255,255,255,0.1)',
              }}
            />
          ))}
        </div>
      </div>
      <div style={{ fontSize: '0.78rem', color: '#999', marginBottom: '6px', lineHeight: 1.4 }}>
        {node.desc}
      </div>
      {effectText.length > 0 && (
        <div style={{ fontSize: '0.75rem', color: '#81c784', marginBottom: '8px' }}>
          {effectText.join(' | ')}
        </div>
      )}
      {!isMaxed && (
        <button
          disabled={!canLevel}
          onClick={() => onLevelUp(key, node.costPerLevel)}
          style={{
            width: '100%',
            padding: '6px',
            borderRadius: '6px',
            border: 'none',
            fontSize: '0.8rem',
            fontWeight: 600,
            cursor: canLevel ? 'pointer' : 'not-allowed',
            background: canLevel
              ? 'linear-gradient(135deg, #1565c0, #0d47a1)'
              : 'rgba(255,255,255,0.05)',
            color: canLevel ? '#fff' : '#666',
          }}
        >
          {isLocked ? `Requires: ${(node.prereqs || []).join(', ')}` : `Upgrade (${cost} pt)`}
        </button>
      )}
    </div>
  );
}

export function CareerTreeModal({
  person,
  onUpdate,
  onClose,
  language = 'en',
  t = (key, fallback) => fallback || key,
}) {
  const { job } = person;
  const treeId = getTreeIdForJob(job);
  const tree = treeId ? CAREER_SKILL_TREES[treeId] : null;
  const careerData = person.careerData || {
    availableSkillPoints: 0,
    totalSkillPointsEarned: 0,
    nodes: {},
  };
  const [selectedSpec, setSelectedSpec] = useState(0);

  if (!tree) {
    return (
      <div className="modal-overlay">
        <div className="modal-content" style={{ maxWidth: '450px', textAlign: 'center' }}>
          <div className="modal-header">
            <h2 className="modal-title">Career Skills</h2>
            <button className="close-btn" onClick={onClose}>
              &times;
            </button>
          </div>
          <div className="modal-body">
            <p style={{ color: '#999' }}>
              Your current career does not have a skill tree available.
            </p>
            <button className="btn-primary" onClick={onClose} style={{ marginTop: '16px' }}>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  const nodes = careerData.nodes || {};
  const availablePoints = careerData.availableSkillPoints || 0;
  const effects = getCareerEffects(person, treeId);

  const handleLevelUp = (nodeKey, cost) => {
    if (availablePoints < cost) {
      return;
    }
    onUpdate(p => {
      if (!p.careerData) {
        p.careerData = { totalSkillPointsEarned: 0, availableSkillPoints: 0, nodes: {} };
      }
      if (!p.careerData.nodes) {
        p.careerData.nodes = {};
      }
      p.careerData.nodes[nodeKey] = (p.careerData.nodes[nodeKey] || 0) + 1;
      p.careerData.availableSkillPoints = Math.max(
        0,
        (p.careerData.availableSkillPoints || 0) - cost
      );
      p.logEvent(`Skill upgraded: ${nodeKey}`, 'good');
    });
  };

  const checkPrereqs = (node, specId) => {
    if (!node.prereqs || node.prereqs.length === 0) {
      return true;
    }
    return node.prereqs.every(prereqId => {
      const key = `${specId}_${prereqId}`;
      return (nodes[key] || 0) > 0;
    });
  };

  const spec = tree.specializations[selectedSpec];

  const effectSummary = [];
  if (effects.salaryMult) {
    effectSummary.push(`${(effects.salaryMult * 100).toFixed(0)}% salary bonus`);
  }
  if (effects.stressReduction) {
    effectSummary.push(`-${effects.stressReduction} stress/year`);
  }
  if (effects.happiness) {
    effectSummary.push(`+${effects.happiness} happiness/year`);
  }
  if (effects.fame) {
    effectSummary.push(`+${effects.fame} fame/year`);
  }
  if (effects.promotionChance) {
    effectSummary.push(`+${(effects.promotionChance * 100).toFixed(0)}% promotion`);
  }
  if (effects.raiseBonus) {
    effectSummary.push(`+${(effects.raiseBonus * 100).toFixed(0)}% raises`);
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '520px' }}>
        <div className="modal-header">
          <h2 className="modal-title">{tree.name} Skills</h2>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="modal-body">
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(33,150,243,0.15), rgba(21,101,192,0.1))',
              borderRadius: '10px',
              padding: '12px',
              marginBottom: '12px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ fontSize: '0.75rem', color: '#888', marginBottom: '2px' }}>
                Available Points
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#42a5f5' }}>
                {availablePoints}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', color: '#888', marginBottom: '2px' }}>
                Total Earned
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 600, color: '#aaa' }}>
                {careerData.totalSkillPointsEarned || 0}
              </div>
            </div>
          </div>

          {effectSummary.length > 0 && (
            <div
              style={{
                background: 'rgba(76,175,80,0.08)',
                borderRadius: '8px',
                padding: '8px 12px',
                marginBottom: '12px',
                fontSize: '0.78rem',
                color: '#81c784',
                lineHeight: 1.5,
              }}
            >
              Active: {effectSummary.join(' | ')}
            </div>
          )}

          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
            {tree.specializations.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setSelectedSpec(i)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '8px',
                  border: '1px solid',
                  borderColor: i === selectedSpec ? '#42a5f5' : 'rgba(255,255,255,0.1)',
                  background:
                    i === selectedSpec ? 'rgba(33,150,243,0.2)' : 'rgba(255,255,255,0.03)',
                  color: i === selectedSpec ? '#42a5f5' : '#aaa',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  flex: 1,
                  minWidth: '80px',
                }}
              >
                {s.name}
              </button>
            ))}
          </div>

          <div
            style={{
              fontSize: '0.75rem',
              color: '#777',
              marginBottom: '10px',
              fontStyle: 'italic',
            }}
          >
            {spec.description}
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              maxHeight: '380px',
              overflowY: 'auto',
              paddingRight: '4px',
            }}
          >
            {spec.nodes.map(node => {
              const key = `${spec.id}_${node.id}`;
              const level = nodes[key] || 0;
              const prereqsMet = checkPrereqs(node, spec.id);
              const canAfford = availablePoints >= node.costPerLevel;
              return (
                <NodeCard
                  key={key}
                  node={node}
                  specId={spec.id}
                  level={level}
                  availablePoints={availablePoints}
                  canAfford={canAfford}
                  prereqsMet={prereqsMet}
                  onLevelUp={handleLevelUp}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
