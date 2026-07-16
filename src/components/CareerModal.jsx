import React, { useMemo, useState } from 'react';
import { INSTRUMENTS } from '../logic/SpecialCareers';
import { getStoredLanguage, translateGameText } from '../logic/i18n';
import {
  PhaseTwoActionRow,
  PhaseTwoMetric,
  PhaseTwoProgress,
  PhaseTwoScreen,
  PhaseTwoSection,
  PhaseTwoTabs,
} from './PhaseTwoScaffold';

const COPY = {
  en: {
    eyebrow: 'Special career',
    title: 'Music and talent',
    subtitle: 'Train your voice, master instruments, and build a band.',
    overview: 'Overview',
    instruments: 'Instruments',
    talent: 'Musical talent',
    voice: 'Voice skill',
    instrumentsKnown: 'Instruments',
    band: 'Band',
    training: 'Training paths',
    trainingHint: 'Practice consumes time and improves the skills used by music careers.',
    voiceLessons: 'Take voice lessons',
    voiceHint: 'Improve singing skill and audition readiness.',
    practiceInstrument: 'Practice an instrument',
    instrumentHint: 'Choose guitar, piano, drums, and more.',
    manageBand: 'Manage band',
    formBand: 'Form a band and recruit members.',
    practice: 'Practice',
    skill: 'Skill',
    type: 'Type',
    noBand: 'No band',
    close: 'Close music career',
  },
  ar: {
    eyebrow: 'مهنة خاصة',
    title: 'الموسيقى والموهبة',
    subtitle: 'درّب صوتك وأتقن الآلات وابنِ فرقة موسيقية.',
    overview: 'نظرة عامة',
    instruments: 'الآلات',
    talent: 'الموهبة الموسيقية',
    voice: 'مهارة الغناء',
    instrumentsKnown: 'الآلات',
    band: 'الفرقة',
    training: 'مسارات التدريب',
    trainingHint: 'يستهلك التدريب وقتا ويحسن المهارات اللازمة للمهن الموسيقية.',
    voiceLessons: 'خذ دروسا في الغناء',
    voiceHint: 'حسّن مهارة الغناء واستعد للاختبارات.',
    practiceInstrument: 'تدرّب على آلة',
    instrumentHint: 'اختر الغيتار أو البيانو أو الطبول وغيرها.',
    manageBand: 'إدارة الفرقة',
    formBand: 'أنشئ فرقة واستقطب أعضاء.',
    practice: 'تدرّب',
    skill: 'المهارة',
    type: 'النوع',
    noBand: 'لا توجد فرقة',
    close: 'أغلق مهنة الموسيقى',
  },
};

export function CareerModal({
  person,
  onAction,
  onClose,
  onBand,
  language = getStoredLanguage(),
}) {
  const locale = language === 'ar' ? 'ar' : 'en';
  const copy = COPY[locale];
  const [view, setView] = useState('overview');
  const instrumentSkills = person.skills?.instruments || {};
  const practicedCount = useMemo(
    () => Object.values(instrumentSkills).filter(value => Number(value) > 0).length,
    [instrumentSkills]
  );
  const strongestInstrument = useMemo(
    () =>
      INSTRUMENTS.map(instrument => ({
        instrument,
        skill: Number(instrumentSkills[instrument.id]) || 0,
      })).sort((a, b) => b.skill - a.skill)[0],
    [instrumentSkills]
  );

  const tabs = [
    { id: 'overview', label: copy.overview, icon: '🎵' },
    { id: 'instruments', label: copy.instruments, icon: '🎸', count: INSTRUMENTS.length },
  ];

  return (
    <PhaseTwoScreen
      icon="activities"
      eyebrow={copy.eyebrow}
      title={copy.title}
      subtitle={copy.subtitle}
      onClose={onClose}
      closeLabel={copy.close}
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
      className="music-career-destination"
    >
      <div className="phase-two-metrics">
        <PhaseTwoMetric icon="🎼" label={copy.talent} value={`${Math.round(Number(person.musicalTalent) || 0)}%`} tone="gold" />
        <PhaseTwoMetric icon="🎤" label={copy.voice} value={`${Math.round(Number(person.skills?.voice) || 0)}%`} tone="growth" />
        <PhaseTwoMetric icon="🎸" label={copy.instrumentsKnown} value={practicedCount} tone="world" />
        <PhaseTwoMetric icon="👥" label={copy.band} value={person.band?.name || copy.noBand} />
      </div>

      <PhaseTwoTabs tabs={tabs} activeId={view} onChange={setView} ariaLabel={copy.title} />

      {view === 'overview' && (
        <PhaseTwoSection title={copy.training} subtitle={copy.trainingHint}>
          <div className="phase-two-action-list">
            <PhaseTwoActionRow
              icon="🎤"
              title={copy.voiceLessons}
              subtitle={copy.voiceHint}
              meta={`${copy.skill}: ${Math.round(Number(person.skills?.voice) || 0)}%`}
              onClick={() => onAction('voice')}
              tone="growth"
            />
            <PhaseTwoActionRow
              icon="🎸"
              title={copy.practiceInstrument}
              subtitle={copy.instrumentHint}
              meta={strongestInstrument?.skill > 0 ? `${translateGameText(language, strongestInstrument.instrument.name)} · ${strongestInstrument.skill}%` : undefined}
              onClick={() => setView('instruments')}
              tone="world"
            />
            {onBand && (
              <PhaseTwoActionRow
                icon="🥁"
                title={copy.manageBand}
                subtitle={person.band ? `${person.band.name} · ${person.band.members?.length || 0}` : copy.formBand}
                onClick={onBand}
                tone="gold"
              />
            )}
          </div>
        </PhaseTwoSection>
      )}

      {view === 'instruments' && (
        <PhaseTwoSection title={copy.instruments} subtitle={copy.instrumentHint}>
          <div className="phase-two-action-list music-instrument-list">
            {INSTRUMENTS.map(instrument => {
              const skill = Math.max(0, Math.min(100, Number(instrumentSkills[instrument.id]) || 0));
              return (
                <div key={instrument.id} className="phase-two-card music-instrument-card">
                  <div className="music-instrument-heading">
                    <div>
                      <h2>{translateGameText(language, instrument.name)}</h2>
                      <p>{copy.type}: {translateGameText(language, instrument.type)}</p>
                    </div>
                    <button type="button" className="phase-two-button" onClick={() => onAction('practice', instrument.id)}>
                      {copy.practice}
                    </button>
                  </div>
                  <PhaseTwoProgress label={copy.skill} value={skill} tone={skill >= 70 ? 'growth' : skill >= 35 ? 'warning' : 'world'} />
                </div>
              );
            })}
          </div>
        </PhaseTwoSection>
      )}
    </PhaseTwoScreen>
  );
}
