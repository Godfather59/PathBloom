import React, { useEffect, useMemo, useState } from 'react';
import { PUBLIC_SCHOOLS } from '../logic/Education';
import { UNIVERSITY_MAJORS, GRAD_SCHOOLS, checkPrereq } from '../logic/EducationLogic';
import { translateGameText } from '../logic/i18n';
import { formatArabicMoney } from '../logic/ArabicLocalization';
import {
  PhaseTwoActionRow,
  PhaseTwoEmpty,
  PhaseTwoMetric,
  PhaseTwoProgress,
  PhaseTwoScreen,
  PhaseTwoSection,
  PhaseTwoTabs,
} from './PhaseTwoScaffold';

const COPY = {
  en: {
    eyebrow: 'Education',
    title: 'School and learning',
    subtitle: 'Study, earn qualifications, and unlock better careers.',
    current: 'Current school',
    school: 'School',
    university: 'University',
    graduate: 'Graduate',
    grade: 'Performance',
    year: 'Current year',
    degrees: 'Degrees',
    completed: 'Completed',
    enrolledTitle: 'Your studies',
    enrolledSubtitle: 'Keep your performance high to graduate successfully.',
    study: 'Study harder',
    dropOut: 'Drop out',
    opportunities: 'Programs available',
    opportunitiesSubtitle: 'Compare duration, tuition, and entry requirements.',
    apply: 'Apply',
    unavailable: 'Unavailable',
    requires: 'Requires',
    tuition: 'per year',
    years: 'years',
    noPrograms: 'No programs available right now',
    noProgramsHint: 'Your age or completed qualifications may not match this level yet.',
    close: 'Close education',
    schoolProgress: 'Progress toward graduation',
    educationHistory: 'Education history',
    noHistory: 'No completed qualifications yet.',
  },
  ar: {
    eyebrow: 'التعليم',
    title: 'الدراسة والتعلم',
    subtitle: 'ادرس واحصل على المؤهلات وافتح وظائف أفضل.',
    current: 'الدراسة الحالية',
    school: 'المدرسة',
    university: 'الجامعة',
    graduate: 'الدراسات العليا',
    grade: 'الأداء',
    year: 'السنة الحالية',
    degrees: 'الشهادات',
    completed: 'مكتملة',
    enrolledTitle: 'دراستك',
    enrolledSubtitle: 'حافظ على أداء مرتفع لتتخرج بنجاح.',
    study: 'ادرس بجدية أكبر',
    dropOut: 'انسحب من الدراسة',
    opportunities: 'البرامج المتاحة',
    opportunitiesSubtitle: 'قارن المدة والرسوم ومتطلبات القبول.',
    apply: 'قدّم',
    unavailable: 'غير متاح',
    requires: 'يتطلب',
    tuition: 'سنويا',
    years: 'سنوات',
    noPrograms: 'لا توجد برامج متاحة حاليا',
    noProgramsHint: 'قد لا يتناسب عمرك أو مؤهلاتك الحالية مع هذا المستوى بعد.',
    close: 'أغلق التعليم',
    schoolProgress: 'التقدم نحو التخرج',
    educationHistory: 'السجل التعليمي',
    noHistory: 'لا توجد مؤهلات مكتملة بعد.',
  },
};

function formatMoney(value, language) {
  const amount = Math.round(Number(value) || 0);
  return language === 'ar'
    ? formatArabicMoney(amount, 'USD')
    : `$${amount.toLocaleString('en-US')}`;
}

