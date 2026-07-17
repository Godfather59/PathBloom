import React, { useMemo, useState } from 'react';
import { formatArabicNumber } from '../logic/ArabicLocalization';
import { getStoredLanguage } from '../logic/i18n';
import {
  PhaseTwoEmpty,
  PhaseTwoMetric,
  PhaseTwoProgress,
  PhaseTwoScreen,
  PhaseTwoSection,
  PhaseTwoTabs,
} from './PhaseTwoScaffold';

const REL_EMOJI = {
  Spouse: '💑',
  Partner: '💕',
  Fiance: '💍',
  Child: '👶',
  Sibling: '👫',
  Mother: '👩',
  Father: '👨',
  Parent: '👪',
  'Best Friend': '🤝',
  Friend: '🤝',
  King: '👑',
  Queen: '👑',
};

const TYPE_AR = {
  Spouse: 'الزوج/الزوجة',
  Partner: 'الشريك',
  Fiance: 'الخطيب/الخطيبة',
  Child: 'الابن/الابنة',
  Sibling: 'الأخ/الأخت',
  Mother: 'الأم',
  Father: 'الأب',
  Parent: 'الوالد',
  'Best Friend': 'أفضل صديق',
  Friend: 'صديق',
  King: 'الملك',
  Queen: 'الملكة',
};

const COPY = {
  en: {
    eyebrow: 'Relationships',
    title: 'People in your life',
    subtitle: 'Family, love, friendship, trust, memories, and unresolved tension.',
    all: 'All',
    family: 'Family',
    love: 'Love',
    friends: 'Friends',
    departed: 'Departed',
    alive: 'Living',
    average: 'Average bond',
    conflicts: 'Conflicts',
    promises: 'Promises',
    search: 'Search people…',
    peopleTitle: 'Relationships',
    peopleSubtitle: 'Strong bonds appear first. Open the full manager for interactions.',
    noRelationships: 'No relationships yet',
    noRelationshipsHint: 'Meet people through school, work, love, and social activities.',
    openManager: 'Open relationship manager',
    bond: 'Relationship health',
    conflict: 'Unresolved conflict',
    promise: 'Promise pending',
    finances: 'Shared finances',
    memories: 'memories',
    deceased: 'Deceased',
    close: 'Close relationships',
  },
  ar: {
    eyebrow: 'العلاقات',
    title: 'الأشخاص في حياتك',
    subtitle: 'العائلة والحب والصداقة والثقة والذكريات والخلافات.',
    all: 'الكل',
    family: 'العائلة',
    love: 'الحب',
    friends: 'الأصدقاء',
    departed: 'المتوفون',
    alive: 'على قيد الحياة',
    average: 'متوسط الترابط',
    conflicts: 'الخلافات',
    promises: 'الوعود',
    search: 'ابحث عن شخص…',
    peopleTitle: 'العلاقات',
    peopleSubtitle: 'تظهر أقوى الروابط أولا. افتح المدير الكامل للتفاعل.',
    noRelationships: 'لا توجد علاقات بعد',
    noRelationshipsHint: 'تعرّف على أشخاص من خلال المدرسة والعمل والحب والأنشطة الاجتماعية.',
    openManager: 'افتح مدير العلاقات',
    bond: 'قوة العلاقة',
    conflict: 'خلاف غير محلول',
    promise: 'وعد قيد الانتظار',
    finances: 'أموال مشتركة',
    memories: 'ذكريات',
    deceased: 'متوفى',
    close: 'أغلق العلاقات',
  },
};

const FAMILY_TYPES = new Set(['Child', 'Sibling', 'Mother', 'Father', 'Parent', 'King', 'Queen']);
const LOVE_TYPES = new Set(['Spouse', 'Partner', 'Fiance']);
const FRIEND_TYPES = new Set(['Best Friend', 'Friend']);

function typeLabel(type, language) {
  return language === 'ar' ? TYPE_AR[type] || type : type;
}

function formatNumber(value, language) {
  return language === 'ar'
    ? formatArabicNumber(value, { maximumFractionDigits: 0 })
    : Number(value || 0).toLocaleString('en-US');
}

