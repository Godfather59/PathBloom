import React, { useEffect, useRef, memo, useMemo } from 'react';
import { translateGameMessage, translateGameText } from '../logic/i18n';
import { cleanLocalizedText } from '../logic/localizationSanitizer';
import { translateDeepSimulationText } from '../logic/DeepLocalization';
import {
  formatArabicMoney,
  formatArabicNumber,
  localizeArabicCandidate,
} from '../logic/ArabicLocalization';
import { AppIcon } from './AppIcon';
import './EventLog.css';

const MAX_VISIBLE_EVENTS = 140;

const CATEGORY_DEFINITIONS = {
  family: { icon: 'relationships', en: 'Family', ar: 'العائلة' },
  career: { icon: 'briefcase', en: 'Career', ar: 'المهنة' },
  money: { icon: 'assets', en: 'Money', ar: 'المال' },
  crime: { icon: 'warning', en: 'Crime', ar: 'الجريمة' },
  politics: { icon: 'trend', en: 'Politics', ar: 'السياسة' },
  world: { icon: 'world', en: 'World', ar: 'العالم' },
  war: { icon: 'warning', en: 'War', ar: 'الحرب' },
  health: { icon: 'life', en: 'Health', ar: 'الصحة' },
  education: { icon: 'education', en: 'Education', ar: 'التعليم' },
  relationship: { icon: 'relationships', en: 'Relationship', ar: 'العلاقات' },
  achievement: { icon: 'trend', en: 'Milestone', ar: 'إنجاز' },
  life: { icon: 'life', en: 'Life', ar: 'الحياة' },
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
  reputation: { en: 'reputation', ar: 'السمعة' },
};

const localizeEvent = (event, language) => {
  const packText =
    event.localizedText && typeof event.localizedText === 'object'
      ? event.localizedText[language] || event.localizedText.en
      : null;
  if (packText) {
    return language === 'ar'
      ? localizeArabicCandidate(
          packText,
          event.localizedText.en || event.text,
          `history:${event.type || 'event'}`
        )
      : String(packText);
  }

  const localized = event.messageKey
    ? translateGameMessage(language, event.messageKey, event.messageParams || {}, event.text)
    : translateGameText(language, event.text);
  const cleaned = cleanLocalizedText(localized, event.text, language);
  const deepLocalized = translateDeepSimulationText(cleaned, language);
  return language === 'ar'
    ? localizeArabicCandidate(deepLocalized, event.text, `history:${event.type || 'event'}`)
    : deepLocalized;
};

function detectCategory(event) {
  const explicit = String(event.category || event.situationType || '').toLowerCase();
  if (CATEGORY_DEFINITIONS[explicit]) {
    return explicit;
  }

  const pack = String(event.contentPackId || '').toLowerCase();
  if (pack.includes('family')) {
    return 'family';
  }
  if (pack.includes('career')) {
    return 'career';
  }
  if (pack.includes('crime')) {
    return 'crime';
  }
  if (pack.includes('politic')) {
    return 'politics';
  }
  if (pack.includes('war') || pack.includes('geopolit')) {
    return 'world';
  }
  if (pack.includes('school')) {
    return 'education';
  }

  const text = String(event.text || event.localizedText?.en || '').toLowerCase();
  if (/war|military|deployment|battle|missile|casualt|invasion/.test(text)) {
    return 'war';
  }
  if (
    /president|election|campaign|minister|government|politic|parliament|coup|sanction/.test(text)
  ) {
    return 'politics';
  }
  if (/job|career|salary|promotion|fired|business|company|work/.test(text)) {
    return 'career';
  }
  if (/school|college|university|class|degree|graduat|exam/.test(text)) {
    return 'education';
  }
  if (/doctor|health|ill|disease|injur|treatment|hospital|pregnan/.test(text)) {
    return 'health';
  }
  if (/married|divorc|partner|friend|relationship|child|parent|family|baby/.test(text)) {
    return 'relationship';
  }
  if (/crime|prison|arrest|police|rob|stole|gang|court|lawsuit/.test(text)) {
    return 'crime';
  }
  if (/money|paid|earned|cost|debt|tax|rent|bought|sold|profit|loss/.test(text)) {
    return 'money';
  }
  if (/achievement|milestone|completed|won|graduated/.test(text)) {
    return 'achievement';
  }
  if (/world|country|refugee|migration|alliance|treaty/.test(text)) {
    return 'world';
  }
  return 'life';
}

