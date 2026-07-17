import React, { useState } from 'react';
import { getCurrentTimePerson } from '../logic/TimeProgression';
import { setGuidedJourney } from '../logic/PlayerJourney';
import './Modal.css';
import './ReleasePolish.css';

const STEPS = {
  en: [
    {
      icon: '🌱',
      title: 'Every life becomes a story',
      body: 'Advance through years, react to events, and watch small choices grow into a career, family, reputation, and legacy.',
      preview: [
        'Your timeline remembers important moments',
        'Decisions create visible consequences',
        'The world continues around you',
      ],
    },
    {
      icon: '❤️',
      title: 'Watch what matters',
      body: 'Health, happiness, stress, money, relationships, and reputation constantly shape which opportunities appear.',
      preview: [
        'Tap the compact stat row for details',
        'Active situations advance month by month',
        'Warnings appear before serious risk',
      ],
    },
    {
      icon: '✨',
      title: 'Choose your direction',
      body: 'Activities, education, work, relationships, assets, politics, and the world screen are the tools that shape your path.',
      preview: [
        'Career and education unlock opportunities',
        'Relationships remember support and betrayal',
        'Assets build security and risk',
      ],
    },
    {
      icon: '🎯',
      title: 'Start with a guided journey',
      body: 'A small goal card can guide your first life, reward progress, and explain major features as they unlock. You remain free to play any way you choose.',
      preview: [
        'Eight optional starter goals',
        'Rewards for healthy progress',
        'Contextual tips at important ages',
      ],
    },
    {
      icon: '🌳',
      title: 'Build a life worth remembering',
      body: 'There is no single winning path. Become kind, powerful, wealthy, infamous, influential—or simply create a life that feels meaningful.',
      preview: [
        'Autosave protects every important change',
        'Milestones celebrate real progress',
        'Children can continue a family legacy',
      ],
    },
  ],
  ar: [
    {
      icon: '🌱',
      title: 'كل حياة تتحول إلى قصة',
      body: 'تقدم عبر السنوات وتفاعل مع الأحداث وشاهد كيف تتحول الاختيارات الصغيرة إلى مهنة وعائلة وسمعة وإرث.',
      preview: [
        'يحفظ الخط الزمني اللحظات المهمة',
        'تُظهر القرارات نتائج واضحة',
        'يستمر العالم من حولك',
      ],
    },
    {
      icon: '❤️',
      title: 'راقب ما يهم',
      body: 'تؤثر الصحة والسعادة والتوتر والمال والعلاقات والسمعة باستمرار في الفرص التي تظهر لك.',
      preview: [
        'اضغط على صف الإحصائيات لعرض التفاصيل',
        'تتقدم الأوضاع النشطة شهرا بعد شهر',
        'تظهر التحذيرات قبل المخاطر الكبيرة',
      ],
    },
    {
      icon: '✨',
      title: 'اختر اتجاهك',
      body: 'الأنشطة والتعليم والعمل والعلاقات والممتلكات والسياسة وشاشة العالم هي أدوات تشكيل مسارك.',
      preview: [
        'تفتح المهنة والتعليم فرصا جديدة',
        'تتذكر العلاقات الدعم والخيانة',
        'تبني الممتلكات الأمان والمخاطر',
      ],
    },
    {
      icon: '🎯',
      title: 'ابدأ برحلة موجهة',
      body: 'يمكن لبطاقة أهداف صغيرة إرشاد حياتك الأولى ومكافأة تقدمك وشرح الميزات المهمة عند فتحها، مع بقاء حرية اللعب كاملة.',
      preview: [
        'ثمانية أهداف بداية اختيارية',
        'مكافآت على التقدم الصحي',
        'نصائح سياقية في الأعمار المهمة',
      ],
    },
    {
      icon: '🌳',
      title: 'ابنِ حياة تستحق أن تُذكر',
      body: 'لا يوجد مسار فوز واحد. كن طيبا أو قويا أو ثريا أو سيئ السمعة أو مؤثرا، أو اصنع ببساطة حياة ذات معنى.',
      preview: [
        'يحمي الحفظ التلقائي كل تغيير مهم',
        'تحتفل الإنجازات بالتقدم الحقيقي',
        'يمكن للأطفال مواصلة إرث العائلة',
      ],
    },
  ],
};

export function OnboardingOverlay({ language = 'en', onClose }) {
  const locale = language === 'ar' ? 'ar' : 'en';
  const steps = STEPS[locale];
  const [index, setIndex] = useState(0);
  const step = steps[index];
  const isLast = index === steps.length - 1;
  const copy =
    locale === 'ar'
      ? {
          brand: 'PathBloom',
          skip: 'تخطَّ',
          back: 'السابق',
          next: 'التالي',
          start: 'ابدأ الرحلة الموجهة',
        }
      : {
          brand: 'PathBloom',
          skip: 'Skip',
          back: 'Back',
          next: 'Next',
          start: 'Start guided journey',
        };

  const finish = guided => {
    const person = getCurrentTimePerson();
    if (person) {
      setGuidedJourney(person, guided);
    }
    try {
      localStorage.setItem('pathbloom_guided_journey', guided ? 'true' : 'false');
    } catch {
      // Storage is optional; the person save will retain the choice after the next action.
    }
    onClose?.({ guided, skipped: !guided });
  };

  return (
    <div className="modal-overlay onboarding-overlay release-onboarding">
      <div className="modal-content onboarding-card" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
        <header className="release-onboarding-header">
          <div className="release-onboarding-brand">
            <span aria-hidden="true">🌱</span>
            <span>{copy.brand}</span>
          </div>
          <button type="button" className="release-onboarding-skip" onClick={() => finish(false)}>
            {copy.skip}
          </button>
        </header>

        <main className="release-onboarding-body">
          <div className="release-onboarding-visual">
            <div className="release-onboarding-icon" aria-hidden="true">
              {step.icon}
            </div>
          </div>
          <h2>{step.title}</h2>
          <p>{step.body}</p>
          <div className="release-onboarding-preview">
            {step.preview.map(item => (
              <span key={item}>
                <b aria-hidden="true">✓</b>
                {item}
              </span>
            ))}
          </div>
        </main>

        <footer className="release-onboarding-footer">
          <div className="release-onboarding-dots" aria-label={`${index + 1}/${steps.length}`}>
            {steps.map((_, stepIndex) => (
              <button
                key={stepIndex}
                type="button"
                className={stepIndex === index ? 'is-active' : ''}
                onClick={() => setIndex(stepIndex)}
                aria-label={`${stepIndex + 1}`}
              />
            ))}
          </div>
          <div className="release-onboarding-actions">
            <button
              type="button"
              className="release-onboarding-back"
              onClick={() => setIndex(value => Math.max(0, value - 1))}
              disabled={index === 0}
            >
              {copy.back}
            </button>
            <button
              type="button"
              className="release-onboarding-next"
              onClick={() => {
                if (isLast) {
                  finish(true);
                } else {
                  setIndex(value => value + 1);
                }
              }}
            >
              {isLast ? copy.start : copy.next}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
