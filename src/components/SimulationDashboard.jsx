import React from 'react';
import { getCountryLifeSummary } from '../logic/CountryLifeSystem';
import { getFinanceSummary } from '../logic/PersonalFinanceSystem';
import { getReputationSummary } from '../logic/ReputationSystem';
import { getNPCMemorySummary } from '../logic/NPCMemorySystem';
import { getMonthlySituationSummary } from '../logic/MonthlySituationEngine';
import './Modal.css';

const meter = value => `${Math.max(0, Math.min(100, Math.round(Number(value) || 0)))}%`;
const money = value => `$${Math.round(Number(value) || 0).toLocaleString('en-US')}`;

function Section({ title, children }) {
  return (
    <section style={{
      padding: '12px', borderRadius: '14px', background: 'rgba(255,255,255,0.055)',
      border: '1px solid rgba(255,255,255,0.08)',
    }}>
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

function buildSituationLines(situation, isArabic) {
  if (!situation) return [];
  const ar = isArabic;
  const labels = {
    type: ar ? 'النوع' : 'Type', month: ar ? 'الشهر' : 'Month', health: ar ? 'الصحة' : 'Health',
    prenatalCare: ar ? 'متابعات الحمل' : 'Prenatal visits', partnerSupport: ar ? 'دعم الشريك' : 'Partner support',
    polling: ar ? 'نسبة التأييد' : 'Polling', scandals: ar ? 'الفضائح' : 'Scandals', funds: ar ? 'أموال الحملة' : 'Campaign funds',
    missions: ar ? 'المهمات' : 'Missions', medals: ar ? 'الأوسمة' : 'Medals', evidence: ar ? 'قوة الأدلة' : 'Evidence',
    legalCosts: ar ? 'التكاليف القانونية' : 'Legal costs', performance: ar ? 'الأداء' : 'Performance', wins: ar ? 'الانتصارات' : 'Wins',
    losses: ar ? 'الخسائر' : 'Losses', shortages: ar ? 'حدة النقص' : 'Shortages', response: ar ? 'الاستجابة للعلاج' : 'Treatment response',
    months: ar ? 'الأشهر' : 'Months',
  };
  const typeLabels = {
    pregnancy: ar ? 'الحمل' : 'Pregnancy', campaign: ar ? 'الحملة الانتخابية' : 'Election campaign',
    deployment: ar ? 'المهمة العسكرية' : 'Deployment', lawsuit: ar ? 'القضية القضائية' : 'Court case',
    sports: ar ? 'الموسم الرياضي' : 'Sports season', business: ar ? 'أزمة الشركة' : 'Business crisis',
    war: ar ? 'الحرب' : 'War', treatment: ar ? 'العلاج' : 'Treatment', prison: ar ? 'السجن' : 'Prison',
  };
  const lines = [[labels.type, typeLabels[situation.type] || situation.type]];
  const percentageKeys = new Set(['health', 'partnerSupport', 'polling', 'evidence', 'performance', 'shortages', 'response']);
  const moneyKeys = new Set(['funds', 'legalCosts']);
  const ordered = ['month', 'months', 'health', 'prenatalCare', 'partnerSupport', 'polling', 'funds', 'scandals', 'missions', 'medals', 'evidence', 'legalCosts', 'performance', 'wins', 'losses', 'shortages', 'response'];
  ordered.forEach(key => {
    const value = situation[key];
    if (value === undefined || value === null || typeof value === 'object') return;
    lines.push([
      labels[key] || key,
      percentageKeys.has(key) ? meter(value) : moneyKeys.has(key) ? money(value) : String(value),
    ]);
  });
  return lines;
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
  const situationLines = buildSituationLines(situation, isArabic);
  const activeChains = (person.eventChains || []).filter(chain => chain.status === 'active').slice(0, 5);

  const labels = isArabic
    ? {
        title: 'نظرة عامة على المحاكاة', country: 'قواعد البلد', finance: 'الوضع المالي',
        reputation: 'السمعة والهوية', chains: 'القصص المستمرة', npc: 'ذاكرة الشخصيات',
        situation: 'الوضع الشهري', none: 'لا يوجد', close: 'إغلاق', credit: 'النقاط الائتمانية',
        debt: 'الديون', savings: 'المدخرات', cost: 'تكلفة المعيشة', tax: 'معدل الضريبة',
        retirement: 'سن التقاعد', service: 'الخدمة الوطنية', months: 'أشهر حتى التطور التالي',
        jobMarket: 'قوة سوق العمل', unemployment: 'البطالة', healthcare: 'الرعاية الصحية',
      }
    : {
        title: 'Simulation Overview', country: 'Country rules', finance: 'Personal finance',
        reputation: 'Reputation & identity', chains: 'Ongoing story chains', npc: 'NPC memory',
        situation: 'Monthly situation', none: 'None', close: 'Close', credit: 'Credit score',
        debt: 'Total debt', savings: 'Savings', cost: 'Cost-of-living factor', tax: 'Income-tax rate',
        retirement: 'Retirement age', service: 'National service', months: 'Months until next development',
        jobMarket: 'Job-market strength', unemployment: 'Unemployment', healthcare: 'Healthcare',
      };

  const status = value => {
    const maps = isArabic
      ? { public: 'عمومية', private: 'خاصة', completed: 'مكتملة', deferred: 'مؤجلة', required: 'إلزامية', 'not required': 'غير إلزامية' }
      : {};
    return maps[value] || value;
  };
  const chainNames = {
    school_bullying: isArabic ? 'التنمر المدرسي' : 'School bullying',
    family_conflict: isArabic ? 'الخلاف العائلي' : 'Family conflict',
    health_recovery: isArabic ? 'التعافي الصحي' : 'Health recovery',
    career_setback: isArabic ? 'انتكاسة مهنية' : 'Career setback',
    financial_hardship: isArabic ? 'ضائقة مالية' : 'Financial hardship',
  };
  const identityNames = {
    'respected professional': 'مهني محترم', 'unreliable worker': 'عامل غير موثوق',
    'notorious criminal': 'مجرم سيئ السمعة', 'known offender': 'جانح معروف',
    'political leader': 'قائد سياسي', 'family pillar': 'ركيزة العائلة',
    'estranged relative': 'قريب منقطع', 'public figure': 'شخصية عامة',
    'highly trusted': 'موثوق جدا', 'widely distrusted': 'غير موثوق على نطاق واسع',
  };
  const roleNames = {
    Father: 'الأب', Mother: 'الأم', Parent: 'أحد الوالدين', Sibling: 'أخ أو أخت',
    Child: 'طفل', Friend: 'صديق', 'Best Friend': 'أفضل صديق', Partner: 'شريك',
    Fiance: 'خطيب', Spouse: 'زوج',
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
            <StatLine label={labels.healthcare} value={status(country.healthcareAccess)} />
            <StatLine label={labels.cost} value={`${country.rules.costOfLiving.toFixed(2)}×`} />
            <StatLine label={labels.tax} value={`${Math.round(country.rules.incomeTaxRate * 100)}%`} />
            <StatLine label={labels.retirement} value={country.rules.retirementAge} />
            <StatLine label={labels.service} value={status(country.militaryService)} />
            <StatLine label={labels.unemployment} value={`${Number(country.rules.unemploymentRate || 0).toFixed(1)}%`} />
            <StatLine label={labels.jobMarket} value={meter(country.rules.jobMarketStrength)} />
          </Section>

          <Section title={`💳 ${labels.finance}`}>
            <StatLine label={labels.credit} value={finance.creditScore} />
            <StatLine label={labels.debt} value={money(finance.debt)} />
            <StatLine label={labels.savings} value={money(finance.savings)} />
            {finance.lastBudget && (
              <StatLine label={isArabic ? 'المبلغ المتاح بعد النفقات' : 'Discretionary after expenses'}
                value={money(finance.lastBudget.discretionary)} />
            )}
          </Section>

          <Section title={`⭐ ${labels.reputation}`}>
            <StatLine label={isArabic ? 'المهنية' : 'Professional'} value={meter(reputation.professional)} />
            <StatLine label={isArabic ? 'العائلية' : 'Family'} value={meter(reputation.family)} />
            <StatLine label={isArabic ? 'الثقة' : 'Trust'} value={meter(reputation.trust)} />
            <StatLine label={isArabic ? 'العامة' : 'Public'} value={meter(reputation.public)} />
            <StatLine label={isArabic ? 'الإجرامية' : 'Criminal'} value={meter(reputation.criminal)} />
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '8px' }}>
              {(reputation.identityTags || []).map(tag => isArabic ? identityNames[tag] || tag : tag).join(' • ') || labels.none}
            </div>
          </Section>

          <Section title={`🔗 ${labels.chains}`}>
            {activeChains.length === 0 ? <div style={{ color: 'var(--text-secondary)' }}>{labels.none}</div> :
              activeChains.map(chain => (
                <div key={chain.id} style={{ marginBottom: '9px' }}>
                  <strong>{chainNames[chain.type] || chain.type.replaceAll('_', ' ')}</strong>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
                    {labels.months}: {Math.max(0, chain.monthsUntilNext || 0)}
                  </div>
                </div>
              ))}
          </Section>

          <Section title={`🧠 ${labels.npc}`}>
            {npcMemories.length === 0 ? <div style={{ color: 'var(--text-secondary)' }}>{labels.none}</div> :
              npcMemories.map(npc => (
                <div key={npc.id || npc.name} style={{ marginBottom: '10px' }}>
                  <strong>{npc.name}</strong>{' '}
                  <span style={{ color: 'var(--text-secondary)' }}>({isArabic ? roleNames[npc.type] || npc.type : npc.type})</span>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    {isArabic ? 'القرب' : 'Closeness'} {Math.round(npc.closeness || 0)}% ·{' '}
                    {isArabic ? 'الثقة' : 'Trust'} {Math.round(npc.trust || 0)}% ·{' '}
                    {isArabic ? 'الاستياء' : 'Resentment'} {Math.round(npc.resentment || 0)}%
                  </div>
                </div>
              ))}
          </Section>

          <Section title={`🗓️ ${labels.situation}`}>
            {situationLines.length === 0
              ? <div style={{ color: 'var(--text-secondary)' }}>{labels.none}</div>
              : situationLines.map(([label, value]) => <StatLine key={label} label={label} value={value} />)}
          </Section>

          <button className="btn-primary" onClick={onClose}>{labels.close}</button>
        </div>
      </div>
    </div>
  );
}
