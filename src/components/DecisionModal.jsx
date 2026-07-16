import React from 'react';
import { translateGameMessage, translateGameText } from '../logic/i18n';
import { cleanLocalizedText } from '../logic/localizationSanitizer';
import { translateDeepSimulationText } from '../logic/DeepLocalization';
import { localizeArabicCandidate } from '../logic/ArabicLocalization';
import './Modal.css';

const TYPE_EMOJIS = {
  good: '✅',
  bad: '⚠️',
  mixed: '🎲',
  neutral: '💭',
};

function getChoiceEmoji(choice) {
  if (choice.emoji) return choice.emoji;
  if (choice.type && TYPE_EMOJIS[choice.type]) return TYPE_EMOJIS[choice.type];

  const effects = choice.effects || {};
  const score = Object.entries(effects).reduce((total, [key, value]) => {
    if (key === 'stress') return total - value;
    return total + value;
  }, 0);

  if ((effects.money ?? 0) > 0) return '💰';
  if ((effects.money ?? 0) < 0) return '💸';
  if (score > 5) return '✅';
  if (score < -5) return '⚠️';
  return '💭';
}

export function DecisionModal({
  event,
  onChoice,
  language = 'en',
  t = (key, fallback) => fallback || key,
}) {
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

  return (
    <div className="modal-overlay">
      <div
        className="modal-content"
        style={{ maxWidth: '360px' }}
        dir={language === 'ar' ? 'rtl' : 'ltr'}
      >
        <div className="modal-header">
          <h2 className="modal-title">✨ {t('decision.event', 'Event')}</h2>
        </div>

        <div className="modal-body">
          <p
            dir="auto"
            style={{ fontSize: '1.2em', lineHeight: '1.5', margin: '0 0 24px 0' }}
          >
            {localize(
              event.text,
              event.messageKey,
              event.messageParams,
              event.localizedText,
              `decision:${event.type || 'event'}`
            )}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {(event.choices || []).map((choice, index) => (
              <button
                key={choice.id || choice.effect || index}
                onClick={() => onChoice(choice)}
                className="btn-secondary"
                style={{
                  textAlign: language === 'ar' ? 'right' : 'left',
                  padding: '16px',
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  transition: 'background 0.2s',
                  justifyContent: 'flex-start',
                }}
              >
                <span className="choice-emoji" aria-hidden="true">
                  {getChoiceEmoji(choice)}
                </span>
                <span dir="auto">
                  {localize(
                    choice.text,
                    choice.messageKey,
                    choice.messageParams,
                    choice.localizedText,
                    `choice:${event.type || 'event'}`
                  )}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
