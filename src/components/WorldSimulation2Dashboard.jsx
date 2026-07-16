import React, { useMemo, useState } from 'react';
import {
  getWorldSimulation2Summary,
  performWorldSimulationAction,
} from '../logic/WorldSimulation2';
import { COUNTRY_NAME_AR, GOVERNMENT_AR } from '../logic/WorldSimulation2Data';
import './Modal.css';

const percent = value => `${Math.round(Number(value) || 0)}%`;
const number = value => Math.round(Number(value) || 0).toLocaleString('en-US');
const money = value => `$${number(value)}B`;

function Section({ title, children }) {
  return (
    <section style={{ padding: '12px', borderRadius: '14px', background: 'rgba(255,255,255,0.055)', border: '1px solid rgba(255,255,255,0.08)' }}>
      <h3 style={{ margin: '0 0 10px', fontSize: '1rem' }}>{title}</h3>
      {children}
    </section>
  );
}

function Stat({ label, value }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '8px', marginBottom: '6px' }}>
      <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export default function WorldSimulation2Dashboard({ person, onClose, language = 'en' }) {
  const [revision, setRevision] = useState(0);
  const [target, setTarget] = useState('');
  const [notice, setNotice] = useState('');
  const isArabic = language === 'ar';
  const summary = useMemo(() => getWorldSimulation2Summary(person), [person, revision]);
  const { world, home, activeWars, activeSanctions, alliances, topEconomies, recentTimeline } = summary;
  const countries = Object.values(world.countries).filter(country => country.name !== home?.name);
  const countryName = name => (isArabic ? COUNTRY_NAME_AR[name] || name : name);
  const governmentName = value => (isArabic ? GOVERNMENT_AR[value] || value : value);

  const labels = isArabic
    ? {
        title: 'محاكاة العالم 2.0', close: 'إغلاق', date: 'تاريخ العالم', global: 'الوضع العالمي',
        growth: 'النمو العالمي', inflation: 'التضخم العالمي', tension: 'التوتر العالمي', trade: 'التجارة العالمية',
        refugees: 'اللاجئون', home: 'بلدك', government: 'نظام الحكم', leader: 'القائد', approval: 'التأييد',
        population: 'السكان', gdp: 'الناتج المحلي', debt: 'الدين', stability: 'الاستقرار', freedom: 'الحرية',
        unemployment: 'البطالة', military: 'القوة العسكرية', technology: 'التكنولوجيا', alliances: 'التحالفات',
        tradePacts: 'اتفاقيات التجارة', sanctions: 'العقوبات المفروضة', wars: 'الحروب النشطة', noWars: 'لا توجد حرب نشطة.',
        front: 'الجبهة', months: 'الأشهر', casualties: 'الخسائر', economies: 'أكبر الاقتصادات', timeline: 'الخط الزمني العالمي',
        influence: 'التأثير السياسي', target: 'الدولة المستهدفة', diplomacy: 'محادثات دبلوماسية', impose: 'فرض عقوبات',
        aid: 'مساعدات إنسانية', budget: 'ميزانية طارئة', locked: 'يتطلب منصبا سياسيا كبيرا أو سمعة سياسية 60.',
        activeSanctions: 'عقوبات نشطة', activeAlliances: 'تحالفات نشطة', migration: 'تدفقات الهجرة',
      }
    : {
        title: 'World Simulation 2.0', close: 'Close', date: 'World date', global: 'Global conditions',
        growth: 'Global growth', inflation: 'Global inflation', tension: 'Global tension', trade: 'Global trade',
        refugees: 'Refugees', home: 'Your country', government: 'Government', leader: 'Leader', approval: 'Approval',
        population: 'Population', gdp: 'GDP', debt: 'Debt', stability: 'Stability', freedom: 'Freedom',
        unemployment: 'Unemployment', military: 'Military strength', technology: 'Technology', alliances: 'Alliances',
        tradePacts: 'Trade pacts', sanctions: 'Sanctions against it', wars: 'Active wars', noWars: 'No active wars.',
        front: 'Front', months: 'Months', casualties: 'Casualties', economies: 'Largest economies', timeline: 'World timeline',
        influence: 'Political influence', target: 'Target country', diplomacy: 'Diplomatic talks', impose: 'Impose sanctions',
        aid: 'Humanitarian aid', budget: 'Emergency budget', locked: 'Requires a major political role or 60 political reputation.',
        activeSanctions: 'Active sanctions', activeAlliances: 'Active alliances', migration: 'Migration flows',
      };

  const runAction = action => {
    const result = performWorldSimulationAction(person, action, target || null);
    setNotice(result.message);
    setRevision(value => value + 1);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" dir={isArabic ? 'rtl' : 'ltr'} style={{ maxWidth: '560px' }}>
        <div className="modal-header">
          <h2 className="modal-title">🌍 {labels.title}</h2>
          <button className="close-btn" onClick={onClose} aria-label={labels.close}>&times;</button>
        </div>
        <div className="modal-body" style={{ display: 'grid', gap: '12px' }}>
          <Section title={`📅 ${labels.date}: ${world.year} · ${isArabic ? 'الشهر' : 'Month'} ${(world.month % 12) + 1}`}>
            <Stat label={labels.activeAlliances} value={alliances.length} />
            <Stat label={labels.activeSanctions} value={activeSanctions.length} />
            <Stat label={labels.migration} value={world.migrationFlows.length} />
          </Section>

          <Section title={`🌐 ${labels.global}`}>
            <Stat label={labels.growth} value={`${world.global.growth.toFixed(1)}%`} />
            <Stat label={labels.inflation} value={`${world.global.inflation.toFixed(1)}%`} />
            <Stat label={labels.tension} value={percent(world.global.tension)} />
            <Stat label={labels.trade} value={percent(world.global.trade)} />
            <Stat label={labels.refugees} value={number(world.global.refugees)} />
          </Section>

          {home && (
            <Section title={`🏠 ${labels.home}: ${countryName(home.name)}`}>
              <Stat label={labels.government} value={governmentName(home.government)} />
              <Stat label={labels.leader} value={home.leader.name} />
              <Stat label={labels.approval} value={percent(home.leader.approval)} />
              <Stat label={labels.population} value={`${home.population.toFixed(2)}M`} />
              <Stat label={labels.gdp} value={money(home.gdp)} />
              <Stat label={labels.debt} value={`${money(home.debt)} (${home.debtRatio.toFixed(1)}%)`} />
              <Stat label={labels.inflation} value={`${home.inflation.toFixed(1)}%`} />
              <Stat label={labels.unemployment} value={`${home.unemployment.toFixed(1)}%`} />
              <Stat label={labels.stability} value={percent(home.stability)} />
              <Stat label={labels.freedom} value={percent(home.freedom)} />
              <Stat label={labels.military} value={percent(home.military)} />
              <Stat label={labels.technology} value={percent(home.technology)} />
              <Stat label={labels.alliances} value={home.alliances.map(countryName).join('، ') || '—'} />
              <Stat label={labels.tradePacts} value={home.tradePacts.length} />
              <Stat label={labels.sanctions} value={home.sanctionsFrom.length} />
            </Section>
          )}

          <Section title={`⚔️ ${labels.wars}`}>
            {activeWars.length === 0 ? (
              <div style={{ color: 'var(--text-secondary)' }}>{labels.noWars}</div>
            ) : activeWars.map(war => (
              <div key={war.id} style={{ paddingBottom: '10px', marginBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <strong>{countryName(war.attacker)} ↔ {countryName(war.defender)}</strong>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.84rem', marginTop: '5px' }}>
                  {labels.months}: {war.months} · {labels.front}: {war.front.toFixed(1)} · {labels.casualties}: {number(war.casualties.attacker + war.casualties.defender + war.casualties.civilian)}
                </div>
              </div>
            ))}
          </Section>

          <Section title={`📈 ${labels.economies}`}>
            {topEconomies.map((country, index) => (
              <div key={country.name} style={{ display: 'grid', gridTemplateColumns: '26px 1fr auto', gap: '8px', marginBottom: '7px' }}>
                <span>{index + 1}</span>
                <span>{countryName(country.name)}</span>
                <strong>{money(country.gdp)}</strong>
              </div>
            ))}
          </Section>

          <Section title={`🕊️ ${labels.influence}`}>
            {summary.influenceAvailable ? (
              <>
                <label style={{ display: 'grid', gap: '6px', marginBottom: '10px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{labels.target}</span>
                  <select value={target} onChange={event => setTarget(event.target.value)} className="form-input">
                    <option value="">{countries[0] ? countryName(countries[0].name) : '—'}</option>
                    {countries.map(country => <option key={country.name} value={country.name}>{countryName(country.name)}</option>)}
                  </select>
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <button className="btn-secondary" onClick={() => runAction('diplomacy')}>🤝 {labels.diplomacy}</button>
                  <button className="btn-secondary" onClick={() => runAction('sanctions')}>🚫 {labels.impose}</button>
                  <button className="btn-secondary" onClick={() => runAction('humanitarian_aid')}>🕊️ {labels.aid}</button>
                  <button className="btn-secondary" onClick={() => runAction('emergency_budget')}>💰 {labels.budget}</button>
                </div>
                {notice && <div style={{ marginTop: '9px', color: 'var(--text-secondary)' }}>{notice}</div>}
              </>
            ) : <div style={{ color: 'var(--text-secondary)' }}>{labels.locked}</div>}
          </Section>

          <Section title={`📰 ${labels.timeline}`}>
            {recentTimeline.length === 0 ? (
              <div style={{ color: 'var(--text-secondary)' }}>—</div>
            ) : recentTimeline.map(entry => (
              <div key={entry.id} style={{ marginBottom: '10px' }}>
                <div>{entry.text?.[isArabic ? 'ar' : 'en'] || entry.text?.en}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>{entry.year} · M{(entry.month % 12) + 1}</div>
              </div>
            ))}
          </Section>

          <button className="btn-primary" onClick={onClose}>{labels.close}</button>
        </div>
      </div>
    </div>
  );
}
