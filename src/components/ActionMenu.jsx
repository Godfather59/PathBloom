import React, { memo, useMemo, useState } from 'react';
import {
  getActiveMonthlySituation,
  getCurrentTimePerson,
  getSituationLabel,
} from '../logic/TimeProgression';
import { getMonthlySituationSummary } from '../logic/MonthlySituationEngine';
import { BottomNavigation } from './BottomNavigation';
import { AppIcon } from './AppIcon';
import SituationDetailsSheet from './SituationDetailsSheet';
import WorldSimulation2Dashboard from './WorldSimulation2Dashboard';
import './ActionMenu.css';

const LIFE_SHORTCUTS = [
  { id: 'occupation', icon: 'briefcase', en: 'Career', ar: 'المهنة' },
  { id: 'relationships', icon: 'relationships', en: 'Relationships', ar: 'العلاقات' },
  { id: 'education', icon: 'education', en: 'Education', ar: 'التعليم' },
  { id: 'assets', icon: 'assets', en: 'Assets', ar: 'الممتلكات' },
];

const PRIMARY_LABELS = {
  en: {
    normal: 'Age Up',
    prison: 'Serve 1 Month',
    pregnancy: 'Continue Pregnancy',
    campaign: 'Campaign 1 Month',
    deployment: 'Continue Mission',
    treatment: 'Continue Treatment',
    lawsuit: 'Continue Case',
    sports: 'Play 1 Month',
    business: 'Manage Crisis',
    war: 'Continue War',
  },
  ar: {
    normal: 'تقدم سنة',
    prison: 'اقضِ شهرا',
    pregnancy: 'تابع الحمل',
    campaign: 'تابع الحملة شهرا',
    deployment: 'تابع المهمة',
    treatment: 'تابع العلاج',
    lawsuit: 'تابع القضية',
    sports: 'العب شهرا',
    business: 'أدر الأزمة',
    war: 'تابع الحرب',
  },
};

const TEXT = {
  en: {
    situation: 'Active situation',
    inspect: 'Open details',
    month: 'Month',
    remaining: 'remaining',
    polling: 'polling',
    evidence: 'evidence',
    response: 'response',
    performance: 'performance',
    shortages: 'shortages',
    smartYears: 'Smart +5',
    smartMonths: 'Smart +12',
    normalHint: 'Advance one year and continue your story.',
    monthlyHint: 'Advance one month inside the current situation.',
  },
  ar: {
    situation: 'وضع نشط',
    inspect: 'افتح التفاصيل',
    month: 'الشهر',
    remaining: 'متبقية',
    polling: 'التأييد',
    evidence: 'الأدلة',
    response: 'الاستجابة',
    performance: 'الأداء',
    shortages: 'النقص',
    smartYears: 'ذكي +5',
    smartMonths: 'ذكي +12',
    normalHint: 'تقدم سنة واحدة وتابع قصتك.',
    monthlyHint: 'تقدم شهرا واحدا داخل الوضع الحالي.',
  },
};

function clampPercent(value) {
  return Math.max(0, Math.min(100, Math.round(Number(value) || 0)));
}

function getSituationPresentation(person, situation, summary, language) {
  const copy = TEXT[language];
  const state = person?.timeProgress || {};
  const result = { meta: '', progress: null, progressLabel: '' };

  switch (situation?.id) {
    case 'prison': {
      const stored = Number(state.prisonMonthsRemaining);
      const remaining = Number.isFinite(stored)
        ? Math.max(0, Math.floor(stored))
        : Math.max(0, Math.round((Number(person?.prisonSentence) || 0) * 12));
      const years = Math.floor(remaining / 12);
      const months = remaining % 12;
      result.meta =
        language === 'ar'
          ? `${years ? `${years} سنة` : ''}${years && months ? ' و' : ''}${months ? `${months} شهر` : ''} ${copy.remaining}`.trim()
          : `${years ? `${years}y` : ''}${years && months ? ' ' : ''}${months ? `${months}m` : ''} ${copy.remaining}`.trim();
      result.progressLabel = String(remaining);
      break;
    }
    case 'pregnancy': {
      const month = Math.max(0, Number(summary?.month) || 0);
      const due = Math.max(1, Number(summary?.dueMonth) || 9);
      result.meta =
        language === 'ar' ? `${copy.month} ${month} من ${due}` : `${copy.month} ${month} of ${due}`;
      result.progress = clampPercent((month / due) * 100);
      result.progressLabel = `${month}/${due}`;
      break;
    }
    case 'campaign': {
      const month = Math.max(1, Number(summary?.months) || Number(state.situationMonths) || 1);
      const polling = clampPercent(summary?.polling);
      result.meta = `${copy.month} ${month} · ${copy.polling} ${polling}%`;
      result.progress = polling;
      result.progressLabel = `${polling}%`;
      break;
    }
    case 'lawsuit': {
      const month = Math.max(1, Number(summary?.months) || Number(state.situationMonths) || 1);
      const evidence = clampPercent(summary?.evidence);
      result.meta = `${copy.month} ${month} · ${copy.evidence} ${evidence}%`;
      result.progress = evidence;
      result.progressLabel = `${evidence}%`;
      break;
    }
    case 'treatment': {
      const month = Math.max(1, Number(summary?.months) || Number(state.treatmentMonths) || 1);
      const response = clampPercent(summary?.response);
      result.meta = `${copy.month} ${month} · ${copy.response} ${response}%`;
      result.progress = response;
      result.progressLabel = `${response}%`;
      break;
    }
    case 'sports': {
      const month = Math.max(1, Number(summary?.months) || Number(state.situationMonths) || 1);
      const performance = clampPercent(summary?.performance);
      result.meta = `${copy.month} ${month} · ${copy.performance} ${performance}%`;
      result.progress = performance;
      result.progressLabel = `${performance}%`;
      break;
    }
    case 'war': {
      const month = Math.max(1, Number(summary?.months) || Number(state.situationMonths) || 1);
      const shortages = clampPercent(summary?.shortages);
      result.meta = `${copy.month} ${month} · ${copy.shortages} ${shortages}%`;
      result.progress = shortages;
      result.progressLabel = `${shortages}%`;
      break;
    }
    case 'deployment': {
      const month = Math.max(1, Number(summary?.months) || Number(state.situationMonths) || 1);
      const missions = Math.max(0, Number(summary?.missions) || 0);
      result.meta =
        language === 'ar'
          ? `${copy.month} ${month} · ${missions} مهمات`
          : `${copy.month} ${month} · ${missions} missions`;
      result.progressLabel = String(missions);
      break;
    }
    case 'business': {
      const month = Math.max(1, Number(summary?.months) || Number(state.situationMonths) || 1);
      result.meta = `${copy.month} ${month}`;
      result.progressLabel = String(month);
      break;
    }
    default:
      result.meta = `${copy.month} ${Math.max(1, Number(state.situationMonths) || 1)}`;
  }

  return result;
}

