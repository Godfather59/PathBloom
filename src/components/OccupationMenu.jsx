import React, { useMemo, useState } from 'react';
import { translateGameText } from '../logic/i18n';
import { JOBS } from '../logic/Job';
import { meetsEducationRequirement } from '../logic/EducationLogic';
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

const MILITARY_BRANCHES = [
  { name: 'Army', ar: 'القوات البرية', key: 'army', icon: '🪖' },
  { name: 'Navy', ar: 'القوات البحرية', key: 'navy', icon: '⚓' },
  { name: 'Air Force', ar: 'القوات الجوية', key: 'airForce', icon: '✈️' },
  { name: 'Marines', ar: 'مشاة البحرية', key: 'marines', icon: '🎖️' },
];

const COPY = {
  en: {
    eyebrow: 'Career',
    title: 'Work and occupation',
    subtitle: 'Build a career, compare opportunities, or serve in the military.',
    current: 'Current role',
    market: 'Job market',
    military: 'Military',
    salary: 'Annual salary',
    years: 'Years employed',
    openings: 'Open roles',
    qualified: 'Qualified',
    unemployed: 'You are currently unemployed',
    unemployedHint: 'Browse the market and find a role that matches your education and abilities.',
    currentTitle: 'Your career',
    currentSubtitle: 'Performance, tenure, and next actions.',
    jobMarket: 'Available opportunities',
    jobMarketSubtitle: 'Search roles and review every requirement before applying.',
    search: 'Search jobs…',
    apply: 'Apply',
    locked: 'Not qualified',
    requires: 'Requires',
    resign: 'Resign',
    skills: 'Career skills',
    deploy: 'Deploy',
    civilian: 'Civilian role',
    militaryRole: 'Military role',
    militaryTitle: 'Choose a service branch',
    militarySubtitle: 'Enlist directly or apply as an officer when you hold a degree.',
    enlist: 'Enlist',
    officer: 'Apply as officer',
    officerHint: 'College degree required',
    noJobs: 'No jobs match this search',
    noJobsHint: 'Clear the search or improve your qualifications.',
    close: 'Close career',
  },
  ar: {
    eyebrow: 'المهنة',
    title: 'العمل والمهنة',
    subtitle: 'ابنِ مسيرتك وقارن الفرص أو انضم إلى الخدمة العسكرية.',
    current: 'الوظيفة الحالية',
    market: 'سوق العمل',
    military: 'العسكرية',
    salary: 'الراتب السنوي',
    years: 'سنوات العمل',
    openings: 'الوظائف المتاحة',
    qualified: 'مؤهل لها',
    unemployed: 'أنت عاطل عن العمل حاليا',
    unemployedHint: 'تصفح السوق واختر وظيفة تناسب تعليمك وقدراتك.',
    currentTitle: 'مسيرتك المهنية',
    currentSubtitle: 'الأداء والخبرة والخطوات التالية.',
    jobMarket: 'الفرص المتاحة',
    jobMarketSubtitle: 'ابحث في الوظائف وراجع المتطلبات قبل التقديم.',
    search: 'ابحث عن وظيفة…',
    apply: 'قدّم',
    locked: 'غير مؤهل',
    requires: 'يتطلب',
    resign: 'استقل',
    skills: 'مهارات المهنة',
    deploy: 'انطلق في مهمة',
    civilian: 'وظيفة مدنية',
    militaryRole: 'وظيفة عسكرية',
    militaryTitle: 'اختر فرع الخدمة',
    militarySubtitle: 'التحق مباشرة أو قدّم كضابط عندما تتوفر لديك شهادة جامعية.',
    enlist: 'التحق',
    officer: 'قدّم كضابط',
    officerHint: 'تتطلب شهادة جامعية',
    noJobs: 'لا توجد وظائف مطابقة',
    noJobsHint: 'امسح البحث أو حسّن مؤهلاتك.',
    close: 'أغلق المهنة',
  },
};

function formatMoney(value, language) {
  const amount = Math.round(Number(value) || 0);
  return language === 'ar'
    ? formatArabicMoney(amount, 'USD')
    : `$${amount.toLocaleString('en-US')}`;
}

