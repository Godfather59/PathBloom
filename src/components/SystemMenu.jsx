import React, { useState } from 'react';
import { LANGUAGES } from '../logic/i18n';
import { THEMES } from '../logic/themes';
import { getCurrentTimePerson } from '../logic/TimeProgression';
import SimulationDashboard from './SimulationDashboard';
import ContentStudio from './ContentStudio';
import WorldSimulation2Dashboard from './WorldSimulation2Dashboard';
import ArabicLocalizationDashboard from './ArabicLocalizationDashboard';
import { AppIcon } from './AppIcon';
import './Modal.css';

const COPY = {
  en: {
    paused: 'Paused',
    subtitle: 'Your life is safe while this menu is open.',
    home: 'Home',
    records: 'Life',
    world: 'World',
    settings: 'Settings',
    tools: 'Tools',
    resume: 'Resume life',
    save: 'Save now',
    savedHint: 'Store the latest progress in this life.',
    godModeHint: 'Edit this life and test unusual paths.',
    recordsTitle: 'Life records',
    worldTitle: 'World and country',
    settingsTitle: 'Preferences',
    toolsTitle: 'Creator tools',
    audio: 'Audio',
    vibration: 'Vibration',
    language: 'Language',
    appearance: 'Appearance',
    tutorial: 'Tutorial',
    resetTutorial: 'Restart tutorial',
    exit: 'Exit to main menu',
    exitHint: 'The current life is saved before leaving.',
    on: 'On',
    off: 'Off',
    sfx: 'Sound effects',
    music: 'Music',
  },
  ar: {
    paused: 'متوقف مؤقتا',
    subtitle: 'حياتك محفوظة أثناء فتح هذه القائمة.',
    home: 'الرئيسية',
    records: 'الحياة',
    world: 'العالم',
    settings: 'الإعدادات',
    tools: 'الأدوات',
    resume: 'تابع الحياة',
    save: 'احفظ الآن',
    savedHint: 'احفظ أحدث تقدم في هذه الحياة.',
    godModeHint: 'عدّل هذه الحياة واختبر مسارات غير عادية.',
    recordsTitle: 'سجلات الحياة',
    worldTitle: 'العالم والبلد',
    settingsTitle: 'التفضيلات',
    toolsTitle: 'أدوات الإنشاء',
    audio: 'الصوت',
    vibration: 'الاهتزاز',
    language: 'اللغة',
    appearance: 'المظهر',
    tutorial: 'الشرح',
    resetTutorial: 'أعد الشرح',
    exit: 'اخرج إلى القائمة الرئيسية',
    exitHint: 'تُحفظ الحياة الحالية قبل الخروج.',
    on: 'تشغيل',
    off: 'إيقاف',
    sfx: 'المؤثرات الصوتية',
    music: 'الموسيقى',
  },
};

const TABS = [
  { id: 'home', icon: 'life' },
  { id: 'records', icon: 'trend' },
  { id: 'world', icon: 'world' },
  { id: 'settings', icon: 'menu' },
  { id: 'tools', icon: 'activities' },
];

function MenuTile({ item, language }) {
  if (!item.handler) return null;
  return (
    <button
      type="button"
      className={`system-menu-tile tone-${item.tone || 'neutral'}`}
      onClick={item.handler}
    >
      <span className="system-menu-tile-icon" aria-hidden="true">{item.emoji}</span>
      <span className="system-menu-tile-copy">
        <strong>{language === 'ar' ? item.ar : item.en}</strong>
        {item.description && (
          <small>{language === 'ar' ? item.descriptionAr : item.description}</small>
        )}
      </span>
      <AppIcon name="chevron" size={17} className="system-menu-tile-arrow" />
    </button>
  );
}

