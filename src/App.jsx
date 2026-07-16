import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { Person } from './logic/Person';
import { GameEngine } from './logic/GameEngine';
import { INITIAL_EVENTS } from './logic/Events';
import { Hud } from './components/Hud';
import { EventLog } from './components/EventLog';
import { ActionMenu } from './components/ActionMenu';
import { OccupationMenu } from './components/OccupationMenu';
import { ActivitiesMenu } from './components/ActivitiesMenu';
import { DecisionModal } from './components/DecisionModal';
import { AssetsMenu } from './components/AssetsMenu';
import { RelationshipsMenu } from './components/RelationshipsMenu';
import { RelationshipDashboard } from './components/RelationshipDashboard';
import { EducationMenu } from './components/EducationMenu';
import { GameOver } from './components/GameOver';
import { AchievementsMenu } from './components/AchievementsMenu';
import { MainMenu } from './components/MainMenu';
import { MiniGameModal } from './components/MiniGameModal';
import { Toast } from './components/Toast';
import { SystemMenu } from './components/SystemMenu';
import { WorldNewsFeed } from './components/WorldNewsFeed';
import { LoveMenu } from './components/LoveMenu';
import { CareerModal } from './components/CareerModal';
import { MafiaMenu } from './components/MafiaMenu';
import { RoyaltyMenu } from './components/RoyaltyMenu';
import { PoliticsMenu } from './components/PoliticsMenu';
import { GamblingMenu } from './components/GamblingMenu';
import { SocialMenu } from './components/SocialMenu';
import { GodModeMenu } from './components/GodModeMenu';
import { DebugMenu } from './components/DebugMenu';
import { PrisonMenu } from './components/PrisonMenu';
import { SaveSlotMenu } from './components/SaveSlotMenu';
import { ACHIEVEMENTS, checkAchievements } from './logic/Achievements';
import { applyTheme, getStoredTheme } from './logic/themes';
import { getStoredLanguage, setStoredLanguage, translate } from './logic/i18n';
import { lifetimeStats } from './logic/LifetimeStats';
import { familyTree } from './logic/DynastyMode';
import { HAPTICS } from './logic/Haptics';
import {
  setAudioEnabled as setAudioEngineEnabled,
  setSfxVolume,
  setMusicVolume,
  getSfxVolume,
  getMusicVolume,
  isAudioEnabled,
  playTap,
} from './logic/Audio';
import { treatDisease } from './logic/Disease';
import { recordDailyPlay, getDailyLifeConfig } from './logic/DailyStreak';
import { ImmigrationManager } from './logic/ImmigrationSystem';
import { travelToCity } from './logic/TravelSystem';
import {
  createSlotId,
  getMostRecentSaveMetadata,
  loadSaveData,
  migrateLegacySave,
  readSaveMetadata,
  resetRuntimeState,
  saveGameData,
} from './logic/SaveSystem';
import { ChallengeMenu } from './components/ChallengeMenu';
import { OnboardingOverlay } from './components/OnboardingOverlay';
import LazyModalLoader from './components/ModalLoader';

const lazyNamed = (importFn, name) => lazy(() => importFn().then(m => ({ default: m[name] })));

