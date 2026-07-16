import React from 'react';
import { getSituationLabel } from '../logic/TimeProgression';
import {
  formatArabicMoney,
  formatArabicNumber,
  formatArabicPercent,
} from '../logic/ArabicLocalization';
import { AppIcon } from './AppIcon';
import './Modal.css';

const LABELS = {
  en: {
    title: 'Active situation',
    close: 'Back to life',
    month: 'Month',
    months: 'Months active',
    health: 'Health',
    prenatalCare: 'Prenatal visits',
    partnerSupport: 'Partner support',
    polling: 'Polling',
    funds: 'Campaign funds',
    scandals: 'Scandals',
    missions: 'Missions',
    medals: 'Medals',
    evidence: 'Evidence strength',
    legalCosts: 'Legal costs',
    performance: 'Performance',
    wins: 'Wins',
    losses: 'Losses',
    shortages: 'Shortages',
    response: 'Treatment response',
    remaining: 'Months remaining',
    hint: 'Progress one month from the center button when you are ready.',
  },
  ar: {
    title: 'الوضع النشط',
    close: 'العودة إلى الحياة',
    month: 'الشهر',
    months: 'الأشهر النشطة',
    health: 'الصحة',
    prenatalCare: 'زيارات متابعة الحمل',
    partnerSupport: 'دعم الشريك',
    polling: 'نسبة التأييد',
    funds: 'أموال الحملة',
    scandals: 'الفضائح',
    missions: 'المهمات',
    medals: 'الأوسمة',
    evidence: 'قوة الأدلة',
    legalCosts: 'التكاليف القانونية',
    performance: 'الأداء',
    wins: 'الانتصارات',
    losses: 'الخسائر',
    shortages: 'النقص',
    response: 'الاستجابة للعلاج',
    remaining: 'الأشهر المتبقية',
    hint: 'تقدم شهرا من الزر الأوسط عندما تكون مستعدا.',
  },
};

const PERCENT_KEYS = new Set(['health', 'partnerSupport', 'polling', 'evidence', 'performance', 'shortages', 'response']);
const MONEY_KEYS = new Set(['funds', 'legalCosts']);
const ORDER = [
  'month',
  'months',
  'remaining',
  'health',
  'prenatalCare',
  'partnerSupport',
  'polling',
  'funds',
  'scandals',
  'missions',
  'medals',
  'evidence',
  'legalCosts',
  'performance',
  'wins',
  'losses',
  'shortages',
  'response',
];

function formatValue(key, value, language) {
  if (MONEY_KEYS.has(key)) {
    return language === 'ar'
      ? formatArabicMoney(value)
      : new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          maximumFractionDigits: 0,
        }).format(Number(value) || 0);
  }
  if (PERCENT_KEYS.has(key)) {
    return language === 'ar'
      ? formatArabicPercent(value)
      : `${Math.max(0, Math.min(100, Math.round(Number(value) || 0)))}%`;
  }
  return language === 'ar'
    ? formatArabicNumber(value, { maximumFractionDigits: 0 })
    : String(value);
}

export default function SituationDetailsSheet({
  situation,
  summary,
  person,
  language = 'en',
  onClose,
}) {
  const locale = language === 'ar' ? 'ar' : 'en';
  const labels = LABELS[locale];
  const data = { ...(summary || {}) };
  if (situation?.id === 'prison') {
    const stored = Number(person?.timeProgress?.prisonMonthsRemaining);
    data.remaining = Number.isFinite(stored)
      ? Math.max(0, Math.floor(stored))
      : Math.max(0, Math.round((Number(person?.prisonSentence) || 0) * 12));
  }

  const rows = ORDER
    .filter(key => data[key] !== undefined && data[key] !== null && typeof data[key] !== 'object')
    .map(key => ({ key, label: labels[key] || key, value: formatValue(key, data[key], locale) }));

  return (
    <div className="modal-overlay situation-sheet-overlay" onClick={onClose}>
      <section
        className="situation-detail-sheet"
        dir={locale === 'ar' ? 'rtl' : 'ltr'}
        onClick={event => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={labels.title}
      >
        <div className="sheet-handle" aria-hidden="true" />
        <header className="situation-sheet-header">
          <span className="situation-sheet-icon" aria-hidden="true">{situation?.icon || '◷'}</span>
          <div>
            <span>{labels.title}</span>
            <h2>{getSituationLabel(situation, locale)}</h2>
          </div>
          <button type="button" className="sheet-close-button" onClick={onClose} aria-label={labels.close}>
            <AppIcon name="close" size={20} />
          </button>
        </header>

        <div className="situation-detail-grid">
          {rows.length > 0 ? rows.map(row => (
            <div key={row.key} className="situation-detail-row">
              <span>{row.label}</span>
              <strong dir="auto">{row.value}</strong>
            </div>
          )) : (
            <p className="situation-empty-copy">{labels.hint}</p>
          )}
        </div>

        <p className="situation-sheet-hint">{labels.hint}</p>
        <button type="button" className="btn-primary situation-sheet-done" onClick={onClose}>
          {labels.close}
        </button>
      </section>
    </div>
  );
}