export const ActionMenu = memo(
  ({ onAgeUp, onAction, onAgeSkip, onNavigate, onOpenSituation, language = 'en' }) => {
    const [localOverlay, setLocalOverlay] = useState(null);
    const person = getCurrentTimePerson();
    const activeSituation = getActiveMonthlySituation(person);
    const isArabic = language === 'ar';
    const locale = isArabic ? 'ar' : 'en';
    const labels = PRIMARY_LABELS[locale];
    const copy = TEXT[locale];
    const summary = activeSituation && person ? getMonthlySituationSummary(person) : null;
    const presentation = useMemo(
      () => getSituationPresentation(person, activeSituation, summary, locale),
      [person, activeSituation, summary, locale]
    );

    if (localOverlay === 'world' && person) {
      return (
        <WorldSimulation2Dashboard
          person={person}
          onClose={() => setLocalOverlay(null)}
          language={locale}
        />
      );
    }

    if (localOverlay === 'situation' && activeSituation) {
      return (
        <SituationDetailsSheet
          person={person}
          situation={activeSituation}
          summary={summary}
          language={locale}
          onClose={() => setLocalOverlay(null)}
        />
      );
    }

    const primaryLabel = activeSituation
      ? labels[activeSituation.id] || labels.normal
      : labels.normal;
    const primaryHint = activeSituation ? copy.monthlyHint : copy.normalHint;
    const smartLabel = activeSituation ? copy.smartMonths : copy.smartYears;

    const handlePrimary = () => {
      if (activeSituation) {
        onAgeSkip?.('month');
      } else {
        onAgeUp?.();
      }
    };

    const handleSmart = () => {
      if (activeSituation) {
        onAgeSkip?.('smart_months');
      } else {
        onAgeSkip?.(5);
      }
    };

    const handleNavigate = destination => {
      if (onNavigate) {
        onNavigate(destination);
        return;
      }
      if (destination === 'activities') {
        onAction?.('activities');
      } else if (destination === 'world') {
        setLocalOverlay('world');
      } else if (destination === 'menu') {
        document.querySelector('.hud-menu-fallback')?.click();
      }
    };

    const handleSituationOpen = () => {
      if (onOpenSituation) {
        onOpenSituation(activeSituation?.id);
        return;
      }
      setLocalOverlay('situation');
    };

    return (
      <div className="action-menu" dir={isArabic ? 'rtl' : 'ltr'}>
        <div
          className="life-shortcuts"
          aria-label={isArabic ? 'اختصارات الحياة' : 'Life shortcuts'}
        >
          {LIFE_SHORTCUTS.map(shortcut => (
            <button
              key={shortcut.id}
              type="button"
              className="life-shortcut"
              onClick={() => onAction?.(shortcut.id)}
            >
              <AppIcon name={shortcut.icon} size={17} />
              <span>{isArabic ? shortcut.ar : shortcut.en}</span>
            </button>
          ))}
        </div>

        {activeSituation && (
          <button
            type="button"
            className="active-situation-card"
            onClick={handleSituationOpen}
            title={copy.inspect}
          >
            <span className="active-situation-icon" aria-hidden="true">
              {activeSituation.icon}
            </span>
            <span className="active-situation-copy">
              <span className="active-situation-kicker">{copy.situation}</span>
              <span className="active-situation-title">
                {getSituationLabel(activeSituation, locale)}
              </span>
              <span className="active-situation-meta">{presentation.meta}</span>
            </span>
            <span className="active-situation-progress" aria-hidden="true">
              <strong>{presentation.progressLabel}</strong>
              {presentation.progress !== null && (
                <span className="active-situation-track">
                  <span
                    className="active-situation-fill"
                    style={{ width: `${presentation.progress}%` }}
                  />
                </span>
              )}
            </span>
          </button>
        )}

        <BottomNavigation
          activeDestination="life"
          onNavigate={handleNavigate}
          onPrimaryAction={handlePrimary}
          onSmartAdvance={handleSmart}
          primaryLabel={primaryLabel}
          primaryHint={primaryHint}
          smartLabel={smartLabel}
          isMonthly={Boolean(activeSituation)}
          disabled={!person?.isAlive || Boolean(person?.pendingEvent)}
          language={locale}
        />
      </div>
    );
  }
);