const LazySystemMenu = lazyNamed(() => import('./components/SystemMenu'), 'SystemMenu');
const LazyGodModeMenu = lazyNamed(() => import('./components/GodModeMenu'), 'GodModeMenu');
const LazyOccupationMenu = lazyNamed(() => import('./components/OccupationMenu'), 'OccupationMenu');
const LazyActivitiesMenu = lazyNamed(() => import('./components/ActivitiesMenu'), 'ActivitiesMenu');
const LazyLoveMenu = lazyNamed(() => import('./components/LoveMenu'), 'LoveMenu');
const LazyCareerModal = lazyNamed(() => import('./components/CareerModal'), 'CareerModal');
const LazyBandMenu = lazyNamed(() => import('./components/BandMenu'), 'BandMenu');
const LazySocialMenu = lazyNamed(() => import('./components/SocialMenu'), 'SocialMenu');
const LazyRelationshipsMenu = lazyNamed(
  () => import('./components/RelationshipsMenu'),
  'RelationshipsMenu'
);
const LazyMafiaMenu = lazyNamed(() => import('./components/MafiaMenu'), 'MafiaMenu');
const LazyRoyaltyMenu = lazyNamed(() => import('./components/RoyaltyMenu'), 'RoyaltyMenu');
const LazyPoliticsMenu = lazyNamed(() => import('./components/PoliticsMenu'), 'PoliticsMenu');
const LazyGeopoliticsModal = lazyNamed(() => import('./components/GeopoliticsModal'), 'GeopoliticsModal');
const LazyGamblingMenu = lazyNamed(() => import('./components/GamblingMenu'), 'GamblingMenu');
const LazyEducationMenu = lazyNamed(() => import('./components/EducationMenu'), 'EducationMenu');
const LazyAssetsMenu = lazyNamed(() => import('./components/AssetsMenu'), 'AssetsMenu');
const LazyAchievementsMenu = lazyNamed(
  () => import('./components/AchievementsMenu'),
  'AchievementsMenu'
);
const LazyMiniGameModal = lazyNamed(() => import('./components/MiniGameModal'), 'MiniGameModal');
const LazyMinesweeper = lazyNamed(() => import('./components/Minesweeper'), 'Minesweeper');
const LazyDoctorMenu = lazyNamed(() => import('./components/DoctorMenu'), 'DoctorMenu');
const LazyWillMenu = lazyNamed(() => import('./components/WillMenu'), 'WillMenu');
const LazyHobbiesMenu = lazyNamed(() => import('./components/HobbiesMenu'), 'HobbiesMenu');
const LazyPetsMenu = lazyNamed(() => import('./components/PetsMenu'), 'PetsMenu');
const LazyStatsMenu = lazyNamed(() => import('./components/StatsMenu'), 'StatsMenu');
const LazyFamilyTreeMenu = lazyNamed(() => import('./components/FamilyTreeMenu'), 'FamilyTreeMenu');
const LazyWorldOverview = lazyNamed(() => import('./components/WorldOverview'), 'WorldOverview');
const LazyCountryProfile = lazyNamed(() => import('./components/CountryProfile'), 'CountryProfile');
const LazyLifeTimeline = lazyNamed(() => import('./components/LifeTimeline'), 'LifeTimeline');
const LazyEventHistoryModal = lazyNamed(() => import('./components/EventHistoryModal'), 'EventHistoryModal');
const LazyTravelMap = lazyNamed(() => import('./components/TravelMap'), 'TravelMap');

function ModalLoader() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        color: 'var(--text-secondary)',
      }}
    >
      <div className="loading-spinner" />
    </div>
  );
}