function collectEffectChips(event, language) {
  const source = event.effects || event.statChanges || event.changes || {};
  const values = { ...source };
  if (Number.isFinite(Number(event.moneyChange))) {
    values.money = Number(event.moneyChange);
  }
  if (Number.isFinite(Number(event.reputationChange))) {
    values.reputation = Number(event.reputationChange);
  }

  return Object.entries(values)
    .filter(
      ([key, value]) => EFFECT_LABELS[key] && Number.isFinite(Number(value)) && Number(value) !== 0
    )
    .slice(0, 4)
    .map(([key, value]) => {
      const numeric = Number(value);
      const sign = numeric > 0 ? '+' : '';
      const formatted =
        key === 'money'
          ? language === 'ar'
            ? formatArabicMoney(numeric)
            : new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                maximumFractionDigits: 0,
                signDisplay: 'always',
              }).format(numeric)
          : `${sign}${
              language === 'ar'
                ? formatArabicNumber(numeric, { maximumFractionDigits: 0 })
                : Math.round(numeric)
            }`;
      return {
        key,
        positive: numeric > 0,
        text: `${formatted} ${EFFECT_LABELS[key][language === 'ar' ? 'ar' : 'en']}`,
      };
    });
}

const TimelineEvent = memo(({ event, language, t, showAgeMarker }) => {
  const categoryId = detectCategory(event);
  const category = CATEGORY_DEFINITIONS[categoryId] || CATEGORY_DEFINITIONS.life;
  const effects = collectEffectChips(event, language);
  const age =
    language === 'ar' ? formatArabicNumber(event.age, { maximumFractionDigits: 0 }) : event.age;

  return (
    <article className={`timeline-event category-${categoryId} tone-${event.type || 'neutral'}`}>
      <div className="timeline-rail" aria-hidden="true">
        <span className="timeline-dot">
          <AppIcon name={category.icon} size={13} strokeWidth={2} />
        </span>
      </div>

      <div className="timeline-card">
        <div className="timeline-meta-row">
          <span className="timeline-category">{category[language === 'ar' ? 'ar' : 'en']}</span>
          <span className={`timeline-age ${showAgeMarker ? 'is-new-age' : ''}`}>
            {t('common.age', 'Age')} {age}
          </span>
        </div>

        <p className="event-text" dir="auto">
          {localizeEvent(event, language)}
        </p>

        {effects.length > 0 && (
          <div
            className="timeline-effects"
            aria-label={language === 'ar' ? 'نتائج الحدث' : 'Event consequences'}
          >
            {effects.map(effect => (
              <span
                key={`${event.id || event.text}-${effect.key}`}
                className={`effect-chip ${effect.positive ? 'is-positive' : 'is-negative'}`}
                dir="auto"
              >
                {effect.text}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
});

export const EventLog = memo(
  ({ history = [], language = 'en', t = (key, fallback) => fallback || key }) => {
    const containerRef = useRef(null);

    useEffect(() => {
      const element = containerRef.current;
      if (!element) {
        return undefined;
      }

      const updatePadding = () => {
        const hud = document.querySelector('.hud-container');
        const actionMenu = document.querySelector('.action-menu');
        if (hud) {
          element.style.paddingTop = `${hud.offsetHeight + 18}px`;
        }
        if (actionMenu) {
          element.style.paddingBottom = `${actionMenu.offsetHeight + 22}px`;
        }
      };

      const observer = new ResizeObserver(updatePadding);
      const hud = document.querySelector('.hud-container');
      const actionMenu = document.querySelector('.action-menu');
      if (hud) {
        observer.observe(hud);
      }
      if (actionMenu) {
        observer.observe(actionMenu);
      }
      updatePadding();
      return () => observer.disconnect();
    }, []);

    useEffect(() => {
      if (containerRef.current) {
        containerRef.current.scrollTop = 0;
      }
    }, [history.length]);

    const displayHistory = useMemo(() => {
      const reversed = [...history].reverse();
      return reversed.length > MAX_VISIBLE_EVENTS
        ? reversed.slice(0, MAX_VISIBLE_EVENTS)
        : reversed;
    }, [history]);

    return (
      <main className="event-log" ref={containerRef} dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <div className="timeline-heading">
          <span>{language === 'ar' ? 'قصتك' : 'Your story'}</span>
          <strong>{language === 'ar' ? 'أحدث الأحداث أولا' : 'Newest first'}</strong>
        </div>

        {displayHistory.length === 0 && (
          <div className="timeline-empty">
            <span className="timeline-empty-icon">
              <AppIcon name="life" size={26} />
            </span>
            <strong>{t('eventlog.empty', 'No events yet. Start living!')}</strong>
          </div>
        )}

        <div className="timeline-list">
          {displayHistory.map((event, index) => (
            <TimelineEvent
              key={event.id || `${event.age}-${index}-${event.text}`}
              event={event}
              language={language}
              t={t}
              showAgeMarker={index === 0 || displayHistory[index - 1]?.age !== event.age}
            />
          ))}
        </div>
      </main>
    );
  }
);