export function SystemMenu({
  language = 'en',
  currentTheme = 'dark',
  t = (key, fallback) => fallback || key,
  onLanguageChange,
  onThemeChange,
  onResume,
  onSave,
  onExit,
  onGodMode,
  onStats,
  onHistory,
  onFamilyTree,
  onWorldNews,
  onWorldOverview,
  onAchievements,
  onChallenge,
  onTutorial,
  onResetTutorial,
  audioEnabled = true,
  onSoundToggle,
  sfxVolume = 0.7,
  onSfxVolumeChange,
  musicVolume = 0.5,
  onMusicVolumeChange,
  hapticsEnabled = true,
  onHapticsToggle,
  onDebug,
  onRelationshipDashboard,
  onEventHistory,
  onLifeTimeline,
  onCountryProfile,
  onSimulationDashboard,
}) {
  const [activeTab, setActiveTab] = useState('home');
  const [showSimulation, setShowSimulation] = useState(false);
  const [showContentStudio, setShowContentStudio] = useState(false);
  const [showWorldSimulation2, setShowWorldSimulation2] = useState(false);
  const [showArabicAudit, setShowArabicAudit] = useState(false);
  const currentPerson = getCurrentTimePerson();
  const locale = language === 'ar' ? 'ar' : 'en';
  const copy = COPY[locale];
  const openSimulation = onSimulationDashboard || (() => setShowSimulation(true));

  const records = [
    {
      handler: onStats,
      emoji: '📊',
      en: 'Lifetime stats',
      ar: 'إحصائيات الحياة',
      description: 'Money, years, careers, and milestones.',
      descriptionAr: 'المال والسنوات والمهن والمحطات المهمة.',
    },
    {
      handler: onHistory,
      emoji: '📈',
      en: 'Life trends',
      ar: 'اتجاهات الحياة',
      description: 'See how your stats changed over time.',
      descriptionAr: 'شاهد كيف تغيرت إحصائياتك عبر الزمن.',
    },
    {
      handler: onLifeTimeline,
      emoji: '🕰️',
      en: 'Life timeline',
      ar: 'الخط الزمني للحياة',
      description: 'Review the defining moments of this life.',
      descriptionAr: 'راجع اللحظات التي صنعت هذه الحياة.',
    },
    {
      handler: onEventHistory,
      emoji: '📜',
      en: 'Event history',
      ar: 'سجل الأحداث',
      description: 'Browse the complete event archive.',
      descriptionAr: 'تصفح أرشيف الأحداث الكامل.',
    },
    {
      handler: onRelationshipDashboard,
      emoji: '🤝',
      en: 'Relationships',
      ar: 'العلاقات',
      description: 'Family, friends, trust, and memories.',
      descriptionAr: 'العائلة والأصدقاء والثقة والذكريات.',
    },
    {
      handler: onFamilyTree,
      emoji: '🌳',
      en: 'Family dynasty',
      ar: 'سلالة العائلة',
      description: 'Explore generations and descendants.',
      descriptionAr: 'استكشف الأجيال والأبناء.',
    },
    {
      handler: onAchievements,
      emoji: '🏆',
      en: 'Achievements',
      ar: 'الإنجازات',
      description: 'See unlocked and remaining achievements.',
      descriptionAr: 'شاهد الإنجازات المفتوحة والمتبقية.',
      tone: 'gold',
    },
    {
      handler: onChallenge,
      emoji: '🎯',
      en: 'Challenges',
      ar: 'التحديات',
      description: 'Attempt special rules and goals.',
      descriptionAr: 'جرّب قواعد وأهدافا خاصة.',
    },
  ];

  const worldItems = [
    {
      handler: () => setShowWorldSimulation2(true),
      emoji: '🌐',
      en: 'World Simulation 2.0',
      ar: 'محاكاة العالم 2.0',
      description: 'Countries, leaders, wars, trade, and migration.',
      descriptionAr: 'الدول والقادة والحروب والتجارة والهجرة.',
      tone: 'world',
    },
    {
      handler: onWorldNews,
      emoji: '📰',
      en: 'World news',
      ar: 'أخبار العالم',
      description: 'Read the latest global headlines.',
      descriptionAr: 'اقرأ أحدث الأخبار العالمية.',
    },
    {
      handler: onWorldOverview,
      emoji: '🌍',
      en: 'World overview',
      ar: 'نظرة عامة على العالم',
      description: 'Inspect the wider geopolitical map.',
      descriptionAr: 'استكشف الخريطة الجيوسياسية الأوسع.',
    },
    {
      handler: onCountryProfile,
      emoji: '🗺️',
      en: 'Country profile',
      ar: 'ملف البلد',
      description: 'Economy, laws, opportunities, and risks.',
      descriptionAr: 'الاقتصاد والقوانين والفرص والمخاطر.',
    },
  ];

  const tools = [
    {
      handler: openSimulation,
      emoji: '🧩',
      en: 'Simulation overview',
      ar: 'نظرة عامة على المحاكاة',
      description: 'Inspect finance, reputation, NPC memory, and active chains.',
      descriptionAr: 'افحص المال والسمعة وذاكرة الشخصيات والقصص النشطة.',
    },
    {
      handler: () => setShowContentStudio(true),
      emoji: '🧰',
      en: 'Content Studio',
      ar: 'استوديو المحتوى',
      description: 'Browse, validate, import, and edit story packs.',
      descriptionAr: 'تصفح حزم القصص ودققها واستوردها وعدّلها.',
    },
    {
      handler: () => setShowArabicAudit(true),
      emoji: '🌙',
      en: 'Arabic localization audit',
      ar: 'تدقيق الترجمة العربية',
      description: 'Find untranslated runtime text and formatting issues.',
      descriptionAr: 'اعثر على النصوص غير المترجمة ومشاكل التنسيق.',
    },
    {
      handler: onDebug,
      emoji: '🛠️',
      en: 'Debug tools',
      ar: 'أدوات التصحيح',
      description: 'Developer diagnostics and test controls.',
      descriptionAr: 'تشخيصات المطور وأدوات الاختبار.',
    },
  ];

  if (showSimulation && currentPerson) {
    return (
      <SimulationDashboard
        person={currentPerson}
        onClose={() => setShowSimulation(false)}
        language={language}
        t={t}
      />
    );
  }
  if (showContentStudio) {
    return <ContentStudio onClose={() => setShowContentStudio(false)} language={language} t={t} />;
  }
  if (showWorldSimulation2 && currentPerson) {
    return (
      <WorldSimulation2Dashboard
        person={currentPerson}
        onClose={() => setShowWorldSimulation2(false)}
        language={language}
      />
    );
  }
  if (showArabicAudit) {
    return <ArabicLocalizationDashboard onClose={() => setShowArabicAudit(false)} language={language} />;
  }

  return (
    <div className="modal-overlay system-destination-overlay">
      <section className="system-destination" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
        <header className="system-destination-header">
          <div className="system-destination-title">
            <span className="system-pause-icon"><AppIcon name="menu" size={22} /></span>
            <div>
              <h1>{copy.paused}</h1>
              <p>{copy.subtitle}</p>
            </div>
          </div>
          <button type="button" className="destination-close" onClick={onResume} aria-label={copy.resume}>
            <AppIcon name="close" size={21} />
          </button>
        </header>

        <nav className="system-tabs" aria-label={copy.paused}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              type="button"
              className={activeTab === tab.id ? 'is-active' : ''}
              onClick={() => setActiveTab(tab.id)}
              aria-current={activeTab === tab.id ? 'page' : undefined}
            >
              <AppIcon name={tab.icon} size={18} />
              <span>{copy[tab.id]}</span>
            </button>
          ))}
        </nav>

        <div className="system-destination-scroll">
          {activeTab === 'home' && (
            <>
              <div className="system-primary-actions">
                <button type="button" className="system-resume-card" onClick={onResume}>
                  <span><AppIcon name="life" size={25} /></span>
                  <strong>{copy.resume}</strong>
                  <small>{locale === 'ar' ? 'ارجع مباشرة إلى قصتك.' : 'Return directly to your story.'}</small>
                </button>
                <button type="button" className="system-save-card" onClick={onSave}>
                  <span>💾</span>
                  <strong>{copy.save}</strong>
                  <small>{copy.savedHint}</small>
                </button>
              </div>

              {onGodMode && (
                <button type="button" className="system-godmode-card" onClick={onGodMode}>
                  <span>⚡</span>
                  <span>
                    <strong>{t('system.godMode', 'God Mode')}</strong>
                    <small>{copy.godModeHint}</small>
                  </span>
                  <AppIcon name="chevron" size={18} />
                </button>
              )}

              <div className="system-home-summary">
                <button type="button" onClick={() => setActiveTab('records')}>
                  <AppIcon name="trend" size={19} /><span>{copy.recordsTitle}</span>
                </button>
                <button type="button" onClick={() => setActiveTab('world')}>
                  <AppIcon name="world" size={19} /><span>{copy.worldTitle}</span>
                </button>
                <button type="button" onClick={() => setActiveTab('settings')}>
                  <AppIcon name="menu" size={19} /><span>{copy.settingsTitle}</span>
                </button>
              </div>
            </>
          )}

          {activeTab === 'records' && (
            <section className="system-section">
              <div className="system-section-heading">
                <span>{copy.recordsTitle}</span>
                <strong>{records.filter(item => item.handler).length}</strong>
              </div>
              <div className="system-menu-grid">
                {records.map(item => <MenuTile key={item.en} item={item} language={locale} />)}
              </div>
            </section>
          )}

          {activeTab === 'world' && (
            <section className="system-section">
              <div className="system-section-heading">
                <span>{copy.worldTitle}</span>
                <strong>{worldItems.filter(item => item.handler).length}</strong>
              </div>
              <div className="system-menu-grid">
                {worldItems.map(item => <MenuTile key={item.en} item={item} language={locale} />)}
              </div>
            </section>
          )}

          {activeTab === 'settings' && (
            <section className="system-section system-settings-section">
              <div className="system-section-heading"><span>{copy.settingsTitle}</span></div>

              <div className="setting-card">
                <div className="setting-card-heading"><span>🔊</span><strong>{copy.audio}</strong></div>
                <div className="segmented-control">
                  <button type="button" className={audioEnabled ? 'is-active' : ''} onClick={() => onSoundToggle?.(true)}>{copy.on}</button>
                  <button type="button" className={!audioEnabled ? 'is-active' : ''} onClick={() => onSoundToggle?.(false)}>{copy.off}</button>
                </div>
                <label className="setting-slider">
                  <span>{copy.sfx}</span>
                  <input type="range" min="0" max="1" step="0.05" value={sfxVolume} onChange={event => onSfxVolumeChange?.(Number(event.target.value))} />
                  <strong>{Math.round(sfxVolume * 100)}%</strong>
                </label>
                <label className="setting-slider">
                  <span>{copy.music}</span>
                  <input type="range" min="0" max="1" step="0.05" value={musicVolume} onChange={event => onMusicVolumeChange?.(Number(event.target.value))} />
                  <strong>{Math.round(musicVolume * 100)}%</strong>
                </label>
              </div>

              <div className="setting-card setting-inline-card">
                <div className="setting-card-heading"><span>📳</span><strong>{copy.vibration}</strong></div>
                <div className="segmented-control compact">
                  <button type="button" className={hapticsEnabled ? 'is-active' : ''} onClick={() => onHapticsToggle?.(true)}>{copy.on}</button>
                  <button type="button" className={!hapticsEnabled ? 'is-active' : ''} onClick={() => onHapticsToggle?.(false)}>{copy.off}</button>
                </div>
              </div>

              <div className="setting-card">
                <div className="setting-card-heading"><span>🌐</span><strong>{copy.language}</strong></div>
                <div className="choice-chip-grid">
                  {LANGUAGES.map(option => (
                    <button
                      key={option.id}
                      type="button"
                      className={language === option.id ? 'is-active' : ''}
                      onClick={() => {
                        onLanguageChange?.(option.id);
                        window.dispatchEvent(new CustomEvent('pathbloom-language-changed'));
                      }}
                    >
                      {option.nativeName}
                    </button>
                  ))}
                </div>
              </div>

              <div className="setting-card">
                <div className="setting-card-heading"><span>🎨</span><strong>{copy.appearance}</strong></div>
                <div className="choice-chip-grid theme-chip-grid">
                  {Object.entries(THEMES).map(([id, theme]) => (
                    <button
                      key={id}
                      type="button"
                      className={currentTheme === id ? 'is-active' : ''}
                      onClick={() => onThemeChange?.(id)}
                    >
                      {theme.icon}<span>{theme.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="setting-card setting-actions-card">
                <button type="button" onClick={onTutorial}>🧭 <span>{copy.tutorial}</span></button>
                <button type="button" onClick={onResetTutorial}>↻ <span>{copy.resetTutorial}</span></button>
              </div>

              <button
                type="button"
                className="system-exit-card"
                onClick={() => {
                  if (confirm(t('system.exitConfirm', 'Are you sure you want to exit? Unsaved progress will be lost.'))) {
                    onExit?.();
                  }
                }}
              >
                <span>↪</span>
                <span><strong>{copy.exit}</strong><small>{copy.exitHint}</small></span>
              </button>
            </section>
          )}

          {activeTab === 'tools' && (
            <section className="system-section">
              <div className="system-section-heading">
                <span>{copy.toolsTitle}</span>
                <strong>{tools.filter(item => item.handler).length}</strong>
              </div>
              <div className="system-menu-grid">
                {tools.map(item => <MenuTile key={item.en} item={item} language={locale} />)}
              </div>
            </section>
          )}
        </div>
      </section>
    </div>
  );
}