export function EducationMenu({
  person,
  onEnroll,
  onStudy,
  onDropOut,
  onClose,
  language = 'en',
  t = (key, fallback) => fallback || key,
}) {
  const locale = language === 'ar' ? 'ar' : 'en';
  const copy = COPY[locale];
  const [activeTab, setActiveTab] = useState(person.age < 18 ? 'public' : 'uni');

  useEffect(() => {
    if (person.age < 18) {
      setActiveTab('public');
    }
  }, [person.age]);

  const lists = useMemo(
    () => ({
      public: PUBLIC_SCHOOLS.filter(school => {
        if (school.type === 'elementary') {
          return person.age >= 6 && person.age < 14;
        }
        if (school.type === 'high_school') {
          return person.age >= 14 && person.age < 18;
        }
        return false;
      }),
      uni: UNIVERSITY_MAJORS,
      grad: GRAD_SCHOOLS,
    }),
    [person.age]
  );

  const currentList = lists[activeTab] || [];
  const history = [
    ...(person.educationHistory || []).map(value =>
      typeof value === 'string' ? value : value?.name
    ),
    ...(person.degrees || []).map(degree => degree?.type || degree?.name),
  ].filter(Boolean);
  const uniqueHistory = [...new Set(history)];
  const school = person.currentSchool;
  const performance = Math.max(0, Math.min(100, Number(school?.performance) || 0));
  const currentYear = Math.max(0, Number(school?.year) || 0);
  const totalYears = Math.max(1, Number(school?.years) || 1);
  const graduationProgress = Math.max(0, Math.min(100, (currentYear / totalYears) * 100));

  const tabs = [
    ...(person.age < 18
      ? [{ id: 'public', label: copy.school, icon: '🏫', count: lists.public.length }]
      : []),
    { id: 'uni', label: copy.university, icon: '🎓', count: lists.uni.length },
    { id: 'grad', label: copy.graduate, icon: '📜', count: lists.grad.length },
  ];

  const programStatus = program => {
    let hasReq = true;
    if (program.req_degree) {
      const degrees = (person.degrees || []).map(degree => degree.type);
      hasReq = checkPrereq(program.id, degrees);
    }
    const alreadyHave =
      (person.educationHistory || []).some(entry => entry === program.name) ||
      (person.degrees || []).some(degree => degree.type === program.name);
    return { hasReq, alreadyHave };
  };

  return (
    <PhaseTwoScreen
      icon="education"
      eyebrow={copy.eyebrow}
      title={copy.title}
      subtitle={copy.subtitle}
      onClose={onClose}
      closeLabel={copy.close}
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
      className="education-destination"
    >
      <div className="phase-two-metrics">
        <PhaseTwoMetric
          icon="🎓"
          label={copy.current}
          value={school ? translateGameText(language, school.name) : '—'}
          tone={school ? 'growth' : 'neutral'}
        />
        <PhaseTwoMetric
          icon="📊"
          label={copy.grade}
          value={school ? `${Math.round(performance)}%` : '—'}
        />
        <PhaseTwoMetric
          icon="📅"
          label={copy.year}
          value={school ? `${currentYear}/${totalYears}` : '—'}
          tone="world"
        />
        <PhaseTwoMetric icon="📜" label={copy.degrees} value={uniqueHistory.length} tone="gold" />
      </div>

      {school ? (
        <PhaseTwoSection title={copy.enrolledTitle} subtitle={copy.enrolledSubtitle}>
          <div className="phase-two-card phase-two-card-highlight education-current-card">
            <div className="education-current-heading">
              <span className="education-current-icon" aria-hidden="true">
                🎓
              </span>
              <div>
                <span className="phase-two-eyebrow">{copy.current}</span>
                <h2 dir="auto">{translateGameText(language, school.name)}</h2>
                <p>
                  {copy.year} {currentYear} / {totalYears}
                </p>
              </div>
            </div>
            <PhaseTwoProgress
              label={copy.grade}
              value={performance}
              tone={performance >= 70 ? 'growth' : performance >= 40 ? 'warning' : 'danger'}
            />
            <PhaseTwoProgress label={copy.schoolProgress} value={graduationProgress} tone="world" />
            <div className="phase-two-button-row">
              <button type="button" className="phase-two-button" onClick={onStudy}>
                📚 {copy.study}
              </button>
              <button type="button" className="phase-two-button-danger" onClick={onDropOut}>
                🚪 {copy.dropOut}
              </button>
            </div>
          </div>
        </PhaseTwoSection>
      ) : (
        <>
          <PhaseTwoTabs
            tabs={tabs}
            activeId={activeTab}
            onChange={setActiveTab}
            ariaLabel={copy.title}
          />
          <PhaseTwoSection title={copy.opportunities} subtitle={copy.opportunitiesSubtitle}>
            <div className="phase-two-action-list education-program-list">
              {currentList.map(program => {
                const { hasReq, alreadyHave } = programStatus(program);
                const available = hasReq && !alreadyHave;
                const title = translateGameText(language, program.name);
                const duration = `${program.years} ${copy.years}`;
                const tuition = `${formatMoney(program.cost, language)} ${copy.tuition}`;
                const requirement = !hasReq
                  ? `${copy.requires}: ${translateGameText(language, program.req_degree)}`
                  : alreadyHave
                    ? copy.completed
                    : `${duration} · ${tuition}`;
                return (
                  <PhaseTwoActionRow
                    key={program.id}
                    icon={
                      alreadyHave
                        ? '✅'
                        : activeTab === 'grad'
                          ? '📜'
                          : activeTab === 'uni'
                            ? '🎓'
                            : '🏫'
                    }
                    title={title}
                    subtitle={requirement}
                    disabled={!available}
                    tone={alreadyHave ? 'gold' : hasReq ? 'neutral' : 'danger'}
                    onClick={() => onEnroll(program)}
                    trailing={
                      <span
                        className={`phase-two-pill ${available ? 'good' : alreadyHave ? 'warning' : 'danger'}`}
                      >
                        {available ? copy.apply : alreadyHave ? copy.completed : copy.unavailable}
                      </span>
                    }
                  />
                );
              })}
            </div>
            {currentList.length === 0 && (
              <PhaseTwoEmpty icon="📚" title={copy.noPrograms} description={copy.noProgramsHint} />
            )}
          </PhaseTwoSection>
        </>
      )}

      <PhaseTwoSection title={copy.educationHistory}>
        {uniqueHistory.length > 0 ? (
          <div className="phase-two-pill-row">
            {uniqueHistory.map(item => (
              <span key={item} className="phase-two-pill good" dir="auto">
                ✅ {translateGameText(language, item)}
              </span>
            ))}
          </div>
        ) : (
          <div className="phase-two-inline-note">{copy.noHistory}</div>
        )}
      </PhaseTwoSection>
    </PhaseTwoScreen>
  );
}