export function RelationshipDashboard({
  person,
  onClose,
  onOpenFullManager,
  language = getStoredLanguage(),
}) {
  const locale = language === 'ar' ? 'ar' : 'en';
  const copy = COPY[locale];
  const [activeTab, setActiveTab] = useState('all');
  const [query, setQuery] = useState('');

  const stats = useMemo(() => {
    const relationships = person?.relationships || [];
    const alive = relationships.filter(rel => rel.status !== 'Deceased');
    const deceased = relationships.filter(rel => rel.status === 'Deceased');
    const avgStat = alive.length
      ? Math.round(alive.reduce((sum, rel) => sum + (Number(rel.stat) || 50), 0) / alive.length)
      : 0;
    const conflicts = alive.filter(rel => rel.activeConflict);
    const promises = alive.filter(rel => rel.promise?.status === 'active');
    const sorted = [...alive].sort((a, b) => (Number(b.stat) || 0) - (Number(a.stat) || 0));
    return { alive, deceased, avgStat, conflicts, promises, sorted };
  }, [person]);

  if (!person) {
    return null;
  }

  const tabs = [
    { id: 'all', label: copy.all, icon: '👥', count: stats.alive.length },
    {
      id: 'family',
      label: copy.family,
      icon: '👪',
      count: stats.alive.filter(rel => FAMILY_TYPES.has(rel.type)).length,
    },
    {
      id: 'love',
      label: copy.love,
      icon: '💕',
      count: stats.alive.filter(rel => LOVE_TYPES.has(rel.type)).length,
    },
    {
      id: 'friends',
      label: copy.friends,
      icon: '🤝',
      count: stats.alive.filter(rel => FRIEND_TYPES.has(rel.type)).length,
    },
    { id: 'departed', label: copy.departed, icon: '🕊️', count: stats.deceased.length },
  ];

  const source = activeTab === 'departed' ? stats.deceased : stats.sorted;
  const visible = source.filter(rel => {
    const matchesTab =
      activeTab === 'all' ||
      activeTab === 'departed' ||
      (activeTab === 'family' && FAMILY_TYPES.has(rel.type)) ||
      (activeTab === 'love' && LOVE_TYPES.has(rel.type)) ||
      (activeTab === 'friends' && FRIEND_TYPES.has(rel.type));
    const needle = query.trim().toLocaleLowerCase(locale === 'ar' ? 'ar' : 'en');
    const matchesQuery =
      !needle ||
      String(rel.name || '')
        .toLocaleLowerCase()
        .includes(needle);
    return matchesTab && matchesQuery;
  });

  return (
    <PhaseTwoScreen
      icon="relationships"
      eyebrow={copy.eyebrow}
      title={copy.title}
      subtitle={copy.subtitle}
      onClose={onClose}
      closeLabel={copy.close}
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
      className="relationships-destination"
    >
      <div className="phase-two-metrics">
        <PhaseTwoMetric
          icon="👥"
          label={copy.alive}
          value={formatNumber(stats.alive.length, language)}
          tone="growth"
        />
        <PhaseTwoMetric
          icon="❤️"
          label={copy.average}
          value={`${formatNumber(stats.avgStat, language)}%`}
        />
        <PhaseTwoMetric
          icon="⚡"
          label={copy.conflicts}
          value={formatNumber(stats.conflicts.length, language)}
          tone={stats.conflicts.length ? 'danger' : 'neutral'}
        />
        <PhaseTwoMetric
          icon="📜"
          label={copy.promises}
          value={formatNumber(stats.promises.length, language)}
          tone="gold"
        />
      </div>

      <PhaseTwoTabs
        tabs={tabs}
        activeId={activeTab}
        onChange={setActiveTab}
        ariaLabel={copy.title}
      />

      <PhaseTwoSection
        title={copy.peopleTitle}
        subtitle={copy.peopleSubtitle}
        action={
          <button type="button" onClick={onOpenFullManager}>
            {copy.openManager}
          </button>
        }
      >
        <input
          className="phase-two-search"
          type="search"
          value={query}
          onChange={event => setQuery(event.target.value)}
          placeholder={copy.search}
          aria-label={copy.search}
        />

        {visible.length > 0 ? (
          <div className="phase-two-action-list relationship-overview-list">
            {visible.map(rel => {
              const value = Math.max(0, Math.min(100, Number(rel.stat) || 0));
              const isDeceased = rel.status === 'Deceased';
              const memoryCount = (rel.memories || []).length;
              const badges = [
                rel.activeConflict ? `⚡ ${copy.conflict}` : null,
                rel.promise?.status === 'active' ? `📜 ${copy.promise}` : null,
                rel.financialArrangement ? `💰 ${copy.finances}` : null,
                memoryCount ? `🧠 ${formatNumber(memoryCount, language)} ${copy.memories}` : null,
              ].filter(Boolean);
              return (
                <div
                  key={rel.id}
                  className={`phase-two-card relationship-person-card ${isDeceased ? 'is-deceased' : ''}`}
                >
                  <div className="relationship-person-heading">
                    <span className="relationship-person-avatar" aria-hidden="true">
                      {isDeceased ? '🕊️' : REL_EMOJI[rel.type] || '👤'}
                    </span>
                    <div>
                      <h2 dir="auto">{rel.name}</h2>
                      <p>
                        {typeLabel(rel.type, language)}
                        {isDeceased ? ` · ${copy.deceased}` : ''}
                      </p>
                    </div>
                    {!isDeceased && <strong>{formatNumber(value, language)}%</strong>}
                  </div>
                  {!isDeceased && (
                    <PhaseTwoProgress
                      label={copy.bond}
                      value={value}
                      tone={value >= 70 ? 'growth' : value >= 40 ? 'warning' : 'danger'}
                    />
                  )}
                  {badges.length > 0 && (
                    <div className="phase-two-pill-row relationship-badges">
                      {badges.map(label => (
                        <span key={label} className="phase-two-pill">
                          {label}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <PhaseTwoEmpty
            icon="🤝"
            title={copy.noRelationships}
            description={copy.noRelationshipsHint}
            action={
              <button type="button" className="phase-two-button" onClick={onOpenFullManager}>
                {copy.openManager}
              </button>
            }
          />
        )}
      </PhaseTwoSection>

      <button
        type="button"
        className="phase-two-button relationship-manager-wide"
        onClick={onOpenFullManager}
      >
        🤝 {copy.openManager}
      </button>
    </PhaseTwoScreen>
  );
}
