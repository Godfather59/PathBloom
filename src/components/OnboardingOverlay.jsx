import React, { useState } from 'react';
import './Modal.css';

const STEPS = [
  {
    icon: '😊',
    titleKey: 'onboarding.statsTitle',
    title: 'Watch your stats',
    bodyKey: 'onboarding.statsBody',
    body: 'Happiness, health, smarts, looks, stress, and karma shape every life event.',
  },
  {
    icon: '🎂',
    titleKey: 'onboarding.ageTitle',
    title: 'Age up to move forward',
    bodyKey: 'onboarding.ageBody',
    body: 'Tap Age Up when you are ready. Each year can bring school, work, relationships, surprises, or trouble.',
  },
  {
    icon: '🎯',
    titleKey: 'onboarding.activitiesTitle',
    title: 'Choose activities with intent',
    bodyKey: 'onboarding.activitiesBody',
    body: 'Activities are your main choices: love, fitness, crime, business, hobbies, travel, and more.',
  },
  {
    icon: '💵',
    titleKey: 'onboarding.moneyTitle',
    title: 'Build money and bonds',
    bodyKey: 'onboarding.moneyBody',
    body: 'Jobs, assets, education, relationships, and children all feed into your long-term legacy.',
  },
  {
    icon: '🌳',
    titleKey: 'onboarding.legacyTitle',
    title: 'Grow a legacy',
    bodyKey: 'onboarding.legacyBody',
    body: 'Life goals and legacy score give every run a direction. When a life ends, you can start fresh or continue as a child.',
  },
];

export function OnboardingOverlay({
  language = 'en',
  t = (key, fallback) => fallback || key,
  onClose,
}) {
  const [index, setIndex] = useState(0);
  const step = STEPS[index];
  const isLast = index === STEPS.length - 1;

  return (
    <div className="modal-overlay onboarding-overlay">
      <div className="modal-content onboarding-card" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <div className="onboarding-step-count">
          {index + 1}/{STEPS.length}
        </div>
        <div className="onboarding-icon" aria-hidden="true">
          {step.icon}
        </div>
        <h2 className="modal-title onboarding-title">{t(step.titleKey, step.title)}</h2>
        <p className="onboarding-body">{t(step.bodyKey, step.body)}</p>

        <div className="onboarding-actions">
          <button className="btn-secondary" onClick={onClose}>
            {t('onboarding.skip', 'Skip')}
          </button>
          <button
            className="btn-primary"
            onClick={() => {
              if (isLast) {
                onClose();
              } else {
                setIndex(index + 1);
              }
            }}
          >
            {isLast ? t('onboarding.done', 'Done') : t('onboarding.next', 'Next')}
          </button>
        </div>
      </div>
    </div>
  );
}
