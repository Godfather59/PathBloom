import React from 'react';
import { translateGameMessage, translateGameText } from '../logic/i18n';
import { cleanLocalizedText } from '../logic/localizationSanitizer';
import { translateDeepSimulationText } from '../logic/DeepLocalization';
import {
  formatArabicMoney,
  formatArabicNumber,
  localizeArabicCandidate,
} from '../logic/ArabicLocalization';
import { HAPTICS } from '../logic/Haptics';
import { AppIcon } from './AppIcon';
import './Modal.css';

const TYPE_EMOJIS = {
  good: '✓',
  bad: '!',
  mixed: '◇',
  neutral: '·',
};

const EFFECT_LABELS = {
  money: { en: 'money', ar: 'المال' },
  health: { en: 'health', ar: 'الصحة' },
  happiness: { en: 'happiness', ar: 'السعادة' },
  stress: { en: 'stress', ar: 'التوتر' },
  smarts: { en: 'smarts', ar: 'الذكاء' },
  looks: { en: 'looks', ar: 'المظهر' },
  karma: { en: 'karma', ar: 'الكارما' },
  fame: { en: 'fame', ar: 'الشهرة' },
  energy: { en: 'energy', ar: 'الطاقة' },
  polling: { en: 'polling', ar: 'التأييد' },
  reputation: { en: 'reputation', ar: 'السمعة' },
};

const COPY = {
  en: {
    title: 'Decision',
    subtitle: 'Your choice can return later in this story.',
    low: 'Low risk',
    medium: 'Medium risk',
    high: 'High risk',
    certain: 'Direct effect',
  },
  ar: {
    title: 'قرار',
    subtitle: 'قد تعود نتائج اختيارك لاحقا في هذه القصة.',
    low: 'مخاطرة منخفضة',
    medium: 'مخاطرة متوسطة',
    high: 'مخاطرة عالية',
    certain: 'تأثير مباشر',
  },
};

function hapticsAllowed() {
  try {
    return localStorage.getItem('pathbloom_haptics_enabled') !== 'false';
  } catch {
    return true;
  }
}

function getChoiceEmoji(choice) {
  if (choice.emoji) {
    return choice.emoji;
  }
  if (choice.type && TYPE_EMOJIS[choice.type]) {
    return TYPE_EMOJIS[choice.type];
  }

  const effects = choice.effects || {};
  const score = Object.entries(effects).reduce((total, [key, value]) => {
    if (!Number.isFinite(Number(value))) {
      return total;
    }
    if (key === 'stress') {
      return total - Number(value);
    }
    return total + Number(value);
  }, 0);

  if ((effects.money ?? 0) > 0) {
    return '$';
  }
  if ((effects.money ?? 0) < 0) {
    return '−';
  }
  if (score > 5) {
    return '✓';
  }
  if (score < -5) {
    return '!';
  }
  return '◇';
}

function getRisk(choice) {
  if (choice.risk) {
    const risk = String(choice.risk).toLowerCase();
    if (['low', 'medium', 'high'].includes(risk)) {
      return risk;
    }
  }
  if (choice.type === 'bad') {
    return 'high';
  }
  if (choice.type === 'good') {
    return 'low';
  }

  const effects = choice.effects || {};
  let downside = 0;
  Object.entries(effects).forEach(([key, value]) => {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) {
      return;
    }
    if (key === 'stress' && numeric > 0) {
      downside += numeric;
    }
    if (key !== 'stress' && numeric < 0) {
      downside += Math.abs(numeric);
    }
  });
  if (downside >= 15) {
    return 'high';
  }
  if (downside >= 5) {
    return 'medium';
  }
  return 'low';
}

