import React from 'react';
import { getCountryLifeSummary } from '../logic/CountryLifeSystem';
import { getFinanceSummary } from '../logic/PersonalFinanceSystem';
import { getReputationSummary } from '../logic/ReputationSystem';
import { getNPCMemorySummary } from '../logic/NPCMemorySystem';
import { getMonthlySituationSummary } from '../logic/MonthlySituationEngine';
import './Modal.css';

const meter = value => `${Math.max(0, Math.min(100, Math.round(Number(value) || 0)))}%`;

function Section({ title, children }) {
  return (
    <section
      style={{
        padding: '12px',
        borderRadius: '14px',
        background: 'rgba(255,255,255,0.055)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <h3 style={{ margin: '0 0 10px', fontSize: '1rem' }}>{title}</h3>
      {children}
    </section>
  );
}

function StatLine({ label, value }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '8px', marginBottom: '6px' }}>
      <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export default function SimulationDashboard({
  person,
  onClose,
  language = 'en',
  t = (key, fallback) => fallback || key,
}) {
  const isArabic = language === 'ar';
  const country = getCountryLifeSummary(person, person.geopoliticalState);
  const finance = getFinanceSummary(person);
  const reputation = getReputationSummary(person);
  const npcMemories = getNPCMemorySummary(person)
    .sort((a, b) => (b.resentment || 0) - (a.resentment || 0) || (b.closeness || 0) - (a.closeness || 0))
    .slice(0, 5);
  const situation = getMonthlySituationSummary(person);
  const activeChains = (person.eventChains || []).filter(chain => chain.status === 'active').slice(0, 5);

  const labels = isArabic
    ? {
        title: 'نظرة عامة على المحاكاة', country: 'قواعد البلد', finance: 'الوضع المالي',
        reputation: 'السمعة والهوية', chains: 'القصص المستمرة', npc: 'ذاكرة الشخصيات',
        situation: 'الوضع الشهري', none: 'لا يوجد', close: 'إغلاق', credit: 'النقاط الائتمانية',
        debt: 'الديون', savings: 'المدخرات', cost: 'تكلفة المعيشة', tax: 'معدل الضريبة',
        retirement: 'سن التقاعد', service: 'الخدمة الوطنية', months: 'أشهر حتى التطور التالي',
      }
    : {
        title: 'Simulation Overview', country: 'Country rules', finance: 'Personal finance',
        reputation: 'Reputation & identity', chains: 'Ongoing story chains', npc: 'NPC memory',
        situation: 'Monthly situation', none: 'None', close: 'Close', credit: 'Credit score',
        debt: 'Total debt', savings: 'Savings', cost: 'Cost-of-living factor', tax: 'Income-tax rate',
        retirement: 'Retirement age', service: 'National service', months: 'Months until next development',
      };

  return (
    <div className="modal-overlay">
      <div className="modal-content" dir={isArabic ? 'rtl' : 'ltr'} style={{ maxWidth: '430px' }}>
        <div className="modal-header">
          <h2 className="modal-title">🧩 {labels.title}</h2>
          <button className="close-btn" onClick={onClose} aria-label={labels.close}>&times;</button>
        </div>
        <div className="modal-body" style={{ display: 'grid', gap: '12px' }}>
          <Section title={`🗺️ ${labels.country}`}>
            <StatLine label={country.country} value={country.healthcareAccess} />
            <StatLine label={labels.cost} value={`${country.rules.costOfLiving.toFixed(2)}×`} />
            <StatLine label={labels.tax} value={`${Math.round(country.rules.incomeTaxRate * 100)}%`} />
            <StatLine label={labels.retirement} value={country.rules.retirementAge} />
            <StatLine label={labels.service} value={country.militaryService} />
          </Section>

          <Section title={`💳 ${labels.finance}`}>
            <StatLine label={labels.credit} value={finance.creditScore} />
            <StatLine label={labels.debt} value={`$${finance.debt.toLocaleString()}`} />
            <StatLine label={labels.savings} value={`$${finance.savings.toLocaleString()}`} />
            {finance.lastBudget && (
              <StatLine
                label={isArabic ? 'المبلغ المتاح بعد النفقات' : 'Discretionary after expenses'}
                value={`$${Math.round(finance.lastBudget.discretionary || 0).toLocaleString()}`}
              />
            )}
          </Section>

          <Section title={`⭐ ${labels.reputation}`}>
            <StatLine label={isArabic ? 'المهنية' : 'Professional'} value={meter(reputation.professional)} />
            <StatLine label={isArabic ? 'العائلية' : 'Family'} value={meter(reputation.family)} />
            <StatLine label={isArabic ? 'الثقة' : 'Trust'} value={meter(reputation.trust)} />
            <StatLine label={isArabic ? 'العامة' : 'Public'} value={meter(reputation.public)} />
            <StatLine label={isArabic ? 'الإجرامية' : 'Criminal'} value={meter(reputation.criminal)} />
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '8px' }}>
              {(reputation.identityTags || []).join(' • ') || labels.none}
            </div>
          </Section>

          <Section title={`🔗 ${labels.chains}`}>
            {activeChains.length === 0 ? (
              <div style={{ color: 'var(--text-secondary)' }}>{labels.none}</div>
            ) : activeChains.map(chain => (
              <div key={chain.id} style={{ marginBottom: '9px' }}>
                <strong>{chain.type.replaceAll('_', ' ')}</strong>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
                  {labels.months}: {Math.max(0, chain.monthsUntilNext || 0)}
                </div>
              </div>
            ))}
          </Section>

          <Section title={`🧠 ${labels.npc}`}>
            {npcMemories.length === 0 ? (
              <div style={{ color: 'var(--text-secondary)' }}>{labels.none}</div>
            ) : npcMemories.map(npc => (
              <div key={npc.id || npc.name} style={{ marginBottom: '10px' }}>
                <strong>{npc.name}</strong> <span style={{ color: 'var(--text-secondary)' }}>({npc.type})</span>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  {isArabic ? 'القرب' : 'Closeness'} {Math.round(npc.closeness || 0)}% ·{' '}
                  {isArabic ? 'الثقة' : 'Trust'} {Math.round(npc.trust || 0)}% ·{' '}
                  {isArabic ? 'الاستياء' : 'Resentment'} {Math.round(npc.resentment || 0)}%
                </div>
              </div>
            ))}
          </Section>

          <Section title={`🗓️ ${labels.situation}`}>
            {situation ? (
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap', color: 'var(--text-secondary)', fontFamily: 'inherit', fontSize: '0.82rem' }}>
                {JSON.stringify(situation, null, 2)}
              </pre>
            ) : (
              <div style={{ color: 'var(--text-secondary)' }}>{labels.none}</div>
            )}
          </Section>

          <button className="btn-primary" onClick={onClose}>{labels.close}</button>
        </div>
      </div>
    </div>
  );
}
