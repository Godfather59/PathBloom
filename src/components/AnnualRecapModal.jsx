import React from 'react';
import { translateGameMessage, translateGameText } from '../logic/i18n';
import './AnnualRecapModal.css';

const STAT_ICONS = {
  happiness: '😊',
  health: '❤️',
  smarts: '🧠',
  looks: '✨',
  stress: '😵',
  karma: '⚖️',
  energy: '⚡',
  fame: '🌟',
  notoriety: '🕶️',
};

const money = value =>
  `${Number(value) < 0 ? '-' : ''}$${Math.abs(Math.round(Number(value) || 0)).toLocaleString()}`;

function interpolate(template, params = {}) {
  return Object.entries(params).reduce(
    (result, [key, value]) => result.replaceAll(`{${key}}`, String(value)),
    template
  );
}

function Descriptor({ descriptor, t }) {
  return interpolate(t(descriptor.key, descriptor.fallback), descriptor.params);
}

function localizeEvent(event, language) {
  return event.messageKey
    ? translateGameMessage(language, event.messageKey, event.messageParams || {}, event.text)
    : translateGameText(language, event.text);
}

function FinanceItem({ icon, label, value, signed = false }) {
  const numeric = Math.round(Number(value) || 0);
  return (
    <div className="recap-finance-item">
      <span>
        {icon} {label}
      </span>
      <strong className={signed && numeric !== 0 ? (numeric > 0 ? 'positive' : 'negative') : ''}>
        {signed && numeric > 0 ? '+' : ''}
        {money(numeric)}
      </strong>
    </div>
  );
}

export function AnnualRecapModal({
  person,
  onClose,
  language = 'en',
  t = (key, fallback) => fallback || key,
}) {
  const recaps = Array.isArray(person?.latestAgeUpRecaps) ? person.latestAgeUpRecaps : [];
  const isRtl = language === 'ar';
  if (recaps.length === 0) {
    return null;
  }

  const fastForward = person.fastForwardResult;

  return (
    <div className="modal-overlay recap-overlay">
      <div className="modal-content annual-recap" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="modal-header">
          <div>
            <div className="recap-kicker">🌱 {t('recap.kicker', 'Your path this year')}</div>
            <h2 className="modal-title">
              {recaps.length > 1
                ? t('recap.yearsTitle', 'Years in Review')
                : t('recap.title', 'Year in Review')}
            </h2>
          </div>
          <button className="close-btn" onClick={onClose} aria-label={t('common.close', 'Close')}>
            &times;
          </button>
        </div>

        {fastForward?.reason && (
          <div className="recap-stop-banner">
            <span>⏸️</span>
            <div>
              <strong>{t('recap.fastForwardStopped', 'Fast-forward paused')}</strong>
              <small>
                {t(fastForward.reason.key, fastForward.reason.fallback)} ·{' '}
                {fastForward.completedYears}/{fastForward.requestedYears}{' '}
                {t('recap.yearsAdvanced', 'years advanced')}
              </small>
            </div>
          </div>
        )}

        <div className="modal-body recap-list">
          {recaps.map((recap, index) => {
            const changedStats = Object.entries(recap.statChanges || {}).filter(
              ([, value]) => value !== 0
            );
            const finance = recap.finance || {};
            return (
              <details
                key={recap.id}
                className="recap-year-card"
                open={index === recaps.length - 1}
              >
                <summary>
                  <span>
                    🎂 {t('common.age', 'Age')} {recap.age}
                  </span>
                  <strong className={(finance.netWorthChange || 0) >= 0 ? 'positive' : 'negative'}>
                    {(finance.netWorthChange || 0) > 0 ? '+' : ''}
                    {money(finance.netWorthChange || 0)}
                  </strong>
                </summary>

                <div className="recap-section">
                  <h3>💰 {t('recap.finances', 'Finances')}</h3>
                  <div className="recap-finance-grid">
                    <FinanceItem
                      icon="💵"
                      label={t('recap.income', 'Income')}
                      value={finance.income}
                    />
                    <FinanceItem
                      icon="🏡"
                      label={t('recap.livingExpenses', 'Living costs')}
                      value={finance.livingExpenses}
                    />
                    <FinanceItem
                      icon="🧾"
                      label={t('recap.taxes', 'Taxes')}
                      value={finance.taxes}
                    />
                    <FinanceItem
                      icon="👛"
                      label={t('recap.cashChange', 'Cash change')}
                      value={finance.cashChange}
                      signed
                    />
                    <FinanceItem
                      icon="📈"
                      label={t('recap.netWorthChange', 'Net worth change')}
                      value={finance.netWorthChange}
                      signed
                    />
                    <FinanceItem
                      icon="💳"
                      label={t('recap.debtChange', 'Debt change')}
                      value={finance.debtChange}
                      signed
                    />
                  </div>
                </div>

                {changedStats.length > 0 && (
                  <div className="recap-section">
                    <h3>📊 {t('recap.stats', 'Stat changes')}</h3>
                    <div className="recap-stat-row">
                      {changedStats.map(([key, value]) => (
                        <span key={key} className={value > 0 ? 'positive' : 'negative'}>
                          {STAT_ICONS[key] || '•'} {t(`stat.${key}`, key)} {value > 0 ? '+' : ''}
                          {value}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {(recap.changes || []).length > 0 && (
                  <div className="recap-section">
                    <h3>🧭 {t('recap.milestones', 'Important changes')}</h3>
                    <ul className="recap-change-list">
                      {recap.changes.map((change, changeIndex) => (
                        <li key={`${change.key}-${changeIndex}`}>
                          <Descriptor descriptor={change} t={t} />
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {(recap.events || []).length > 0 && (
                  <div className="recap-section">
                    <h3>📰 {t('recap.highlights', 'Year highlights')}</h3>
                    <ul className="recap-event-list">
                      {recap.events.slice(-3).map((event, eventIndex) => (
                        <li
                          key={`${event.age}-${eventIndex}`}
                          className={`type-${event.type || 'neutral'}`}
                        >
                          {localizeEvent(event, language)}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </details>
            );
          })}
        </div>

        <button className="btn-primary recap-continue" onClick={onClose}>
          {t('recap.continue', 'Continue your life')}
        </button>
      </div>
    </div>
  );
}
