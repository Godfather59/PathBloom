import React, { Suspense, lazy } from 'react';

/**
 * Lazy-loaded modal components for better performance and code splitting
 * These components are only loaded when needed, reducing initial bundle size
 */

const LazyModalLoader = ({ modalType, modalData, onClose, ...props }) => {
  // Map of modal types to their lazy-loaded components
  const modalComponents = {
    occupation: lazy(() => import('./OccupationMenu')),
    activities: lazy(() => import('./ActivitiesMenu')),
    relationships: lazy(() => import('./RelationshipsMenu')),
    assets: lazy(() => import('./AssetsMenu')),
    education: lazy(() => import('./EducationMenu')),
    achievements: lazy(() => import('./AchievementsMenu')),
    career: lazy(() => import('./CareerModal')),
    careerTree: lazy(() => import('./CareerTreeModal')),
    challenge: lazy(() => import('./ChallengeMenu')),
    clubs: lazy(() => import('./ClubsMenu')),
    crime: lazy(() => import('./CrimeMenu')),
    doctor: lazy(() => import('./DoctorMenu')),
    familyTree: lazy(() => import('./FamilyTreeMenu')),
    fitness: lazy(() => import('./FitnessMenu')),
    gambling: lazy(() => import('./GamblingMenu')),
    godMode: lazy(() => import('./GodModeMenu')),
    hobbies: lazy(() => import('./HobbiesMenu')),
    immigration: lazy(() => import('./ImmigrationMenu')),
    insurance: lazy(() => import('./InsuranceMenu')),
    lawsuit: lazy(() => import('./LawsuitMenu')),
    love: lazy(() => import('./LoveMenu')),
    mafia: lazy(() => import('./MafiaMenu')),
    miniGame: lazy(() => import('./MiniGameModal')),
    pets: lazy(() => import('./PetsMenu')),
    philanthropy: lazy(() => import('./PhilanthropyMenu')),
    politics: lazy(() => import('./PoliticsMenu')),
    prison: lazy(() => import('./PrisonMenu')),
    renovation: lazy(() => import('./RenovationMenu')),
    retirement: lazy(() => import('./RetirementMenu')),
    royalty: lazy(() => import('./RoyaltyMenu')),
    saveSlot: lazy(() => import('./SaveSlotMenu')),
    social: lazy(() => import('./SocialMenu')),
    space: lazy(() => import('./SpaceMenu')),
    sports: lazy(() => import('./SportsMenu')),
    stats: lazy(() => import('./StatsMenu')),
    system: lazy(() => import('./SystemMenu')),
    timeCapsule: lazy(() => import('./TimeCapsuleMenu')),
    travel: lazy(() => import('./TravelMap')),
    will: lazy(() => import('./WillMenu')),
    worldNews: lazy(() => import('./WorldNewsFeed')),
    decision: lazy(() => import('./DecisionModal')),
    gameOver: lazy(() => import('./GameOver')),
    annualRecap: lazy(() => import('./AnnualRecapModal')),
    geopolitics: lazy(() => import('./GeopoliticsModal')),
  };

  const ModalComponent = modalComponents[modalType];

  if (!ModalComponent) {
    console.warn(`Unknown modal type: ${modalType}`);
    return null;
  }

  return (
    <Suspense
      fallback={
        <div
          className="modal-loading"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '200px',
            color: '#4ecdc4',
          }}
        >
          <div className="loading-spinner" />
        </div>
      }
    >
      <ModalComponent {...modalData} onClose={onClose} {...props} />
    </Suspense>
  );
};

export default LazyModalLoader;