function getEffectPreview(choice, language) {
  return Object.entries(choice.effects || {})
    .filter(
      ([key, value]) => EFFECT_LABELS[key] && Number.isFinite(Number(value)) && Number(value) !== 0
    )
    .slice(0, 3)
    .map(([key, value]) => {
      const numeric = Number(value);
      const label = EFFECT_LABELS[key][language === 'ar' ? 'ar' : 'en'];
      let formatted;
      if (key === 'money') {
        formatted =
          language === 'ar'
            ? formatArabicMoney(numeric)
            : new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                maximumFractionDigits: 0,
                signDisplay: 'always',
              }).format(numeric);
      } else {
        const sign = numeric > 0 ? '+' : '';
        const amount =
          language === 'ar'
            ? formatArabicNumber(numeric, { maximumFractionDigits: 0 })
            : Math.round(numeric);
        formatted = `${sign}${amount}`;
      }
      return {
        key,
        positive: key === 'stress' ? numeric < 0 : numeric > 0,
        text: `${formatted} ${label}`,
      };
    });
}

export function DecisionModal({
  event,
  onChoice,
  language = 'en',
  t = (key, fallback) => fallback || key,
}) {
  const locale = language === 'ar' ? 'ar' : 'en';
  const copy = COPY[locale];

  const localize = (value, messageKey, messageParams, localizedText, context) => {
    const packText =
      localizedText && typeof localizedText === 'object'
        ? localizedText[language] || localizedText.en
        : null;
    if (packText) {
      return language === 'ar'
        ? localizeArabicCandidate(packText, localizedText.en || value, context)
        : String(packText);
    }

    const localized = messageKey
      ? translateGameMessage(language, messageKey, messageParams || {}, value)
      : translateGameText(language, value);
    const cleaned = cleanLocalizedText(localized, value, language);
    const deepLocalized = translateDeepSimulationText(cleaned, language);
    return language === 'ar'
      ? localizeArabicCandidate(deepLocalized, value, context)
      : deepLocalized;
  };

  const choose = choice => {
    if (hapticsAllowed()) {
      HAPTICS.event();
    }
    onChoice(choice);
  };

  return (
    <div className="modal-overlay decision-sheet-overlay">
      <section
        className="decision-sheet"
        dir={locale === 'ar' ? 'rtl' : 'ltr'}
        role="dialog"
        aria-modal="true"
        aria-labelledby="decision-sheet-title"
      >
        <div className="sheet-handle" aria-hidden="true" />
        <header className="decision-sheet-header">
          <span className="decision-sheet-symbol" aria-hidden="true">
            <AppIcon name="trend" size={22} />
          </span>
          <div>
            <span>{t('decision.event', copy.title)}</span>
            <h2 id="decision-sheet-title">{copy.title}</h2>
          </div>
        </header>

        <p className="decision-story-text" dir="auto">
          {localize(
            event.text,
            event.messageKey,
            event.messageParams,
            event.localizedText,
            `decision:${event.type || 'event'}`
          )}
        </p>
        <p className="decision-story-hint">{copy.subtitle}</p>

        <div className="decision-choice-list">
          {(event.choices || []).map((choice, index) => {
            const risk = getRisk(choice);
            const preview = getEffectPreview(choice, locale);
            return (
              <button
                key={choice.id || choice.effect || index}
                type="button"
                onClick={() => choose(choice)}
                className={`decision-choice-card risk-${risk}`}
              >
                <span className="decision-choice-symbol" aria-hidden="true">
                  {getChoiceEmoji(choice)}
                </span>
                <span className="decision-choice-content">
                  <strong dir="auto">
                    {localize(
                      choice.text,
                      choice.messageKey,
                      choice.messageParams,
                      choice.localizedText,
                      `choice:${event.type || 'event'}`
                    )}
                  </strong>
                  <span className="decision-risk-label">{copy[risk] || copy.certain}</span>
                  {preview.length > 0 && (
                    <span className="decision-effect-preview">
                      {preview.map(effect => (
                        <span
                          key={`${choice.id || index}-${effect.key}`}
                          className={`decision-effect-chip ${effect.positive ? 'is-positive' : 'is-negative'}`}
                          dir="auto"
                        >
                          {effect.text}
                        </span>
                      ))}
                    </span>
                  )}
                </span>
                <AppIcon name="chevron" size={18} className="decision-choice-arrow" />
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