export function OccupationMenu({
  person,
  onApply,
  onQuit,
  onClose,
  language = 'en',
  t = (key, fallback) => fallback || key,
}) {
  const locale = language === 'ar' ? 'ar' : 'en';
  const copy = COPY[locale];
  const [activeTab, setActiveTab] = useState(person.job ? 'current' : 'market');
  const [query, setQuery] = useState('');
  const jobs = person.market?.jobs || JOBS;

  const checkRequirements = job => {
    const issues = [];
    const add = (english, arabic = english) => issues.push(locale === 'ar' ? arabic : english);

    if (job.customReq === 'influencer' && !person.social?.isInfluencer) {
      add('Social Media Influencer status', 'صفة مؤثر على وسائل التواصل');
    }
    if (job.customReq === 'stuntman' && (person.skills?.martialArts || 0) < 100) {
      add('Martial Arts Mastery (100)', 'إتقان الفنون القتالية (100)');
    }
    if (job.customReq === 'coding_skill' && (person.skills?.coding || 0) < 80) {
      add('Coding Skill (80+)', 'مهارة البرمجة (80+)');
    }
    if (job.customReq === 'cooking_skill' && (person.skills?.cooking || 0) < 90) {
      add('Cooking Skill (90+)', 'مهارة الطبخ (90+)');
    }
    if (job.customReq === 'musician') {
      const musicSkill = Math.max(
        person.skills?.voice || 0,
        person.skills?.instrument || 0,
        ...Object.values(person.skills?.instruments || {}).map(Number)
      );
      if (musicSkill < 80) add('Voice or Instrument Skill (80+)', 'مهارة الغناء أو العزف (80+)');
    }
    if (job.customReq === 'actor' && (person.fame || 0) < 20) {
      add('Fame (20+)', 'الشهرة (20+)');
    }
    if (
      job.customReq === 'personal_trainer_unlock' &&
      !person.unlockedFeatures?.includes('personal_training')
    ) {
      add('Complete a personal training session', 'أكمل حصة تدريب شخصي');
    }
    if (job.customReq === 'study_group_unlock' && !person.unlockedFeatures?.includes('study_group')) {
      add('Discover a study group at the library', 'اكتشف مجموعة دراسة في المكتبة');
    }

    const req = job.requirements || {};
    if (req.smarts && person.smarts < req.smarts) {
      add(`Smarts ${req.smarts}+`, `الذكاء ${req.smarts}+`);
    }
    if (req.looks && person.looks < req.looks) {
      add(`Looks ${req.looks}+`, `المظهر ${req.looks}+`);
    }
    if (req.health && person.health < req.health) {
      add(`Health ${req.health}+`, `الصحة ${req.health}+`);
    }
    if (!meetsEducationRequirement(person, req.education)) {
      add(`Education: ${req.education}`, `التعليم: ${translateGameText(language, req.education)}`);
    }
    if (Array.isArray(req.degree_req)) {
      const hasRequiredMajor = (person.degrees || []).some(degree =>
        req.degree_req.includes(degree?.type)
      );
      if (!hasRequiredMajor) {
        add(`Degree: ${req.degree_req.join(' or ')}`, `شهادة: ${req.degree_req.map(value => translateGameText(language, value)).join(' أو ')}`);
      }
    }
    return issues;
  };

  const evaluatedJobs = useMemo(
    () =>
      jobs.map(job => ({
        job,
        issues: checkRequirements(job),
        localizedTitle: translateGameText(language, job.title),
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [jobs, person, language]
  );

  const visibleJobs = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase(locale === 'ar' ? 'ar' : 'en');
    if (!needle) return evaluatedJobs;
    return evaluatedJobs.filter(item => item.localizedTitle.toLocaleLowerCase().includes(needle));
  }, [evaluatedJobs, query, locale]);

  const qualifiedCount = evaluatedJobs.filter(item => item.issues.length === 0).length;
  const jobPerformance = Math.max(
    0,
    Math.min(100, Number(person.job?.performance ?? person.jobPerformance ?? 50) || 0)
  );

  const tabs = [
    { id: 'current', label: copy.current, icon: '💼' },
    { id: 'market', label: copy.market, icon: '🔎', count: jobs.length },
    { id: 'military', label: copy.military, icon: '🪖' },
  ];

  return (
    <PhaseTwoScreen
      icon="briefcase"
      eyebrow={copy.eyebrow}
      title={copy.title}
      subtitle={copy.subtitle}
      onClose={() => onClose()}
      closeLabel={copy.close}
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
      className="career-destination"
    >
      <PhaseTwoTabs tabs={tabs} activeId={activeTab} onChange={setActiveTab} ariaLabel={copy.title} />

      <div className="phase-two-metrics">
        <PhaseTwoMetric
          icon="💵"
          label={copy.salary}
          value={person.job ? formatMoney(person.job.salary, language) : '—'}
          tone={person.job ? 'growth' : 'neutral'}
        />
        <PhaseTwoMetric
          icon="📅"
          label={copy.years}
          value={person.job?.yearsEmployed ?? 0}
        />
        <PhaseTwoMetric icon="📋" label={copy.openings} value={jobs.length} tone="world" />
        <PhaseTwoMetric icon="✅" label={copy.qualified} value={qualifiedCount} tone="growth" />
      </div>

      {activeTab === 'current' && (
        <PhaseTwoSection title={copy.currentTitle} subtitle={copy.currentSubtitle}>
          {person.job ? (
            <div className="phase-two-card phase-two-card-highlight">
              <div className="career-current-heading">
                <div>
                  <span className="phase-two-eyebrow">
                    {person.job.isMilitary ? copy.militaryRole : copy.civilian}
                  </span>
                  <h2 dir="auto">{translateGameText(language, person.job.title)}</h2>
                  <p>
                    {formatMoney(person.job.salary, language)} · {person.job.yearsEmployed || 0} {copy.years.toLocaleLowerCase()}
                  </p>
                </div>
                <span className="career-current-icon" aria-hidden="true">
                  {person.job.isMilitary ? '🎖️' : '💼'}
                </span>
              </div>
              <PhaseTwoProgress
                label={t('occupation.performance', locale === 'ar' ? 'الأداء' : 'Performance')}
                value={jobPerformance}
                tone={jobPerformance >= 65 ? 'growth' : jobPerformance >= 35 ? 'warning' : 'danger'}
              />
              <div className="phase-two-button-row">
                <button type="button" className="phase-two-button-secondary" onClick={() => onClose('skills')}>
                  🧭 {copy.skills}
                </button>
                {person.job.isMilitary ? (
                  <button type="button" className="phase-two-button" onClick={() => onClose('deploy')}>
                    🪖 {copy.deploy}
                  </button>
                ) : (
                  <button type="button" className="phase-two-button-danger" onClick={onQuit}>
                    🚪 {copy.resign}
                  </button>
                )}
              </div>
              {person.job.isMilitary && (
                <button type="button" className="phase-two-button-danger career-resign-wide" onClick={onQuit}>
                  🚪 {copy.resign}
                </button>
              )}
            </div>
          ) : (
            <PhaseTwoEmpty
              icon="💼"
              title={copy.unemployed}
              description={copy.unemployedHint}
              action={
                <button type="button" className="phase-two-button" onClick={() => setActiveTab('market')}>
                  {copy.market}
                </button>
              }
            />
          )}
        </PhaseTwoSection>
      )}

      {activeTab === 'market' && (
        <PhaseTwoSection title={copy.jobMarket} subtitle={copy.jobMarketSubtitle}>
          <input
            className="phase-two-search"
            type="search"
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder={copy.search}
            aria-label={copy.search}
          />
          <div className="phase-two-action-list career-market-list">
            {visibleJobs.map(({ job, issues, localizedTitle }) => {
              const qualified = issues.length === 0;
              return (
                <PhaseTwoActionRow
                  key={job.id}
                  icon={qualified ? '💼' : '🔒'}
                  title={localizedTitle}
                  subtitle={`${formatMoney(job.salary, language)} · ${qualified ? copy.qualified : `${copy.requires}: ${issues.join(' · ')}`}`}
                  meta={job.category ? translateGameText(language, job.category) : undefined}
                  disabled={!qualified}
                  tone={qualified ? 'neutral' : 'danger'}
                  onClick={() => onApply(job)}
                  trailing={<span className={`phase-two-pill ${qualified ? 'good' : 'danger'}`}>{qualified ? copy.apply : copy.locked}</span>}
                />
              );
            })}
          </div>
          {visibleJobs.length === 0 && (
            <PhaseTwoEmpty icon="🔎" title={copy.noJobs} description={copy.noJobsHint} />
          )}
        </PhaseTwoSection>
      )}

      {activeTab === 'military' && (
        <PhaseTwoSection title={copy.militaryTitle} subtitle={copy.militarySubtitle}>
          <div className="phase-two-grid military-branch-grid">
            {MILITARY_BRANCHES.map(branch => (
              <div key={branch.key} className="phase-two-card military-branch-card">
                <span className="military-branch-icon" aria-hidden="true">{branch.icon}</span>
                <h2>{locale === 'ar' ? branch.ar : branch.name}</h2>
                <div className="phase-two-button-row">
                  <button
                    type="button"
                    className="phase-two-button-secondary"
                    onClick={() => onApply({ isMilitary: true, branch: { name: branch.name, id: branch.key }, isOfficer: false })}
                  >
                    {copy.enlist}
                  </button>
                  <button
                    type="button"
                    className="phase-two-button"
                    onClick={() => onApply({ isMilitary: true, branch: { name: branch.name, id: branch.key }, isOfficer: true })}
                    title={copy.officerHint}
                  >
                    {copy.officer}
                  </button>
                </div>
                <small>{copy.officerHint}</small>
              </div>
            ))}
          </div>
        </PhaseTwoSection>
      )}
    </PhaseTwoScreen>
  );
}