function App() {
  const [person, setPerson] = useState(null);
  const [modal, setModal] = useState(null); // 'occupation', 'activities', etc.
  const [modalData, setModalData] = useState({}); // Extra data for modals

  // Achievements State
  const [achievements, setAchievements] = useState([]);

  // Theme State
  const [currentTheme, setCurrentTheme] = useState(getStoredTheme());

  // Language State
  const [language, setLanguage] = useState(getStoredLanguage());
  const t = (key, fallback) => translate(language, key, fallback);
  const handleLanguageChange = langId => {
    setLanguage(langId);
    setStoredLanguage(langId);
  };

  // Audio State
  const [audioEnabled, setAudioEnabledState] = useState(isAudioEnabled());
  const [sfxVolume, setSfxVolumeState] = useState(getSfxVolume());
  const [musicVolume, setMusicVolumeState] = useState(getMusicVolume());
  const [hapticsEnabled, setHapticsEnabled] = useState(true);

  const handleAudioToggle = enabled => {
    setAudioEnabledState(enabled);
    setAudioEngineEnabled(enabled);
  };

  const handleSfxVolume = val => {
    setSfxVolumeState(val);
    setSfxVolume(val);
    // Preview the volume
    playTap();
  };

  const handleMusicVolume = val => {
    setMusicVolumeState(val);
    setMusicVolume(val);
  };

  // Onboarding / Tutorial
  const [showOnboarding, setShowOnboarding] = useState(false);
  const TUTORIAL_DONE_KEY = 'pathbloom_tutorial_done';

  // Save Slots State
  const [currentSlotId, setCurrentSlotId] = useState(null);

  // Toast State
  const [toast, setToast] = useState(null); // { message, type }
  const showToast = (message, type = 'neutral') => {
    setToast({ message, type });
  };

  // Initialize Logic
  const initNewGame = config => {
    resetRuntimeState();
    const isDaily = config.isDaily || false;
    const newPerson = new Person(config.firstName, config.lastName, config.gender, config.country);

    if (isDaily) {
      const dailyConfig = getDailyLifeConfig();
      newPerson.dailySeed = dailyConfig.seed;
      newPerson.dailyDate = dailyConfig.date;
      recordDailyPlay();
    }

    // Create new slot ID
    const slotId = createSlotId();
    setCurrentSlotId(slotId);

    INITIAL_EVENTS.forEach(eventGen => {
      newPerson.logEvent(eventGen(newPerson), 'neutral');
    });
    newPerson.logEvent(t('app.bornIn', `You were born in ${newPerson.country}.`), 'neutral');

    GameEngine.initializeFamily(newPerson);
    setPerson(newPerson);

    // Save Initial State
    saveGameData(newPerson, slotId);

    if (!localStorage.getItem(TUTORIAL_DONE_KEY)) {
      setShowOnboarding(true);
    }
  };

  const loadGameData = slotId => {
    try {
      const { person: loadedPerson } = loadSaveData(slotId);

      setPerson(loadedPerson);
      setCurrentSlotId(slotId);
      showToast(
        t('app.welcomeBack', `Welcome back, ${loadedPerson.name?.first || 'Stranger'}!`),
        'good'
      );
    } catch (e) {
      console.error('loadGameData error:', e);
      showToast(t('app.failedLoad', 'Failed to load save.'), 'bad');
    }
  };

  // Save State
  const [hasSave, setHasSave] = useState(false);
  const [saveSummary, setSaveSummary] = useState(null);

  // Initialize: Check for save file and apply theme
  useEffect(() => {
    // Apply saved theme
    applyTheme(currentTheme);

    // Load Achievements
    const savedAch = localStorage.getItem('bitlife_achievements');
    if (savedAch) {
      try {
        setAchievements(JSON.parse(savedAch));
      } catch {
        setAchievements([]);
      }
    }

    migrateLegacySave();
    const recent = getMostRecentSaveMetadata(readSaveMetadata());
    if (recent) {
      setHasSave(true);
      setSaveSummary(recent);
    }
  }, []);

  const handleContinue = () => {
    // Continue most recent save
    const recent = getMostRecentSaveMetadata(readSaveMetadata());
    if (recent) {
      loadGameData(recent.id);
    } else {
      showToast(t('app.failedLoad', 'Failed to load save.'), 'bad');
    }
  };

  const _handleLoadSlot = slotId => {
    loadGameData(slotId);
    setModal(null);
  };

  const handleExitToMenu = () => {
    // Save before exiting just in case
    if (person && currentSlotId) {
      saveGameData(person, currentSlotId);
    }
    setPerson(null);
    setCurrentSlotId(null);

    // Refresh Meta for Main Menu
    const recent = getMostRecentSaveMetadata(readSaveMetadata());
    if (recent) {
      setHasSave(true);
      setSaveSummary(recent);
    } else {
      setHasSave(false);
      setSaveSummary(null);
    }
  };

  // Helper to safely update person state
  const pendingNewsRef = useRef([]);
  const runAction = actionFn => {
    setPerson(prevPerson => {
      const newPerson = prevPerson.clone();
      actionFn(newPerson);
      if (newPerson._breakingNews?.length > 0) {
        pendingNewsRef.current = pendingNewsRef.current.concat(newPerson._breakingNews);
        newPerson._breakingNews = [];
      }
      return newPerson;
    });
  };

  useEffect(() => {
    if (pendingNewsRef.current.length > 0) {
      const news = pendingNewsRef.current.splice(0);
      news.forEach(n => showToast(n.text, n.type));
    }
  });

  const updatePerson = newPerson => {
    setPerson(newPerson.clone());
  };

  // Auto-save whenever person changes
  useEffect(() => {
    try {
      if (person && currentSlotId) {
        saveGameData(person, currentSlotId);

        const newUnlocks = checkAchievements(person, achievements);
        if (newUnlocks.length > 0) {
          if (hapticsEnabled) HAPTICS.achievement();
          const updatedAch = [...achievements, ...newUnlocks];
          setAchievements(updatedAch);
          try {
            localStorage.setItem('bitlife_achievements', JSON.stringify(updatedAch));
          } catch (e) {
            console.error('Failed to save achievements:', e);
          }

          newUnlocks.forEach(id => {
            const ach = ACHIEVEMENTS.find(a => a.id === id);
            if (ach) {
              person.logEvent(
                t('app.achievementUnlocked', `🏆 Achievement Unlocked: ${ach.title}!`),
                'good'
              );
            }
          });
          updatePerson(person);
        }
      }
    } catch (e) {
      console.error('Auto-save effect error:', e);
    }
  }, [person, achievements, currentSlotId]);

  const handleAgeUp = () => {
    if (!person.isAlive) {
      return;
    }
    if (hapticsEnabled) HAPTICS.ageUp();
    runAction(p => GameEngine.ageUp(p));
  };

  const handleAgeSkip = years => {
    if (!person.isAlive) {
      return;
    }
    if (hapticsEnabled) HAPTICS.ageUp();
    runAction(p => GameEngine.ageUp(p, years));
  };

  const handleAction = type => {
    if (!person.isAlive) {
      return;
    }

    if (type === 'occupation') {
      if (person.age < 18) {
        showToast(t('app.tooYoungWork', 'You are too young to work full-time!'), 'bad');
        return;
      }
      setModal('occupation');
      return;
    }
    if (type === 'education') {
      // Allow opening education at any age now, so we can see elementary school
      setModal('education');
      return;
    }
    if (type === 'assets') {
      if (person.age < 18) {
        showToast(t('app.tooYoungAssets', 'You must be 18 to manage assets!'), 'bad');
        return;
      }
      setModal('assets');
      return;
    }
    if (type === 'relationships') {
      setModal('relationships_dashboard');
      return;
    }
    if (type === 'pets') {
      setModal('pets');
      return;
    }
    if (type === 'activities') {
      setModal('activities');
      return;
    }
    if (type === 'achievements') {
      setModal('achievements');
      return;
    }
    if (type === 'travel') {
      setModal('travel');
      return;
    }

    showToast(t('app.featureComing', `You opened ${type}. (Feature coming soon)`), 'neutral');
  };

  const handleJobApplication = job => {
    runAction(p => {
      if (job.isMilitary) {
        const success = p.joinMilitary(job.branch, job.isOfficer);
        if (success) {
          setModal(null);
        }
      } else {
        const hired = p.setJob(job);
        if (hired) {
          setModal(null);
        }
      }
    });
  };

  const handleActivity = activity => {
    if (activity.isSocial) {
      setModal('social');
      return;
    }
    if (activity.isLove) {
      if (person.age < 14) {
        showToast(t('app.tooYoungDate', 'You are too young to date!'), 'bad');
        return;
      }
      setModal('love');
      return;
    }
    if (activity.isMusic) {
      setModal('career_music');
      return;
    }
    if (activity.isMafia) {
      setModal('mafia');
      return;
    }
    if (activity.crimeType === 'burglary') {
      setModal('minigame_burglary');
      setModalData({ difficulty: Math.floor(Math.random() * 3) + 1 });
      return;
    }
    if (activity.isRoyalty) {
      setModal('royalty');
      return;
    }
    if (activity.isPolitics) {
      setModal('politics');
      return;
    }
    if (activity.isGambling) {
      setModal('gambling');
      return;
    }
    if (activity.isDoctor) {
      setModal('doctor');
      return;
    }
    if (activity.isHobbies) {
      setModal('hobbies');
      return;
    }
    if (activity.isWill) {
      if (person.age < 18) {
        showToast(t('app.tooYoungWill', 'You must be 18 to create a will!'), 'bad');
        return;
      }
      setModal('will');
      return;
    }
    if (activity.isImmigration) {
      if (person.age < 18) {
        showToast(t('app.tooYoung', 'You must be 18 for immigration!'), 'bad');
        return;
      }
      setModal('immigration');
      setModalData({
        onEmigrate: (countryName) => {
          runAction(p => {
            const mgr = new ImmigrationManager(p);
            const result = mgr.attemptEmigration(countryName);
            if (result.success) {
              showToast(result.message, 'good');
              setModal(null);
            } else {
              showToast(result.message, 'bad');
            }
          });
        },
        onCitizenship: () => {
          runAction(p => {
            const mgr = new ImmigrationManager(p);
            const result = mgr.applyForCitizenship();
            showToast(result.message, result.success ? 'good' : 'bad');
          });
        },
      });
      return;
    }
    if (activity.isCrimeHub) {
      setModal('crime');
      return;
    }
    if (activity.isBusiness) {
      setModal('business');
      return;
    }
    if (activity.isFitness) {
      setModal('fitness');
      return;
    }
    if (activity.isAddiction) {
      setModal('addiction');
      return;
    }
    if (activity.isInsurance) {
      setModal('insurance');
      return;
    }
    if (activity.isRetirement) {
      setModal('retirement');
      return;
    }
    if (activity.isSports) {
      setModal('sports');
      return;
    }
    if (activity.isSpace) {
      setModal('space');
      return;
    }
    if (activity.isPhilanthropy) {
      setModal('philanthropy');
      return;
    }
    if (activity.isClubs) {
      setModal('clubs');
      return;
    }
    if (activity.isLawsuits) {
      setModal('lawsuit');
      return;
    }
    if (activity.isMemories) {
      setModal('timeCapsule');
      return;
    }
    runAction(p => p.performActivity(activity));
  };

  // Main Menu Logic
  const [showLoadMenu, setShowLoadMenu] = useState(false);

  if (!person) {
    if (showLoadMenu) {
      return (
        <SaveSlotMenu
          onSelectSlot={slotId => {
            loadGameData(slotId);
            setShowLoadMenu(false);
          }}
          onSlotsChanged={slots => {
            const recent = getMostRecentSaveMetadata(slots);
            setHasSave(Boolean(recent));
            setSaveSummary(recent);
          }}
          onNewGame={() => setShowLoadMenu(false)}
          onClose={() => setShowLoadMenu(false)}
        />
      );
    }
    return (
      <MainMenu
        onStartGame={initNewGame}
        onStartDailyLife={initNewGame}
        onContinue={handleContinue}
        onLoad={() => setShowLoadMenu(true)}
        hasSave={hasSave}
        saveSummary={saveSummary}
        language={language}
        onLanguageChange={handleLanguageChange}
        t={t}
      />
    );
  }

  return (
    <div className="app-container" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Hud
        person={person}
        onOpenMenu={() => setModal('system')}
        onWorldNews={() => setModal('world_news')}
        language={language}
        t={t}
      />
      <EventLog history={person.history} language={language} t={t} />
      {person.isInPrison ? (
        <PrisonMenu
          person={person}
          onAction={action => runAction(p => p.prisonAction(action))}
          language={language}
          t={t}
        />
      ) : (
        <ActionMenu
          onAgeUp={handleAgeUp}
          onAction={handleAction}
          onAgeSkip={handleAgeSkip}
          language={language}
          t={t}
        />
      )}

      {/* Interactive Modals */}
      {modal === 'system' && (
        <Suspense fallback={<ModalLoader />}>
          <LazySystemMenu
            onResume={() => setModal(null)}
            onSave={() => {
              if (currentSlotId) {
                saveGameData(person, currentSlotId);
              }
              showToast(t('toast.saved', 'Game Saved!'), 'good');
              setModal(null);
            }}
            onGodMode={() => setModal('god_mode')}
            onStats={() => setModal('stats')}
            onHistory={() => setModal('stats')}
            onFamilyTree={() => setModal('familytree')}
            onWorldNews={() => setModal('world_news')}
            onWorldOverview={() => setModal('world_overview')}
            onAchievements={() => setModal('achievements')}
            onChallenge={() => setModal('challenge')}
            onTutorial={() => setShowOnboarding(true)}
            onResetTutorial={() => {
              localStorage.removeItem(TUTORIAL_DONE_KEY);
              setShowOnboarding(true);
              setModal(null);
            }}
            onExit={() => {
              handleExitToMenu();
              setModal(null);
            }}
            language={language}
            onLanguageChange={handleLanguageChange}
            t={t}
            currentTheme={currentTheme}
            onThemeChange={id => {
              setCurrentTheme(id);
              applyTheme(id);
            }}
            audioEnabled={audioEnabled}
            onSoundToggle={handleAudioToggle}
            sfxVolume={sfxVolume}
            onSfxVolumeChange={handleSfxVolume}
            musicVolume={musicVolume}
            onMusicVolumeChange={handleMusicVolume}
            hapticsEnabled={hapticsEnabled}
            onHapticsToggle={setHapticsEnabled}
            onDebug={() => setModal('debug')}
            onRelationshipDashboard={() => setModal('relationships_dashboard')}
            onLifeTimeline={() => setModal('life_timeline')}
            onEventHistory={() => setModal('event_history')}
            onCountryProfile={() => setModal('country_profile')}
          />
        </Suspense>
      )}

      {modal === 'world_news' && (
        <WorldNewsFeed person={person} onClose={() => setModal(null)} language={language} t={t} />
      )}

      {modal === 'world_overview' && (
        <Suspense fallback={<ModalLoader />}>
          <LazyWorldOverview person={person} onClose={() => setModal(null)} />
        </Suspense>
      )}

      {modal === 'challenge' && <ChallengeMenu person={person} onClose={() => setModal(null)} />}

      {showOnboarding && (
        <OnboardingOverlay
          language={language}
          t={t}
          onClose={() => {
            localStorage.setItem(TUTORIAL_DONE_KEY, '1');
            setShowOnboarding(false);
          }}
        />
      )}

      {modal === 'debug' && (
        <DebugMenu
          onClose={() => setModal(null)}
          t={t}
        />
      )}

      {modal === 'travel' && (
        <Suspense fallback={<ModalLoader />}>
          <LazyTravelMap
            person={person}
            onTravel={city => {
              runAction(p => {
                const result = travelToCity(p, city);
                if (result.success) {
                  showToast(`Traveled to ${city.name}. Cost: $${result.cost.toLocaleString()}`, 'good');
                } else if (result.reason === 'no_money') {
                  showToast(`Need $${result.cost.toLocaleString()} to travel there.`, 'bad');
                }
              });
            }}
            onClose={() => setModal(null)}
            language={language}
            t={t}
          />
        </Suspense>
      )}

      {modal === 'country_profile' && (
        <Suspense fallback={<ModalLoader />}>
          <LazyCountryProfile
            person={person}
            countryId={person.country}
            onClose={() => setModal(null)}
            language={language}
            t={t}
          />
        </Suspense>
      )}

      {modal === 'god_mode' && (
        <Suspense fallback={<ModalLoader />}>
          <LazyGodModeMenu
            person={person}
            onUpdate={updateFn => {
              runAction(updateFn);
            }}
            onClose={() => setModal(null)}
            language={language}
            t={t}
          />
        </Suspense>
      )}

      {modal === 'occupation' && (
        <Suspense fallback={<ModalLoader />}>
          <LazyOccupationMenu
            person={person}
            onApply={handleJobApplication}
            onQuit={() => runAction(p => p.quitJob())}
            onClose={action => {
              if (action === 'deploy') {
                setModal('minesweeper');
              } else {
                setModal(null);
              }
            }}
            language={language}
            t={t}
          />
        </Suspense>
      )}

      {modal === 'activities' && (
        <Suspense fallback={<ModalLoader />}>
          <LazyActivitiesMenu
            person={person}
            onDoActivity={handleActivity}
            onClose={() => setModal(null)}
            language={language}
            t={t}
          />
        </Suspense>
      )}

      {modal === 'love' && (
        <Suspense fallback={<ModalLoader />}>
          <LazyLoveMenu
            person={person}
            onDate={candidate => {
              runAction(p => p.startDating(candidate));
              setModal(null);
            }}
            onClose={() => setModal(null)}
            language={language}
            t={t}
          />
        </Suspense>
      )}

      {modal === 'career_music' && (
        <Suspense fallback={<ModalLoader />}>
          <LazyCareerModal
            person={person}
            onAction={(action, payload) => {
              if (action === 'voice') {
                runAction(p => p.practiceSkill('voice'));
              }
              if (action === 'practice') {
                runAction(p => p.practiceSkill(payload));
              }
            }}
            onBand={() => setModal('band')}
            onClose={() => setModal(null)}
            language={language}
            t={t}
          />
        </Suspense>
      )}

      {modal === 'band' && (
        <Suspense fallback={<ModalLoader />}>
          <LazyBandMenu
            person={person}
            onAction={(action, payload) => {
              if (action === 'form_band') {
                runAction(p => p.formBand(payload.name, payload.genre));
              } else if (action === 'disband') {
                runAction(p => p.disband());
              } else if (action === 'rest') {
                runAction(p => p.rest(35));
              }
            }}
            onClose={() => setModal(null)}
            language={language}
            t={t}
          />
        </Suspense>
      )}

      {modal === 'social' && (
        <Suspense fallback={<ModalLoader />}>
          <LazySocialMenu
            person={person}
            onPost={(platform, post) => runAction(p => p.postToSocial(platform.id, post.id))}
            onMonetize={platform => runAction(p => p.monetizeSocial(platform.id))}
            onBuyFollowers={platform => {
              runAction(p => {
                if (p.money >= 100) {
                  p.money -= 100;
                  if (!p.social.platforms[platform.id]) {
                    p.social.platforms[platform.id] = { followers: 0, posts: 0 };
                  }
                  p.social.platforms[platform.id].followers += 500;
                  p.logEvent(`You bought 500 followers for ${platform.name}.`, 'neutral');
                } else {
                  p.logEvent("You can't afford that!", 'bad');
                }
              });
            }}
            onClose={() => setModal(null)}
            language={language}
            t={t}
          />
        </Suspense>
      )}

      {modal === 'relationships_dashboard' && (
        <RelationshipDashboard
          person={person}
          onClose={() => setModal(null)}
          onOpenFullManager={() => setModal('relationships')}
          t={t}
        />
      )}

      {modal === 'life_timeline' && (
        <Suspense fallback={<ModalLoader />}>
          <LazyLifeTimeline
            person={person}
            onClose={() => setModal(null)}
            t={t}
          />
        </Suspense>
      )}

      {modal === 'event_history' && (
        <Suspense fallback={<ModalLoader />}>
          <LazyEventHistoryModal
            person={person}
            onClose={() => setModal(null)}
            t={t}
          />
        </Suspense>
      )}

      {modal === 'relationships' && (
        <Suspense fallback={<ModalLoader />}>
          <LazyRelationshipsMenu
            person={person}
            onInteract={(id, action, payload) => {
              runAction(p => p.interactWithRel(id, action, payload));
            }}
            onClose={() => setModal(null)}
            showToast={showToast}
            language={language}
            t={t}
          />
        </Suspense>
      )}

      {modal === 'mafia' && (
        <Suspense fallback={<ModalLoader />}>
          <LazyMafiaMenu
            person={person}
            onJoin={family => {
              runAction(p => {
                p.joinMafia(family);
              });
            }}
            onAction={action => {
              runAction(p => {
                p.performMafiaAction(action);
              });
            }}
            onClose={() => setModal(null)}
            language={language}
            t={t}
          />
        </Suspense>
      )}

      {modal === 'royalty' && (
        <Suspense fallback={<ModalLoader />}>
          <LazyRoyaltyMenu
            person={person}
            onAction={action => {
              runAction(p => {
                if (action === 'public_service') {
                  p.performRoyalDuty();
                }
                if (action === 'abdicate') {
                  p.abdicate();
                }
                if (action === 'execute') {
                  p.executeSubject();
                }
                if (action === 'abdicate' || action === 'execute') {
                  setModal(null);
                }
              });
            }}
            onClose={() => setModal(null)}
            language={language}
            t={t}
          />
        </Suspense>
      )}

      {modal === 'politics' && (
        <Suspense fallback={<ModalLoader />}>
          <LazyPoliticsMenu
            person={person}
            onRun={office => {
              runAction(p => {
                p.startCampaign(office);
              });
            }}
            onCampaignAction={action => {
              runAction(p => p.campaignAction(action));
            }}
            onGeopolitics={() => setModal('geopolitics')}
            onClose={() => setModal(null)}
            language={language}
            t={t}
          />
        </Suspense>
      )}

      {modal === 'geopolitics' && (
        <Suspense fallback={<ModalLoader />}>
          <LazyGeopoliticsModal
            person={person}
            onUpdate={fn => runAction(fn)}
            onClose={() => setModal(null)}
            language={language}
            t={t}
          />
        </Suspense>
      )}

      {modal === 'gambling' && (
        <Suspense fallback={<ModalLoader />}>
          <LazyGamblingMenu
            person={person}
            onResult={amount => {
              runAction(p => {
                p.money += amount;
                if (amount > 0) {
                  p.logEvent(`You won $${amount.toLocaleString()} gambling!`, 'good');
                } else {
                  p.logEvent(`You lost $${Math.abs(amount).toLocaleString()} gambling.`, 'bad');
                }
              });
            }}
            onClose={() => setModal(null)}
            language={language}
            t={t}
          />
        </Suspense>
      )}

      {modal === 'education' && (
        <Suspense fallback={<ModalLoader />}>
          <LazyEducationMenu
            person={person}
            onEnroll={school => {
              runAction(p => {
                const success = p.enrollInSchool(school);
                if (success) {
                  setModal(null);
                }
              });
            }}
            onStudy={() => {
              runAction(p => p.studyHard());
            }}
            onDropOut={() => {
              runAction(p => p.dropOut());
            }}
            onClose={() => setModal(null)}
            language={language}
            t={t}
          />
        </Suspense>
      )}

      {modal === 'assets' && (
        <Suspense fallback={<ModalLoader />}>
          <LazyAssetsMenu
            person={person}
            onBuy={(asset, mortgage) => {
              runAction(p => p.buyAsset(asset, mortgage));
            }}
            onSell={index => {
              runAction(p => p.sellAsset(index));
            }}
            onRent={(index, amount) => runAction(p => p.rentAsset(index, amount))}
            onEvict={index => runAction(p => p.evictTenant(index))}
            onInvest={(asset, amount) => runAction(p => p.buyInvestment(asset, amount))}
            onDivest={id => runAction(p => p.sellInvestment(id))}
            onPartialDivest={(id, pct) => runAction(p => p.sellPartialInvestment(id, pct))}
            onClose={() => setModal(null)}
            language={language}
            t={t}
          />
        </Suspense>
      )}

      {modal === 'achievements' && (
        <Suspense fallback={<ModalLoader />}>
          <LazyAchievementsMenu
            unlockedIds={achievements}
            onClose={() => setModal(null)}
            language={language}
            t={t}
          />
        </Suspense>
      )}

      {modal === 'minigame_burglary' && (
        <Suspense fallback={<ModalLoader />}>
          <LazyMiniGameModal
            type="burglary"
            difficulty={modalData?.difficulty || 1}
            onResult={success => {
              setModal(null);
              runAction(p => p.commitCrime('burglary', success));
            }}
            onClose={() => setModal(null)}
            language={language}
            t={t}
          />
        </Suspense>
      )}

      {modal === 'minesweeper' && (
        <Suspense fallback={<ModalLoader />}>
          <LazyMinesweeper
            onWin={() => {
              setModal(null);
              runAction(p => {
                p.logEvent(
                  t('app.minesweeperWin', 'MISSION ACCOMPLISHED! You survived the minefield.'),
                  'good'
                );
                p.promoteMilitary();
              });
            }}
            onLose={() => {
              setModal(null);
              runAction(p => {
                p.logEvent(t('app.minesweeperBoom', 'BOOM! You stepped on a mine.'), 'bad');
                p.isAlive = false;
                p.logEvent(t('app.minesweeperKilled', 'You were killed in action.'), 'bad');
              });
            }}
            onClose={() => {
              setModal(null);
              runAction(p =>
                p.logEvent(
                  t('app.minesweeperRetreat', 'You retreated from the minefield. Coward.'),
                  'bad'
                )
              );
            }}
            language={language}
            t={t}
          />
        </Suspense>
      )}

      {modal === 'doctor' && (
        <Suspense fallback={<ModalLoader />}>
          <LazyDoctorMenu
            person={person}
            onTreat={t => {
              runAction(p => p.visitDoctor(t));
            }}
            onSurgery={s => {
              runAction(p => p.plasticSurgery(s));
            }}
            onDiagnose={(diseaseId, treatmentId) => {
              let msg = '';
              runAction(p => {
                const result = treatDisease(p, diseaseId, treatmentId);
                msg = result?.message || 'Treatment applied.';
              });
              return msg;
            }}
            onClose={() => setModal(null)}
            language={language}
            t={t}
          />
        </Suspense>
      )}

      {modal === 'will' && (
        <Suspense fallback={<ModalLoader />}>
          <LazyWillMenu
            person={person}
            onCreateWill={(beneficiary, allocations) => {
              runAction(p => p.createWill(beneficiary, allocations));
            }}
            onClose={() => setModal(null)}
            language={language}
            t={t}
          />
        </Suspense>
      )}

      {modal === 'hobbies' && (
        <Suspense fallback={<ModalLoader />}>
          <LazyHobbiesMenu
            person={person}
            onPractice={skillId => {
              runAction(p => p.practiceSkill(skillId));
            }}
            onClose={() => setModal(null)}
            language={language}
            t={t}
          />
        </Suspense>
      )}

      {modal === 'pets' && (
        <Suspense fallback={<ModalLoader />}>
          <LazyPetsMenu
            person={person}
            onInteract={(index, action) => {
              runAction(p => p.interactWithPet(index, action));
            }}
            onAdopt={pet => {
              runAction(p => p.adoptPet(pet));
            }}
            onClose={() => setModal(null)}
            language={language}
            t={t}
          />
        </Suspense>
      )}

      {modal === 'stats' && (
        <Suspense fallback={<ModalLoader />}>
          <LazyStatsMenu
            stats={lifetimeStats.getStats()}
            onClose={() => setModal(null)}
            language={language}
            t={t}
          />
        </Suspense>
      )}

      {modal === 'familytree' && (
        <Suspense fallback={<ModalLoader />}>
          <LazyFamilyTreeMenu
            familyTree={familyTree}
            onClose={() => setModal(null)}
            language={language}
            t={t}
          />
        </Suspense>
      )}

      {/* Generic modal loader for modals without custom rendering blocks */}
      {modal && ![
        'system','god_mode','occupation','activities','love','career_music','social',
        'career','mafia','royalty','politics','geopolitics','gambling','education',
        'assets','achievements','minigame_burglary','minesweeper','doctor','will',
        'hobbies','pets','stats','familytree','world_news','world_overview','challenge',
        'debug','relationships_dashboard','relationships','life_timeline','event_history',
        'travel','country_profile',
      ].includes(modal) && (
        <LazyModalLoader
          modalType={modal}
          modalData={modalData}
          person={person}
          onClose={() => setModal(null)}
          language={language}
          t={t}
        />
      )}

      {person.pendingEvent && (
        <DecisionModal
          event={person.pendingEvent}
          onChoice={choice => {
            runAction(p => p.resolveEvent(choice));
          }}
          language={language}
          t={t}
        />
      )}

      {!person.isAlive && (
        <GameOver
          person={person}
          onRestart={child => {
            if (child && child.type === 'Child') {
              const heir = person.inherit(child);
              setPerson(heir);
              saveGameData(heir, currentSlotId);
            } else {
              if (hapticsEnabled) HAPTICS.death();
              setPerson(null);
              setCurrentSlotId(null);
            }
          }}
          language={language}
          t={t}
        />
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

export default App;
