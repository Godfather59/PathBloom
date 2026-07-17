const LANGUAGE_KEY = 'pathbloom_language';
const LEGACY_LANGUAGE_KEY = 'lifepath_language';

export const LANGUAGES = [
  { id: 'en', label: 'English', nativeName: 'English', dir: 'ltr', locale: 'en-US' },
  { id: 'ar', label: 'Arabic', nativeName: 'العربية', dir: 'rtl', locale: 'ar-MA' },
];

const TRANSLATIONS = {
  en: {
    'app.title': 'PathBloom',
    'app.subtitle': 'Life Simulator',
    'common.close': 'Close',
    'common.free': 'Free',
    'common.age': 'Age',
    'main.continue': 'Continue Life',
    'main.loadOther': 'Load Other Game',
    'main.startNewLife': 'Start New Life',
    'main.firstName': 'First Name',
    'main.lastName': 'Last Name',
    'main.firstNamePlaceholder': 'Enter first name',
    'main.lastNamePlaceholder': 'Enter last name',
    'main.randomizeName': 'Randomize Name',
    'main.gender': 'Gender',
    'main.male': 'Male',
    'main.female': 'Female',
    'main.country': 'Country',
    'main.mode': 'Mode',
    'main.normalLife': 'Normal Life',
    'main.dailyLife': 'Daily Life',
    'main.dailyLifeDesc': 'One shared seed, one chance per day.',
    'main.dailyStreak': 'Streak',
    'main.dailyStreakDays': '{count} day streak',
    'main.dailyAlreadyPlayed': 'Daily life already completed today.',
    'main.startLife': 'Start Life',
    'main.fullNameAlert': 'Please enter a full name.',
    'hud.yearsOld': 'years old',
    'hud.student': 'Student',
    'hud.unemployed': 'Unemployed',
    'hud.openMenu': 'Open Menu',
    'hud.debt': 'Debt',
    'stat.happiness': 'Happiness',
    'stat.health': 'Health',
    'stat.smarts': 'Smarts',
    'stat.looks': 'Looks',
    'stat.stress': 'Stress',
    'stat.karma': 'Karma',
    'stat.fame': 'Fame',
    'stat.notoriety': 'Notoriety',
    'stat.energy': 'Energy',
    'action.occupation': 'Occupation',
    'action.activities': 'Activities',
    'action.relationships': 'Relationships',
    'action.assets': 'Assets',
    'action.education': 'Education',
    'action.pets': 'Pets',
    'action.travel': 'Travel',
    'travel.title': 'Travel Map',
    'travel.search': 'Search cities...',
    'travel.all': 'All Cities',
    'travel.domestic': 'Domestic',
    'travel.international': 'International',
    'travel.flightCost': 'Flight Cost',
    'travel.costOfLiving': 'Cost of Living',
    'travel.culture': 'Culture',
    'travel.tech': 'Tech',
    'travel.nature': 'Nature',
    'travel.currentCity': 'Current City',
    'travel.insufficientFunds': 'Insufficient Funds',
    'travel.travelHere': 'Travel Here',
    'travel.close': 'Close',
    'travel.noResults': 'No cities found.',
    'action.ageUp': 'Age Up',
    'action.skip5': '+5 Years',
    'action.skip10': '+10 Years',
    'action.smartSkip5': 'Smart +5',
    'action.smartSkip10': 'Smart +10',
    'action.smartSkipHint': 'Stops when an important decision needs you.',
    'system.paused': 'Paused',
    'system.resume': 'Resume Game',
    'system.save': 'Save Game',
    'system.godMode': 'God Mode',
    'system.stats': 'Lifetime Stats',
    'system.familyTree': 'Family Dynasty',
    'system.achievements': 'Achievements',
    'system.challenge': 'Challenges',
    'system.language': 'Language',
    'system.sound': 'Sound',
    'system.sfxVolume': 'SFX Volume',
    'system.musicVolume': 'Music Volume',
    'system.haptics': 'Vibration',
    'system.exit': 'Exit to Main Menu',
    'system.exitConfirm': 'Are you sure you want to exit? Unsaved progress will be lost.',
    'toast.saved': 'Game Saved!',
    'toast.languageChanged': 'Language updated.',
    'toast.themeChanged': 'Theme updated.',
    'eventlog.empty': 'No events yet. Start living!',
    'system.theme': 'Theme',
    'system.history': 'Current Life Trends',
    'system.worldNews': 'World News',
    'activities.title': 'Activities',
    'activities.more': 'More Activities',
    'activities.unlocksAt': 'Unlocks at age',
    'activities.free': 'Free',
    'activities.cost': 'Cost',
    'activities.energy': 'Energy',
    'activities.age': 'Age',
    'activities.risk': 'Risk',
    'risk.low': 'Low risk',
    'risk.medium': 'Medium risk',
    'risk.high': 'High risk',
    'risk.extreme': 'Extreme risk',
    'activities.royalty': 'Royalty',
    'activities.royaltyHint': 'Power, duties, and scandals.',
    'activities.social': 'Social Media',
    'activities.socialHint': 'Post, grow, and monetize.',
    'activities.love': 'Love',
    'activities.loveHint': 'Date, romance, and commitment.',
    'activities.music': 'Instruments',
    'activities.musicHint': 'Practice your way to fame.',
    'activities.doctor': 'Doctor',
    'activities.doctorHint': 'Treat health and looks.',
    'activities.politics': 'Politics',
    'activities.politicsHint': 'Campaign and lead.',
    'activities.crime': 'Crime',
    'activities.crimeHint': 'Risky moves, big consequences.',
    'activities.business': 'Business',
    'activities.businessHint': 'Start and manage companies.',
    'activities.immigration': 'Immigration',
    'activities.immigrationHint': 'Move, visas, citizenship.',
    'activities.casino': 'Casino',
    'activities.casinoHint': 'Luck, bets, and stress.',
    'activities.hobbies': 'Hobbies',
    'activities.hobbiesHint': 'Build skills and joy.',
    'activities.fitness': 'Fitness',
    'activities.fitnessHint': 'Train, diet, recover.',
    'activities.addiction': 'Substances',
    'activities.addictionHint': 'Temptation with danger.',
    'activities.insurance': 'Insurance',
    'activities.insuranceHint': 'Protect cars, homes, life.',
    'activities.retirement': 'Retirement',
    'activities.retirementHint': 'Save for later years.',
    'activities.sports': 'College Sports',
    'activities.sportsHint': 'Try out and go pro.',
    'activities.space': 'Space Program',
    'activities.spaceHint': 'Train for risky missions.',
    'activities.philanthropy': 'Philanthropy',
    'activities.philanthropyHint': 'Give, build, leave legacy.',
    'activities.clubs': 'Clubs & Societies',
    'activities.clubsHint': 'Join groups and network.',
    'activities.lawsuits': 'Lawsuits',
    'activities.lawsuitsHint': 'Sue, settle, or lose.',
    'activities.memories': 'Memories',
    'activities.memoriesHint': 'Write time capsules.',
    'activity.gym': 'Go to the Gym',
    'activity.meditate': 'Meditate',
    'activity.library': 'Go to Library',
    'activity.club': 'Go Clubbing',
    'activity.plastic_surgery': 'Plastic Surgery',
    'activity.find_date': 'Find a Date',
    'activity.commit_crime_burglary': 'Burgle a House',
    'activity.commit_crime_robbery': 'Rob a Bank',
    'activity.gamble_lottery': 'Play Lottery',
    'activity.gamble_horse': 'Horse Races',
    'activity.adopt_pet_dog': 'Adopt a Dog',
    'activity.adopt_pet_cat': 'Adopt a Cat',
    'activity.travel_budget': 'Budget Travel',
    'activity.travel_luxury': 'Luxury Cruise',
    'activity.busk': 'Street Performance (Busk)',
    'activity.estate_planning': 'Estate Planning',
    'activity.pickpocket_activity': 'Pickpocket',
    'activity.court_case_activity': 'File a Court Case',
    'decision.event': 'Event',
    'recap.kicker': 'Your path this year',
    'recap.title': 'Year in Review',
    'recap.yearsTitle': 'Years in Review',
    'recap.fastForwardStopped': 'Fast-forward paused',
    'recap.yearsAdvanced': 'years advanced',
    'recap.finances': 'Finances',
    'recap.income': 'Income',
    'recap.livingExpenses': 'Living costs',
    'recap.taxes': 'Taxes',
    'recap.cashChange': 'Cash change',
    'recap.netWorthChange': 'Net worth change',
    'recap.debtChange': 'Debt change',
    'recap.stats': 'Stat changes',
    'recap.milestones': 'Important changes',
    'recap.highlights': 'Year highlights',
    'recap.continue': 'Continue your life',
    'recap.stop.death': 'Life ended',
    'recap.stop.decision': 'A decision needs your attention',
    'recap.stop.legal': 'Your legal status changed',
    'recap.stop.career': 'Your career changed',
    'recap.stop.education': 'An education milestone occurred',
    'recap.stop.milestone': 'You reached a life milestone',
    'recap.stop.health': 'Your health needs attention',
    'recap.stop.ambition': 'Your ambition advanced',
    'recap.stop.relationship': 'A relationship changed',
    'recap.change.relationshipNew': '{name} became part of your life.',
    'recap.change.relationshipStatus': "{name}'s relationship status changed to {status}.",
    'recap.change.relationshipStrained': 'Your relationship with {name} became strained.',
    'recap.change.relationshipEnded': '{name} left your life.',
    'recap.change.newJob': 'Career changed to {job}.',
    'recap.change.leftJob': 'You left {job}.',
    'recap.change.degree': 'You earned {degree}.',
    'ambitions.title': 'Life Ambitions',
    'ambitions.choose': 'Choose ambition',
    'ambitions.subtitle': 'Choose what this life will stand for.',
    'ambitions.permanentChoice': 'Your ambition is permanent for this life. Choose carefully.',
    'ambitions.milestones': 'milestones',
    'ambitions.confirmQuestion': 'Commit to this path? You cannot switch paths later.',
    'ambitions.commit': 'Commit',
    'ambitions.yourPath': 'Your path',
    'ambitions.complete': 'complete',
    'ambitions.progress': 'Ambition progress',
    'ambitions.pathComplete': 'Ambition fulfilled!',
    'ambitions.pathCompleteHint': 'This life has achieved something extraordinary.',
    'ambitions.done': 'Done',
    'ambitions.age': 'Age',
    'ambitions.reward': 'Reward',
    'ambitions.checkProgress': 'Check Progress',
    'ambitions.family_legacy.name': 'Family Legacy',
    'ambitions.family_legacy.description':
      'Build a loving, secure family whose influence lasts for generations.',
    'ambitions.business_empire.name': 'Business Empire',
    'ambitions.business_empire.description':
      'Turn discipline and bold ideas into an enduring commercial empire.',
    'ambitions.creative_fame.name': 'Creative Fame',
    'ambitions.creative_fame.description':
      'Master your craft, find an audience and become a cultural icon.',
    'ambitions.public_service.name': 'Public Service',
    'ambitions.public_service.description':
      'Earn the public trust and lead with integrity from your community to the nation.',
    'ambitions.criminal_mastermind.name': 'Criminal Mastermind',
    'ambitions.criminal_mastermind.description':
      'Choose a dangerous rise through the underworld and seize its highest rank.',
    'goals.title': 'Life Goals',
    'goals.completed': 'completed',
    'goals.done': 'Done',
    'goals.notYet': 'Not yet',
    'goal.growUp': 'Reach age 18',
    'goal.healthyStart': 'Keep health above 70',
    'goal.graduate': 'Graduate from school',
    'goal.firstJob': 'Get a job',
    'goal.savings': 'Save $10,000',
    'goal.relationship': 'Build a close relationship',
    'goal.homeOwner': 'Own an asset',
    'goal.legacy': 'Start a legacy',
    'legacy.score': 'Legacy Score',
    'legacy.rank.seed': 'New Seed',
    'legacy.rank.growing': 'Growing Path',
    'legacy.rank.strong': 'Strong Roots',
    'legacy.rank.great': 'Great Legacy',
    'legacy.rank.legend': 'Legendary Bloom',
    'onboarding.statsTitle': 'Watch your stats',
    'onboarding.statsBody':
      'Happiness, health, smarts, looks, stress, and karma shape every life event.',
    'onboarding.ageTitle': 'Age up to move forward',
    'onboarding.ageBody':
      'Tap Age Up when you are ready. Each year can bring school, work, relationships, surprises, or trouble.',
    'onboarding.activitiesTitle': 'Choose activities with intent',
    'onboarding.activitiesBody':
      'Activities are your main choices: love, fitness, crime, business, hobbies, travel, and more.',
    'onboarding.moneyTitle': 'Build money and bonds',
    'onboarding.moneyBody':
      'Jobs, assets, education, relationships, and children all feed into your long-term legacy.',
    'onboarding.legacyTitle': 'Grow a legacy',
    'onboarding.legacyBody':
      'Life goals and legacy score give every run a direction. When a life ends, you can start fresh or continue as a child.',
    'onboarding.skip': 'Skip',
    'onboarding.next': 'Next',
    'onboarding.done': 'Done',
    'system.tutorial': 'Tutorial',
    'system.resetTutorial': 'Reset Tutorial',
    'gameover.rip': 'R.I.P.',
    'gameover.diedAt': 'died at age',
    'gameover.netWorth': 'Net Worth',
    'gameover.career': 'Career',
    'gameover.education': 'Education',
    'gameover.children': 'Children',
    'gameover.partners': 'Partners',
    'gameover.marriages': 'Marriages',
    'gameover.degrees': 'Degrees',
    'gameover.events': 'Life Events',
    'gameover.age': 'Age',
    'gameover.lifeGoals': 'Life Goals Completed',
    'gameover.none': 'None',
    'gameover.startNewLife': 'Start New Life',
    'gameover.continueAsChild': 'Continue as Child',
    'gameover.achievements': 'Achievements',
    'gameover.lifetimeStats': 'Lifetime Stats',
    'gameover.livesLived': 'Lives Lived',
    'gameover.totalYears': 'Total Years Lived',
    'gameover.totalChildren': 'Total Children',
    'gameover.careersHad': 'Careers Had',
    'common.cancel': 'Cancel',
    'common.on': 'On',
    'common.off': 'Off',
    // Avatar Creator
    'avatar.title': 'Create Your Character',
    'avatar.creator': 'Create Your Character',
    'avatar.appearance': 'Appearance',
    'avatar.style': 'Outfit Style',
    'avatar.accessories': 'Accessories',
    'avatar.confirm': 'Start Life',
    'avatar.randomize': 'Randomize',
    'avatar.skinTone': 'Skin Tone',
    'avatar.hairStyle': 'Hair Style',
    'avatar.hairColor': 'Hair Color',
    'avatar.eyeColor': 'Eye Color',
    'avatar.clothing': 'Clothing Style',
    'avatar.clothingColor': 'Outfit Color',
    'avatar.accessory': 'Accessory',
    'hair.short': 'Short',
    'hair.long': 'Long',
    'hair.curly': 'Curly',
    'hair.bald': 'Bald',
    'hair.buzz': 'Buzz Cut',
    'hair.ponytail': 'Ponytail',
    'clothing.casual': 'Casual',
    'clothing.formal': 'Formal',
    'clothing.sporty': 'Sporty',
    'clothing.bohemian': 'Bohemian',
    'accessories.none': 'None',
    'accessories.glasses': 'Glasses',
    'accessories.sunglasses': 'Sunglasses',
    'accessories.earrings': 'Earrings',
    'accessories.hat': 'Hat',
    'accessories.beard': 'Beard',
    // Stats History
    'stats.history': 'Stat History',
    'stats.singleView': 'Single View',
    'stats.gridView': 'Grid View',
    'stats.noData': 'No stat history yet. Age up to start tracking!',
    // Challenge Mode - New Challenges
    'challenge.global_explorer': 'Global Explorer',
    'challenge.global_explorer_desc': 'Visit 15 countries and learn 5 languages by age 60',
    'challenge.philanthropist': 'Philanthropist',
    'challenge.philanthropist_desc': 'Donate $5M to charity and establish 3 foundations by age 65',
    'challenge.sports_legend': 'Sports Legend',
    'challenge.sports_legend_desc': 'Win 3 championships and be MVP 5 times by age 40',
    'challenge.political_dynasty': 'Political Dynasty',
    'challenge.political_dynasty_desc': 'Become Head of State and have child become Head of State',
    'challenge.scientist_extraordinaire': 'Scientist Extraordinaire',
    'challenge.scientist_extraordinaire_desc':
      'Win Nobel Prize, patent 10 inventions, earn PhD by age 50',
    // Challenge requirements
    'challenge.countries_visited': 'Countries Visited',
    'challenge.languages_known': 'Languages Known',
    'challenge.donated_money': 'Money Donated',
    'challenge.foundations': 'Foundations',
    'challenge.championships': 'Championships Won',
    'challenge.mvp_awards': 'MVP Awards',
    'challenge.head_of_state': 'Head of State',
    'challenge.child_head_of_state': 'Child Head of State',
    'challenge.nobel_prize': 'Nobel Prize',
    'challenge.patents': 'Patents',
    'challenge.degree': 'Degree',
    'challenge.phd': 'PhD',

    // Politics
    'politics.offices': 'Political Offices',
    'politics.run': 'Run for Office',
    'politics.campaign': 'Campaign',
    'politics.approval': 'Approval Rating',
    'politics.funds': 'Funds',
    'politics.weeksLeft': 'weeks until Election',
    'politics.actions': 'Campaign Actions',
    'politics.cost': 'Cost',
    'politics.impact': 'Impact',
    'politics.term': 'Term',
    'politics.salary': 'Salary',
    'politics.campaignCost': 'Campaign Cost',
    'politics.years': 'yrs',
    'politics.reElect': 'You won re-election!',
    'politics.lostElection': 'You lost re-election.',

    // Prison
    'prison.title': 'State Penitentiary',
    'prison.sentence': 'Sentence Remaining',
    'prison.years': 'Years',
    'prison.respect': 'Respect',
    'prison.gang': 'Gang',
    'prison.affiliated': 'Affiliated',
    'prison.none': 'None',
    'prison.yard': 'Prison Yard',
    'prison.workout': 'Yard Workout',
    'prison.library': 'Prison Library',
    'prison.gangAction': 'Gang Interaction',
    'prison.legal': 'Legal & Illegal',
    'prison.appeal': 'Appeal Sentence ($5,000)',
    'prison.riot': 'Incite Riot',
    'prison.escape': 'Escape!',

    // Stats
    'stats.title': 'Lifetime Statistics',
    'stats.career': 'Career Summary',
    'stats.livesLived': 'Lives Lived',
    'stats.totalYears': 'Total Years',
    'stats.moneyEarned': 'Money Earned',
    'stats.jobsHeld': 'Jobs Held',
    'stats.hallOfFame': 'Hall of Fame',
    'stats.richestLife': 'Richest Life',
    'stats.longestLife': 'Longest Life',
    'stats.mostChildren': 'Most Children',
    'stats.mostFamous': 'Most Famous',
    'stats.mostCommonJobs': 'Most Common Jobs',
    'stats.lifeStats': 'Life Statistics',
    'stats.totalChildren': 'Total Children',
    'stats.marriages': 'Marriages',
    'stats.assetsOwned': 'Assets Owned',
    'stats.degreesEarned': 'Degrees Earned',
    'stats.noneYet': 'None yet',
    'stats.yearsOld': 'years old',
    'stats.fame': 'fame',
    'stats.time': 'time',
    'stats.times': 'times',
    'stats.children': 'children',

    // Occupation
    'occupation.title': 'Occupation',
    'occupation.military': 'Military Service',
    'occupation.army': 'Army',
    'occupation.navy': 'Navy',
    'occupation.airForce': 'Air Force',
    'occupation.marines': 'Marines',
    'occupation.enlist': 'Enlist as Private',
    'occupation.officer': 'Officer (Degree Req)',
    'occupation.career': 'Career',
    'occupation.salary': 'Salary',
    'occupation.years': 'Years',
    'occupation.resign': 'Resign',
    'occupation.deploy': 'Deploy',
    'occupation.apply': 'Apply',
    'occupation.locked': 'Locked',
    'occupation.requires': 'Requires',
    'occupation.smarts': 'Smarts',
    'occupation.looks': 'Looks',
    'occupation.health': 'Health',
    'occupation.degree': 'Degree',
    'occupation.skill': 'Skill',

    // Education
    'education.title': 'Education',
    'education.study': 'Study Harder',
    'education.dropOut': 'Drop Out',
    'education.school': 'School',
    'education.university': 'University',
    'education.gradSchool': 'Grad School',
    'education.completed': 'Completed',
    'education.apply': 'Apply',
    'education.year': 'Year',
    'education.grades': 'Grades',
    'education.requires': 'Requires',

    // Save / Load
    'saveload.title': 'Load Game',
    'saveload.noSaves': 'No saved games found.',
    'saveload.delete': 'Delete',
    'saveload.newLife': 'Start New Life',
    'saveload.deleteConfirm': 'Are you sure you want to delete this save? This cannot be undone.',

    // Achievements
    'achievements.title': 'Trophy Case',
    'achievements.close': 'Close',
    'achievements.unlocked': 'Unlocked',

    // Relationships
    'relationships.title': 'Relationships',
    'relationships.spendTime': 'Spend Time',
    'relationships.compliment': 'Compliment',
    'dashboard.title': 'Relationship Dashboard',
    'dashboard.alive': 'Alive',
    'dashboard.deceased': 'Departed',
    'dashboard.avgHealth': 'Avg Health',
    'dashboard.conflicts': 'Conflicts',
    'dashboard.noRelationships': 'No relationships yet. Go make some friends!',
    'dashboard.allRelationships': 'All Relationships',
    'dashboard.openManager': 'Open Full Relationship Manager',
    'dashboard.conflictTooltip': 'Unresolved conflict',
    'dashboard.promiseTooltip': 'Promise pending',
    'dashboard.financeTooltip': 'Shared finances',
    'relationships.giveGift': 'Give Gift',
    'relationships.insult': 'Insult',
    'relationships.makeLove': 'Make Love (18+)',
    'relationships.propose': 'Propose (18+)',
    'relationships.planWedding': 'Plan Wedding',
    'relationships.cheat': 'Cheat',
    'relationships.divorce': 'Divorce',
    'relationships.breakUp': 'Break Up',
    'relationships.marryMe': 'Will you marry me?',
    'relationships.ringCost': 'Select Ring Cost',
    'relationships.plasticRing': 'Plastic Ring ($100)',
    'relationships.vintageRing': 'Vintage Tiffany ($50,000)',
    'relationships.weddingBudget': 'Wedding Budget',
    'relationships.courthouse': 'Courthouse ($100)',
    'relationships.castle': 'Castle ($100,000)',
    'relationships.prenup': 'Sign Prenup?',
    'relationships.prenupDesc': 'Protects assets, but may offend spouse.',
    'relationships.confirm': 'Confirm',
    'relationships.cancel': 'Cancel',
    'relationships.back': 'Back',
    'relationships.noRelationships': 'You have no relationships.',
    'relationships.tooYoung': 'You are too young for this!',
    'relationships.tooYoungMarry': 'You are too young to marry!',
    'relationships.divorceConfirm':
      'Are you sure you want to divorce? You will lose half your money.',

    // Immigration
    'immigration.citizenships': 'Citizenships',
    'immigration.applyCitizenship': 'Apply for Citizenship',
    'immigration.countries': 'Countries',
    'immigration.visa': 'Visa',
    'immigration.difficulty': 'Difficulty',
    'immigration.here': 'Here',
    'immigration.move': 'Move',
    'immigration.ageReq': 'Must be 18+.',
    'immigration.noFunds': 'Not enough cash.',

    // Love
    'love.title': 'Find Love',
    'love.datingApp': 'Dating App ($100)',
    'love.datingAppDesc': 'Browse profiles and pick your match.',
    'love.blindDate': 'Blind Date (Free)',
    'love.blindDateDesc': 'Let fate decide! Risk of weirdos.',
    'love.askOut': 'Ask Out',
    'love.back': 'Back',

    // Relationships extra
    'relationships.relationship': 'Relationship',
    'education.of': 'of',
    'education.years': 'Years',

    // Alert dialogs
    'alert.broke': "You don't have enough money!",
    'alert.busted': 'Busted! You lose.',
    'alert.dealerBusts': 'Dealer busts! You win!',
    'alert.youWin': 'You win!',
    'alert.push': 'Push (Tie).',
    'alert.dealerWins': 'Dealer wins.',
    'alert.notNotorious': 'You are not notorious enough!',
    'alert.abdicate': 'Are you sure you want to abdicate? You will lose your title and fortune.',
    'alert.lotteryWin': 'JACKPOT!!! YOU WON $10,000,000!',
    'alert.lotteryLoss': 'You lost the lottery. ($5)',
  },
  ar: {
    'app.title': 'PathBloom',
    'app.subtitle': 'محاكي الحياة',
    'common.close': 'إغلاق',
    'common.free': 'مجاني',
    'common.age': 'العمر',
    'main.continue': 'تابع الحياة',
    'main.loadOther': 'تحميل لعبة أخرى',
    'main.startNewLife': 'ابدأ حياة جديدة',
    'main.firstName': 'الاسم الأول',
    'main.lastName': 'اسم العائلة',
    'main.firstNamePlaceholder': 'اكتب الاسم الأول',
    'main.lastNamePlaceholder': 'اكتب اسم العائلة',
    'main.randomizeName': 'اسم عشوائي',
    'main.gender': 'الجنس',
    'main.male': 'ذكر',
    'main.female': 'أنثى',
    'main.country': 'الدولة',
    'main.mode': 'النمط',
    'main.normalLife': 'حياة عادية',
    'main.startLife': 'ابدأ الحياة',
    'main.fullNameAlert': 'اكتب الاسم الكامل من فضلك.',
    'hud.yearsOld': 'سنة',
    'hud.student': 'طالب',
    'hud.unemployed': 'بدون عمل',
    'hud.openMenu': 'فتح القائمة',
    'hud.debt': 'الدين',
    'stat.happiness': 'السعادة',
    'stat.health': 'الصحة',
    'stat.smarts': 'الذكاء',
    'stat.looks': 'المظهر',
    'stat.stress': 'التوتر',
    'stat.karma': 'الكارما',
    'stat.fame': 'الشهرة',
    'stat.notoriety': 'السمعة الإجرامية',
    'stat.energy': 'الطاقة',
    'action.occupation': 'العمل',
    'action.activities': 'الأنشطة',
    'action.relationships': 'العلاقات',
    'action.assets': 'الأملاك',
    'action.education': 'التعليم',
    'action.pets': 'الحيوانات',
    'action.travel': 'السفر',
    'travel.title': 'خريطة السفر',
    'travel.search': 'البحث عن المدن...',
    'travel.all': 'جميع المدن',
    'travel.domestic': 'محلية',
    'travel.international': 'دولية',
    'travel.flightCost': 'تكلفة الرحلة',
    'travel.costOfLiving': 'تكلفة المعيشة',
    'travel.culture': 'الثقافة',
    'travel.tech': 'التكنولوجيا',
    'travel.nature': 'الطبيعة',
    'travel.currentCity': 'المدينة الحالية',
    'travel.insufficientFunds': 'أموال غير كافية',
    'travel.travelHere': 'سافر إلى هنا',
    'travel.close': 'إغلاق',
    'travel.noResults': 'لم يتم العثور على مدن.',
    'action.ageUp': 'كبر سنة',
    'action.skip5': '+5 سنوات',
    'action.skip10': '+10 سنوات',
    'action.smartSkip5': 'تقدم ذكي +5',
    'action.smartSkip10': 'تقدم ذكي +10',
    'action.smartSkipHint': 'يتوقف عندما يحتاج قرار مهم إلى تدخلك.',
    'system.paused': 'إيقاف مؤقت',
    'system.resume': 'استئناف اللعب',
    'system.save': 'حفظ اللعبة',
    'system.godMode': 'وضع التحكم',
    'system.stats': 'إحصائيات الحياة',
    'system.familyTree': 'شجرة العائلة',
    'system.achievements': 'الإنجازات',
    'system.challenge': 'التحديات',
    'system.language': 'اللغة',
    'system.sound': 'الصوت',
    'system.sfxVolume': 'مستوى المؤثرات',
    'system.musicVolume': 'مستوى الموسيقى',
    'system.haptics': 'الاهتزاز',
    'system.exit': 'الخروج إلى القائمة',
    'system.exitConfirm': 'هل تريد الخروج؟ قد تفقد التقدم غير المحفوظ.',
    'toast.saved': 'تم حفظ اللعبة!',
    'toast.languageChanged': 'تم تغيير اللغة.',
    'toast.themeChanged': 'تم تحديث السمة.',
    'system.theme': 'السمة',
    'system.history': 'اتجاهات الحياة الحالية',
    'system.worldNews': 'أخبار العالم',
    'eventlog.empty': 'لا توجد أحداث بعد. ابدأ الحياة!',
    'activities.title': 'الأنشطة',
    'activities.more': 'أنشطة أخرى',
    'activities.unlocksAt': 'يُفتح في عمر',
    'activities.free': 'مجاني',
    'activities.cost': 'التكلفة',
    'activities.energy': 'الطاقة',
    'activities.age': 'العمر',
    'activities.risk': 'المخاطرة',
    'risk.low': 'مخاطرة منخفضة',
    'risk.medium': 'مخاطرة متوسطة',
    'risk.high': 'مخاطرة عالية',
    'risk.extreme': 'مخاطرة قصوى',
    'activities.royalty': 'الملكية',
    'activities.royaltyHint': 'سلطة وواجبات وفضائح.',
    'activities.social': 'التواصل الاجتماعي',
    'activities.socialHint': 'انشر واكبر واربح.',
    'activities.love': 'الحب',
    'activities.loveHint': 'مواعدة ورومانسية وارتباط.',
    'activities.music': 'الآلات الموسيقية',
    'activities.musicHint': 'تدرّب حتى تصل للشهرة.',
    'activities.doctor': 'الطبيب',
    'activities.doctorHint': 'عالج الصحة والمظهر.',
    'activities.politics': 'السياسة',
    'activities.politicsHint': 'انتخابات وقيادة.',
    'activities.crime': 'الجريمة',
    'activities.crimeHint': 'مخاطرة ونتائج كبيرة.',
    'activities.business': 'الأعمال',
    'activities.businessHint': 'ابدأ وأدر الشركات.',
    'activities.immigration': 'الهجرة',
    'activities.immigrationHint': 'انتقال وتأشيرات وجنسية.',
    'activities.casino': 'الكازينو',
    'activities.casinoHint': 'حظ ورهانات وتوتر.',
    'activities.hobbies': 'الهوايات',
    'activities.hobbiesHint': 'مهارات وفرح.',
    'activities.fitness': 'اللياقة',
    'activities.fitnessHint': 'تمرّن ونظّم أكلك وتعافى.',
    'activities.addiction': 'المواد',
    'activities.addictionHint': 'إغراء فيه خطر.',
    'activities.insurance': 'التأمين',
    'activities.insuranceHint': 'احم السيارة والبيت والحياة.',
    'activities.retirement': 'التقاعد',
    'activities.retirementHint': 'ادخر لسنواتك القادمة.',
    'activities.sports': 'رياضة الجامعة',
    'activities.sportsHint': 'جرّب وتمرّن واحتراف.',
    'activities.space': 'برنامج الفضاء',
    'activities.spaceHint': 'تدريب لمهمات خطيرة.',
    'activities.philanthropy': 'الأعمال الخيرية',
    'activities.philanthropyHint': 'تبرع وابنِ أثرا.',
    'activities.clubs': 'الأندية والجمعيات',
    'activities.clubsHint': 'انضم وتعرّف على الناس.',
    'activities.lawsuits': 'القضايا',
    'activities.lawsuitsHint': 'ارفع دعوى أو اخسر.',
    'activities.memories': 'الذكريات',
    'activities.memoriesHint': 'اكتب كبسولات زمنية.',
    'activity.gym': 'اذهب إلى النادي',
    'activity.meditate': 'تأمل',
    'activity.library': 'اذهب إلى المكتبة',
    'activity.club': 'اذهب للسهر',
    'activity.plastic_surgery': 'جراحة تجميل',
    'activity.find_date': 'ابحث عن موعد',
    'activity.commit_crime_burglary': 'اقتحم منزلا',
    'activity.commit_crime_robbery': 'اسرق بنكا',
    'activity.gamble_lottery': 'العب اليانصيب',
    'activity.gamble_horse': 'سباق الخيل',
    'activity.adopt_pet_dog': 'تبنّ كلبا',
    'activity.adopt_pet_cat': 'تبنّ قطة',
    'activity.travel_budget': 'سفر اقتصادي',
    'activity.travel_luxury': 'رحلة فاخرة',
    'activity.busk': 'عرض في الشارع',
    'activity.estate_planning': 'تخطيط الإرث',
    'activity.pickpocket_activity': 'نشل',
    'activity.court_case_activity': 'ارفع قضية',
    'decision.event': 'حدث',
    'recap.kicker': 'مسارك هذا العام',
    'recap.title': 'مراجعة العام',
    'recap.yearsTitle': 'مراجعة السنوات',
    'recap.fastForwardStopped': 'توقف التقدم السريع',
    'recap.yearsAdvanced': 'سنوات تم تجاوزها',
    'recap.finances': 'الأموال',
    'recap.income': 'الدخل',
    'recap.livingExpenses': 'تكاليف المعيشة',
    'recap.taxes': 'الضرائب',
    'recap.cashChange': 'تغير النقد',
    'recap.netWorthChange': 'تغير صافي الثروة',
    'recap.debtChange': 'تغير الدين',
    'recap.stats': 'تغير الإحصائيات',
    'recap.milestones': 'تغييرات مهمة',
    'recap.highlights': 'أبرز أحداث العام',
    'recap.continue': 'تابع حياتك',
    'recap.stop.death': 'انتهت الحياة',
    'recap.stop.decision': 'هناك قرار يحتاج إلى انتباهك',
    'recap.stop.legal': 'تغير وضعك القانوني',
    'recap.stop.career': 'تغير مسارك المهني',
    'recap.stop.education': 'حدث إنجاز تعليمي',
    'recap.stop.milestone': 'بلغت محطة مهمة في حياتك',
    'recap.stop.health': 'صحتك تحتاج إلى الانتباه',
    'recap.stop.ambition': 'تقدم طموحك',
    'recap.stop.relationship': 'تغيرت إحدى علاقاتك',
    'recap.change.relationshipNew': 'أصبح {name} جزءا من حياتك.',
    'recap.change.relationshipStatus': 'تغيرت حالة علاقة {name} إلى {status}.',
    'recap.change.relationshipStrained': 'أصبحت علاقتك مع {name} متوترة.',
    'recap.change.relationshipEnded': 'غادر {name} حياتك.',
    'recap.change.newJob': 'تغيرت مهنتك إلى {job}.',
    'recap.change.leftJob': 'تركت عملك في {job}.',
    'recap.change.degree': 'حصلت على شهادة {degree}.',
    'ambitions.title': 'طموحات الحياة',
    'ambitions.choose': 'اختر طموحا',
    'ambitions.subtitle': 'اختر ما ستمثله هذه الحياة.',
    'ambitions.permanentChoice': 'طموحك دائم في هذه الحياة، لذلك اختر بعناية.',
    'ambitions.milestones': 'مراحل',
    'ambitions.confirmQuestion': 'هل تلتزم بهذا المسار؟ لن تتمكن من تغييره لاحقا.',
    'ambitions.commit': 'التزام',
    'ambitions.yourPath': 'مسارك',
    'ambitions.complete': 'مكتمل',
    'ambitions.progress': 'تقدم الطموح',
    'ambitions.pathComplete': 'تحقق الطموح!',
    'ambitions.pathCompleteHint': 'حققت هذه الحياة شيئا استثنائيا.',
    'ambitions.done': 'مكتمل',
    'ambitions.age': 'العمر',
    'ambitions.reward': 'المكافأة',
    'ambitions.checkProgress': 'تحقق من التقدم',
    'ambitions.family_legacy.name': 'إرث العائلة',
    'ambitions.family_legacy.description': 'ابنِ عائلة محبة ومستقرة يستمر تأثيرها عبر الأجيال.',
    'ambitions.business_empire.name': 'إمبراطورية الأعمال',
    'ambitions.business_empire.description':
      'حوّل الانضباط والأفكار الجريئة إلى إمبراطورية تجارية راسخة.',
    'ambitions.creative_fame.name': 'الشهرة الإبداعية',
    'ambitions.creative_fame.description': 'أتقن موهبتك واعثر على جمهورك وأصبح أيقونة ثقافية.',
    'ambitions.public_service.name': 'الخدمة العامة',
    'ambitions.public_service.description': 'اكسب ثقة الناس وقُد بنزاهة من مجتمعك إلى وطنك.',
    'ambitions.criminal_mastermind.name': 'العقل المدبّر',
    'ambitions.criminal_mastermind.description':
      'اختر صعودا خطيرا في عالم الجريمة واستولِ على أعلى مراتبه.',
    'goals.title': 'أهداف الحياة',
    'goals.completed': 'مكتملة',
    'goals.done': 'تم',
    'goals.notYet': 'ليس بعد',
    'goal.growUp': 'اصل إلى عمر 18',
    'goal.healthyStart': 'حافظ على الصحة فوق 70',
    'goal.graduate': 'تخرج من المدرسة',
    'goal.firstJob': 'احصل على عمل',
    'goal.savings': 'ادخر 10,000 دولار',
    'goal.relationship': 'ابن علاقة قريبة',
    'goal.homeOwner': 'امتلك شيئا',
    'goal.legacy': 'ابدأ إرثا',
    'legacy.score': 'نقاط الإرث',
    'legacy.rank.seed': 'بذرة جديدة',
    'legacy.rank.growing': 'طريق ينمو',
    'legacy.rank.strong': 'جذور قوية',
    'legacy.rank.great': 'إرث عظيم',
    'legacy.rank.legend': 'إرث أسطوري',
    'onboarding.statsTitle': 'راقب إحصائياتك',
    'onboarding.statsBody':
      'السعادة والصحة والذكاء والمظهر والتوتر والكارما تؤثر في كل حدث في حياتك.',
    'onboarding.ageTitle': 'كبر سنة لتتقدم',
    'onboarding.ageBody':
      'اضغط كبر سنة عندما تكون جاهزا. كل عام قد يجلب مدرسة أو عملا أو علاقات أو مفاجآت أو مشاكل.',
    'onboarding.activitiesTitle': 'اختر الأنشطة بوعي',
    'onboarding.activitiesBody':
      'الأنشطة هي اختياراتك الأساسية: حب، لياقة، جريمة، أعمال، هوايات، سفر وأكثر.',
    'onboarding.moneyTitle': 'ابن المال والعلاقات',
    'onboarding.moneyBody':
      'العمل والأملاك والتعليم والعلاقات والأطفال كلها تصنع إرثك على المدى الطويل.',
    'onboarding.legacyTitle': 'نمِّ إرثك',
    'onboarding.legacyBody':
      'أهداف الحياة ونقاط الإرث تعطي كل حياة اتجاها. عند النهاية يمكنك البدء من جديد أو المتابعة كأحد الأبناء.',
    'onboarding.skip': 'تخطي',
    'onboarding.next': 'التالي',
    'onboarding.done': 'تم',
    'system.tutorial': 'الشرح',
    'system.resetTutorial': 'إعادة تعيين الشرح',
    'gameover.rip': 'انتهت الحياة',
    'gameover.diedAt': 'توفي/ت في عمر',
    'gameover.netWorth': 'صافي الثروة',
    'gameover.career': 'المهنة',
    'gameover.education': 'التعليم',
    'gameover.children': 'الأطفال',
    'gameover.partners': 'الشركاء',
    'gameover.marriages': 'الزواجات',
    'gameover.degrees': 'الشهادات',
    'gameover.events': 'أحداث الحياة',
    'gameover.age': 'العمر',
    'gameover.lifeGoals': 'أهداف الحياة المكتملة',
    'gameover.none': 'لا شيء',
    'gameover.startNewLife': 'ابدأ حياة جديدة',
    'gameover.continueAsChild': 'تابع كابن',
    'gameover.achievements': 'الإنجازات',
    'gameover.lifetimeStats': 'إحصائيات العمر',
    'gameover.livesLived': 'الحيات المعاشة',
    'gameover.totalYears': 'مجموع السنوات',
    'gameover.totalChildren': 'مجموع الأطفال',
    'gameover.careersHad': 'الوظائف السابقة',
    'common.cancel': 'إلغاء',
    'common.on': 'تشغيل',
    'common.off': 'إيقاف',
    // Avatar Creator
    'avatar.title': 'إنشاء شخصيتك',
    'avatar.creator': 'إنشاء شخصيتك',
    'avatar.appearance': 'المظهر',
    'avatar.style': 'نمط الزي',
    'avatar.accessories': 'الإكسسوارات',
    'avatar.confirm': 'ابدأ الحياة',
    'avatar.randomize': 'عشوائي',
    'avatar.skinTone': 'لون البشرة',
    'avatar.hairStyle': 'تسريحة الشعر',
    'avatar.hairColor': 'لون الشعر',
    'avatar.eyeColor': 'لون العين',
    'avatar.clothing': 'نمط الملابس',
    'avatar.clothingColor': 'لون الملبس',
    'avatar.accessory': 'إكسسوار',
    'hair.short': 'قصير',
    'hair.long': 'طويل',
    'hair.curly': 'مجعد',
    'hair.bald': 'أصلع',
    'hair.buzz': 'حلاقة بज़',
    'hair.ponytail': 'ذيل حصان',
    'clothing.casual': 'كاجوال',
    'clothing.formal': 'رسمي',
    'clothing.sporty': 'رياضي',
    'clothing.bohemian': 'بوهيمي',
    'accessories.none': 'لا شيء',
    'accessories.glasses': 'نظارات',
    'accessories.sunglasses': 'نظارات شمسية',
    'accessories.earrings': 'أقراط',
    'accessories.hat': 'قبعة',
    'accessories.beard': 'لحية',
    // Stats History
    'stats.history': 'سجل الإحصائيات',
    'stats.singleView': 'عرض مفرد',
    'stats.gridView': 'عرض شبكي',
    'stats.noData': 'لا يوجد سجل إحصائيات بعد. كبّر السن لبدء التسجيل!',
    // Challenge Mode - New Challenges
    'challenge.global_explorer': 'المستكشف العالمي',
    'challenge.global_explorer_desc': 'زر 15 دولة وتعلم 5 لغات بحلول سن 60',
    'challenge.philanthropist': 'المحسن',
    'challenge.philanthropist_desc': 'تبرع بـ 5 ملايين دولار وأنشئ 3 مؤسسات بحلول سن 65',
    'challenge.sports_legend': 'أسطورة رياضية',
    'challenge.sports_legend_desc': 'اربح 3 بطولات وكن أفضل لاعب 5 مرات بحلول سن 40',
    'challenge.political_dynasty': 'سلالة سياسية',
    'challenge.political_dynasty_desc': 'كن رئيس الدولة واجعل ابنك رئيس الدولة',
    'challenge.scientist_extraordinaire': 'عالم استثنائي',
    'challenge.scientist_extraordinaire_desc':
      'اربح جائزة نوبل وسجل 10 براءات اختراع واحصل على دكتوراه بحلول سن 50',
    // Challenge requirements
    'challenge.countries_visited': 'البلدان المزارة',
    'challenge.languages_known': 'اللغات المعروفة',
    'challenge.donated_money': 'المال المتبرع به',
    'challenge.foundations': 'المؤسسات الخيرية',
    'challenge.championships': 'البطولات',
    'challenge.mvp_awards': 'جوائز أفضل لاعب',
    'challenge.head_of_state': 'رئيس الدولة',
    'challenge.child_head_of_state': 'ابن رئيس الدولة',
    'challenge.nobel_prize': 'جائزة نوبل',
    'challenge.patents': 'براءات الاختراع',
    'challenge.degree': 'الشهادة',
    'challenge.phd': 'دكتوراه',

    // Politics
    'politics.offices': 'المناصب السياسية',
    'politics.run': 'ترشح للمنصب',
    'politics.campaign': 'حملة انتخابية',
    'politics.approval': 'نسبة الموافقة',
    'politics.funds': 'الأموال',
    'politics.weeksLeft': 'أسبوع حتى الانتخاب',
    'politics.actions': 'إجراءات الحملة',
    'politics.cost': 'التكلفة',
    'politics.impact': 'التأثير',
    'politics.term': 'المدة',
    'politics.salary': 'الراتب',
    'politics.campaignCost': 'تكلفة الحملة',
    'politics.years': 'سنوات',
    'politics.reElect': 'فزت بإعادة الانتخاب!',
    'politics.lostElection': 'خسرت إعادة الانتخاب.',

    // Prison
    'prison.title': 'سجن الولاية',
    'prison.sentence': 'المدة المتبقية',
    'prison.years': 'سنوات',
    'prison.respect': 'الاحترام',
    'prison.gang': 'العصابة',
    'prison.affiliated': 'منتسب',
    'prison.none': 'لا يوجد',
    'prison.yard': 'ساحة السجن',
    'prison.workout': 'تمارين في الساحة',
    'prison.library': 'مكتبة السجن',
    'prison.gangAction': 'تفاعل مع العصابة',
    'prison.legal': 'قانوني وغير قانوني',
    'prison.appeal': 'استئناف الحكم (٥,٠٠٠$)',
    'prison.riot': 'إثارة شغب',
    'prison.escape': 'اهرب!',

    // Stats
    'stats.title': 'إحصائيات العمر',
    'stats.career': 'ملخص المهنة',
    'stats.livesLived': 'الحيات التي عشتها',
    'stats.totalYears': 'إجمالي السنوات',
    'stats.moneyEarned': 'الأموال المكتسبة',
    'stats.jobsHeld': 'الوظائف التي شغلتها',
    'stats.hallOfFame': 'قاعة المشاهير',
    'stats.richestLife': 'أغنى حياة',
    'stats.longestLife': 'أطول حياة',
    'stats.mostChildren': 'أكثر أطفال',
    'stats.mostFamous': 'الأكثر شهرة',
    'stats.mostCommonJobs': 'الوظائف الأكثر شيوعاً',
    'stats.lifeStats': 'إحصائيات الحياة',
    'stats.totalChildren': 'مجموع الأطفال',
    'stats.marriages': 'الزواج',
    'stats.assetsOwned': 'الأصول المملوكة',
    'stats.degreesEarned': 'الشهادات المكتسبة',
    'stats.noneYet': 'لا يوجد بعد',
    'stats.yearsOld': 'سنة',
    'stats.fame': 'شهرة',
    'stats.time': 'مرة',
    'stats.times': 'مرات',
    'stats.children': 'أطفال',

    // Occupation
    'occupation.title': 'المهنة',
    'occupation.military': 'الخدمة العسكرية',
    'occupation.army': 'الجيش',
    'occupation.navy': 'البحرية',
    'occupation.airForce': 'القوات الجوية',
    'occupation.marines': 'مشاة البحرية',
    'occupation.enlist': 'التجنيد كجندي',
    'occupation.officer': 'ضابط (يشترط شهادة)',
    'occupation.career': 'المسار المهني',
    'occupation.salary': 'الراتب',
    'occupation.years': 'سنوات',
    'occupation.resign': 'استقالة',
    'occupation.deploy': 'انتشار',
    'occupation.apply': 'تقديم',
    'occupation.locked': 'مغلق',
    'occupation.requires': 'يتطلب',
    'occupation.smarts': 'الذكاء',
    'occupation.looks': 'المظهر',
    'occupation.health': 'الصحة',
    'occupation.degree': 'الشهادة',
    'occupation.skill': 'المهارة',

    // Education
    'education.title': 'التعليم',
    'education.study': 'ادرس بجد',
    'education.dropOut': 'انسحب',
    'education.school': 'مدرسة',
    'education.university': 'جامعة',
    'education.gradSchool': 'دراسات عليا',
    'education.completed': 'مكتمل',
    'education.apply': 'تقديم',
    'education.year': 'سنة',
    'education.grades': 'الدرجات',
    'education.requires': 'يتطلب',

    // Save / Load
    'saveload.title': 'تحميل اللعبة',
    'saveload.noSaves': 'لا توجد ألعاب محفوظة.',
    'saveload.delete': 'حذف',
    'saveload.newLife': 'ابدأ حياة جديدة',
    'saveload.deleteConfirm': 'هل أنت متأكد من حذف هذا الحفظ؟ لا يمكن التراجع عن هذا.',

    // Achievements
    'achievements.title': 'خزانة الجوائز',
    'achievements.close': 'إغلاق',
    'achievements.unlocked': 'تم فتحه',

    // Relationships
    'relationships.title': 'العلاقات',
    'relationships.spendTime': 'قضاء وقت',
    'relationships.compliment': 'مجاملة',
    'dashboard.title': 'لوحة العلاقات',
    'dashboard.alive': 'على قيد الحياة',
    'dashboard.deceased': 'متوفى',
    'dashboard.avgHealth': 'متوسط الصحة',
    'dashboard.conflicts': 'خلافات',
    'dashboard.noRelationships': 'لا توجد علاقات بعد. اذهب لتكوين بعض الصداقات!',
    'dashboard.allRelationships': 'جميع العلاقات',
    'dashboard.openManager': 'افتح مدير العلاقات الكامل',
    'dashboard.conflictTooltip': 'خلاف لم يُحل',
    'dashboard.promiseTooltip': 'وعد قيد الانتظار',
    'dashboard.financeTooltip': 'شؤون مالية مشتركة',
    'relationships.giveGift': 'إهداء هدية',
    'relationships.insult': 'إهانة',
    'relationships.makeLove': 'علاقة حميمية (١٨+)',
    'relationships.propose': 'اقتراح زواج (١٨+)',
    'relationships.planWedding': 'تخطيط الزفاف',
    'relationships.cheat': 'خيانة',
    'relationships.divorce': 'طلاق',
    'relationships.breakUp': 'انفصال',
    'relationships.marryMe': 'هل تتزوجني؟',
    'relationships.ringCost': 'اختر تكلفة الخاتم',
    'relationships.plasticRing': 'خاتم بلاستيك (١٠٠$)',
    'relationships.vintageRing': 'خاتم عتيق تيفاني (٥٠,٠٠٠$)',
    'relationships.weddingBudget': 'ميزانية الزفاف',
    'relationships.courthouse': 'محكمة (١٠٠$)',
    'relationships.castle': 'قلعة (١٠٠,٠٠٠$)',
    'relationships.prenup': 'اتفاقية ما قبل الزواج؟',
    'relationships.prenupDesc': 'يحمي الأصول، لكنه قد يسيء للزوج.',
    'relationships.confirm': 'تأكيد',
    'relationships.cancel': 'إلغاء',
    'relationships.back': 'رجوع',
    'relationships.noRelationships': 'لا توجد علاقات.',
    'relationships.tooYoung': 'أنت صغير جداً على هذا!',
    'relationships.tooYoungMarry': 'أنت صغير جداً على الزواج!',
    'relationships.divorceConfirm': 'هل أنت متأكد من الطلاق؟ ستفقد نصف أموالك.',

    // Immigration
    'immigration.citizenships': 'الجنسيات',
    'immigration.applyCitizenship': 'تقدم بطلب للحصول على الجنسية',
    'immigration.countries': 'الدول',
    'immigration.visa': 'تأشيرة',
    'immigration.difficulty': 'الصعوبة',
    'immigration.here': 'هنا',
    'immigration.move': 'انتقال',
    'immigration.ageReq': 'يجب أن يكون عمرك ١٨+',
    'immigration.noFunds': 'ليس لديك ما يكفي من المال.',

    // Love
    'love.title': 'ابحث عن الحب',
    'love.datingApp': 'تطبيق مواعدة (١٠٠$)',
    'love.datingAppDesc': 'تصفح الملفات الشخصية واختر شريكك.',
    'love.blindDate': 'موعد أعمى (مجاني)',
    'love.blindDateDesc': 'دع القدر يقرر! مخاطرة بمواعدة غرباء.',
    'love.askOut': 'اطلب موعداً',
    'love.back': 'رجوع',

    // Relationships extra
    'relationships.relationship': 'العلاقة',
    'education.of': 'من',
    'education.years': 'سنوات',

    // Alert dialogs
    'alert.broke': 'ليس لديك ما يكفي من المال!',
    'alert.busted': 'خسرت! انتهت اللعبة.',
    'alert.dealerBusts': 'التاجر خسر! أنت تربح!',
    'alert.youWin': 'أنت تربح!',
    'alert.push': 'تعادل.',
    'alert.dealerWins': 'التاجر يربح.',
    'alert.notNotorious': 'سمعتك السيئة ليست كافية!',
    'alert.abdicate': 'هل أنت متأكد من التنازل عن العرش؟ ستفقد لقبك وثروتك.',
    'alert.lotteryWin': 'الجائزة الكبرى!!! ربحت ١٠,٠٠٠,٠٠٠$!',
    'alert.lotteryLoss': 'خسرت اليانصيب. (٥$)',
  },
};

export function getStoredLanguage() {
  if (typeof localStorage === 'undefined') {
    return 'en';
  }
  try {
    const stored = localStorage.getItem(LANGUAGE_KEY) || localStorage.getItem(LEGACY_LANGUAGE_KEY);
    return LANGUAGES.some(language => language.id === stored) ? stored : 'en';
  } catch {
    return 'en';
  }
}

export function setStoredLanguage(languageId) {
  if (typeof localStorage === 'undefined') {
    return;
  }
  if (!LANGUAGES.some(language => language.id === languageId)) {
    return;
  }
  try {
    localStorage.setItem(LANGUAGE_KEY, languageId);
    localStorage.removeItem(LEGACY_LANGUAGE_KEY);
  } catch {
    /* storage is optional */
  }
}

export function getLanguageMeta(languageId) {
  return LANGUAGES.find(language => language.id === languageId) || LANGUAGES[0];
}

export function translate(languageId, key, fallback = key) {
  return TRANSLATIONS[languageId]?.[key] || TRANSLATIONS.en[key] || fallback;
}

const AR_COUNTRIES = {
  'United States': 'الولايات المتحدة',
  'United Kingdom': 'المملكة المتحدة',
  Canada: 'كندا',
  Australia: 'أستراليا',
  Japan: 'اليابان',
  France: 'فرنسا',
  Germany: 'ألمانيا',
  Italy: 'إيطاليا',
  Brazil: 'البرازيل',
  China: 'الصين',
  India: 'الهند',
  Russia: 'روسيا',
  Mexico: 'المكسيك',
  Spain: 'إسبانيا',
  'South Korea': 'كوريا الجنوبية',
};

const AR_RELATIONSHIP_TYPES = {
  Parent: 'والد',
  Father: 'والد',
  Mother: 'والدة',
  Sibling: 'شقيق',
  Child: 'طفل',
  Grandchild: 'حفيد',
  Partner: 'شريك',
  Fiance: 'خطيب',
  Fiancé: 'خطيب',
  Spouse: 'زوج',
  Friend: 'صديق',
  Coworker: 'زميل',
};

const AR_AMBITION_NAMES = {
  'Family Legacy': 'إرث العائلة',
  'Business Empire': 'إمبراطورية الأعمال',
  'Creative Fame': 'الشهرة الإبداعية',
  'Public Service': 'الخدمة العامة',
  'Criminal Mastermind': 'العقل المدبّر',
};

const AR_AMBITION_STAGES = {
  'Trusted Circle': 'دائرة الثقة',
  'Life Partner': 'شريك الحياة',
  'Next Generation': 'الجيل القادم',
  'Strong Roots': 'جذور راسخة',
  'Lasting Legacy': 'إرث خالد',
  'Seed Capital': 'رأس المال الأولي',
  Founder: 'المؤسس',
  'Growing Team': 'فريق متنامٍ',
  'Market Leader': 'رائد السوق',
  'Ring the Bell': 'قرع جرس البورصة',
  'Business Legend': 'أسطورة الأعمال',
  'Find Your Voice': 'اكتشف صوتك',
  'Professional Break': 'الفرصة الاحترافية',
  'Rising Star': 'نجم صاعد',
  'Household Name': 'اسم مشهور',
  'Cultural Icon': 'أيقونة ثقافية',
  'Community Spirit': 'روح المجتمع',
  'Give Back': 'رد الجميل',
  'Win a Mandate': 'افز بتفويض',
  'Trusted Leader': 'قائد موثوق',
  'National Leader': 'قائد وطني',
  'First Steps': 'الخطوات الأولى',
  'Known Operator': 'عنصر معروف',
  'Made Member': 'عضو معتمد',
  'Underworld Boss': 'زعيم العالم السفلي',
  Mastermind: 'العقل المدبّر',
};

// Stable, save-safe message keys are the primary localization path for generated
// events. English text remains on the event objects as a compatibility fallback
// for older saves and callers that have not migrated to message metadata yet.
const GAME_MESSAGES = {
  // Political offices and campaign actions
  'politics.office.school_board': { en: 'School Board Director', ar: 'مدير مجلس التعليم' },
  'politics.office.city_council': { en: 'City Council Member', ar: 'عضو المجلس البلدي' },
  'politics.office.mayor': { en: 'Mayor', ar: 'عمدة' },
  'politics.office.congress': { en: 'Member of Congress', ar: 'عضو في الكونغرس' },
  'politics.office.senate': { en: 'Senator', ar: 'عضو مجلس الشيوخ' },
  'politics.office.governor': { en: 'Governor', ar: 'حاكم الولاية' },
  'politics.office.president': { en: 'President', ar: 'رئيس الدولة' },
  'politics.action.rally': { en: 'Hold a Rally', ar: 'نظّم تجمعا انتخابيا' },
  'politics.action.fundraise': { en: 'Fundraising Event', ar: 'فعالية لجمع التبرعات' },
  'politics.action.interview': { en: 'TV Interview', ar: 'مقابلة تلفزيونية' },
  'politics.action.debate': { en: 'Participate in Debate', ar: 'شارك في مناظرة' },
  'politics.action.town_hall': { en: 'Town Hall Meeting', ar: 'لقاء مفتوح مع المواطنين' },
  'politics.action.ad_campaign': { en: 'Run TV Ads', ar: 'أطلق إعلانات تلفزيونية' },
  'politics.action.attack': { en: 'Attack Opponent', ar: 'هاجم الخصم' },
  'politics.action.bribe': { en: 'Bribe Officials', ar: 'رشوة المسؤولين' },
  'politics.action.scandal_leak': { en: 'Leak Scandal', ar: 'سرّب فضيحة' },

  // Events during a political term
  'politics.term.bipartisan_bill': {
    en: '[Politics] You passed a bipartisan bill! Your approval ratings rise.',
    ar: '[السياسة] مرّرت قانونا بتوافق الحزبين! ارتفعت شعبيتك.',
  },
  'politics.term.administration_scandal': {
    en: '[Politics] A scandal erupts in your administration. Your staff takes the blame.',
    ar: '[السياسة] اندلعت فضيحة في إدارتك، وتحمّل فريقك المسؤولية.',
  },
  'politics.term.economic_boom': {
    en: '[Politics] The economy is booming under your leadership! Citizens are grateful.',
    ar: '[السياسة] يزدهر الاقتصاد تحت قيادتك! المواطنون ممتنون لك.',
  },
  'politics.term.opponent_rumors': {
    en: '[Politics] Your opponent spreads rumors about you. You lose some support.',
    ar: '[السياسة] نشر خصمك شائعات عنك، فخسرت بعض التأييد.',
  },
  'politics.term.politician_of_year': {
    en: '[Politics] You were voted "Politician of the Year"! Your fame grows.',
    ar: '[السياسة] اختيرت «سياسي العام»! ازدادت شهرتك.',
  },
  'politics.term.disaster_response': {
    en: '[Politics] A natural disaster struck. Your response was widely praised.',
    ar: '[السياسة] وقعت كارثة طبيعية، وحظيت استجابتك بإشادة واسعة.',
  },
  'politics.term.policy_protest': {
    en: '[Politics] A protest against your policies has gained momentum.',
    ar: '[السياسة] اتسعت الاحتجاجات المعارضة لسياساتك.',
  },
  'politics.term.tax_cut_spending': {
    en: '[Politics] You cut taxes and increased spending. The public loves it!',
    ar: '[السياسة] خفّضت الضرائب وزدت الإنفاق، فأحب الجمهور القرار!',
  },
  'politics.term.corruption_investigation': {
    en: '[Politics] A corruption investigation has been opened. Your lawyers are handling it.',
    ar: '[السياسة] فُتح تحقيق في قضية فساد، ويتولى محاموك الأمر.',
  },
  'politics.term.convention_speech': {
    en: '[Politics] Your speech at the national convention moved the audience to tears.',
    ar: '[السياسة] أثّر خطابك في المؤتمر الوطني في الجمهور حتى البكاء.',
  },
  'politics.term.re_elected': {
    en: '[Politics] You won re-election! Your term continues.',
    ar: '[السياسة] فزت بإعادة الانتخاب! تستمر ولايتك.',
  },
  'politics.term.lost_re_election': {
    en: '[Politics] You lost re-election as {office}. Back to civilian life.',
    ar: '[السياسة] خسرت إعادة الانتخاب لمنصب {office}. عدت إلى حياتك المدنية.',
  },
  'politics.campaign.need_funds': {
    en: 'You need ${amount} to run for {office}.',
    ar: 'تحتاج إلى {amount} دولار للترشح لمنصب {office}.',
  },
  'politics.campaign.minimum_age': {
    en: 'You must be at least {age} to run for {office}.',
    ar: 'يجب ألا يقل عمرك عن {age} سنة للترشح لمنصب {office}.',
  },
  'politics.campaign.announced': {
    en: 'You announced your candidacy for {office}! Campaign started.',
    ar: 'أعلنت ترشحك لمنصب {office}! بدأت الحملة الانتخابية.',
  },
  'politics.campaign.fundraiser': {
    en: 'You held a fundraiser and raised ${amount}!',
    ar: 'نظمت فعالية لجمع التبرعات وجمعت {amount} دولار!',
  },
  'politics.campaign.insufficient_funds': {
    en: 'Your campaign is broke! Fundraise more.',
    ar: 'نفدت أموال حملتك! اجمع المزيد من التبرعات.',
  },
  'politics.campaign.action_success': {
    en: 'Campaign: {action} was a success! Polls +{impact}%',
    ar: 'الحملة: نجح إجراء «{action}»! الاستطلاعات +{impact}٪',
  },
  'politics.campaign.action_backfire': {
    en: 'Campaign: {action} backfired! Polls -{impact}%',
    ar: 'الحملة: جاء إجراء «{action}» بنتيجة عكسية! الاستطلاعات -{impact}٪',
  },
  'politics.election.won': {
    en: 'ELECTION RESULTS: YOU WON! You are now the {office}!',
    ar: 'نتائج الانتخابات: لقد فزت! أصبحت الآن {office}!',
  },
  'politics.election.lost': {
    en: 'ELECTION RESULTS: You lost the election for {office}.',
    ar: 'نتائج الانتخابات: خسرت الانتخابات لمنصب {office}.',
  },

  // Life ambitions
  'ambitions.event.selected': {
    en: 'You chose the {path} ambition for this life.',
    ar: 'اخترت طموح «{pathAr}» لهذه الحياة.',
  },
  'ambitions.event.milestone': {
    en: 'Ambition milestone completed: {stage}.',
    ar: 'اكتملت مرحلة الطموح: {stageAr}.',
  },

  // World events
  'worldEvent.global_recession.name': { en: 'Global Recession', ar: 'ركود عالمي' },
  'worldEvent.global_recession.description': {
    en: 'Markets crash worldwide. Jobs are harder to find and salaries shrink.',
    ar: 'انهارت الأسواق حول العالم، وأصبح العثور على عمل أصعب وتراجعت الرواتب.',
  },
  'worldEvent.tech_boom.name': { en: 'Tech Boom', ar: 'طفرة تقنية' },
  'worldEvent.tech_boom.description': {
    en: 'Technology sector explodes. New startups emerge and tech salaries soar.',
    ar: 'يشهد قطاع التقنية نموا هائلا، فتظهر شركات ناشئة وترتفع الرواتب التقنية.',
  },
  'worldEvent.real_estate_bubble.name': { en: 'Real Estate Bubble', ar: 'فقاعة عقارية' },
  'worldEvent.real_estate_bubble.description': {
    en: 'Property values skyrocket. Great time to sell, terrible time to buy.',
    ar: 'قفزت أسعار العقارات؛ إنه وقت ممتاز للبيع وسيئ جدا للشراء.',
  },
  'worldEvent.pandemic.name': { en: 'Global Pandemic', ar: 'جائحة عالمية' },
  'worldEvent.pandemic.description': {
    en: 'A deadly virus spreads across borders. Quarantines and lockdowns everywhere.',
    ar: 'ينتشر فيروس خطير عبر الحدود، وتُفرض إجراءات الحجر والإغلاق في كل مكان.',
  },
  'worldEvent.climate_disaster.name': { en: 'Climate Disaster', ar: 'كارثة مناخية' },
  'worldEvent.climate_disaster.description': {
    en: 'Extreme weather events devastate regions worldwide.',
    ar: 'تدمّر ظواهر جوية قاسية مناطق متعددة حول العالم.',
  },
  'worldEvent.cultural_renaissance.name': { en: 'Cultural Renaissance', ar: 'نهضة ثقافية' },
  'worldEvent.cultural_renaissance.description': {
    en: 'Arts, music, and film flourish. Creativity is at an all-time high.',
    ar: 'تزدهر الفنون والموسيقى والسينما، ويبلغ الإبداع ذروته.',
  },
  'worldEvent.sports_madness.name': { en: 'Sports Fever', ar: 'حمّى الرياضة' },
  'worldEvent.sports_madness.description': {
    en: 'The world is captivated by major sporting events. Athletic careers get a spotlight.',
    ar: 'تستحوذ البطولات الكبرى على اهتمام العالم، وتتألق المسارات الرياضية.',
  },
  'worldEvent.political_upheaval.name': { en: 'Political Upheaval', ar: 'اضطرابات سياسية' },
  'worldEvent.political_upheaval.description': {
    en: 'Governments fall and protests erupt. Political careers are made and broken.',
    ar: 'تسقط حكومات وتندلع احتجاجات، فتُبنى مسارات سياسية وتنهار أخرى.',
  },
  'worldEvent.gold_rush.name': { en: 'Modern Gold Rush', ar: 'حمّى ذهب حديثة' },
  'worldEvent.gold_rush.description': {
    en: 'Cryptocurrency and commodity prices explode. Early investors get rich.',
    ar: 'تقفز أسعار العملات الرقمية والسلع، ويحقق المستثمرون الأوائل ثروات.',
  },
  'worldEvent.space_race.name': { en: 'New Space Race', ar: 'سباق فضاء جديد' },
  'worldEvent.space_race.description': {
    en: 'Nations and corporations compete for space exploration. STEM careers thrive.',
    ar: 'تتنافس الدول والشركات في استكشاف الفضاء، وتزدهر المهن العلمية والتقنية.',
  },
  'worldEvent.education_reform.name': { en: 'Education Reform', ar: 'إصلاح التعليم' },
  'worldEvent.education_reform.description': {
    en: 'Governments invest heavily in education. Scholarships and grants abound.',
    ar: 'تستثمر الحكومات بكثافة في التعليم، فتكثر المنح الدراسية والمساعدات.',
  },
  'worldEvent.crime_wave.name': { en: 'Crime Wave', ar: 'موجة جريمة' },
  'worldEvent.crime_wave.description': {
    en: 'Organized crime and street violence spike. Law enforcement is stretched thin.',
    ar: 'تتصاعد الجريمة المنظمة وأعمال العنف، وتتعرض أجهزة الأمن لضغط شديد.',
  },
  'worldEvent.peace_treaty.name': { en: 'Global Peace Treaty', ar: 'معاهدة سلام عالمية' },
  'worldEvent.peace_treaty.description': {
    en: 'Historic peace agreements are signed. Military tensions ease worldwide.',
    ar: 'تُوقّع اتفاقيات سلام تاريخية، وتخف التوترات العسكرية عالميا.',
  },
  'worldEvent.baby_boom.name': { en: 'Baby Boom', ar: 'طفرة مواليد' },
  'worldEvent.baby_boom.description': {
    en: 'Birth rates surge. Families are celebrated and child benefits increase.',
    ar: 'ترتفع معدلات الولادة، ويزداد الاهتمام بالعائلات ودعم الأطفال.',
  },
  'worldEvent.immigration_wave.name': {
    en: 'Open Borders Initiative',
    ar: 'مبادرة الحدود المفتوحة',
  },
  'worldEvent.immigration_wave.description': {
    en: 'Countries ease immigration policies. Moving abroad has never been easier.',
    ar: 'تخفف الدول سياسات الهجرة، فيصبح الانتقال إلى الخارج أسهل من أي وقت.',
  },
  'worldEvent.cyber_attack.name': { en: 'Massive Cyber Attack', ar: 'هجوم إلكتروني واسع' },
  'worldEvent.cyber_attack.description': {
    en: 'Critical infrastructure is compromised. Digital security is paramount.',
    ar: 'تتعرض بنى تحتية حيوية للاختراق، ويصبح الأمن الرقمي أولوية قصوى.',
  },
  'worldEvent.green_revolution.name': { en: 'Green Revolution', ar: 'ثورة خضراء' },
  'worldEvent.green_revolution.description': {
    en: 'Renewable energy and sustainability drive the economy.',
    ar: 'تقود الطاقة المتجددة والاستدامة عجلة الاقتصاد.',
  },
  'worldEvent.olympic_games.name': { en: 'Olympic Games', ar: 'الألعاب الأولمبية' },
  'worldEvent.olympic_games.description': {
    en: 'The Olympics unite the world. Athletic achievements are celebrated globally.',
    ar: 'توحّد الألعاب الأولمبية العالم، ويُحتفى بالإنجازات الرياضية عالميا.',
  },
  'worldEvent.medieval_festival.name': {
    en: 'Renaissance Fair Craze',
    ar: 'حمّى مهرجانات عصر النهضة',
  },
  'worldEvent.medieval_festival.description': {
    en: 'Historical reenactments and medieval fairs are all the rage.',
    ar: 'تنتشر عروض إعادة تمثيل التاريخ ومهرجانات العصور الوسطى.',
  },
  'worldEvent.housing_crisis.name': { en: 'Housing Crisis', ar: 'أزمة سكن' },
  'worldEvent.housing_crisis.description': {
    en: 'Affordable housing disappears. Rent and mortgage payments skyrocket.',
    ar: 'يختفي السكن الميسور وترتفع الإيجارات وأقساط الرهن بقوة.',
  },

  // Seasonal events and holidays
  'season.spring.spring_bloom': {
    en: '[Spring] Spring flowers are blooming everywhere. The world feels fresh.',
    ar: '[الربيع] تتفتح أزهار الربيع في كل مكان ويبدو العالم متجددا.',
  },
  'season.spring.spring_allergies': {
    en: '[Spring] Your seasonal allergies are acting up. Pollen is everywhere.',
    ar: '[الربيع] اشتدت حساسيتك الموسمية وحبوب اللقاح في كل مكان.',
  },
  'season.spring.spring_rain': {
    en: '[Spring] It has been raining for a week straight. You feel cooped up.',
    ar: '[الربيع] لم يتوقف المطر منذ أسبوع وتشعر بأنك حبيس المنزل.',
  },
  'season.spring.spring_garden': {
    en: '[Spring] You plant a small garden. Watching things grow is satisfying.',
    ar: '[الربيع] زرعت حديقة صغيرة، ومشاهدة النباتات تنمو تمنحك الرضا.',
  },
  'season.summer.summer_heatwave': {
    en: '[Summer] A brutal heatwave has hit. You can barely function.',
    ar: '[الصيف] ضربت موجة حر قاسية وبالكاد تستطيع متابعة يومك.',
  },
  'season.summer.summer_vacation': {
    en: '[Summer] You take a lovely summer vacation. The memories will last a lifetime.',
    ar: '[الصيف] قضيت عطلة صيفية رائعة ستبقى ذكرياتها طوال العمر.',
  },
  'season.summer.summer_fun': {
    en: '[Summer] Summer is in full swing! You feel full of energy.',
    ar: '[الصيف] بلغ الصيف أوجه وتشعر بطاقة كبيرة.',
  },
  'season.summer.summer_storm': {
    en: '[Summer] A violent thunderstorm knocks out the power for days.',
    ar: '[الصيف] قطعت عاصفة رعدية عنيفة الكهرباء لعدة أيام.',
  },
  'season.fall.fall_harvest': {
    en: '[Fall] The harvest season brings abundance and cozy feelings.',
    ar: '[الخريف] يجلب موسم الحصاد الوفرة وأجواء دافئة.',
  },
  'season.fall.fall_flu': {
    en: '[Fall] The autumn flu is going around. You caught it.',
    ar: '[الخريف] تنتشر إنفلونزا الخريف وقد أُصبت بها.',
  },
  'season.fall.fall_leaves': {
    en: '[Fall] The leaves have turned beautiful colors. You go for a scenic walk.',
    ar: '[الخريف] تلونت الأوراق بألوان جميلة فخرجت في نزهة بين المناظر الخلابة.',
  },
  'season.fall.fall_gloom': {
    en: '[Fall] The grey skies and shorter days are bringing you down.',
    ar: '[الخريف] تؤثر فيك السماء الرمادية وقِصر النهار.',
  },
  'season.winter.winter_blizzard': {
    en: '[Winter] A massive blizzard has stranded everyone indoors.',
    ar: '[الشتاء] أجبرت عاصفة ثلجية هائلة الجميع على البقاء في منازلهم.',
  },
  'season.winter.winter_cozy': {
    en: '[Winter] You spend a cozy day by the fire with hot cocoa.',
    ar: '[الشتاء] قضيت يوما دافئا قرب النار مع كوب كاكاو ساخن.',
  },
  'season.winter.winter_holiday': {
    en: '[Winter] The holiday season fills you with warmth and joy.',
    ar: '[الشتاء] ملأك موسم الأعياد بالدفء والفرح.',
  },
  'season.winter.winter_sadness': {
    en: '[Winter] The cold, dark winter is making you feel lonely.',
    ar: '[الشتاء] يجعلك الشتاء البارد والمظلم تشعر بالوحدة.',
  },
  'holiday.new_year': {
    en: "🎉 It's New Year's Day! A time for fresh starts.",
    ar: '🎉 إنه يوم رأس السنة! وقت لبدايات جديدة.',
  },
  'holiday.birthday': { en: "🎂 It's your {age} birthday!", ar: '🎂 إنه عيد ميلادك رقم {age}!' },
  'holiday.summer_solstice': {
    en: '🎉 The summer solstice — the longest day of the year.',
    ar: '🎉 حل الانقلاب الصيفي، أطول نهار في السنة.',
  },
  'holiday.winter_solstice': {
    en: '🎉 The winter solstice — the longest night of the year.',
    ar: '🎉 حل الانقلاب الشتوي، أطول ليلة في السنة.',
  },
  'holiday.tax_day': {
    en: '🎉 Tax season is here. What a drag.',
    ar: '🎉 بدأ موسم الضرائب، يا له من عبء.',
  },
  'holiday.halloween': {
    en: '🎉 Trick or treat! Halloween is so much fun.',
    ar: '🎉 حلوى أم مقلب! الهالوين ممتع جدا.',
  },
  'holiday.spooky_season': {
    en: '🎉 Halloween parties are in full swing. Did you dress up?',
    ar: '🎉 حفلات الهالوين في أوجها، هل ارتديت زيا تنكريا؟',
  },
  'holiday.national_day': {
    en: '🎉 Your country is celebrating its national day!',
    ar: '🎉 تحتفل دولتك بعيدها الوطني!',
  },

  // Interactive political decisions from the career event catalog
  'event.career.pol_disaster': {
    en: 'A massive hurricane has devastated the coast. The people are looking to you.',
    ar: 'دمّر إعصار هائل الساحل والناس ينتظرون قرارك.',
  },
  'event.career.pol_disaster.choice.0': { en: 'Send Aid ()', ar: 'أرسل مساعدات' },
  'event.career.pol_disaster.outcome.0': {
    en: 'The relief effort was successful. Approval ratings up!',
    ar: 'نجحت جهود الإغاثة وارتفعت شعبيتك!',
  },
  'event.career.pol_disaster.choice.1': { en: 'Ignore it', ar: 'تجاهل الكارثة' },
  'event.career.pol_disaster.outcome.1': {
    en: 'The media is destroying you. Approval ratings plummeted.',
    ar: 'هاجمتك وسائل الإعلام وانهارت شعبيتك.',
  },
  'event.career.pol_war': {
    en: 'Intelligence suggests a hostile nation is preparing a missile test.',
    ar: 'تشير الاستخبارات إلى أن دولة معادية تستعد لاختبار صاروخي.',
  },
  'event.career.pol_war.choice.0': { en: 'Diplomacy', ar: 'الحل الدبلوماسي' },
  'event.career.pol_war.outcome.0': {
    en: 'Peace talks succeeded. Nobel Prize?',
    ar: 'نجحت محادثات السلام، فهل تنتظرك جائزة نوبل؟',
  },
  'event.career.pol_war.choice.1': { en: 'Drone Strike', ar: 'نفّذ ضربة بطائرة مسيّرة' },
  'event.career.pol_war.outcome.1': {
    en: 'Target destroyed. International tensions are high.',
    ar: 'دُمّر الهدف وتصاعد التوتر الدولي.',
  },
  'event.career.pol_scandal': {
    en: 'A tape has leaked of you insulting your voters.',
    ar: 'تسرّب تسجيل لك وأنت تهين ناخبيك.',
  },
  'event.career.pol_scandal.choice.0': { en: 'Apologize', ar: 'اعتذر' },
  'event.career.pol_scandal.outcome.0': {
    en: "Some forgave you. Others didn't.",
    ar: 'سامحك بعضهم ولم يسامحك آخرون.',
  },
  'event.career.pol_scandal.choice.1': { en: 'Deny it', ar: 'أنكر الأمر' },
  'event.career.pol_scandal.outcome.1': {
    en: 'The lie made it worse.',
    ar: 'جعلت الكذبة الوضع أسوأ.',
  },
  'event.career.pol_taxes': {
    en: 'The Congress is debating a major tax reform. They want your signature.',
    ar: 'يناقش الكونغرس إصلاحا ضريبيا كبيرا ويريد توقيعك.',
  },
  'event.career.pol_taxes.choice.0': { en: 'Lower Taxes', ar: 'خفّض الضرائب' },
  'event.career.pol_taxes.outcome.0': {
    en: 'The middle class is happy, but the budget deficit grew.',
    ar: 'سعدت الطبقة الوسطى، لكن عجز الميزانية ازداد.',
  },
  'event.career.pol_taxes.choice.1': { en: 'Tax the Rich', ar: 'ارفع الضرائب على الأثرياء' },
  'event.career.pol_taxes.outcome.1': {
    en: 'Public services boosted. Your billionaire donors are furious.',
    ar: 'تحسنت الخدمات العامة، لكن داعميك من المليارديرات غاضبون.',
  },
  'event.career.pol_taxes.choice.2': { en: 'Veto Bill', ar: 'استخدم حق النقض' },
  'event.career.pol_taxes.outcome.2': {
    en: 'Political gridlock continues. You look strong but unproductive.',
    ar: 'استمر الجمود السياسي؛ تبدو قويا لكن بلا إنجاز.',
  },
  'event.career.pol_infra': {
    en: 'A proposal for a high-speed rail network is on your desk.',
    ar: 'يوجد على مكتبك اقتراح لإنشاء شبكة قطارات فائقة السرعة.',
  },
  'event.career.pol_infra.choice.0': { en: 'Build it', ar: 'ابدأ البناء' },
  'event.career.pol_infra.outcome.0': {
    en: 'A technological marvel! Your legacy is secured.',
    ar: 'إنجاز تقني مذهل! ضمنت مكانك في التاريخ.',
  },
  'event.career.pol_infra.choice.1': { en: 'Budget cuts', ar: 'خفّض الميزانية' },
  'event.career.pol_infra.outcome.1': {
    en: 'Saved money, but the roads are crumbling.',
    ar: 'وفّرت المال، لكن الطرق تتداعى.',
  },
  'event.career.pol_state_visit': {
    en: 'The leader of a powerful allied nation is visiting for a summit.',
    ar: 'يزورك زعيم دولة حليفة قوية لحضور قمة.',
  },
  'event.career.pol_state_visit.choice.0': { en: 'Lavish Gala', ar: 'أقم حفلا فاخرا' },
  'event.career.pol_state_visit.outcome.0': {
    en: 'The world watched in awe. Diplomacy at its finest.',
    ar: 'تابع العالم بإعجاب؛ دبلوماسية في أبهى صورها.',
  },
  'event.career.pol_state_visit.choice.1': { en: 'Business only', ar: 'اجتماع عمل فقط' },
  'event.career.pol_state_visit.outcome.1': {
    en: 'A productive meeting. No fluff.',
    ar: 'اجتماع مثمر ومباشر.',
  },
  'event.career.pol_reform': {
    en: 'Activists are marching for major healthcare reform.',
    ar: 'يتظاهر ناشطون مطالبين بإصلاح كبير للرعاية الصحية.',
  },
  'event.career.pol_reform.choice.0': { en: 'Universal Care', ar: 'رعاية صحية شاملة' },
  'event.career.pol_reform.outcome.0': {
    en: "A historic move! You've changed millions of lives.",
    ar: 'خطوة تاريخية غيّرت حياة الملايين.',
  },
  'event.career.pol_reform.choice.1': { en: 'Private system', ar: 'نظام خاص' },
  'event.career.pol_reform.outcome.1': {
    en: 'The stock market loved it. The people... not so much.',
    ar: 'أحبّت الأسواق القرار، أما الناس فلم يحبوه كثيرا.',
  },
  'event.career.pol_reform.choice.2': { en: 'Do nothing', ar: 'لا تفعل شيئا' },
  'event.career.pol_reform.outcome.2': {
    en: 'Protests intensified. You look out of touch.',
    ar: 'اشتدت الاحتجاجات وبدوت بعيدا عن هموم الناس.',
  },
  'event.career.pol_crisis': {
    en: 'The stock market has crashed 20% in a single day.',
    ar: 'انهارت سوق الأسهم بنسبة 20% في يوم واحد.',
  },
  'event.career.pol_crisis.choice.0': { en: 'Bailouts', ar: 'أنقذ المؤسسات ماليا' },
  'event.career.pol_crisis.outcome.0': {
    en: 'The banks survived. The taxpayers are angry.',
    ar: 'نجت البنوك لكن دافعي الضرائب غاضبون.',
  },
  'event.career.pol_crisis.choice.1': { en: 'Austerity', ar: 'طبّق التقشف' },
  'event.career.pol_crisis.outcome.1': {
    en: 'National debt down, unemployment up.',
    ar: 'انخفض الدين العام وارتفعت البطالة.',
  },
  'event.career.pol_crisis.choice.2': { en: 'Stimulus', ar: 'أطلق حزمة تحفيز' },
  'event.career.pol_crisis.outcome.2': {
    en: 'The economy is slowly recovering.',
    ar: 'بدأ الاقتصاد يتعافى ببطء.',
  },
  'event.career.adult_jealous': {
    en: 'Your partner has been texting a "friend" a lot lately. You feel jealous.',
    ar: 'Your partner has been texting a "friend" a lot lately. You feel jealous. AR',
  },
  'event.career.adult_jealous.choice.0': { en: 'Confront them', ar: 'Confront them AR' },
  'event.career.adult_jealous.choice.1': { en: 'Ignore it', ar: 'Ignore it AR' },
  'event.career.adult_jealous.outcome.0': {
    en: 'They were just planning your surprise party. Oops.',
    ar: 'They were just planning your surprise party. Oops. AR',
  },
  'event.career.adult_jealous.outcome.1': {
    en: 'It eats at you all year.',
    ar: 'It eats at you all year. AR',
  },
  'event.career.adult_marathon': {
    en: 'You decided to run a marathon. You trained for months.',
    ar: 'You decided to run a marathon. You trained for months. AR',
  },
  'event.career.adult_midlife_crisis': {
    en: 'You are having a midlife crisis. You bought a red convertible.',
    ar: 'You are having a midlife crisis. You bought a red convertible. AR',
  },
  'event.career.adult_side_hustle': {
    en: 'A friend wants you to invest in their startup. It is a phone case that doubles as a wallet.',
    ar: 'A friend wants you to invest in their startup. It is a phone case that doubles as a wallet. AR',
  },
  'event.career.adult_side_hustle.choice.0': { en: 'Invest $500', ar: 'Invest $500 AR' },
  'event.career.adult_side_hustle.choice.1': { en: 'Pass', ar: 'Pass AR' },
  'event.career.adult_side_hustle.outcome.0': {
    en: 'It actually took off! You made $2000 back.',
    ar: 'It actually took off! You made $2000 back. AR',
  },
  'event.career.adult_side_hustle.outcome.1': {
    en: 'You missed the next big thing.',
    ar: 'You missed the next big thing. AR',
  },
  'event.career.adult_therapy': {
    en: "Your therapist says you have made great progress. But your insurance won't cover the next session.",
    ar: "Your therapist says you have made great progress. But your insurance won't cover the next session. AR",
  },
  'event.career.adult_therapy.choice.0': { en: 'Pay out of pocket', ar: 'Pay out of pocket AR' },
  'event.career.adult_therapy.choice.1': { en: 'Quit therapy', ar: 'Quit therapy AR' },
  'event.career.adult_therapy.outcome.0': {
    en: 'Your mental health is worth it.',
    ar: 'Your mental health is worth it. AR',
  },
  'event.career.adult_therapy.outcome.1': {
    en: 'You will be fine. Probably.',
    ar: 'You will be fine. Probably. AR',
  },
  'event.career.child_bake_sale': {
    en: 'Your school is having a bake sale. Do you want to help?',
    ar: 'Your school is having a bake sale. Do you want to help? AR',
  },
  'event.career.child_bake_sale.choice.0': { en: 'Bake cookies', ar: 'Bake cookies AR' },
  'event.career.child_bake_sale.choice.1': { en: 'Buy cookies', ar: 'Buy cookies AR' },
  'event.career.child_bake_sale.outcome.0': {
    en: 'You sold out in an hour!',
    ar: 'You sold out in an hour! AR',
  },
  'event.career.child_bake_sale.outcome.1': {
    en: 'You ate six cupcakes. Worth it.',
    ar: 'You ate six cupcakes. Worth it. AR',
  },
  'event.career.child_bedwetting': {
    en: 'You wet the bed at a sleepover. So embarrassing.',
    ar: 'You wet the bed at a sleepover. So embarrassing. AR',
  },
  'event.career.child_grounded': {
    en: 'You broke a vase playing ball inside. You are grounded for a week.',
    ar: 'You broke a vase playing ball inside. You are grounded for a week. AR',
  },
  'event.career.child_penpal': {
    en: 'You got a pen pal from Japan! You write letters every month.',
    ar: 'You got a pen pal from Japan! You write letters every month. AR',
  },
  'event.career.child_pet_fish': {
    en: 'You won a goldfish at the fair! You named it George.',
    ar: 'You won a goldfish at the fair! You named it George. AR',
  },
  'event.career.child_piano': {
    en: 'You started piano lessons. Your fingers hurt but it sounds nice.',
    ar: 'You started piano lessons. Your fingers hurt but it sounds nice. AR',
  },
  'event.career.child_rollercoaster': {
    en: 'Your family went to an amusement park! You rode the biggest rollercoaster.',
    ar: 'Your family went to an amusement park! You rode the biggest rollercoaster. AR',
  },
  'event.career.child_sport': {
    en: 'Your parents signed you up for soccer! You hate it.',
    ar: 'Your parents signed you up for soccer! You hate it. AR',
  },
  'event.career.elder_grandchild': {
    en: 'Your child had a baby! You are a grandparent now!',
    ar: 'Your child had a baby! You are a grandparent now! AR',
  },
  'event.career.elder_health_scare': {
    en: 'You had a health scare. The doctors say you need to take it easy.',
    ar: 'You had a health scare. The doctors say you need to take it easy. AR',
  },
  'event.career.elder_reminsice': {
    en: 'You find an old photo album and spend the afternoon reminiscing.',
    ar: 'You find an old photo album and spend the afternoon reminiscing. AR',
  },
  'event.career.elder_will_update': {
    en: 'Your lawyer recommends updating your will.',
    ar: 'Your lawyer recommends updating your will. AR',
  },
  'event.career.elder_will_update.choice.0': { en: 'Update it', ar: 'Update it AR' },
  'event.career.elder_will_update.choice.1': { en: 'Procrastinate', ar: 'Procrastinate AR' },
  'event.career.elder_will_update.outcome.0': {
    en: 'Peace of mind. Your affairs are in order.',
    ar: 'Peace of mind. Your affairs are in order. AR',
  },
  'event.career.elder_will_update.outcome.1': {
    en: 'You will do it next year. Probably.',
    ar: 'You will do it next year. Probably. AR',
  },
  'event.career.elder_wisdom': {
    en: 'You feel a sense of clarity. Life is good. You write down your thoughts.',
    ar: 'You feel a sense of clarity. Life is good. You write down your thoughts. AR',
  },
  'event.career.fame_fan_encounter': {
    en: 'A fan approaches you in a restaurant and asks for a selfie.',
    ar: 'A fan approaches you in a restaurant and asks for a selfie. AR',
  },
  'event.career.fame_fan_encounter.choice.0': { en: 'Take the selfie', ar: 'Take the selfie AR' },
  'event.career.fame_fan_encounter.choice.1': { en: 'Politely decline', ar: 'Politely decline AR' },
  'event.career.fame_fan_encounter.outcome.0': {
    en: 'You made their day!',
    ar: 'You made their day! AR',
  },
  'event.career.fame_fan_encounter.outcome.1': {
    en: 'They understood. Mostly.',
    ar: 'They understood. Mostly. AR',
  },
  'event.career.fame_haters': {
    en: 'A gossip site published a story about you. It is completely false.',
    ar: 'A gossip site published a story about you. It is completely false. AR',
  },
  'event.career.fame_haters.choice.0': { en: 'Ignore it', ar: 'Ignore it AR' },
  'event.career.fame_haters.choice.1': { en: 'Sue them', ar: 'Sue them AR' },
  'event.career.fame_haters.choice.2': { en: 'Cry', ar: 'Cry AR' },
  'event.career.fame_haters.outcome.0': {
    en: 'The controversy made you more famous.',
    ar: 'The controversy made you more famous. AR',
  },
  'event.career.fame_haters.outcome.1': {
    en: 'You won the lawsuit! Headlines everywhere.',
    ar: 'You won the lawsuit! Headlines everywhere. AR',
  },
  'event.career.fame_haters.outcome.2': {
    en: 'Not your finest moment.',
    ar: 'Not your finest moment. AR',
  },
  'event.career.ma_annual_checkup': {
    en: 'You are due for your annual physical. You have been avoiding it.',
    ar: 'You are due for your annual physical. You have been avoiding it. AR',
  },
  'event.career.ma_annual_checkup.choice.0': { en: 'Go to the doctor', ar: 'Go to the doctor AR' },
  'event.career.ma_annual_checkup.choice.1': { en: 'Skip it again', ar: 'Skip it again AR' },
  'event.career.ma_annual_checkup.outcome.0': {
    en: 'Clean bill of health. What a relief!',
    ar: 'Clean bill of health. What a relief! AR',
  },
  'event.career.ma_annual_checkup.outcome.1': {
    en: 'Ignorance is bliss.',
    ar: 'Ignorance is bliss. AR',
  },
  'event.career.ma_back_pain': {
    en: 'You threw your back out by sneezing. Getting old is humbling.',
    ar: 'You threw your back out by sneezing. Getting old is humbling. AR',
  },
  'event.career.ma_empty_nest': {
    en: 'Your last child moved out. The house feels so quiet now.',
    ar: 'Your last child moved out. The house feels so quiet now. AR',
  },
  'event.career.ma_family_reunion': {
    en: 'Your extended family is organizing a reunion. You have not seen some of them in years.',
    ar: 'Your extended family is organizing a reunion. You have not seen some of them in years. AR',
  },
  'event.career.ma_family_reunion.choice.0': { en: 'Go', ar: 'Go AR' },
  'event.career.ma_family_reunion.choice.1': { en: 'Make an excuse', ar: 'Make an excuse AR' },
  'event.career.ma_family_reunion.outcome.0': {
    en: 'Aunt Karen was there. So was the good potato salad. Worth it.',
    ar: 'Aunt Karen was there. So was the good potato salad. Worth it. AR',
  },
  'event.career.ma_family_reunion.outcome.1': {
    en: 'You ordered pizza and watched TV instead. Peaceful.',
    ar: 'You ordered pizza and watched TV instead. Peaceful. AR',
  },
  'event.career.ma_glasses': {
    en: 'You have been squinting at menus. It is time for reading glasses.',
    ar: 'You have been squinting at menus. It is time for reading glasses. AR',
  },
  'event.career.ma_health_scare': {
    en: 'Your doctor says your cholesterol is high and your blood pressure is concerning.',
    ar: 'Your doctor says your cholesterol is high and your blood pressure is concerning. AR',
  },
  'event.career.ma_health_scare.choice.0': {
    en: 'Change diet and exercise',
    ar: 'Change diet and exercise AR',
  },
  'event.career.ma_health_scare.choice.1': { en: 'Ignore it', ar: 'Ignore it AR' },
  'event.career.ma_health_scare.outcome.0': {
    en: 'A year later, your numbers are perfect. Feel amazing!',
    ar: 'A year later, your numbers are perfect. Feel amazing! AR',
  },
  'event.career.ma_health_scare.outcome.1': {
    en: 'Ignorance is bliss until it is not.',
    ar: 'Ignorance is bliss until it is not. AR',
  },
  'event.career.ma_high_school_reunion': {
    en: 'Your high school reunion is coming up. Do you go?',
    ar: 'Your high school reunion is coming up. Do you go? AR',
  },
  'event.career.ma_high_school_reunion.choice.0': {
    en: 'Go and show off',
    ar: 'Go and show off AR',
  },
  'event.career.ma_high_school_reunion.choice.1': { en: 'Skip it', ar: 'Skip it AR' },
  'event.career.ma_high_school_reunion.outcome.0': {
    en: 'You are doing way better than most of them. Feels good.',
    ar: 'You are doing way better than most of them. Feels good. AR',
  },
  'event.career.ma_high_school_reunion.outcome.1': {
    en: 'Living well is the best revenge.',
    ar: 'Living well is the best revenge. AR',
  },
  'event.career.ma_home_maintenance': {
    en: 'The water heater broke and the basement is flooding.',
    ar: 'The water heater broke and the basement is flooding. AR',
  },
  'event.career.ma_inheritance': {
    en: 'A distant aunt you barely remember passed away and left you something.',
    ar: 'A distant aunt you barely remember passed away and left you something. AR',
  },
  'event.career.ma_inheritance.choice.0': { en: 'Cash inheritance', ar: 'Cash inheritance AR' },
  'event.career.ma_inheritance.choice.1': { en: 'Heirloom watch', ar: 'Heirloom watch AR' },
  'event.career.ma_inheritance.outcome.0': {
    en: 'She always liked you best.',
    ar: 'She always liked you best. AR',
  },
  'event.career.ma_inheritance.outcome.1': {
    en: 'It is not worth much, but the sentimental value is priceless.',
    ar: 'It is not worth much, but the sentimental value is priceless. AR',
  },
  'event.career.ma_kids_activities': {
    en: 'Your child wants to join an expensive extracurricular activity.',
    ar: 'Your child wants to join an expensive extracurricular activity. AR',
  },
  'event.career.ma_kids_activities.choice.0': { en: 'Enroll them', ar: 'Enroll them AR' },
  'event.career.ma_kids_activities.choice.1': { en: 'Too expensive', ar: 'Too expensive AR' },
  'event.career.ma_kids_activities.outcome.0': {
    en: 'They loved it! You are their favorite parent.',
    ar: 'They loved it! You are their favorite parent. AR',
  },
  'event.career.ma_kids_activities.outcome.1': {
    en: 'They understood, but you feel guilty.',
    ar: 'They understood, but you feel guilty. AR',
  },
  'event.career.ma_mentor_junior': {
    en: 'Your company asked you to mentor a junior employee. They look up to you.',
    ar: 'Your company asked you to mentor a junior employee. They look up to you. AR',
  },
  'event.career.ma_neighbor_dispute': {
    en: 'Your new neighbor blasts music at 2 AM every night.',
    ar: 'Your new neighbor blasts music at 2 AM every night. AR',
  },
  'event.career.ma_neighbor_dispute.choice.0': {
    en: 'Talk to them nicely',
    ar: 'Talk to them nicely AR',
  },
  'event.career.ma_neighbor_dispute.choice.1': { en: 'Call the police', ar: 'Call the police AR' },
  'event.career.ma_neighbor_dispute.outcome.0': {
    en: 'They apologized! They did not realize the walls were thin.',
    ar: 'They apologized! They did not realize the walls were thin. AR',
  },
  'event.career.ma_neighbor_dispute.outcome.1': {
    en: 'Now they glare at you in the hallway. Worth it.',
    ar: 'Now they glare at you in the hallway. Worth it. AR',
  },
  'event.career.ma_new_hobby': {
    en: 'You have been feeling stagnant. Maybe it is time for a new hobby.',
    ar: 'You have been feeling stagnant. Maybe it is time for a new hobby. AR',
  },
  'event.career.ma_new_hobby.choice.0': { en: 'Take up photography', ar: 'Take up photography AR' },
  'event.career.ma_new_hobby.choice.1': { en: 'Start a garden', ar: 'Start a garden AR' },
  'event.career.ma_new_hobby.choice.2': { en: 'Not now', ar: 'Not now AR' },
  'event.career.ma_new_hobby.outcome.0': {
    en: 'You have an eye for it! Friends love your photos.',
    ar: 'You have an eye for it! Friends love your photos. AR',
  },
  'event.career.ma_new_hobby.outcome.1': {
    en: 'Your tomatoes are the envy of the neighborhood.',
    ar: 'Your tomatoes are the envy of the neighborhood. AR',
  },
  'event.career.ma_new_hobby.outcome.2': {
    en: 'The routine consumes you again.',
    ar: 'The routine consumes you again. AR',
  },
  'event.career.ma_old_friend': {
    en: 'An old friend from high school just moved back to town. They want to catch up.',
    ar: 'An old friend from high school just moved back to town. They want to catch up. AR',
  },
  'event.career.ma_old_friend.choice.0': { en: 'Meet up', ar: 'Meet up AR' },
  'event.career.ma_old_friend.choice.1': { en: 'Too busy', ar: 'Too busy AR' },
  'event.career.ma_old_friend.outcome.0': {
    en: 'It felt like no time had passed. Great night.',
    ar: 'It felt like no time had passed. Great night. AR',
  },
  'event.career.ma_old_friend.outcome.1': {
    en: 'You keep saying you will call. You never do.',
    ar: 'You keep saying you will call. You never do. AR',
  },
  'event.career.ma_parenting_milestone': {
    en: 'Your child just performed in their first school play. You cried a little.',
    ar: 'Your child just performed in their first school play. You cried a little. AR',
  },
  'event.career.ma_refinance': {
    en: 'Interest rates dropped. A great time to refinance your mortgage.',
    ar: 'Interest rates dropped. A great time to refinance your mortgage. AR',
  },
  'event.career.ma_refinance.choice.0': { en: 'Refinance', ar: 'Refinance AR' },
  'event.career.ma_refinance.choice.1': {
    en: 'Not worth the hassle',
    ar: 'Not worth the hassle AR',
  },
  'event.career.ma_refinance.outcome.0': {
    en: 'Your monthly payment dropped significantly. Financial win!',
    ar: 'Your monthly payment dropped significantly. Financial win! AR',
  },
  'event.career.ma_refinance.outcome.1': {
    en: 'You missed the rate window.',
    ar: 'You missed the rate window. AR',
  },
  'event.career.ma_renew_vows': {
    en: 'Your anniversary is coming up. You want to do something special.',
    ar: 'Your anniversary is coming up. You want to do something special. AR',
  },
  'event.career.ma_renew_vows.choice.0': { en: 'Renew your vows', ar: 'Renew your vows AR' },
  'event.career.ma_renew_vows.choice.1': {
    en: 'Quiet dinner at home',
    ar: 'Quiet dinner at home AR',
  },
  'event.career.ma_renew_vows.outcome.0': {
    en: 'It was beautiful. Your partner cried. You cried. Everyone cried.',
    ar: 'It was beautiful. Your partner cried. You cried. Everyone cried. AR',
  },
  'event.career.ma_renew_vows.outcome.1': {
    en: 'Sometimes simple is best.',
    ar: 'Sometimes simple is best. AR',
  },
  'event.career.ma_volunteering': {
    en: 'A local shelter is looking for volunteers. You have some free weekends.',
    ar: 'A local shelter is looking for volunteers. You have some free weekends. AR',
  },
  'event.career.ma_volunteering.choice.0': { en: 'Volunteer', ar: 'Volunteer AR' },
  'event.career.ma_volunteering.choice.1': { en: 'Too busy', ar: 'Too busy AR' },
  'event.career.ma_volunteering.outcome.0': {
    en: 'Giving back fills a void you did not know you had.',
    ar: 'Giving back fills a void you did not know you had. AR',
  },
  'event.career.ma_volunteering.outcome.1': {
    en: 'Maybe another time.',
    ar: 'Maybe another time. AR',
  },
  'event.career.mil_deployment': {
    en: 'You have been ordered to deploy to a combat zone.',
    ar: 'You have been ordered to deploy to a combat zone. AR',
  },
  'event.career.mil_deployment.choice.0': { en: 'Serve proudly', ar: 'Serve proudly AR' },
  'event.career.mil_deployment.choice.1': { en: 'Desert', ar: 'Desert AR' },
  'event.career.mil_deployment.outcome.0': {
    en: 'You returned home safe with a medal.',
    ar: 'You returned home safe with a medal. AR',
  },
  'event.career.mil_deployment.outcome.1': {
    en: 'You went AWOL and are now a fugitive.',
    ar: 'You went AWOL and are now a fugitive. AR',
  },
  'event.career.music_flop': {
    en: 'Your experimental jazz album was a total flop.',
    ar: 'Your experimental jazz album was a total flop. AR',
  },
  'event.career.music_hit': {
    en: 'Your latest single is climbing the charts!',
    ar: 'Your latest single is climbing the charts! AR',
  },
  'event.career.music_tour': {
    en: 'Your label wants you to go on a World Tour.',
    ar: 'Your label wants you to go on a World Tour. AR',
  },
  'event.career.music_tour.choice.0': { en: 'Go on Tour', ar: 'Go on Tour AR' },
  'event.career.music_tour.choice.1': { en: 'Stay home', ar: 'Stay home AR' },
  'event.career.music_tour.outcome.0': {
    en: "Sold out stadiums! You're exhausted but rich.",
    ar: "Sold out stadiums! You're exhausted but rich. AR",
  },
  'event.career.music_tour.outcome.1': {
    en: 'You worked on new music instead.',
    ar: 'You worked on new music instead. AR',
  },
  'event.career.pet_sick': {
    en: 'Your pet is acting strange. Might be sick.',
    ar: 'Your pet is acting strange. Might be sick. AR',
  },
  'event.career.pet_sick.choice.0': { en: 'Vet visit', ar: 'Vet visit AR' },
  'event.career.pet_sick.choice.1': { en: 'Wait and see', ar: 'Wait and see AR' },
  'event.career.pet_sick.outcome.0': {
    en: 'Just a stomach bug. They are fine!',
    ar: 'Just a stomach bug. They are fine! AR',
  },
  'event.career.pet_sick.outcome.1': {
    en: 'They recovered on their own, luckily.',
    ar: 'They recovered on their own, luckily. AR',
  },
  'event.career.pet_tricks': {
    en: 'Your pet learned a new trick! They can roll over and play dead.',
    ar: 'Your pet learned a new trick! They can roll over and play dead. AR',
  },
  'event.career.poverty_eviction': {
    en: 'You are behind on rent. The landlord posted an eviction notice.',
    ar: 'You are behind on rent. The landlord posted an eviction notice. AR',
  },
  'event.career.poverty_eviction.choice.0': { en: 'Beg for more time', ar: 'Beg for more time AR' },
  'event.career.poverty_eviction.choice.1': { en: 'Sell belongings', ar: 'Sell belongings AR' },
  'event.career.poverty_eviction.outcome.0': {
    en: 'He gave you two weeks to pay up.',
    ar: 'He gave you two weeks to pay up. AR',
  },
  'event.career.poverty_eviction.outcome.1': {
    en: 'You sold your TV and guitar. Rent paid.',
    ar: 'You sold your TV and guitar. Rent paid. AR',
  },
  'event.career.royal_duty': {
    en: 'You are required to attend a state banquet. Boring but expected.',
    ar: 'You are required to attend a state banquet. Boring but expected. AR',
  },
  'event.career.royal_scandal': {
    en: 'The press caught you doing something embarrassing at a private club.',
    ar: 'The press caught you doing something embarrassing at a private club. AR',
  },
  'event.career.royal_scandal.choice.0': { en: 'Issue apology', ar: 'Issue apology AR' },
  'event.career.royal_scandal.choice.1': { en: 'Deny everything', ar: 'Deny everything AR' },
  'event.career.royal_scandal.outcome.0': {
    en: 'Damage control. The tabloids move on.',
    ar: 'Damage control. The tabloids move on. AR',
  },
  'event.career.royal_scandal.outcome.1': {
    en: 'The story grew. You are memed worldwide.',
    ar: 'The story grew. You are memed worldwide. AR',
  },
  'event.career.sports_championship': {
    en: "It's the Championship Game! The score is tied.",
    ar: "It's the Championship Game! The score is tied. AR",
  },
  'event.career.sports_championship.choice.0': { en: 'Pass the ball', ar: 'Pass the ball AR' },
  'event.career.sports_championship.choice.1': { en: 'Go for glory', ar: 'Go for glory AR' },
  'event.career.sports_championship.outcome.0': {
    en: 'Teammate scored! WE WON!',
    ar: 'Teammate scored! WE WON! AR',
  },
  'event.career.sports_championship.outcome.1': {
    en: 'You scored the winning point! MVP!',
    ar: 'You scored the winning point! MVP! AR',
  },
  'event.career.sports_injury': {
    en: 'You felt a pop in your knee during practice.',
    ar: 'You felt a pop in your knee during practice. AR',
  },
  'event.career.teen_breakup': {
    en: 'Your high school sweetheart dumped you for the quarterback.',
    ar: 'Your high school sweetheart dumped you for the quarterback. AR',
  },
  'event.career.teen_college_letter': {
    en: 'Your dream university sent a letter. Acceptance or rejection?',
    ar: 'Your dream university sent a letter. Acceptance or rejection? AR',
  },
  'event.career.teen_college_letter.choice.0': { en: 'Open it', ar: 'Open it AR' },
  'event.career.teen_college_letter.choice.1': { en: 'Delay', ar: 'Delay AR' },
  'event.career.teen_college_letter.outcome.0': {
    en: 'You got in! Tears of joy.',
    ar: 'You got in! Tears of joy. AR',
  },
  'event.career.teen_college_letter.outcome.1': {
    en: 'You are too nervous to look.',
    ar: 'You are too nervous to look. AR',
  },
  'event.career.teen_driving': {
    en: 'You saved up and bought your first car. It is a 1998 Honda Civic with 200k miles.',
    ar: 'You saved up and bought your first car. It is a 1998 Honda Civic with 200k miles. AR',
  },
  'event.career.teen_dye_hair': {
    en: 'You dyed your hair bright blue. Your mom is furious.',
    ar: 'You dyed your hair bright blue. Your mom is furious. AR',
  },
  'event.career.teen_exam_stress': {
    en: 'Final exams are next week and you have barely studied.',
    ar: 'Final exams are next week and you have barely studied. AR',
  },
  'event.career.teen_part_time_job': {
    en: 'The local pizza place is hiring. Do you want a part-time job?',
    ar: 'The local pizza place is hiring. Do you want a part-time job? AR',
  },
  'event.career.teen_part_time_job.choice.0': { en: 'Take the job', ar: 'Take the job AR' },
  'event.career.teen_part_time_job.choice.1': { en: 'Focus on school', ar: 'Focus on school AR' },
  'event.career.teen_part_time_job.outcome.0': {
    en: 'You are making minimum wage, but it is your own money!',
    ar: 'You are making minimum wage, but it is your own money! AR',
  },
  'event.career.teen_part_time_job.outcome.1': {
    en: 'You aced your classes.',
    ar: 'You aced your classes. AR',
  },
  'event.career.wealth_donation': {
    en: 'A charity asks you to make a significant donation.',
    ar: 'A charity asks you to make a significant donation. AR',
  },
  'event.career.wealth_donation.choice.0': { en: 'Donate $100k', ar: 'Donate $100k AR' },
  'event.career.wealth_donation.choice.1': { en: 'Decline', ar: 'Decline AR' },
  'event.career.wealth_donation.outcome.0': {
    en: 'You changed lives. Feels amazing.',
    ar: 'You changed lives. Feels amazing. AR',
  },
  'event.career.wealth_donation.outcome.1': {
    en: 'Your bank account is safe.',
    ar: 'Your bank account is safe. AR',
  },
  'event.career.wealth_investment_offer': {
    en: 'A private equity firm offers you an exclusive investment opportunity.',
    ar: 'A private equity firm offers you an exclusive investment opportunity. AR',
  },
  'event.career.wealth_investment_offer.choice.0': { en: 'Invest $200k', ar: 'Invest $200k AR' },
  'event.career.wealth_investment_offer.choice.1': { en: 'Too risky', ar: 'Too risky AR' },
  'event.career.wealth_investment_offer.outcome.0': {
    en: 'The IPO was a massive success!',
    ar: 'The IPO was a massive success! AR',
  },
  'event.career.wealth_investment_offer.outcome.1': {
    en: 'It soared without you. Regret.',
    ar: 'It soared without you. Regret. AR',
  },
  'event.career.ya_city_discovery': {
    en: 'You discovered a hidden gem of a café in your neighborhood.',
    ar: 'You discovered a hidden gem of a café in your neighborhood. AR',
  },
  'event.career.ya_credit_card': {
    en: 'You checked your credit card statement. The interest is brutal.',
    ar: 'You checked your credit card statement. The interest is brutal. AR',
  },
  'event.career.ya_first_serious': {
    en: 'Your partner said "I love you" for the first time. Butterflies everywhere.',
    ar: 'Your partner said "I love you" for the first time. Butterflies everywhere. AR',
  },
  'event.career.ya_fitness_journey': {
    en: 'You are tired of feeling out of shape. A gym opened near your place.',
    ar: 'You are tired of feeling out of shape. A gym opened near your place. AR',
  },
  'event.career.ya_fitness_journey.choice.0': { en: 'Join the gym', ar: 'Join the gym AR' },
  'event.career.ya_fitness_journey.choice.1': { en: 'Skip it', ar: 'Skip it AR' },
  'event.career.ya_fitness_journey.outcome.0': {
    en: 'Six months later, you barely recognize yourself!',
    ar: 'Six months later, you barely recognize yourself! AR',
  },
  'event.career.ya_fitness_journey.outcome.1': {
    en: 'Maybe next year.',
    ar: 'Maybe next year. AR',
  },
  'event.career.ya_friend_wedding': {
    en: 'Your best friend just got engaged. You are happy for them, but also... single.',
    ar: 'Your best friend just got engaged. You are happy for them, but also... single. AR',
  },
  'event.career.ya_job_interview': {
    en: 'You have a big job interview tomorrow. Your best shirt has a stain.',
    ar: 'You have a big job interview tomorrow. Your best shirt has a stain. AR',
  },
  'event.career.ya_job_interview.choice.0': { en: 'Buy a new shirt', ar: 'Buy a new shirt AR' },
  'event.career.ya_job_interview.choice.1': { en: 'Wear it anyway', ar: 'Wear it anyway AR' },
  'event.career.ya_job_interview.outcome.0': {
    en: 'You nailed the interview! They loved your confidence.',
    ar: 'You nailed the interview! They loved your confidence. AR',
  },
  'event.career.ya_job_interview.outcome.1': {
    en: 'They noticed. You did not get the job.',
    ar: 'They noticed. You did not get the job. AR',
  },
  'event.career.ya_late_night_existential': {
    en: 'It is 2 AM and you are wide awake questioning every life choice you ever made.',
    ar: 'It is 2 AM and you are wide awake questioning every life choice you ever made. AR',
  },
  'event.career.ya_learning_cook': {
    en: 'Eating out is draining your wallet. Time to learn to cook.',
    ar: 'Eating out is draining your wallet. Time to learn to cook. AR',
  },
  'event.career.ya_learning_cook.choice.0': {
    en: 'Take a cooking class',
    ar: 'Take a cooking class AR',
  },
  'event.career.ya_learning_cook.choice.1': { en: 'YouTube tutorials', ar: 'YouTube tutorials AR' },
  'event.career.ya_learning_cook.outcome.0': {
    en: 'You can now make a mean spaghetti carbonara!',
    ar: 'You can now make a mean spaghetti carbonara! AR',
  },
  'event.career.ya_learning_cook.outcome.1': {
    en: 'You burnt the rice. But the omelets are getting better.',
    ar: 'You burnt the rice. But the omelets are getting better. AR',
  },
  'event.career.ya_moving_home': {
    en: 'Money is tight. Your parents offered to let you move back in.',
    ar: 'Money is tight. Your parents offered to let you move back in. AR',
  },
  'event.career.ya_moving_home.choice.0': { en: 'Move back', ar: 'Move back AR' },
  'event.career.ya_moving_home.choice.1': { en: 'Tough it out', ar: 'Tough it out AR' },
  'event.career.ya_moving_home.outcome.0': {
    en: 'Free laundry and home-cooked meals. Worth it.',
    ar: 'Free laundry and home-cooked meals. Worth it. AR',
  },
  'event.career.ya_moving_home.outcome.1': {
    en: 'Pride over comfort. You will make it work.',
    ar: 'Pride over comfort. You will make it work. AR',
  },
  'event.career.ya_networking': {
    en: 'An industry conference is in town. Great chance to network.',
    ar: 'An industry conference is in town. Great chance to network. AR',
  },
  'event.career.ya_networking.choice.0': { en: 'Attend', ar: 'Attend AR' },
  'event.career.ya_networking.choice.1': { en: 'Skip it', ar: 'Skip it AR' },
  'event.career.ya_networking.outcome.0': {
    en: 'You met someone who could change your career!',
    ar: 'You met someone who could change your career! AR',
  },
  'event.career.ya_networking.outcome.1': {
    en: 'Networking is overrated anyway.',
    ar: 'Networking is overrated anyway. AR',
  },
  'event.career.ya_online_dating': {
    en: 'You matched with someone amazing on a dating app. They want to meet!',
    ar: 'You matched with someone amazing on a dating app. They want to meet! AR',
  },
  'event.career.ya_online_dating.choice.0': { en: 'Go on the date', ar: 'Go on the date AR' },
  'event.career.ya_online_dating.choice.1': { en: 'Too nervous', ar: 'Too nervous AR' },
  'event.career.ya_online_dating.outcome.0': {
    en: 'It went surprisingly well. You really clicked!',
    ar: 'It went surprisingly well. You really clicked! AR',
  },
  'event.career.ya_online_dating.outcome.1': {
    en: 'You unmatched and regretted it immediately.',
    ar: 'You unmatched and regretted it immediately. AR',
  },
  'event.career.ya_promotion_milestone': {
    en: 'Your boss pulled you aside. They see leadership potential in you.',
    ar: 'Your boss pulled you aside. They see leadership potential in you. AR',
  },
  'event.career.ya_roommate': {
    en: 'Your roommate ate all your food again and left a mess.',
    ar: 'Your roommate ate all your food again and left a mess. AR',
  },
  'event.life.acne': {
    en: 'You have a terrible breakout of acne.',
    ar: 'You have a terrible breakout of acne. AR',
  },
  'event.life.alien_abduction': {
    en: 'A bright light wakes you up... ALIENS?!',
    ar: 'A bright light wakes you up... ALIENS?! AR',
  },
  'event.life.alien_abduction.choice.0': { en: 'Scream', ar: 'Scream AR' },
  'event.life.alien_abduction.choice.1': { en: 'communicate', ar: 'communicate AR' },
  'event.life.alien_abduction.outcome.0': {
    en: 'They probed you and dumped you in a cornfield.',
    ar: 'They probed you and dumped you in a cornfield. AR',
  },
  'event.life.alien_abduction.outcome.1': {
    en: 'They gave you knowledge of the universe.',
    ar: 'They gave you knowledge of the universe. AR',
  },
  'event.life.all_nighter': {
    en: 'You pulled an all-nighter to study for finals.',
    ar: 'You pulled an all-nighter to study for finals. AR',
  },
  'event.life.anniversary_forgot': {
    en: 'It was your anniversary yesterday... and you forgot.',
    ar: 'It was your anniversary yesterday... and you forgot. AR',
  },
  'event.life.anniversary_forgot.choice.0': {
    en: 'Apologize profusely',
    ar: 'Apologize profusely AR',
  },
  'event.life.anniversary_forgot.choice.1': {
    en: "Pretend you didn't",
    ar: "Pretend you didn't AR",
  },
  'event.life.anniversary_forgot.outcome.0': {
    en: 'You bought expensive flowers. They still mad.',
    ar: 'You bought expensive flowers. They still mad. AR',
  },
  'event.life.anniversary_forgot.outcome.1': {
    en: 'They saw right through you. Sleeping on couch.',
    ar: 'They saw right through you. Sleeping on couch. AR',
  },
  'event.life.annoying_coworker': {
    en: 'A coworker, Karen, keeps stealing your lunch.',
    ar: 'A coworker, Karen, keeps stealing your lunch. AR',
  },
  'event.life.annoying_coworker.choice.0': { en: 'Report her', ar: 'Report her AR' },
  'event.life.annoying_coworker.choice.1': {
    en: 'Put laxatives in it',
    ar: 'Put laxatives in it AR',
  },
  'event.life.annoying_coworker.outcome.0': {
    en: 'HR gave her a warning.',
    ar: 'HR gave her a warning. AR',
  },
  'event.life.annoying_coworker.outcome.1': {
    en: 'She ran to the bathroom screaming.',
    ar: 'She ran to the bathroom screaming. AR',
  },
  'event.life.ate_glue': {
    en: 'You got curious in art class and ate a stick of glue.',
    ar: 'You got curious in art class and ate a stick of glue. AR',
  },
  'event.life.backpacking': {
    en: 'You have an urge to backpack across Europe.',
    ar: 'You have an urge to backpack across Europe. AR',
  },
  'event.life.backpacking.choice.0': { en: 'Go ($2k)', ar: 'Go ($2k) AR' },
  'event.life.backpacking.choice.1': { en: 'Too poor', ar: 'Too poor AR' },
  'event.life.backpacking.outcome.0': {
    en: 'Life changing experience!',
    ar: 'Life changing experience! AR',
  },
  'event.life.backpacking.outcome.1': { en: 'Maybe next year.', ar: 'Maybe next year. AR' },
  'event.life.bad_haircut': {
    en: 'The barber completely messed up your hair.',
    ar: 'The barber completely messed up your hair. AR',
  },
  'event.life.bad_hip': {
    en: 'Your hip is aching. Rain must be coming.',
    ar: 'Your hip is aching. Rain must be coming. AR',
  },
  'event.life.bank_error': { en: 'Bank Error in your favor!', ar: 'Bank Error in your favor! AR' },
  'event.life.bingo_night': {
    en: 'You went to Bingo night and won the jackpot!',
    ar: 'You went to Bingo night and won the jackpot! AR',
  },
  'event.life.bird_poop': {
    en: 'A bird pooped directly on your head.',
    ar: 'A bird pooped directly on your head. AR',
  },
  'event.life.bribe_offer': {
    en: 'A shady client offers you a bribe to ignore protocol.',
    ar: 'A shady client offers you a bribe to ignore protocol. AR',
  },
  'event.life.bribe_offer.choice.0': { en: 'Take Bribe ($5k)', ar: 'Take Bribe ($5k) AR' },
  'event.life.bribe_offer.choice.1': { en: 'Report them', ar: 'Report them AR' },
  'event.life.bribe_offer.outcome.0': {
    en: "You took the cash. Hope you don't get caught.",
    ar: "You took the cash. Hope you don't get caught. AR",
  },
  'event.life.bribe_offer.outcome.1': {
    en: 'Your boss praised your integrity.',
    ar: 'Your boss praised your integrity. AR',
  },
  'event.life.broken_arm': {
    en: 'You tripped over your own feet and broke your arm.',
    ar: 'You tripped over your own feet and broke your arm. AR',
  },
  'event.life.broken_copier': {
    en: "The office copier is broken again. 'PC LOAD LETTER'?",
    ar: "The office copier is broken again. 'PC LOAD LETTER'? AR",
  },
  'event.life.bullied': {
    en: 'A bully made fun of your shoes at school.',
    ar: 'A bully made fun of your shoes at school. AR',
  },
  'event.life.business_trip': {
    en: 'Boss wants you to go on a boring conference trip to Ohio.',
    ar: 'Boss wants you to go on a boring conference trip to Ohio. AR',
  },
  'event.life.business_trip.choice.0': { en: 'Go', ar: 'Go AR' },
  'event.life.business_trip.choice.1': { en: 'Fake sick', ar: 'Fake sick AR' },
  'event.life.business_trip.outcome.0': {
    en: 'You earned a per diem bonus.',
    ar: 'You earned a per diem bonus. AR',
  },
  'event.life.business_trip.outcome.1': {
    en: 'You stayed home and watched Netflix.',
    ar: 'You stayed home and watched Netflix. AR',
  },
  'event.life.cheating_test': {
    en: "You didn't study for your math test. Do you want to cheat?",
    ar: "You didn't study for your math test. Do you want to cheat? AR",
  },
  'event.life.cheating_test.choice.0': { en: 'Cheat off neighbor', ar: 'Cheat off neighbor AR' },
  'event.life.cheating_test.choice.1': { en: 'Guess honestly', ar: 'Guess honestly AR' },
  'event.life.cheating_test.outcome.0': {
    en: 'You got caught! Detention.',
    ar: 'You got caught! Detention. AR',
  },
  'event.life.cheating_test.outcome.1': {
    en: 'You managed to scrape a C-.',
    ar: 'You managed to scrape a C-. AR',
  },
  'event.life.chest_pain': {
    en: 'You are experiencing severe chest pains.',
    ar: 'You are experiencing severe chest pains. AR',
  },
  'event.life.chicken_pox': {
    en: 'You caught the Chicken Pox. You are incredibly itchy.',
    ar: 'You caught the Chicken Pox. You are incredibly itchy. AR',
  },
  'event.life.child_drawing': {
    en: 'Your child drew a picture of you. It looks like a potato.',
    ar: 'Your child drew a picture of you. It looks like a potato. AR',
  },
  'event.life.class_clown': {
    en: 'You made the whole class laugh.',
    ar: 'You made the whole class laugh. AR',
  },
  'event.life.coffee_spill': {
    en: 'You spilled hot coffee all over your white shirt.',
    ar: 'You spilled hot coffee all over your white shirt. AR',
  },
  'event.life.cold': {
    en: 'You have caught a nasty cold.',
    ar: 'You have caught a nasty cold. AR',
  },
  'event.life.crush_reject': {
    en: 'You worked up the courage to ask your crush out... and they laughed at you.',
    ar: 'You worked up the courage to ask your crush out... and they laughed at you. AR',
  },
  'event.life.crypto_scam': {
    en: "A 'friend' tells you about a guaranteed crypto coin that will moon.",
    ar: "A 'friend' tells you about a guaranteed crypto coin that will moon. AR",
  },
  'event.life.crypto_scam.choice.0': { en: 'Invest $1k', ar: 'Invest $1k AR' },
  'event.life.crypto_scam.choice.1': { en: 'Ignore', ar: 'Ignore AR' },
  'event.life.crypto_scam.outcome.0': {
    en: 'It was a rug pull! You lost it all.',
    ar: 'It was a rug pull! You lost it all. AR',
  },
  'event.life.crypto_scam.outcome.1': {
    en: 'Smart move. It crashed to zero.',
    ar: 'Smart move. It crashed to zero. AR',
  },
  'event.life.double_rainbow': {
    en: 'You saw a double rainbow! What does it mean?',
    ar: 'You saw a double rainbow! What does it mean? AR',
  },
  'event.life.driving_test': {
    en: "It's time for your driving test!",
    ar: "It's time for your driving test! AR",
  },
  'event.life.driving_test.choice.0': { en: 'Take test', ar: 'Take test AR' },
  'event.life.driving_test.choice.1': { en: 'Skip it', ar: 'Skip it AR' },
  'event.life.driving_test.outcome.0': {
    en: 'You passed! License acquired.',
    ar: 'You passed! License acquired. AR',
  },
  'event.life.driving_test.outcome.1': {
    en: "You're stuck riding the bus.",
    ar: "You're stuck riding the bus. AR",
  },
  'event.life.early_bird': {
    en: 'You ate dinner at 4:30 PM to get the Early Bird Special.',
    ar: 'You ate dinner at 4:30 PM to get the Early Bird Special. AR',
  },
  'event.life.eat_vegetables': {
    en: 'Your parents are forcing you to eat broccoli. It smells like feet.',
    ar: 'Your parents are forcing you to eat broccoli. It smells like feet. AR',
  },
  'event.life.eat_vegetables.choice.0': { en: 'Eat it', ar: 'Eat it AR' },
  'event.life.eat_vegetables.choice.1': { en: 'Throw it', ar: 'Throw it AR' },
  'event.life.eat_vegetables.outcome.0': {
    en: 'You choked it down. Gross.',
    ar: 'You choked it down. Gross. AR',
  },
  'event.life.eat_vegetables.outcome.1': {
    en: 'You threw it on the floor! Timeout!',
    ar: 'You threw it on the floor! Timeout! AR',
  },
  'event.life.family_vacation': {
    en: 'Your family went on a trip to Disney World!',
    ar: 'Your family went on a trip to Disney World! AR',
  },
  'event.life.find_contraband': {
    en: 'You found a bag of white powder on the park bench.',
    ar: 'You found a bag of white powder on the park bench. AR',
  },
  'event.life.find_contraband.choice.0': { en: 'Sell it', ar: 'Sell it AR' },
  'event.life.find_contraband.choice.1': { en: 'Leave it', ar: 'Leave it AR' },
  'event.life.find_contraband.outcome.0': {
    en: 'You sold it to a shady guy.',
    ar: 'You sold it to a shady guy. AR',
  },
  'event.life.find_contraband.outcome.1': {
    en: 'You walked away quickly.',
    ar: 'You walked away quickly. AR',
  },
  'event.life.first_apartment': {
    en: 'You moved into your first cheap apartment. It has roaches.',
    ar: 'You moved into your first cheap apartment. It has roaches. AR',
  },
  'event.life.first_kiss': {
    en: 'You had your first kiss behind the bleachers.',
    ar: 'You had your first kiss behind the bleachers. AR',
  },
  'event.life.first_zit': {
    en: 'A massive zit appeared on your nose right before school.',
    ar: 'A massive zit appeared on your nose right before school. AR',
  },
  'event.life.food_poisoning': {
    en: 'That sushi smelled funny. Now you are puking.',
    ar: 'That sushi smelled funny. Now you are puking. AR',
  },
  'event.life.found_money': {
    en: 'You found $100 on the street!',
    ar: 'You found $100 on the street! AR',
  },
  'event.life.found_phone': {
    en: 'You found an iPhone on a park bench.',
    ar: 'You found an iPhone on a park bench. AR',
  },
  'event.life.found_phone.choice.0': { en: 'Return it', ar: 'Return it AR' },
  'event.life.found_phone.choice.1': { en: 'Keep it', ar: 'Keep it AR' },
  'event.life.found_phone.outcome.0': {
    en: 'The owner gave you $20 reward!',
    ar: 'The owner gave you $20 reward! AR',
  },
  'event.life.found_phone.outcome.1': {
    en: "It's locked, but you sold it for parts.",
    ar: "It's locked, but you sold it for parts. AR",
  },
  'event.life.found_twenty': {
    en: 'You found a $20 bill in your old jeans.',
    ar: 'You found a $20 bill in your old jeans. AR',
  },
  'event.life.found_wallet': {
    en: 'You found a loaded wallet on the sidewalk. It has $200 and an ID.',
    ar: 'You found a loaded wallet on the sidewalk. It has $200 and an ID. AR',
  },
  'event.life.found_wallet.choice.0': { en: 'Return it', ar: 'Return it AR' },
  'event.life.found_wallet.choice.1': { en: 'Keep the cash', ar: 'Keep the cash AR' },
  'event.life.found_wallet.outcome.0': {
    en: 'The owner was so grateful!',
    ar: 'The owner was so grateful! AR',
  },
  'event.life.found_wallet.outcome.1': { en: 'Finders keepers!', ar: 'Finders keepers! AR' },
  'event.life.frat_party': {
    en: 'You went to a wild frat party last night.',
    ar: 'You went to a wild frat party last night. AR',
  },
  'event.life.friend_loan': {
    en: "Your friend Steve wants to borrow $500 for his 'revolutionary' app idea.",
    ar: "Your friend Steve wants to borrow $500 for his 'revolutionary' app idea. AR",
  },
  'event.life.friend_loan.choice.0': { en: 'Lend money', ar: 'Lend money AR' },
  'event.life.friend_loan.choice.1': { en: 'Refuse', ar: 'Refuse AR' },
  'event.life.friend_loan.outcome.0': {
    en: "He says he'll pay you back... eventually.",
    ar: "He says he'll pay you back... eventually. AR",
  },
  'event.life.friend_loan.outcome.1': {
    en: 'Steve is annoyed with you.',
    ar: 'Steve is annoyed with you. AR',
  },
  'event.life.grandkids_visit': {
    en: 'Your grandkids came to visit. They are extremely loud.',
    ar: 'Your grandkids came to visit. They are extremely loud. AR',
  },
  'event.life.house_party': {
    en: 'A popular kid is throwing a huge house party.',
    ar: 'A popular kid is throwing a huge house party. AR',
  },
  'event.life.house_party.choice.0': { en: 'Go', ar: 'Go AR' },
  'event.life.house_party.choice.1': { en: 'Study instead', ar: 'Study instead AR' },
  'event.life.house_party.outcome.0': { en: 'It was legendary!', ar: 'It was legendary! AR' },
  'event.life.house_party.outcome.1': {
    en: 'You aced the test, but missed the fun.',
    ar: 'You aced the test, but missed the fun. AR',
  },
  'event.life.ice_cream_truck': {
    en: 'The music of the Ice Cream Truck is heard in the distance.',
    ar: 'The music of the Ice Cream Truck is heard in the distance. AR',
  },
  'event.life.ice_cream_truck.choice.0': { en: 'Chase it', ar: 'Chase it AR' },
  'event.life.ice_cream_truck.choice.1': { en: 'Ignore', ar: 'Ignore AR' },
  'event.life.ice_cream_truck.outcome.0': {
    en: 'You got a SpongeBob popsicle.',
    ar: 'You got a SpongeBob popsicle. AR',
  },
  'event.life.ice_cream_truck.outcome.1': {
    en: 'You saved your money.',
    ar: 'You saved your money. AR',
  },
  'event.life.identity_theft': {
    en: 'Someone opened 5 credit cards in your name!',
    ar: 'Someone opened 5 credit cards in your name! AR',
  },
  'event.life.imaginary_friend': {
    en: "You made a new friend named 'Mr. Sparkles'. No one else can see him.",
    ar: "You made a new friend named 'Mr. Sparkles'. No one else can see him. AR",
  },
  'event.life.inLaw_visit': {
    en: 'Your in-laws are coming to visit for the weekend. They hate your cooking.',
    ar: 'Your in-laws are coming to visit for the weekend. They hate your cooking. AR',
  },
  'event.life.junkie_neighbor': {
    en: "Your neighbor is asking for 'sugar' at 3 AM. They look rough.",
    ar: "Your neighbor is asking for 'sugar' at 3 AM. They look rough. AR",
  },
  'event.life.jury_duty': {
    en: 'You have been summoned for Jury Duty.',
    ar: 'You have been summoned for Jury Duty. AR',
  },
  'event.life.jury_duty.choice.0': { en: 'Serve', ar: 'Serve AR' },
  'event.life.jury_duty.choice.1': { en: 'Skip it', ar: 'Skip it AR' },
  'event.life.jury_duty.outcome.0': {
    en: 'You did your civic duty.',
    ar: 'You did your civic duty. AR',
  },
  'event.life.jury_duty.outcome.1': {
    en: 'You threw the letter in the trash.',
    ar: 'You threw the letter in the trash. AR',
  },
  'event.life.layoff_rumors': {
    en: 'There are rumors of layoffs in your department.',
    ar: 'There are rumors of layoffs in your department. AR',
  },
  'event.life.lost_in_store': {
    en: 'You got lost in the grocery store! The intercom called your name.',
    ar: 'You got lost in the grocery store! The intercom called your name. AR',
  },
  'event.life.lost_tooth': {
    en: 'You lost a baby tooth! The Tooth Fairy left $5.',
    ar: 'You lost a baby tooth! The Tooth Fairy left $5. AR',
  },
  'event.life.lottery_find': {
    en: "A gust of wind blew a lottery ticket right into your face. It's a winner!",
    ar: "A gust of wind blew a lottery ticket right into your face. It's a winner! AR",
  },
  'event.life.lottery_win_small': {
    en: 'You won $5,000 in a scratch-off lottery!',
    ar: 'You won $5,000 in a scratch-off lottery! AR',
  },
  'event.life.math_tutor': {
    en: "Your parents hired a math tutor because you're failing.",
    ar: "Your parents hired a math tutor because you're failing. AR",
  },
  'event.life.memory_slip': {
    en: 'You walked into a room and completely forgot why you were there.',
    ar: 'You walked into a room and completely forgot why you were there. AR',
  },
  'event.life.migraine': {
    en: 'You have a splitting migraine.',
    ar: 'You have a splitting migraine. AR',
  },
  'event.life.office_prank': {
    en: 'Someone put your stapler in Jell-O. Classic.',
    ar: 'Someone put your stapler in Jell-O. Classic. AR',
  },
  'event.life.office_prank.choice.0': { en: 'Laugh', ar: 'Laugh AR' },
  'event.life.office_prank.choice.1': { en: 'Rage', ar: 'Rage AR' },
  'event.life.office_prank.outcome.0': {
    en: 'It was pretty funny.',
    ar: 'It was pretty funny. AR',
  },
  'event.life.office_prank.outcome.1': {
    en: 'You yelled at the whole office.',
    ar: 'You yelled at the whole office. AR',
  },
  'event.life.office_romance': {
    en: 'A cute coworker is flirting with you.',
    ar: 'A cute coworker is flirting with you. AR',
  },
  'event.life.office_romance.choice.0': { en: 'Flirt back', ar: 'Flirt back AR' },
  'event.life.office_romance.choice.1': {
    en: 'Keep it professional',
    ar: 'Keep it professional AR',
  },
  'event.life.office_romance.outcome.0': {
    en: 'You have a new work spouse!',
    ar: 'You have a new work spouse! AR',
  },
  'event.life.office_romance.outcome.1': {
    en: 'You focused on your work.',
    ar: 'You focused on your work. AR',
  },
  'event.life.parents_fighting': {
    en: 'Your parents are fighting loudly.',
    ar: 'Your parents are fighting loudly. AR',
  },
  'event.life.principal_office': {
    en: "You got sent to the Principal's office for talking back.",
    ar: "You got sent to the Principal's office for talking back. AR",
  },
  'event.life.prom_invite': {
    en: "It's Prom season! Do you want to ask your crush?",
    ar: "It's Prom season! Do you want to ask your crush? AR",
  },
  'event.life.prom_invite.choice.0': { en: 'Ask them!', ar: 'Ask them! AR' },
  'event.life.prom_invite.choice.1': { en: 'Stay home', ar: 'Stay home AR' },
  'event.life.prom_invite.outcome.0': {
    en: 'They said YES! Best night ever.',
    ar: 'They said YES! Best night ever. AR',
  },
  'event.life.prom_invite.outcome.1': {
    en: 'You played video games all night.',
    ar: 'You played video games all night. AR',
  },
  'event.life.retirement_hobby': {
    en: "You're bored in retirement. Pick a hobby?",
    ar: "You're bored in retirement. Pick a hobby? AR",
  },
  'event.life.retirement_hobby.choice.0': { en: 'Gardening', ar: 'Gardening AR' },
  'event.life.retirement_hobby.choice.1': { en: 'Birdwatching', ar: 'Birdwatching AR' },
  'event.life.retirement_hobby.outcome.0': {
    en: 'Your tomatoes are thriving!',
    ar: 'Your tomatoes are thriving! AR',
  },
  'event.life.retirement_hobby.outcome.1': {
    en: 'You saw a rare Blue Jay.',
    ar: 'You saw a rare Blue Jay. AR',
  },
  'event.life.scam_call': {
    en: 'Someone called claiming to be the IRS demanding gift cards.',
    ar: 'Someone called claiming to be the IRS demanding gift cards. AR',
  },
  'event.life.scam_call.choice.0': { en: 'Pay them', ar: 'Pay them AR' },
  'event.life.scam_call.choice.1': { en: 'Hang up', ar: 'Hang up AR' },
  'event.life.scam_call.outcome.0': { en: 'You got scammed!', ar: 'You got scammed! AR' },
  'event.life.scam_call.outcome.1': { en: 'Not today, scammers.', ar: 'Not today, scammers. AR' },
  'event.life.school_play': {
    en: 'You got the lead role in the school play!',
    ar: 'You got the lead role in the school play! AR',
  },
  'event.life.scraped_knee': {
    en: 'You fell off your bike and scraped your knee.',
    ar: 'You fell off your bike and scraped your knee. AR',
  },
  'event.life.shoplifting_dare': {
    en: "Your 'friends' dare you to steal a candy bar.",
    ar: "Your 'friends' dare you to steal a candy bar. AR",
  },
  'event.life.shoplifting_dare.choice.0': { en: 'Do it', ar: 'Do it AR' },
  'event.life.shoplifting_dare.choice.1': { en: 'Chicken out', ar: 'Chicken out AR' },
  'event.life.shoplifting_dare.outcome.0': {
    en: 'You did it. The rush was intense.',
    ar: 'You did it. The rush was intense. AR',
  },
  'event.life.shoplifting_dare.outcome.1': {
    en: 'They called you a wimp.',
    ar: 'They called you a wimp. AR',
  },
  'event.life.skip_school': {
    en: 'Your friends want to skip school to go to the mall.',
    ar: 'Your friends want to skip school to go to the mall. AR',
  },
  'event.life.skip_school.choice.0': { en: 'Skip school', ar: 'Skip school AR' },
  'event.life.skip_school.choice.1': { en: 'Go to class', ar: 'Go to class AR' },
  'event.life.skip_school.outcome.0': {
    en: 'You had a blast, but missed a test.',
    ar: 'You had a blast, but missed a test. AR',
  },
  'event.life.skip_school.outcome.1': {
    en: 'You learned about photosynthesis. Yay.',
    ar: 'You learned about photosynthesis. Yay. AR',
  },
  'event.life.sneak_out': {
    en: "There's a concert tonight. Do you sneak out?",
    ar: "There's a concert tonight. Do you sneak out? AR",
  },
  'event.life.sneak_out.choice.0': { en: 'Sneak out', ar: 'Sneak out AR' },
  'event.life.sneak_out.choice.1': { en: 'Stay home', ar: 'Stay home AR' },
  'event.life.sneak_out.outcome.0': {
    en: 'It was awesome! Detailed evaded parents.',
    ar: 'It was awesome! Detailed evaded parents. AR',
  },
  'event.life.sneak_out.outcome.1': { en: 'You have FOMO.', ar: 'You have FOMO. AR' },
  'event.life.solicitor': {
    en: 'A door-to-door salesman is trying to sell you magazines.',
    ar: 'A door-to-door salesman is trying to sell you magazines. AR',
  },
  'event.life.solicitor.choice.0': { en: 'Buy ($20)', ar: 'Buy ($20) AR' },
  'event.life.solicitor.choice.1': { en: 'Slam door', ar: 'Slam door AR' },
  'event.life.solicitor.outcome.0': { en: 'You are too nice.', ar: 'You are too nice. AR' },
  'event.life.solicitor.outcome.1': { en: 'Take that!', ar: 'Take that! AR' },
  'event.life.stray_dog': {
    en: 'You found a stray dog on the way home! Can you keep it?',
    ar: 'You found a stray dog on the way home! Can you keep it? AR',
  },
  'event.life.stray_dog.choice.0': { en: 'Beg parents', ar: 'Beg parents AR' },
  'event.life.stray_dog.choice.1': { en: 'Leave it', ar: 'Leave it AR' },
  'event.life.stray_dog.outcome.0': {
    en: 'They said YES! You named him Buster.',
    ar: 'They said YES! You named him Buster. AR',
  },
  'event.life.stray_dog.outcome.1': {
    en: 'You walked away feeling sad.',
    ar: 'You walked away feeling sad. AR',
  },
  'event.life.studied_hard': {
    en: 'You studied hard at school.',
    ar: 'You studied hard at school. AR',
  },
  'event.life.teacher_scolded': {
    en: 'Your teacher scolded you in front of everyone.',
    ar: 'Your teacher scolded you in front of everyone. AR',
  },
  'event.life.team_building': {
    en: 'Mandatory team building exercise: Trust Falls.',
    ar: 'Mandatory team building exercise: Trust Falls. AR',
  },
  'event.life.team_building.choice.0': { en: 'Participate', ar: 'Participate AR' },
  'event.life.team_building.choice.1': { en: 'Skip it', ar: 'Skip it AR' },
  'event.life.team_building.outcome.0': { en: 'Dave dropped you.', ar: 'Dave dropped you. AR' },
  'event.life.team_building.outcome.1': {
    en: 'You hid in the bathroom.',
    ar: 'You hid in the bathroom. AR',
  },
  'event.life.technophobia': {
    en: "You can't figure out how to work the new TV remote.",
    ar: "You can't figure out how to work the new TV remote. AR",
  },
  'event.life.time_traveler': {
    en: "A person in a silver suit appears and asks: 'WHAT YEAR IS IT?!'",
    ar: "A person in a silver suit appears and asks: 'WHAT YEAR IS IT?!' AR",
  },
  'event.life.time_traveler.choice.0': { en: 'Tell them', ar: 'Tell them AR' },
  'event.life.time_traveler.choice.1': { en: 'Run away', ar: 'Run away AR' },
  'event.life.time_traveler.outcome.0': {
    en: 'They typed it into a watch and vanished.',
    ar: 'They typed it into a watch and vanished. AR',
  },
  'event.life.time_traveler.outcome.1': {
    en: 'You ran deeply into the night.',
    ar: 'You ran deeply into the night. AR',
  },
  'event.life.traffic_jam': {
    en: 'Stuck in brutal traffic on the way to work.',
    ar: 'Stuck in brutal traffic on the way to work. AR',
  },
  'event.life.treehouse_build': {
    en: 'Your dad built a treehouse in the backyard!',
    ar: 'Your dad built a treehouse in the backyard! AR',
  },
  'event.life.vape_offer': {
    en: 'The cool kids are vaping in the bathroom. They offer you a hit.',
    ar: 'The cool kids are vaping in the bathroom. They offer you a hit. AR',
  },
  'event.life.vape_offer.choice.0': { en: 'Try it', ar: 'Try it AR' },
  'event.life.vape_offer.choice.1': { en: 'Refuse', ar: 'Refuse AR' },
  'event.life.vape_offer.outcome.0': {
    en: "You coughed everywhere, but they think you're cool.",
    ar: "You coughed everywhere, but they think you're cool. AR",
  },
  'event.life.vape_offer.outcome.1': {
    en: 'They called you a nerd.',
    ar: 'They called you a nerd. AR',
  },
  'event.life.viral_video': {
    en: 'You filmed a funny video of your cat. Post it?',
    ar: 'You filmed a funny video of your cat. Post it? AR',
  },
  'event.life.viral_video.choice.0': { en: 'Post it!', ar: 'Post it! AR' },
  'event.life.viral_video.choice.1': { en: 'Delete it', ar: 'Delete it AR' },
  'event.life.viral_video.outcome.0': {
    en: 'It went viral! 500k views!',
    ar: 'It went viral! 500k views! AR',
  },
  'event.life.viral_video.outcome.1': {
    en: 'Probably for the best.',
    ar: 'Probably for the best. AR',
  },
  'event.life.witness_crime': {
    en: 'You just saw a guy smashing a car window!',
    ar: 'You just saw a guy smashing a car window! AR',
  },
  'event.life.witness_crime.choice.0': { en: 'Call Police', ar: 'Call Police AR' },
  'event.life.witness_crime.choice.1': { en: 'Walk away', ar: 'Walk away AR' },
  'event.life.witness_crime.outcome.0': {
    en: 'The police arrived and thanked you.',
    ar: 'The police arrived and thanked you. AR',
  },
  'event.life.witness_crime.outcome.1': { en: 'Not your problem.', ar: 'Not your problem. AR' },
  'event.life.work_bestie': {
    en: 'You found a work bestie! Lunch is now fun.',
    ar: 'You found a work bestie! Lunch is now fun. AR',
  },
  'event.pandemic.pan_infected': {
    en: 'You have tested positive for the virus.',
    ar: 'You have tested positive for the virus. AR',
  },
  'event.pandemic.pan_lockdown': {
    en: 'The government has issued a strict lockdown. No leaving the house!',
    ar: 'The government has issued a strict lockdown. No leaving the house! AR',
  },
  'event.pandemic.pan_mask': {
    en: 'A lady in the grocery store refuses to wear a mask and is screaming.',
    ar: 'A lady in the grocery store refuses to wear a mask and is screaming. AR',
  },
  'event.pandemic.pan_mask.choice.0': { en: 'Confront her', ar: 'Confront her AR' },
  'event.pandemic.pan_mask.choice.1': { en: 'Ignore her', ar: 'Ignore her AR' },
  'event.pandemic.pan_mask.outcome.0': { en: 'She coughed on you.', ar: 'She coughed on you. AR' },
  'event.pandemic.pan_mask.outcome.1': {
    en: 'You bought your beans and left.',
    ar: 'You bought your beans and left. AR',
  },
  'event.pandemic.pan_remote': {
    en: 'Your job has switched to remote work.',
    ar: 'Your job has switched to remote work. AR',
  },
  'event.seasonal.bucket_list': {
    en: 'You crossed off a bucket list item! Life feels complete.',
    ar: 'You crossed off a bucket list item! Life feels complete. AR',
  },
  'event.seasonal.burnout': {
    en: "You're completely burned out. Work and life have drained all your energy.",
    ar: "You're completely burned out. Work and life have drained all your energy. AR",
  },
  'event.seasonal.charity_knock': {
    en: 'A charity志愿者 knocked on your door. You donated what you could spare.',
    ar: 'A charity志愿者 knocked on your door. You donated what you could spare. AR',
  },
  'event.seasonal.deja_vu': {
    en: 'You experienced intense déjà vu. The moment felt strangely familiar.',
    ar: 'You experienced intense déjà vu. The moment felt strangely familiar. AR',
  },
  'event.seasonal.drivers_license': {
    en: "You passed your driver's license test! Freedom awaits.",
    ar: "You passed your driver's license test! Freedom awaits. AR",
  },
  'event.seasonal.failed_drivers_test': {
    en: "You failed your driver's license test. Parallel parking is impossible.",
    ar: "You failed your driver's license test. Parallel parking is impossible. AR",
  },
  'event.seasonal.fall_harvest': {
    en: 'You visited a harvest festival and enjoyed fresh apple cider.',
    ar: 'You visited a harvest festival and enjoyed fresh apple cider. AR',
  },
  'event.seasonal.fall_leaves': {
    en: 'The autumn leaves are beautiful this year. You take a peaceful walk.',
    ar: 'The autumn leaves are beautiful this year. You take a peaceful walk. AR',
  },
  'event.seasonal.fall_weather': {
    en: 'A big storm is rolling in. You lose power for a day.',
    ar: 'A big storm is rolling in. You lose power for a day. AR',
  },
  'event.seasonal.first_crush': {
    en: 'You have a massive crush on someone. Your heart races every time you see them.',
    ar: 'You have a massive crush on someone. Your heart races every time you see them. AR',
  },
  'event.seasonal.first_sleepover': {
    en: 'You went to your first sleepover! You stayed up all night telling stories.',
    ar: 'You went to your first sleepover! You stayed up all night telling stories. AR',
  },
  'event.seasonal.flat_tire': {
    en: 'You got a flat tire on the way to an important meeting. What a day.',
    ar: 'You got a flat tire on the way to an important meeting. What a day. AR',
  },
  'event.seasonal.food_poisoning': {
    en: "You got food poisoning from last night's dinner. Never again.",
    ar: "You got food poisoning from last night's dinner. Never again. AR",
  },
  'event.seasonal.grandchild_birth': {
    en: 'You became a grandparent! The newest addition to the family has arrived.',
    ar: 'You became a grandparent! The newest addition to the family has arrived. AR',
  },
  'event.seasonal.housewarming': {
    en: 'You hosted a housewarming party. Your new home feels alive!',
    ar: 'You hosted a housewarming party. Your new home feels alive! AR',
  },
  'event.seasonal.internet_famous': {
    en: "A video of you went viral! You're suddenly internet famous.",
    ar: "A video of you went viral! You're suddenly internet famous. AR",
  },
  'event.seasonal.lost_pet': {
    en: "Your pet ran away! You searched everywhere but couldn't find them.",
    ar: "Your pet ran away! You searched everywhere but couldn't find them. AR",
  },
  'event.seasonal.lost_wallet': {
    en: 'You lost your wallet! Someone returned it with everything still inside.',
    ar: 'You lost your wallet! Someone returned it with everything still inside. AR',
  },
  'event.seasonal.lucky_penny': {
    en: 'You found a lucky penny heads up. Maybe today will be a good day!',
    ar: 'You found a lucky penny heads up. Maybe today will be a good day! AR',
  },
  'event.seasonal.neighbor_noise': {
    en: "Your neighbors are being extremely loud again. You can't get any peace.",
    ar: "Your neighbors are being extremely loud again. You can't get any peace. AR",
  },
  'event.seasonal.new_year': {
    en: 'Happy New Year! You reflect on the past year and set new goals.',
    ar: 'Happy New Year! You reflect on the past year and set new goals. AR',
  },
  'event.seasonal.perfect_weather': {
    en: 'The weather is absolutely perfect today. Not too hot, not too cold.',
    ar: 'The weather is absolutely perfect today. Not too hot, not too cold. AR',
  },
  'event.seasonal.power_outage': {
    en: 'A power outage plunged your neighborhood into darkness. You made the best of it with candlelight.',
    ar: 'A power outage plunged your neighborhood into darkness. You made the best of it with candlelight. AR',
  },
  'event.seasonal.prom_night': {
    en: "It's prom night! You danced the night away and made memories to last a lifetime.",
    ar: "It's prom night! You danced the night away and made memories to last a lifetime. AR",
  },
  'event.seasonal.promotion_party': {
    en: 'Your colleagues threw you a surprise party for your recent promotion!',
    ar: 'Your colleagues threw you a surprise party for your recent promotion! AR',
  },
  'event.seasonal.rainy_day_cozy': {
    en: "It's a rainy day. You stayed inside with a good book and hot tea.",
    ar: "It's a rainy day. You stayed inside with a good book and hot tea. AR",
  },
  'event.seasonal.random_act_of_kindness': {
    en: 'A stranger paid for your coffee today. Kindness is contagious!',
    ar: 'A stranger paid for your coffee today. Kindness is contagious! AR',
  },
  'event.seasonal.reconnect_old_friend': {
    en: 'You ran into an old friend from school. You caught up like no time had passed.',
    ar: 'You ran into an old friend from school. You caught up like no time had passed. AR',
  },
  'event.seasonal.retirement_party': {
    en: "Your coworkers threw you a retirement party. You'll miss this place.",
    ar: "Your coworkers threw you a retirement party. You'll miss this place. AR",
  },
  'event.seasonal.school_play': {
    en: 'You were cast in the school play! The audience gave you a standing ovation.',
    ar: 'You were cast in the school play! The audience gave you a standing ovation. AR',
  },
  'event.seasonal.science_fair': {
    en: 'You won first place at the science fair! Your project impressed the judges.',
    ar: 'You won first place at the science fair! Your project impressed the judges. AR',
  },
  'event.seasonal.scout_trip': {
    en: 'Your scout troop went camping. You learned to build a fire and tie knots.',
    ar: 'Your scout troop went camping. You learned to build a fire and tie knots. AR',
  },
  'event.seasonal.senior_health_scare': {
    en: 'You had a health scare. It makes you appreciate every moment.',
    ar: 'You had a health scare. It makes you appreciate every moment. AR',
  },
  'event.seasonal.spring_allergies': {
    en: 'Your spring allergies are acting up. You feel miserable.',
    ar: 'Your spring allergies are acting up. You feel miserable. AR',
  },
  'event.seasonal.spring_cleaning': {
    en: 'You did some spring cleaning and found $50 in an old coat.',
    ar: 'You did some spring cleaning and found $50 in an old coat. AR',
  },
  'event.seasonal.spring_flowers': {
    en: 'Spring is in the air! Flowers are blooming everywhere.',
    ar: 'Spring is in the air! Flowers are blooming everywhere. AR',
  },
  'event.seasonal.strange_encounter': {
    en: 'You met someone who looks exactly like you. Strangest thing that ever happened.',
    ar: 'You met someone who looks exactly like you. Strangest thing that ever happened. AR',
  },
  'event.seasonal.summer_heatwave': {
    en: 'A brutal heatwave has hit your area. Stay hydrated!',
    ar: 'A brutal heatwave has hit your area. Stay hydrated! AR',
  },
  'event.seasonal.summer_romance': {
    en: 'You had a summer fling! Nothing serious, but it was fun.',
    ar: 'You had a summer fling! Nothing serious, but it was fun. AR',
  },
  'event.seasonal.summer_vacation': {
    en: 'You took a summer vacation to the beach!',
    ar: 'You took a summer vacation to the beach! AR',
  },
  'event.seasonal.surprise_gift': {
    en: "You received a surprise gift in the mail! It's from an anonymous admirer.",
    ar: "You received a surprise gift in the mail! It's from an anonymous admirer. AR",
  },
  'event.seasonal.teen_stress': {
    en: 'The pressure of school and social life is overwhelming you.',
    ar: 'The pressure of school and social life is overwhelming you. AR',
  },
  'event.seasonal.winter_blues': {
    en: 'The short days are getting to you. You feel a bit depressed.',
    ar: 'The short days are getting to you. You feel a bit depressed. AR',
  },
  'event.seasonal.winter_holidays': {
    en: 'The holiday season is here! You exchange gifts with loved ones.',
    ar: 'The holiday season is here! You exchange gifts with loved ones. AR',
  },
  'event.seasonal.winter_snow': {
    en: 'A massive snowstorm has blanketed the city. Everything is closed.',
    ar: 'A massive snowstorm has blanketed the city. Everything is closed. AR',
  },
};

const GAME_MESSAGE_BY_ENGLISH = new Map(
  Object.entries(GAME_MESSAGES).map(([key, translations]) => [
    translations.en,
    { key, ...translations },
  ])
);

function interpolateMessage(template, params = {}) {
  return String(template).replace(/\{([a-zA-Z0-9_]+)\}/g, (placeholder, name) =>
    params[name] === undefined || params[name] === null ? placeholder : String(params[name])
  );
}

export function translateGameMessage(languageId, messageKey, params = {}, fallback = messageKey) {
  if (!messageKey) {
    return fallback;
  }

  if (messageKey.startsWith('worldEvent.') && messageKey.endsWith('.announcement')) {
    const eventId = messageKey.slice('worldEvent.'.length, -'.announcement'.length);
    const name = translateGameMessage(languageId, `worldEvent.${eventId}.name`, {}, eventId);
    const description = translateGameMessage(
      languageId,
      `worldEvent.${eventId}.description`,
      {},
      fallback
    );
    return languageId === 'ar'
      ? `[حدث عالمي] ${name}: ${description}`
      : `[World Event] ${name}: ${description}`;
  }

  const definition = GAME_MESSAGES[messageKey];
  let template = definition?.[languageId] || definition?.en;

  if (!template && languageId === 'ar' && typeof fallback === 'string') {
    template = AR_GAME_TEXT[fallback] || fallback;
  }
  if (!template) {
    template = fallback;
  }

  const localizedParams =
    languageId === 'ar'
      ? Object.fromEntries(
          Object.entries(params).map(([name, value]) => {
            const localized =
              typeof value === 'string' ? GAME_MESSAGE_BY_ENGLISH.get(value)?.ar : undefined;
            return [name, localized || value];
          })
        )
      : params;

  return interpolateMessage(template, localizedParams);
}

const AR_GAME_TEXT = {
  'You were born a Male in a hospital.': 'وُلدت ذكرا في المستشفى.',
  'You were born a Female in a hospital.': 'وُلدت أنثى في المستشفى.',
  'You studied hard at school.': 'درست بجد في المدرسة.',
  'A bully made fun of your shoes at school.': 'سخر منك متنمر في المدرسة.',
  'Your parents are fighting loudly.': 'والداك يتشاجران بصوت عال.',
  'Your family went on a trip to Disney World!': 'ذهبت عائلتك في رحلة ممتعة!',
  'You lost a baby tooth! The Tooth Fairy left $5.': 'سقط أحد أسنانك اللبنية وحصلت على 5 دولارات.',
  'You made the whole class laugh.': 'أضحكت الصف كله.',
  'Your teacher scolded you in front of everyone.': 'وبخك المعلم أمام الجميع.',
  'You had your first kiss behind the bleachers.': 'عشت أول لحظة رومانسية في المدرسة.',
  'You have a terrible breakout of acne.': 'ظهر حب الشباب بشكل مزعج.',
  'You have caught a nasty cold.': 'أُصبت بزكام قوي.',
  'You have a splitting migraine.': 'أُصبت بصداع شديد.',
  'You found $100 on the street!': 'وجدت 100 دولار في الشارع!',
  'You worked out at the gym.': 'تمرنت في النادي.',
  'You meditated and found inner peace.': 'تأملت ووجدت بعض السلام الداخلي.',
  'You read a book at the library.': 'قرأت كتابا في المكتبة.',
  'You danced all night at the club!': 'رقصت طوال الليل.',
  'You went out looking for love...': 'خرجت تبحث عن الحب...',
  'You bought a lottery ticket...': 'اشتريت ورقة يانصيب...',
  'You went backpacking!': 'سافرت بميزانية بسيطة.',
  'You relaxed on a world cruise.': 'استرخيت في رحلة فاخرة.',
  'You planned your estate.': 'خططت لإرثك.',
  'You have died.': 'لقد توفيت.',
  'You have been released from prison!': 'تم إطلاق سراحك من السجن!',
  'The pandemic isolation is getting to you.': 'العزلة بدأت تؤثر عليك.',
  'Good Karma! You found a diamond ring on the floor.': 'كارما جيدة! وجدت خاتما ثمينا.',
  'Bad Karma! A bird pooped on your head.': 'كارما سيئة! حدث لك موقف محرج.',
  'A fan asked for your autograph!': 'طلب منك معجب توقيعك!',
  'A fan was stalking you...': 'كان أحد المعجبين يلاحقك...',
  'Not your problem.': 'ليست مشكلتك.',
  'Smart move. It crashed to zero.': 'قرار ذكي. انهار كل شيء.',
  'You focused on your work.': 'ركزت على عملك.',
  'Maybe next year.': 'ربما في العام القادم.',
  'You saved your money.': 'حافظت على مالك.',
  'You walked away quickly.': 'ابتعدت بسرعة.',
  'You are too young to work full-time!': 'أنت صغير جدا على العمل بدوام كامل!',
  'You must be 18 to manage assets!': 'يجب أن تبلغ 18 سنة لإدارة الأملاك!',
  'You are too young to date!': 'أنت صغير جدا على المواعدة!',
  'You must be 18 to create a will!': 'يجب أن تبلغ 18 سنة لإنشاء وصية!',
  'Game Saved!': 'تم حفظ اللعبة!',
  'Failed to load save.': 'فشل تحميل الحفظ.',
  'Cheat off neighbor': 'انقل من زميلك',
  'Guess honestly': 'خمن بصدق',
  'Ask them!': 'اسألهم!',
  'Stay home': 'ابق في البيت',
  'Post it!': 'انشره!',
  'Delete it': 'احذفه',
  'Report her': 'بلّغ عنها',
  Go: 'اذهب',
  'Fake sick': 'تظاهر بالمرض',
  Scream: 'اصرُخ',
  communicate: 'تواصل',
  'Apologize profusely': 'اعتذر كثيرا',
  "Pretend you didn't": 'تظاهر أنك لم تنس',
  'Beg parents': 'توسل لوالديك',
  'Leave it': 'اتركه',
  'Eat it': 'كله',
  'Throw it': 'ارمه',
  'Chase it': 'الحق به',
  Ignore: 'تجاهل',
  'Ignore it': 'تجاهل الأمر',
  'Try it': 'جرب',
  Refuse: 'ارفض',
  'Skip school': 'تغيب عن المدرسة',
  'Go to class': 'اذهب للحصة',
  'Take test': 'اجتز الاختبار',
  'Skip it': 'تجاهل الأمر',
  'Study instead': 'ادرس بدلا من ذلك',
  'Sneak out': 'اخرج سرا',
  'Do it': 'افعلها',
  'Chicken out': 'تراجع',
  'Return it': 'أعده لصاحبه',
  'Keep the cash': 'احتفظ بالمال',
  'Call Police': 'اتصل بالشرطة',
  'Walk away': 'ابتعد',
  'Report them': 'بلّغ عنهم',
  Laugh: 'اضحك',
  Rage: 'اغضب',
  'Flirt back': 'بادله/بادليها الغزل',
  'Keep it professional': 'ابق الأمر مهنيا',
  Participate: 'شارك',
  'Hang up': 'أغلق الخط',
  Gardening: 'البستنة',
  'Tell them': 'أخبرهم',
  'Run away': 'اهرب',
  'Sell it': 'بعه',
  'Buy ($20)': 'اشترِ (20 دولار)',
  'Slam door': 'أغلق الباب بقوة',
  // --- Childhood Events ---
  'You started Elementary School.': 'بدأت المدرسة الابتدائية.',
  'You started High School.': 'بدأت المدرسة الثانوية.',
  'You graduated from Elementary School!': 'تخرجت من المدرسة الابتدائية!',
  'You graduated from High School!': 'تخرجت من المدرسة الثانوية!',
  'You enrolled in college!': 'التحقت بالجامعة!',
  'You graduated from college!': 'تخرجت من الجامعة!',
  'You dropped out of school.': 'تركت المدرسة.',
  'You got your first job!': 'حصلت على أول وظيفة!',
  'You practiced the guitar.': 'تدربت على الجيتار.',
  'You practiced the piano.': 'تدربت على البيانو.',
  'You are now eligible to apply for citizenship.': 'أصبحت مؤهلا للتقديم على الجنسية.',
  // --- Relationship Events ---
  'You broke up with your partner.': 'انفصلت عن شريكك.',
  'You got married!': 'تزوجت!',
  'Your partner proposed to you!': 'شريكك تقدم لخطبتك!',
  'You had a child!': 'رزقت بطفل!',
  'Your pet died.': 'مات حيوانك الأليف.',
  'You adopted a pet.': 'تبنيت حيوانا أليفا.',
  // --- Career & Money ---
  'You got a promotion!': 'حصلت على ترقية!',
  'You were fired from your job.': 'تم طردك من العمل.',
  'You retired from your job.': 'تقاعدت من عملك.',
  'Your business went bankrupt!': 'أفلست شركتك!',
  'Your company earned a profit!': 'حققت شركتك أرباحا!',
  'The economy has entered a recession.': 'دخل الاقتصاد في ركود.',
  'The economy is booming!': 'الاقتصاد يزدهر!',
  'Your investment paid off!': 'استثمارك أثمر!',
  'You lost money on your investment.': 'خسرت مالا في استثمارك.',
  'War has been declared!': 'أُعلنت الحرب!',
  'A GLOBAL PANDEMIC has been declared!': 'أُعلن وباء عالمي!',
  'The global pandemic has ended.': 'انتهى الوباء العالمي.',
  // --- Sports & Fitness ---
  'You made the sports team!': 'انضممت لفريق رياضي!',
  'You went professional!': 'احترفت الرياضة!',
  'You won a championship!': 'فزت ببطولة!',
  'You exercised at the gym.': 'تمرنت في النادي.',
  'You went for a run.': 'ذهبت للجري.',
  'You did yoga.': 'مارست اليوغا.',
  'You lifted weights.': 'رفعت أثقالا.',
  'You are overweight.': 'وزنك زائد.',
  'You are obese.': 'أنت مصاب بالسمنة.',
  'You are underweight.': 'وزنك ناقص.',
  'You are at a healthy weight.': 'وزنك صحي.',
  // --- Crime & Prison ---
  'You committed a crime.': 'ارتكبت جريمة.',
  'You were sent to prison.': 'تم إرسالك إلى السجن.',
  'You worked out in the yard.': 'تمرنت في ساحة السجن.',
  'You read a book in the prison library.': 'قرأت كتابا في مكتبة السجن.',
  'You tried to escape!': 'حاولت الهرب!',
  'You were caught escaping!': 'تم القبض عليك وأنت تهرب!',
  'A riot broke out!': 'اندلعت أعمال شغب!',
  'You joined a prison gang.': 'انضممت إلى عصابة سجن.',
  // --- Royalty ---
  'You were born into royalty!': 'وُلدت في عائلة ملكية!',
  'You abdicated the throne.': 'تنازلت عن العرش.',
  'The kingdom is at peace.': 'المملكة في سلام.',
  'The kingdom is in turmoil!': 'المملكة في فوضى!',
  // --- Space ---
  'You joined the space program!': 'انضممت لبرنامج الفضاء!',
  'You completed space training.': 'أكملت تدريب الفضاء.',
  'Your space mission was a success!': 'نجحت مهمتك الفضائية!',
  'The mission ended in disaster.': 'انتهت المهمة بكارثة.',
  // --- Misc Gameplay ---
  'You are too exhausted to do that.': 'أنت مرهق جدا لفعل ذلك.',
  'You cannot afford that!': 'لا تستطيع تحمل التكلفة!',
  'You need more stress relief.': 'تحتاج إلى تخفيف التوتر.',
  'You are not old enough.': 'عمرك لا يسمح بذلك.',
  // --- Event outcome texts ---
  'You got caught! Detention.': 'تم القبض عليك! احتجاز.',
  'You managed to scrape a C-.': 'نجحت بصعوبة بالغة.',
  'They said YES! Best night ever.': 'قالوا نعم! أفضل ليلة على الإطلاق.',
  'You played video games all night.': 'لعبت ألعاب الفيديو طوال الليل.',
  'It went viral! 500k views!': 'انتشر الفيديو! 500 ألف مشاهدة!',
  'Probably for the best.': 'الأفضل على الأرجح.',
  'HR gave her a warning.': 'قسم الموارد البشرية أنذرها.',
  'She ran to the bathroom screaming.': 'ركضت إلى الحمام وهي تصرخ.',
  'You earned a per diem bonus.': 'حصلت على علاوة يومية.',
  'You stayed home and watched Netflix.': 'بقيت في المنزل وشاهدت نتفلكس.',
  'They probed you and dumped you in a cornfield.': 'قاموا بفحصك وألقوك في حقل ذرة.',
  'They gave you knowledge of the universe.': 'أعطوك معرفة الكون.',
  'You bought expensive flowers. They still mad.': 'اشتريت زهورا باهظة. ما زالوا غاضبين.',
  'They saw right through you. Sleeping on couch.': 'اكتشفوا حقيقتك. نمت على الأريكة.',
  'They said YES! You named him Buster.': 'قالوا نعم أسميته بستر.',
  'You walked away feeling sad.': 'ابتعدت وأنت حزين.',
  'You choked it down. Gross.': 'بلعته بصعوبة. مقرف.',
  'You threw it on the floor! Timeout!': 'رميته على الأرض! عقاب!',
  'You got a SpongeBob popsicle.': 'حصلت على مثلجات سبونج بوب.',
  'You coughed everywhere, but you looked cool.': 'سعلت في كل مكان لكن بدوت رائعا.',
  'They called you a nerd.': 'وصفوك بالمهووس.',
  'You had a blast, but missed a test.': 'استمتعت لكنك فاتك اختبار.',
  'You learned about photosynthesis. Yay.': 'تعلمت عن التمثيل الضوئي. مرحى.',
  'You passed! License acquired.': 'نجحت حصلت على الرخصة.',
  "You're stuck riding the bus.": 'بقيت تستقل الحافلة.',
  'It was legendary!': 'كانت أسطورية!',
  'You aced the test, but missed the fun.': 'تفوقت في الاختبار لكن فاتتك المتعة.',
  'It was awesome! You evaded your parents.': 'كان رائعا تهربت من والديك.',
  'You have FOMO.': 'تشعر بالندم على ما فات.',
  'You did it. The rush was intense.': 'فعلتها. الشعور كان قويا.',
  'They called you a wimp.': 'وصفوك بالجبان.',
  'Life changing experience!': 'تجربة غيرت حياتك!',
  'The owner was so grateful!': 'كان المالك ممتنا جدا!',
  'Finders keepers!': 'من وجده يملكه!',
  'The police arrived and thanked you.': 'وصلت الشرطة وشكرتك.',
  'He says he will pay you back... eventually.': 'يقول أنه سيرد لك المال في النهاية.',
  'Steve is annoyed with you.': 'ستيف منزعج منك.',
  // --- Complete random-event catalog (legacy text fallbacks) ---
  'You are experiencing severe chest pains.': 'تشعر بآلام شديدة في صدرك.',
  'You won $5,000 in a scratch-off lottery!': 'ربحت 5,000 دولار في بطاقة يانصيب فورية!',
  "You didn't study for your math test. Do you want to cheat?":
    'لم تدرس لاختبار الرياضيات. هل تريد الغش؟',
  "It's Prom season! Do you want to ask your crush?":
    'حان موسم حفلة التخرج! هل تريد دعوة الشخص الذي يعجبك؟',
  "You got sent to the Principal's office for talking back.":
    'أُرسلت إلى مكتب المدير بسبب ردك غير اللائق.',
  'You filmed a funny video of your cat. Post it?': 'صوّرت مقطعا مضحكا لقطتك. هل تنشره؟',
  'A coworker, Karen, keeps stealing your lunch.': 'تواصل زميلتك كارين سرقة غدائك.',
  'Put laxatives in it': 'ضع فيه مُليّنا',
  'Boss wants you to go on a boring conference trip to Ohio.':
    'يريد منك مديرك الذهاب إلى مؤتمر ممل في أوهايو.',
  'Someone opened 5 credit cards in your name!': 'فتح شخص خمس بطاقات ائتمانية باسمك!',
  "Your neighbor is asking for 'sugar' at 3 AM. They look rough.":
    'يطلب جارك «السكر» في الثالثة صباحا ويبدو في حالة سيئة.',
  'A bright light wakes you up... ALIENS?!': 'أيقظك ضوء ساطع... كائنات فضائية؟!',
  'You tripped over your own feet and broke your arm.': 'تعثرت بقدميك وكسرت ذراعك.',
  'That sushi smelled funny. Now you are puking.': 'كانت رائحة السوشي غريبة، والآن أنت تتقيأ.',
  'It was your anniversary yesterday... and you forgot.': 'كانت ذكرى ارتباطكما أمس... وقد نسيتها.',
  'Your in-laws are coming to visit for the weekend. They hate your cooking.':
    'سيزورك أهل شريكك في عطلة نهاية الأسبوع، وهم لا يحبون طبخك.',
  'Your child drew a picture of you. It looks like a potato.': 'رسم طفلك صورة لك تبدو كحبة بطاطس.',
  'You got curious in art class and ate a stick of glue.':
    'دفعك الفضول في حصة الفن إلى أكل قطعة صمغ.',
  'You found a stray dog on the way home! Can you keep it?':
    'وجدت كلبا ضالا في طريق العودة! هل يمكنك الاحتفاظ به؟',
  "You made a new friend named 'Mr. Sparkles'. No one else can see him.":
    'كوّنت صديقا جديدا اسمه «السيد بريق»، لكن لا أحد غيرك يراه.',
  'You got lost in the grocery store! The intercom called your name.':
    'ضللت طريقك في المتجر ونادى مكبر الصوت باسمك!',
  'Your parents are forcing you to eat broccoli. It smells like feet.':
    'يجبرك والداك على أكل البروكلي ورائحته سيئة جدا.',
  'Your dad built a treehouse in the backyard!': 'بنى والدك بيتا فوق الشجرة في الفناء!',
  'You fell off your bike and scraped your knee.': 'سقطت من دراجتك وجرحت ركبتك.',
  'You got the lead role in the school play!': 'حصلت على دور البطولة في مسرحية المدرسة!',
  'You caught the Chicken Pox. You are incredibly itchy.': 'أُصبت بجدري الماء وتشعر بحكة شديدة.',
  'The music of the Ice Cream Truck is heard in the distance.':
    'سمعت موسيقى شاحنة المثلجات من بعيد.',
  'The cool kids are vaping in the bathroom. They offer you a hit.':
    'يدخن الطلاب المشهورون سيجارة إلكترونية في الحمام وعرضوا عليك تجربتها.',
  "You coughed everywhere, but they think you're cool.": 'سعلت كثيرا، لكنهم يظنون أنك رائع.',
  'Your friends want to skip school to go to the mall.':
    'يريد أصدقاؤك التغيب عن المدرسة والذهاب إلى المركز التجاري.',
  'You worked up the courage to ask your crush out... and they laughed at you.':
    'جمعت شجاعتك لطلب موعد ممن يعجبك... لكنه ضحك عليك.',
  "It's time for your driving test!": 'حان وقت اختبار القيادة!',
  'A popular kid is throwing a huge house party.': 'يقيم طالب مشهور حفلة كبيرة في منزله.',
  'A massive zit appeared on your nose right before school.':
    'ظهرت بثرة كبيرة على أنفك قبل المدرسة مباشرة.',
  "There's a concert tonight. Do you sneak out?": 'هناك حفل موسيقي الليلة. هل تتسلل من المنزل؟',
  'It was awesome! Detailed evaded parents.': 'كان رائعا! نجحت في الإفلات من والديك.',
  "Your parents hired a math tutor because you're failing.":
    'استأجر والداك مدرسا للرياضيات لأن درجاتك ضعيفة.',
  "Your 'friends' dare you to steal a candy bar.": 'تحداك «أصدقاؤك» أن تسرق قطعة حلوى.',
  'You went to a wild frat party last night.': 'ذهبت إلى حفلة جامعية صاخبة الليلة الماضية.',
  'You pulled an all-nighter to study for finals.': 'سهرت طوال الليل للدراسة للامتحانات النهائية.',
  'You moved into your first cheap apartment. It has roaches.':
    'انتقلت إلى أول شقة رخيصة لك، لكنها مليئة بالصراصير.',
  'You have an urge to backpack across Europe.': 'تراودك رغبة في السفر بحقيبة ظهر عبر أوروبا.',
  'Go ($2k)': 'اذهب (2,000 دولار)',
  'Too poor': 'لا أملك المال',
  'You found a loaded wallet on the sidewalk. It has $200 and an ID.':
    'وجدت محفظة في الرصيف فيها 200 دولار وبطاقة هوية.',
  'You just saw a guy smashing a car window!': 'رأيت شخصا يحطم نافذة سيارة!',
  'Stuck in brutal traffic on the way to work.': 'علقت في ازدحام خانق في طريقك إلى العمل.',
  'You spilled hot coffee all over your white shirt.': 'سكبت قهوة ساخنة على قميصك الأبيض.',
  'You found a $20 bill in your old jeans.': 'وجدت ورقة نقدية بقيمة 20 دولارا في سروالك القديم.',
  'You saw a double rainbow! What does it mean?': 'رأيت قوس قزح مزدوجا! ماذا يعني ذلك؟',
  'A bird pooped directly on your head.': 'أسقط طائر فضلاته فوق رأسك مباشرة.',
  "Your friend Steve wants to borrow $500 for his 'revolutionary' app idea.":
    'يريد صديقك ستيف اقتراض 500 دولار لفكرة تطبيقه «الثورية».',
  'Lend money': 'أقرضه المال',
  "He says he'll pay you back... eventually.": 'يقول إنه سيعيد المال لك... في النهاية.',
  "A gust of wind blew a lottery ticket right into your face. It's a winner!":
    'دفعت الرياح بطاقة يانصيب إلى وجهك، واتضح أنها رابحة!',
  'You have been summoned for Jury Duty.': 'تم استدعاؤك لعضوية هيئة المحلفين.',
  Serve: 'شارك',
  'You did your civic duty.': 'أديت واجبك المدني.',
  'You threw the letter in the trash.': 'رميت الرسالة في القمامة.',
  'The barber completely messed up your hair.': 'أفسد الحلاق شعرك تماما.',
  "A 'friend' tells you about a guaranteed crypto coin that will moon.":
    'يخبرك «صديق» عن عملة رقمية مضمونة سترتفع بقوة.',
  'Invest $1k': 'استثمر 1,000 دولار',
  'It was a rug pull! You lost it all.': 'كانت عملية احتيال! خسرت كل شيء.',
  'A shady client offers you a bribe to ignore protocol.':
    'عرض عليك عميل مشبوه رشوة لتجاهل الإجراءات.',
  'Take Bribe ($5k)': 'خذ الرشوة (5,000 دولار)',
  "You took the cash. Hope you don't get caught.": 'أخذت المال. آمل ألا يتم القبض عليك.',
  'Your boss praised your integrity.': 'أشاد مديرك بنزاهتك.',
  'Someone put your stapler in Jell-O. Classic.': 'وضع أحدهم دباسة مكتبك داخل الهلام. مقلب تقليدي.',
  'It was pretty funny.': 'كان الأمر مضحكا بالفعل.',
  'You yelled at the whole office.': 'صرخت في وجه الجميع في المكتب.',
  'There are rumors of layoffs in your department.': 'تنتشر شائعات عن تسريح موظفين في قسمك.',
  'A cute coworker is flirting with you.': 'يزاحك زميل جذاب في العمل.',
  'You have a new work spouse!': 'أصبح لديك رفيق مقرّب جديد في العمل!',
  "The office copier is broken again. 'PC LOAD LETTER'?":
    'تعطلت آلة النسخ في المكتب مجددا، وتعرض رسالة غامضة.',
  'You found a work bestie! Lunch is now fun.':
    'وجدت صديقا مقربا في العمل، فأصبح وقت الغداء ممتعا.',
  'Mandatory team building exercise: Trust Falls.':
    'تمرين إلزامي لبناء الفريق: السقوط والثقة بالزملاء.',
  'Dave dropped you.': 'تركك ديف تسقط.',
  'You hid in the bathroom.': 'اختبأت في الحمام.',
  'Your grandkids came to visit. They are extremely loud.': 'جاء أحفادك للزيارة وهم صاخبون جدا.',
  'You walked into a room and completely forgot why you were there.':
    'دخلت غرفة ثم نسيت تماما سبب دخولك.',
  'Someone called claiming to be the IRS demanding gift cards.':
    'اتصل شخص يدّعي أنه من مصلحة الضرائب ويطلب بطاقات هدايا.',
  'Pay them': 'ادفع لهم',
  'You got scammed!': 'وقعت ضحية احتيال!',
  'Not today, scammers.': 'لن تنجحوا اليوم أيها المحتالون.',
  "You're bored in retirement. Pick a hobby?": 'تشعر بالملل بعد التقاعد. اختر هواية؟',
  'Your tomatoes are thriving!': 'تنمو طماطمك بشكل رائع!',
  Birdwatching: 'مراقبة الطيور',
  'You saw a rare Blue Jay.': 'شاهدت طائر قيق أزرق نادرا.',
  'Your hip is aching. Rain must be coming.': 'يؤلمك وركك، لا بد أن المطر قادم.',
  'You went to Bingo night and won the jackpot!': 'ذهبت إلى أمسية بينغو وربحت الجائزة الكبرى!',
  "You can't figure out how to work the new TV remote.":
    'لم تعرف كيف تستخدم جهاز التحكم الجديد للتلفاز.',
  'You ate dinner at 4:30 PM to get the Early Bird Special.':
    'تناولت العشاء في الرابعة والنصف للاستفادة من العرض المبكر.',
  "A person in a silver suit appears and asks: 'WHAT YEAR IS IT?!'":
    'ظهر شخص ببدلة فضية وسأل: «في أي سنة نحن؟!»',
  'They typed it into a watch and vanished.': 'كتب السنة في ساعته ثم اختفى.',
  'You ran deeply into the night.': 'هربت بعيدا في ظلام الليل.',
  'You found a bag of white powder on the park bench.': 'وجدت كيس مسحوق أبيض على مقعد في الحديقة.',
  'You sold it to a shady guy.': 'بعته لشخص مشبوه.',
  'Bank Error in your favor!': 'خطأ مصرفي لصالحك!',
  'You found an iPhone on a park bench.': 'وجدت هاتفا على مقعد في الحديقة.',
  'The owner gave you $20 reward!': 'منحك المالك مكافأة قدرها 20 دولارا!',
  'Keep it': 'احتفظ به',
  "It's locked, but you sold it for parts.": 'كان مقفلا، فبعته كقطع غيار.',
  'A door-to-door salesman is trying to sell you magazines.': 'يحاول بائع متجول بيعك مجلات.',
  'You are too nice.': 'أنت لطيف أكثر من اللازم.',
  'Take that!': 'خذ هذه!',
  'Your latest single is climbing the charts!': 'تتقدم أغنيتك الجديدة في قوائم الأغاني!',
  'Your experimental jazz album was a total flop.': 'فشل ألبوم الجاز التجريبي الخاص بك تماما.',
  'Your label wants you to go on a World Tour.': 'تريد شركة الإنتاج أن تنطلق في جولة عالمية.',
  'Go on Tour': 'انطلق في الجولة',
  "Sold out stadiums! You're exhausted but rich.": 'نفدت تذاكر الملاعب! أنت مرهق لكنك ثري.',
  'You worked on new music instead.': 'عملت على موسيقى جديدة بدلا من ذلك.',
  "It's the Championship Game! The score is tied.": 'إنها مباراة البطولة والنتيجة متعادلة!',
  'Pass the ball': 'مرّر الكرة',
  'Teammate scored! WE WON!': 'سجّل زميلك! لقد فزنا!',
  'Go for glory': 'حاول تسجيل نقطة الفوز',
  'You scored the winning point! MVP!': 'سجلت نقطة الفوز! أنت أفضل لاعب!',
  'You felt a pop in your knee during practice.': 'شعرت بفرقعة في ركبتك أثناء التدريب.',
  'You have been ordered to deploy to a combat zone.': 'صدرت إليك أوامر بالانتشار في منطقة قتال.',
  'Serve proudly': 'أدِّ واجبك بفخر',
  'You returned home safe with a medal.': 'عدت إلى وطنك سالما ومعك وسام.',
  Desert: 'اهرب من الخدمة',
  'You went AWOL and are now a fugitive.': 'هربت من الخدمة وأصبحت مطلوبا للعدالة.',
  'Your parents signed you up for soccer! You hate it.':
    'سجّلك والداك في كرة القدم رغم أنك لا تحبها.',
  'You started piano lessons. Your fingers hurt but it sounds nice.':
    'بدأت دروس البيانو. تؤلمك أصابعك لكن العزف جميل.',
  'You wet the bed at a sleepover. So embarrassing.':
    'بللت الفراش خلال ليلة عند صديق. يا له من إحراج.',
  'You got a pen pal from Japan! You write letters every month.':
    'أصبح لديك صديق مراسلة من اليابان وتتبادلان الرسائل كل شهر.',
  'You won a goldfish at the fair! You named it George.':
    'ربحت سمكة ذهبية في المهرجان وسميتها جورج.',
  'You broke a vase playing ball inside. You are grounded for a week.':
    'كسرت مزهرية وأنت تلعب بالكرة في المنزل، فعوقبت أسبوعا.',
  'Your family went to an amusement park! You rode the biggest rollercoaster.':
    'ذهبت عائلتك إلى مدينة الملاهي وركبت أكبر أفعوانية.',
  'Your school is having a bake sale. Do you want to help?':
    'تنظم مدرستك سوقا للمخبوزات. هل تريد المساعدة؟',
  'Bake cookies': 'اخبز البسكويت',
  'You sold out in an hour!': 'بعت كل الكمية خلال ساعة!',
  'Buy cookies': 'اشترِ البسكويت',
  'You ate six cupcakes. Worth it.': 'أكلت ست قطع كعك، وكان الأمر يستحق.',
  'You saved up and bought your first car. It is a 1998 Honda Civic with 200k miles.':
    'ادخرت واشتريت سيارتك الأولى، هوندا سيفيك قديمة قطعت مسافة طويلة.',
  'Final exams are next week and you have barely studied.':
    'الامتحانات النهائية الأسبوع القادم وبالكاد درست.',
  'You dyed your hair bright blue. Your mom is furious.': 'صبغت شعرك بالأزرق الفاقع ووالدتك غاضبة.',
  'The local pizza place is hiring. Do you want a part-time job?':
    'مطعم البيتزا المحلي يوظف. هل تريد عملا بدوام جزئي؟',
  'Take the job': 'اقبل الوظيفة',
  'You are making minimum wage, but it is your own money!':
    'تتقاضى الحد الأدنى للأجر، لكنه مالك أنت!',
  'Focus on school': 'ركّز على الدراسة',
  'You aced your classes.': 'تفوقت في دراستك.',
  'Your high school sweetheart dumped you for the quarterback.':
    'تركك حبيب المدرسة من أجل نجم فريق كرة القدم.',
  'Your dream university sent a letter. Acceptance or rejection?':
    'أرسلت جامعة أحلامك رسالة. هل هي قبول أم رفض؟',
  'Open it': 'افتحها',
  'You got in! Tears of joy.': 'تم قبولك! دموع الفرح تملأ عينيك.',
  Delay: 'أجّل فتحها',
  'You are too nervous to look.': 'أنت متوتر جدا ولا تستطيع النظر.',
  'You decided to run a marathon. You trained for months.': 'قررت خوض سباق ماراثون وتدربت لأشهر.',
  "Your therapist says you have made great progress. But your insurance won't cover the next session.":
    'يقول معالجك إنك أحرزت تقدما كبيرا، لكن التأمين لن يغطي الجلسة القادمة.',
  'Pay out of pocket': 'ادفع من مالك',
  'Your mental health is worth it.': 'صحتك النفسية تستحق ذلك.',
  'Quit therapy': 'أوقف العلاج',
  'You will be fine. Probably.': 'ستكون بخير... على الأرجح.',
  'A friend wants you to invest in their startup. It is a phone case that doubles as a wallet.':
    'يريد صديقك أن تستثمر في شركته الناشئة لصنع غطاء هاتف يعمل كمحفظة.',
  'Invest $500': 'استثمر 500 دولار',
  'It actually took off! You made $2000 back.': 'نجح المشروع بالفعل! استعدت 2,000 دولار.',
  Pass: 'ارفض',
  'You missed the next big thing.': 'فوّت الفرصة الكبيرة القادمة.',
  'Your partner has been texting a "friend" a lot lately. You feel jealous.':
    'يراسل شريكك «صديقا» كثيرا مؤخرا وتشعر بالغيرة.',
  'Confront them': 'واجه شريكك',
  'They were just planning your surprise party. Oops.':
    'كانوا يخططون لحفلة مفاجئة لك فقط. يا للإحراج.',
  'It eats at you all year.': 'ظل الشك يؤلمك طوال العام.',
  'You are having a midlife crisis. You bought a red convertible.':
    'تمر بأزمة منتصف العمر واشتريت سيارة حمراء مكشوفة.',
  'A charity asks you to make a significant donation.': 'طلبت منك جمعية خيرية تقديم تبرع كبير.',
  'Donate $100k': 'تبرع بـ100,000 دولار',
  'You changed lives. Feels amazing.': 'غيّرت حياة أناس وتشعر بسعادة كبيرة.',
  Decline: 'ارفض',
  'Your bank account is safe.': 'حسابك المصرفي بأمان.',
  'You are behind on rent. The landlord posted an eviction notice.':
    'تأخرت في دفع الإيجار ووضع المالك إشعار إخلاء.',
  'Beg for more time': 'اطلب مهلة إضافية',
  'He gave you two weeks to pay up.': 'منحك أسبوعين لتدفع.',
  'Sell belongings': 'بع بعض مقتنياتك',
  'You sold your TV and guitar. Rent paid.': 'بعت التلفاز والغيتار ودفعت الإيجار.',
  'A private equity firm offers you an exclusive investment opportunity.':
    'عرضت عليك شركة استثمار خاص فرصة حصرية.',
  'Invest $200k': 'استثمر 200,000 دولار',
  'The IPO was a massive success!': 'حقق الطرح العام نجاحا هائلا!',
  'Too risky': 'المخاطرة كبيرة',
  'It soared without you. Regret.': 'ارتفع الاستثمار من دونك وتشعر بالندم.',
  'Your pet is acting strange. Might be sick.': 'يتصرف حيوانك الأليف بغرابة وربما يكون مريضا.',
  'Vet visit': 'اذهب إلى الطبيب البيطري',
  'Just a stomach bug. They are fine!': 'مجرد اضطراب في المعدة، إنه بخير!',
  'Wait and see': 'انتظر وراقب',
  'They recovered on their own, luckily.': 'تعافى وحده لحسن الحظ.',
  'Your pet learned a new trick! They can roll over and play dead.':
    'تعلم حيوانك الأليف حيلة جديدة: التدحرج والتظاهر بالموت.',
  'A gossip site published a story about you. It is completely false.':
    'نشر موقع شائعات قصة كاذبة تماما عنك.',
  'The controversy made you more famous.': 'جعلتك الضجة أكثر شهرة.',
  'Sue them': 'ارفع دعوى ضدهم',
  'You won the lawsuit! Headlines everywhere.': 'ربحت الدعوى وتصدرت الأخبار!',
  Cry: 'ابكِ',
  'Not your finest moment.': 'لم تكن أفضل لحظاتك.',
  'A fan approaches you in a restaurant and asks for a selfie.':
    'اقترب منك معجب في مطعم وطلب صورة معك.',
  'Take the selfie': 'التقط الصورة',
  'You made their day!': 'أسعدته كثيرا!',
  'Politely decline': 'ارفض بأدب',
  'They understood. Mostly.': 'تفهم الأمر... إلى حد ما.',
  'You are required to attend a state banquet. Boring but expected.':
    'يجب عليك حضور مأدبة رسمية. مملة لكنها من واجباتك.',
  'The press caught you doing something embarrassing at a private club.':
    'ضبطتك الصحافة في موقف محرج داخل ناد خاص.',
  'Issue apology': 'قدّم اعتذارا',
  'Damage control. The tabloids move on.': 'سيطرت على الضرر وانتقلت الصحف إلى قصة أخرى.',
  'Deny everything': 'أنكر كل شيء',
  'The story grew. You are memed worldwide.': 'تضخمت القصة وأصبحت مادة للسخرية حول العالم.',
  'You find an old photo album and spend the afternoon reminiscing.':
    'وجدت ألبوم صور قديما وقضيت الظهيرة تستعيد الذكريات.',
  'Your child had a baby! You are a grandparent now!': 'رُزق طفلك بمولود وأصبحت جدا الآن!',
  'You had a health scare. The doctors say you need to take it easy.':
    'مررت بوعكة مقلقة ونصحك الأطباء بالراحة.',
  'Your lawyer recommends updating your will.': 'ينصحك محاميك بتحديث وصيتك.',
  'Update it': 'حدّث الوصية',
  'Peace of mind. Your affairs are in order.': 'اطمأننت بعد أن رتبت شؤونك.',
  Procrastinate: 'أجّل الأمر',
  'You will do it next year. Probably.': 'ستفعلها العام القادم... على الأرجح.',
  'You feel a sense of clarity. Life is good. You write down your thoughts.':
    'تشعر بصفاء عميق؛ الحياة جميلة، فتدوّن أفكارك.',
  'A lady in the grocery store refuses to wear a mask and is screaming.':
    'ترفض امرأة في متجر البقالة ارتداء الكمامة وتصرخ.',
  'Confront her': 'واجهها',
  'She coughed on you.': 'سعلت عليك.',
  'Ignore her': 'تجاهلها',
  'You bought your beans and left.': 'اشتريت حاجاتك وغادرت.',
  'The government has issued a strict lockdown. No leaving the house!':
    'فرضت الحكومة إغلاقا صارما. لا خروج من المنزل!',
  'You have tested positive for the virus.': 'ظهرت نتيجة فحص الفيروس إيجابية.',
  'Your job has switched to remote work.': 'تحولت وظيفتك إلى العمل عن بعد.',
  'Spring is in the air! Flowers are blooming everywhere.': 'حل الربيع وتتفتح الأزهار في كل مكان.',
  'You did some spring cleaning and found $50 in an old coat.':
    'نظفت المنزل في الربيع ووجدت 50 دولارا في معطف قديم.',
  'Your spring allergies are acting up. You feel miserable.':
    'اشتدت حساسية الربيع لديك وتشعر بالتعب.',
  'You took a summer vacation to the beach!': 'قضيت عطلة صيفية على الشاطئ!',
  'A brutal heatwave has hit your area. Stay hydrated!':
    'ضربت منطقتك موجة حر قاسية. حافظ على شرب الماء!',
  'You had a summer fling! Nothing serious, but it was fun.':
    'عشت علاقة صيفية عابرة؛ لم تكن جدية لكنها كانت ممتعة.',
  'The autumn leaves are beautiful this year. You take a peaceful walk.':
    'أوراق الخريف جميلة هذا العام، فخرجت في نزهة هادئة.',
  'You visited a harvest festival and enjoyed fresh apple cider.':
    'زرت مهرجان الحصاد واستمتعت بعصير تفاح طازج.',
  'A big storm is rolling in. You lose power for a day.':
    'اقتربت عاصفة كبيرة وانقطعت الكهرباء يوما كاملا.',
  'The holiday season is here! You exchange gifts with loved ones.':
    'حل موسم الأعياد وتبادلت الهدايا مع أحبائك.',
  'A massive snowstorm has blanketed the city. Everything is closed.':
    'غطت عاصفة ثلجية هائلة المدينة وأُغلق كل شيء.',
  'The short days are getting to you. You feel a bit depressed.':
    'بدأ قِصر النهار يؤثر فيك وتشعر ببعض الحزن.',
  'Happy New Year! You reflect on the past year and set new goals.':
    'سنة جديدة سعيدة! راجعت عامك الماضي ووضعت أهدافا جديدة.',
  'You were cast in the school play! The audience gave you a standing ovation.':
    'شاركت في مسرحية المدرسة وصفق لك الجمهور واقفا.',
  'You won first place at the science fair! Your project impressed the judges.':
    'فزت بالمركز الأول في معرض العلوم وأبهر مشروعك الحكام.',
  'Your scout troop went camping. You learned to build a fire and tie knots.':
    'ذهب فريق الكشافة للتخييم وتعلمت إشعال النار وربط العقد.',
  "Your pet ran away! You searched everywhere but couldn't find them.":
    'هرب حيوانك الأليف! بحثت في كل مكان ولم تجده.',
  'You went to your first sleepover! You stayed up all night telling stories.':
    'ذهبت إلى أول ليلة مبيت عند صديق وسهرتما تتبادلان القصص.',
  "You passed your driver's license test! Freedom awaits.":
    'نجحت في اختبار رخصة القيادة! الحرية تنتظرك.',
  "You failed your driver's license test. Parallel parking is impossible.":
    'رسبت في اختبار القيادة؛ الركن الموازي صعب جدا.',
  "It's prom night! You danced the night away and made memories to last a lifetime.":
    'إنها ليلة حفلة التخرج! رقصت وصنعت ذكريات تدوم طويلا.',
  'The pressure of school and social life is overwhelming you.':
    'يضغط عليك التوفيق بين المدرسة والحياة الاجتماعية.',
  'You have a massive crush on someone. Your heart races every time you see them.':
    'أنت معجب جدا بشخص ما ويخفق قلبك كلما رأيته.',
  'Your colleagues threw you a surprise party for your recent promotion!':
    'أقام زملاؤك حفلة مفاجئة احتفالا بترقيتك الأخيرة!',
  'You hosted a housewarming party. Your new home feels alive!':
    'أقمت حفلة بمناسبة منزلك الجديد فامتلأ بالحياة!',
  'You ran into an old friend from school. You caught up like no time had passed.':
    'صادفت صديقا قديما من المدرسة وتحدثتما كأن الزمن لم يمر.',
  "You're completely burned out. Work and life have drained all your energy.":
    'أنت منهك تماما؛ استنزف العمل والحياة كل طاقتك.',
  "A video of you went viral! You're suddenly internet famous.":
    'انتشر مقطع لك وأصبحت مشهورا على الإنترنت فجأة!',
  "Your coworkers threw you a retirement party. You'll miss this place.":
    'أقام زملاؤك حفلة تقاعد لك. ستشتاق إلى هذا المكان.',
  'You became a grandparent! The newest addition to the family has arrived.':
    'أصبحت جدا! وصل أحدث فرد في العائلة.',
  'You crossed off a bucket list item! Life feels complete.':
    'حققت أمرا من قائمة أمنياتك وتشعر بأن حياتك أكثر اكتمالا.',
  'You had a health scare. It makes you appreciate every moment.':
    'مررت بوعكة مقلقة جعلتك تقدّر كل لحظة.',
  'You met someone who looks exactly like you. Strangest thing that ever happened.':
    'قابلت شخصا يشبهك تماما؛ أغرب ما حدث لك.',
  'You experienced intense déjà vu. The moment felt strangely familiar.':
    'شعرت بإحساس قوي بأنك عشت هذه اللحظة من قبل.',
  'You found a lucky penny heads up. Maybe today will be a good day!':
    'وجدت قطعة نقدية محظوظة. ربما يكون اليوم جيدا!',
  'A charity志愿者 knocked on your door. You donated what you could spare.':
    'طرق متطوع من جمعية خيرية بابك، فتبرعت بما تستطيع.',
  'A power outage plunged your neighborhood into darkness. You made the best of it with candlelight.':
    'غرق حيّك في الظلام بسبب انقطاع الكهرباء، فاستمتعت بضوء الشموع.',
  'The weather is absolutely perfect today. Not too hot, not too cold.':
    'الطقس مثالي اليوم؛ لا حار ولا بارد.',
  "Your neighbors are being extremely loud again. You can't get any peace.":
    'جيرانك صاخبون جدا مجددا ولا تجد لحظة هدوء.',
  'A stranger paid for your coffee today. Kindness is contagious!':
    'دفع غريب ثمن قهوتك اليوم. اللطف ينتقل بين الناس!',
  'You lost your wallet! Someone returned it with everything still inside.':
    'فقدت محفظتك، لكن شخصا أعادها بكل ما فيها!',
  'You got a flat tire on the way to an important meeting. What a day.':
    'ثُقب إطار سيارتك في طريقك إلى اجتماع مهم. يا له من يوم.',
  "It's a rainy day. You stayed inside with a good book and hot tea.":
    'إنه يوم ممطر، فبقيت في المنزل مع كتاب جيد وشاي ساخن.',
  "You got food poisoning from last night's dinner. Never again.":
    'أُصبت بتسمم غذائي من عشاء الأمس. لن تكرر ذلك.',
  "You received a surprise gift in the mail! It's from an anonymous admirer.":
    'وصلتك هدية مفاجئة بالبريد من معجب مجهول!',
  // --- Logic-level action feedback ---
  'You must be 18 or older to use substances.': 'يجب أن تبلغ 18 سنة أو أكثر لاستخدام هذه المواد.',
  "You don't have any addictions to treat.": 'ليس لديك أي إدمان يحتاج إلى علاج.',
  'You must be at least 14 to join competitive sports.':
    'يجب ألا يقل عمرك عن 14 سنة للانضمام إلى الرياضات التنافسية.',
  "You're already on a sports team.": 'أنت عضو في فريق رياضي بالفعل.',
  "You're not on any sports team.": 'لست عضوا في أي فريق رياضي.',
  "You're too exhausted to practice.": 'أنت مرهق جدا ولا تستطيع التدريب.',
  "You're not in college sports.": 'لست ضمن فريق رياضي جامعي.',
  'You need at least 80 skill to go pro.': 'تحتاج إلى مهارة لا تقل عن 80 للاحتراف.',
  "You couldn't afford your diet plan for the year.":
    'لم تستطع دفع تكلفة نظامك الغذائي لهذا العام.',
  "You're too exhausted to exercise.": 'أنت مرهق جدا ولا تستطيع التمرن.',
  'Your Athletic trait boosted your muscle gains!':
    'ساعدتك سمة اللياقة على بناء العضلات بشكل أفضل!',
  'You won the Nobel Prize for your groundbreaking research!': 'فزت بجائزة نوبل عن أبحاثك الرائدة!',
  'You are suffering from high blood pressure due to stress.':
    'تعاني من ارتفاع ضغط الدم بسبب التوتر.',
  'You had a massive HEART ATTACK due to extreme stress!':
    'أُصبت بنوبة قلبية حادة بسبب التوتر الشديد!',
  'You paid off your personal debt!': 'سدّدت دينك الشخصي بالكامل!',
  'You paid off your student loans!': 'سدّدت قروضك الدراسية بالكامل!',
  'War has been declared! The country is in conflict.': 'أُعلنت الحرب ودخلت البلاد في نزاع.',
  'The war has ended. Peace has been restored.': 'انتهت الحرب وعاد السلام.',
  'The global pandemic has officially ended.': 'انتهت الجائحة العالمية رسميا.',
  'A GLOBAL PANDEMIC has been declared! Stay safe.': 'أُعلنت جائحة عالمية! حافظ على سلامتك.',
  'You finished Elementary School!': 'أنهيت المدرسة الابتدائية!',
  'You graduated High School!': 'تخرجت من المدرسة الثانوية!',
  'Invalid insurance provider.': 'شركة التأمين غير صالحة.',
  'You must be 18 or older to buy insurance.': 'يجب أن تبلغ 18 سنة أو أكثر لشراء التأمين.',
  'That insurance claim amount is invalid.': 'قيمة مطالبة التأمين غير صالحة.',
  "You don't have that insurance.": 'لا تملك هذا النوع من التأمين.',
  'You must be 18 to file a lawsuit yourself.': 'يجب أن تبلغ 18 سنة لرفع دعوى بنفسك.',
  'You can only file one lawsuit per year.': 'يمكنك رفع دعوى واحدة فقط كل عام.',
  "You don't have enough people in your life to sue.": 'لا يوجد في حياتك شخص مناسب لرفع دعوى ضده.',
  'You must be 18 to work full-time.': 'يجب أن تبلغ 18 سنة للعمل بدوام كامل.',
  'That job offer is invalid.': 'عرض العمل غير صالح.',
  'That activity has invalid requirements.': 'متطلبات هذا النشاط غير صالحة.',
  "You're too exhausted to do that right now.": 'أنت مرهق جدا ولا تستطيع فعل ذلك الآن.',
  'You tried to busk but you have no talent. People threw garbage at you.':
    'حاولت تقديم عرض في الشارع لكن أداءك كان سيئا فرمى الناس القمامة نحوك.',
  'Your Athletic trait helped you get a great workout!': 'ساعدتك سمة اللياقة على أداء تمرين ممتاز!',
  'Dating is only available to adults.': 'المواعدة متاحة للبالغين فقط.',
  'Only real estate can be rented out.': 'يمكن تأجير العقارات فقط.',
  'Choose a valid positive monthly rent.': 'اختر إيجارا شهريا صالحا أكبر من الصفر.',
  'That asset is not available for purchase.': 'هذا الأصل غير متاح للشراء.',
  'The payment details are invalid.': 'بيانات الدفع غير صالحة.',
  'You must be an adult in a committed relationship to do that.':
    'يجب أن تكون بالغا وفي علاقة ملتزمة لفعل ذلك.',
  'You have already spent intimate time together this year.':
    'قضيتما وقتا حميميا معا بالفعل هذا العام.',
  'You are too tired right now.': 'أنت متعب جدا الآن.',
  'You must be an adult with a partner before proposing.':
    'يجب أن تكون بالغا ولديك شريك قبل طلب الزواج.',
  'Choose a valid ring.': 'اختر خاتما صالحا.',
  "You can't afford that ring!": 'لا تستطيع دفع ثمن هذا الخاتم!',
  'You must be an adult and engaged before getting married.':
    'يجب أن تكون بالغا ومخطوبا قبل الزواج.',
  'Choose a valid wedding budget.': 'اختر ميزانية زفاف صالحة.',
  'You are already enrolled in school!': 'أنت مسجل في مؤسسة تعليمية بالفعل!',
  'That school is not available.': 'هذه المؤسسة التعليمية غير متاحة.',
  'You must graduate high school before attending university.':
    'يجب أن تتخرج من الثانوية قبل دخول الجامعة.',
  'You suffered from burnout while trying to study!': 'أُصبت بالإرهاق الشديد أثناء الدراسة!',
  'You studied hard for your classes.': 'درست بجد لموادك.',
  "You're too exhausted to practice right now.": 'أنت مرهق جدا ولا تستطيع التدريب الآن.',
  'You are too young to commit crimes.': 'أنت صغير جدا على ارتكاب الجرائم.',
  'You are already in prison!': 'أنت في السجن بالفعل!',
  "You're too exhausted to work out.": 'أنت مرهق جدا ولا تستطيع التمرن.',
  "You're too exhausted to read.": 'أنت مرهق جدا ولا تستطيع القراءة.',
  'You hung out with your gang.': 'قضيت وقتا مع عصابتك.',
  "You were initiated into 'The Skulls' prison gang.": 'انضممت رسميا إلى عصابة «الجماجم» في السجن.',
  'The gangs ignored you. You need more street cred.': 'تجاهلتك العصابات؛ تحتاج إلى سمعة أقوى.',
  'You started a RIOT! 10 people were injured.': 'أشعلت أعمال شغب وأُصيب عشرة أشخاص.',
  'Your sentence was extended by 2 years.': 'مُدّدت عقوبتك سنتين.',
  'You failed to incite a riot. The guards beat you.': 'فشلت في إشعال الشغب واعتدى عليك الحراس.',
  'YOU ESCAPED PRISON!': 'هربت من السجن!',
  'Escape attempt FAILED! You were beaten and sentence extended.':
    'فشلت محاولة الهرب، وتعرضت للضرب ومُدّدت عقوبتك.',
  "You can't afford a lawyer ($5,000).": 'لا تستطيع دفع أتعاب المحامي (5,000 دولار).',
  'Appeal SUCCESSFUL! You are a free person.': 'نجح الاستئناف! أصبحت حرا.',
  'Appeal DENIED. You remain in prison.': 'رُفض الاستئناف وستبقى في السجن.',
  'You were caught by the police!': 'ألقت الشرطة القبض عليك!',
  'You are now a verified Social Media Influencer!': 'أصبحت الآن مؤثرا موثقا على وسائل التواصل!',
  'You assume you can buy followers with good looks? You need cash.':
    'تحتاج إلى المال لشراء المتابعين.',
  'Your campaign is broke! Fundraise more.': 'نفدت أموال حملتك! اجمع مزيدا من التبرعات.',
  'You must quit your current job first.': 'يجب أن تستقيل من وظيفتك الحالية أولا.',
  'You need a university degree to join as an Officer!': 'تحتاج إلى شهادة جامعية للانضمام كضابط!',
  'Choose a positive amount to invest.': 'اختر مبلغا موجبا للاستثمار.',
  "You don't have enough money to invest that.": 'لا تملك مالا كافيا لهذا الاستثمار.',
  "You can't afford the medical bill!": 'لا تستطيع دفع الفاتورة الطبية!',
  "You drank the Witch Doctor's concoction...": 'شربت خلطة المعالج الشعبي...',
  'Miracle! You feel invincible!': 'معجزة! تشعر بقوة لا تُقهر!',
  'It was poison! You feel terrible.': 'كان سُمّا! تشعر بسوء شديد.',
  'The Witch Doctor killed you.': 'تسبّب المعالج الشعبي في وفاتك.',
  "Insurance doesn't cover vanity. You need cash.":
    'لا يغطي التأمين الإجراءات التجميلية، وتحتاج إلى المال.',
  "You've already performed your duties this month.": 'أديت واجباتك لهذا الشهر بالفعل.',
  "You're too exhausted for royal duties.": 'أنت مرهق جدا لأداء الواجبات الملكية.',
  'The people revolted against your tyranny! You have been overthrown and exiled.':
    'ثار الناس على طغيانك وأطاحوا بك ونفوك.',
  'You had a subject executed for fun. You monster.':
    'أعدمت أحد الرعية لمجرد التسلية. يا لك من وحش.',
  'You must choose a primary beneficiary.': 'يجب أن تختار مستفيدا رئيسيا.',
  'You must be 18 to start a company.': 'يجب أن تبلغ 18 سنة لتأسيس شركة.',
  'That business type is not available.': 'هذا النوع من الأعمال غير متاح.',
  "You can't afford that donation.": 'لا تستطيع دفع هذا التبرع.',
  "You've already funded this project.": 'موّلت هذا المشروع بالفعل.',
  "That's not a real estate property.": 'هذا ليس عقارا.',
  "This property hasn't been renovated. The market isn't interested.":
    'لم يُجدد هذا العقار والسوق غير مهتم به.',
  'You have reached retirement age (65). Consider retiring!':
    'بلغت سن التقاعد (65). فكّر في التقاعد!',
  'You were gently nudged into retirement by your employer.': 'شجّعك صاحب العمل بلطف على التقاعد.',
  'Choose a positive retirement contribution.': 'اختر مساهمة تقاعدية موجبة.',
  'Choose a positive withdrawal amount.': 'اختر مبلغا موجبا للسحب.',
  'Insufficient funds in that account.': 'الرصيد في ذلك الحساب غير كاف.',
  'You are too young to retire!': 'ما زلت صغيرا على التقاعد!',
  'You might struggle financially in retirement...': 'قد تواجه صعوبات مالية خلال التقاعد...',
  "You don't have enough followers for a brand deal (Need 5k).":
    'لا تملك متابعين كافين لعقد إعلاني (تحتاج إلى 5 آلاف).',
  'No brands were interested in working with you right now.':
    'لا توجد علامة تجارية مهتمة بالعمل معك الآن.',
  'That space agency is not available.': 'وكالة الفضاء هذه غير متاحة.',
  'You need to be at least 22 to join a space program.':
    'يجب ألا يقل عمرك عن 22 سنة للانضمام إلى برنامج فضائي.',
  'You need a degree in Engineering, Physics, or Computer Science.':
    'تحتاج إلى شهادة في الهندسة أو الفيزياء أو علوم الحاسوب.',
  "Your smarts aren't high enough for this agency.": 'مستوى ذكائك غير كاف لهذه الوكالة.',
  'You can complete only one space-training module per year.':
    'يمكنك إكمال وحدة تدريب فضائي واحدة فقط كل عام.',
  'You need 25 energy for space training.': 'تحتاج إلى 25 من الطاقة للتدريب الفضائي.',
  'That space mission is not available yet.': 'هذه المهمة الفضائية غير متاحة بعد.',
  'You can fly only one space mission per year.': 'يمكنك تنفيذ مهمة فضائية واحدة فقط كل عام.',
  'You need 30 energy to launch a space mission.': 'تحتاج إلى 30 من الطاقة لإطلاق مهمة فضائية.',
  "You're not part of a space program.": 'لست عضوا في برنامج فضائي.',
  'You need more training before going on missions.':
    'تحتاج إلى مزيد من التدريب قبل تنفيذ المهمات.',
  'Your injuries from the mission were fatal.': 'كانت إصاباتك من المهمة قاتلة.',
  'Write a message before saving a time capsule.': 'اكتب رسالة قبل حفظ الكبسولة الزمنية.',
  'Shared financial decisions are only available in an adult committed relationship.':
    'القرارات المالية المشتركة متاحة فقط للبالغين في علاقة ملتزمة.',
  'You are too exhausted for an important parenting conversation.':
    'أنت مرهق جدا لإجراء حديث تربوي مهم.',
  "You're too exhausted to spend time with anyone.": 'أنت مرهق جدا ولا تستطيع قضاء وقت مع أحد.',
  'You cheated and got away with it... for now.': 'خنت شريكك ولم يُكشف أمرك... حتى الآن.',
};

const AR_REPLACERS = [
  [
    /^\[World Event\] (.+): (.+)$/,
    match => {
      const name = GAME_MESSAGE_BY_ENGLISH.get(match[1])?.ar || match[1];
      const description = GAME_MESSAGE_BY_ENGLISH.get(match[2])?.ar || match[2];
      return `[حدث عالمي] ${name}: ${description}`;
    },
  ],
  [
    /^\[Politics\] You lost re-election as (.+)\. Back to civilian life\.$/,
    match => {
      const office = GAME_MESSAGE_BY_ENGLISH.get(match[1])?.ar || match[1];
      return `[السياسة] خسرت إعادة الانتخاب لمنصب ${office}. عدت إلى حياتك المدنية.`;
    },
  ],
  [/^Event: (.+)$/, match => `الحدث: ${translateGameText('ar', match[1])}`],
  [/^You chose to: (.+)$/, match => `اخترت: ${translateGameText('ar', match[1])}`],
  [/^🎂 It's your (\d+)(?:st|nd|rd|th) birthday!$/, match => `🎂 إنه عيد ميلادك رقم ${match[1]}!`],
  [
    /^You chose the (.+) ambition for this life\.$/,
    match => `اخترت طموح «${AR_AMBITION_NAMES[match[1]] || match[1]}» لهذه الحياة.`,
  ],
  [
    /^Ambition milestone completed: (.+)\.$/,
    match => `اكتملت مرحلة الطموح: ${AR_AMBITION_STAGES[match[1]] || match[1]}.`,
  ],
  [
    /^You broke your promise to make time for (.+)\.$/,
    match => `أخلفت وعدك بتخصيص وقت لـ${match[1]}.`,
  ],
  [
    /^The unresolved conflict with (.+) turned into resentment\.$/,
    match => `تحول الخلاف غير المحلول مع ${match[1]} إلى استياء.`,
  ],
  [
    /^(.+) feels neglected and wants to talk about your relationship\.$/,
    match => `يشعر ${match[1]} بالإهمال ويريد التحدث عن علاقتكما.`,
  ],
  [
    /^You and (.+) looked back on a favorite memory together\.$/,
    match => `استعدت أنت و${match[1]} ذكرى محببة معا.`,
  ],
  [/^You remember (.+) fondly\.$/, match => `تتذكر ${match[1]} بمودة.`],
  [
    /^You spent time with your (.+), (.+)\. You kept your promise to make time for them\.$/,
    match =>
      `قضيت وقتا مع ${AR_RELATIONSHIP_TYPES[match[1]] || match[1]}ك ${match[2]}، ووفيت بوعدك بتخصيص وقت له.`,
  ],
  [/^(.+) ignored you\.$/, match => `تجاهلك ${match[1]}.`],
  [/^(.+) asked, "What do you want\?"$/, match => `سألك ${match[1]}: «ماذا تريد؟»`],
  [/^(.+) told you to stop sucking up\.$/, match => `طلب منك ${match[1]} التوقف عن التملق.`],
  [
    /^You insulted your (.+), (.+)!$/,
    match => `أهنت ${AR_RELATIONSHIP_TYPES[match[1]] || match[1]}ك ${match[2]}!`,
  ],
  [
    /^You already made (.+) a promise that still needs to be kept\.$/,
    match => `قطعت وعدا لـ${match[1]} وما زال عليك الوفاء به.`,
  ],
  [
    /^You promised (.+) that you would make time for them next year\.$/,
    match => `وعدت ${match[1]} بأن تخصص له وقتا في العام القادم.`,
  ],
  [
    /^There is no unresolved conflict with (.+) right now\.$/,
    match => `لا يوجد خلاف عالق مع ${match[1]} حاليا.`,
  ],
  [
    /^You gave (.+) a sincere apology and took responsibility\.$/,
    match => `قدمت لـ${match[1]} اعتذارا صادقا وتحملت المسؤولية.`,
  ],
  [/^You gave (.+) space to cool down\.$/, match => `منحت ${match[1]} مساحة ليهدأ.`],
  [
    /^You and (.+) talked honestly and found a way forward\.$/,
    match => `تحدثت أنت و${match[1]} بصراحة ووجدتما حلا للمضي قدما.`,
  ],
  [
    /^You and (.+) already use that financial arrangement\.$/,
    match => `تستخدم أنت و${match[1]} هذا الترتيب المالي بالفعل.`,
  ],
  [
    /^You and (.+) agreed to manage a joint household budget\.$/,
    match => `اتفقت أنت و${match[1]} على إدارة ميزانية منزلية مشتركة.`,
  ],
  [
    /^You and (.+) agreed to keep separate personal accounts\.$/,
    match => `اتفقت أنت و${match[1]} على إبقاء الحسابات الشخصية منفصلة.`,
  ],
  [
    /^You already made an important parenting decision with (.+) this year\.$/,
    match => `اتخذت قرارا تربويا مهما مع ${match[1]} بالفعل هذا العام.`,
  ],
  [
    /^You listened to (.+)'s dream and promised to support it\.$/,
    match => `استمعت إلى حلم ${match[1]} ووعدت بدعمه.`,
  ],
  [/^You set clear boundaries with (.+)\.$/, match => `وضعت حدودا واضحة مع ${match[1]}.`],
  [
    /^You had a baby (male|female) named (.+)!$/,
    match => `رُزقت بمولود ${match[1] === 'male' ? 'ذكر' : 'أنثى'} اسمه ${match[2]}!`,
  ],
  [/^(.+) turned you down\.$/, match => `رفضك ${match[1]}.`],
  [
    /^You proposed to (.+) with a \$([\d,]+) ring and they said YES!$/,
    match => `طلبت الزواج من ${match[1]} بخاتم قيمته ${match[2]} دولار، وقال نعم!`,
  ],
  [
    /^You proposed to (.+) with a \$([\d,]+) ring but they REJECTED you\.$/,
    match => `طلبت الزواج من ${match[1]} بخاتم قيمته ${match[2]} دولار، لكنه رفضك.`,
  ],
  [
    /^(.+) refused to sign the prenup! The wedding is off\.$/,
    match => `رفض ${match[1]} توقيع اتفاق ما قبل الزواج، فأُلغي الزفاف.`,
  ],
  [
    /^You married (.+)! It was a beautiful ceremony \(\$([\d,]+)\)\. You signed a prenup\.$/,
    match => `تزوجت ${match[1]} في حفل جميل كلف ${match[2]} دولار، ووقعتما اتفاق ما قبل الزواج.`,
  ],
  [
    /^You married (.+)! It was a beautiful ceremony \(\$([\d,]+)\)\.$/,
    match => `تزوجت ${match[1]} في حفل جميل كلف ${match[2]} دولار.`,
  ],
  [/^You were CAUGHT cheating on (.+)!$/, match => `تم ضبطك وأنت تخون ${match[1]}!`],
  [
    /^You divorced (.+)\. Thanks to the prenup, your assets are safe\.$/,
    match => `طلقت ${match[1]}. بفضل اتفاق ما قبل الزواج بقيت ممتلكاتك آمنة.`,
  ],
  [
    /^You divorced (.+)\. Without a prenup, the settlement cost \$([\d,]+) across your cash and estate\.$/,
    match =>
      `طلقت ${match[1]}. ومن دون اتفاق مسبق كلفتك التسوية ${match[2]} دولار من أموالك وممتلكاتك.`,
  ],
  [/^Your name is (.+)\.$/, match => `اسمك هو ${match[1]}.`],
  [/^You were born in (.+)\.$/, match => `وُلدت في ${AR_COUNTRIES[match[1]] || match[1]}.`],
  [/^Age (\d+): Another year passes\.$/, match => `العمر ${match[1]}: مر عام آخر.`],
  [/^Achievement unlocked: (.+)!$/, match => `تم فتح إنجاز: ${match[1]}!`],
  [/^Welcome back, (.+)!$/, match => `مرحبا بعودتك، ${match[1]}!`],
  [/^You opened (.+)\. \(Feature coming soon\)$/, match => `فتحت ${match[1]}. الميزة قادمة قريبا.`],
  [/^You need \$(.+) for filing fees!$/, match => `تحتاج إلى ${match[1]} دولار لرسوم القضية!`],
  [
    /^You turn (\d+) - consider writing a time capsule entry!$/,
    match => `بلغت ${match[1]} سنة - فكّر في كتابة كبسولة زمنية!`,
  ],
  [
    /^You spent the year in prison\. (.+) years remaining\.$/,
    match => `قضيت السنة في السجن. بقي ${match[1]} سنة.`,
  ],
  [/^You posted (.+) on (.+)\.$/, match => `نشرت ${match[1]} على ${match[2]}.`],
  [/^You bought 500 followers for (.+)\.$/, match => `اشتريت 500 متابع على ${match[1]}.`],
  [/^You won \$(.+) gambling!$/, match => `ربحت ${match[1]} دولارا في المقامرة!`],
  [/^You lost \$(.+) gambling\.$/, match => `خسرت ${match[1]} دولارا في المقامرة.`],
  [/^Pickpocketing successful! You made \$(.+)\.$/, match => `نجح النشل! ربحت ${match[1]} دولارا.`],
  [/^Pickpocketing failed! You lost \$(.+)\.$/, match => `فشل النشل! خسرت ${match[1]} دولارا.`],
  [
    /^Space mission successful! Earned \$(.+)\.$/,
    match => `نجحت مهمة الفضاء! ربحت ${match[1]} دولارا.`,
  ],
  [
    /^You won the court case! Awarded \$(.+)\.$/,
    match => `ربحت القضية! حصلت على ${match[1]} دولارا.`,
  ],
  [
    /^The court ruled in partial favor\. You received \$(.+)\.$/,
    match => `حكمت المحكمة جزئيا لصالحك. حصلت على ${match[1]} دولارا.`,
  ],
  [/^You lost the case and owe \$(.+)\.$/, match => `خسرت القضية وعليك دفع ${match[1]} دولارا.`],
  // --- New dynamic patterns ---
  [/^You started working as a (.+)\.$/, match => `بدأت العمل كـ ${match[1]}.`],
  [/^You quit your job as a (.+)\.$/, match => `استقلت من وظيفتك كـ ${match[1]}.`],
  [/^You were hired as a (.+)\.$/, match => `تم تعيينك كـ ${match[1]}.`],
  [/^You were rejected for (.+)\.$/, match => `تم رفضك من ${match[1]}.`],
  [/^You adopted a (.+) named (.+)\.$/, match => `تبنيت ${match[1]} اسمه ${match[2]}.`],
  [/^You took (.+) for a walk\.$/, match => `أخذت ${match[1]} في نزهة.`],
  [/^You gave (.+) a treat\.$/, match => `أعطيت ${match[1]} مكافأة.`],
  [
    /^You spent time with your (.+), (.+)\.$/,
    match => `قضيت وقتا مع ${AR_RELATIONSHIP_TYPES[match[1]] || match[1]}ك ${match[2]}.`,
  ],
  [
    /^You complimented your (.+), (.+)\.$/,
    match => `مادحت ${AR_RELATIONSHIP_TYPES[match[1]] || match[1]}ك ${match[2]}.`,
  ],
  [
    /^You started dating (.+) \(Age (\d+), (.+)\)!$/,
    match => `بدأت مواعدة ${match[1]} (العمر ${match[2]})!`,
  ],
  [/^You broke up with (.+)\.$/, match => `انفصلت عن ${match[1]}.`],
  [/^You married (.+)!$/, match => `تزوجت ${match[1]}!`],
  [/^You divorced (.+)\.$/, match => `طلقت ${match[1]}.`],
  [/^You enrolled in (.+)\.$/, match => `التحقت بـ ${match[1]}.`],
  [/^You graduated from (.+)!$/, match => `تخرجت من ${match[1]}!`],
  [
    /^You bought a (.+) (with a mortgage|for \$(.+))!$/,
    match =>
      `اشتريت ${match[1]}${match[2] === 'with a mortgage' ? ' برهن' : ` بمبلغ ${match[3]}`}!`,
  ],
  [/^You sold your (.+) for \$(.+)\.$/, match => `بعت ${match[1]} بمبلغ ${match[2]} دولارا.`],
  [/^You joined (.+) as a (.+)\.$/, match => `انضممت إلى ${match[1]} كـ ${match[2]}.`],
  [/^You were promoted to (.+)!$/, match => `تمت ترقيتك إلى ${match[1]}!`],
  [/^You were fired from (.+)\.$/, match => `تم طردك من ${match[1]}.`],
  [/^You earned \$([\d,]+) from your (.+)\.$/, match => `ربحت ${match[1]} دولارا من ${match[2]}.`],
  [/^You lost \$([\d,]+) from your (.+)\.$/, match => `خسرت ${match[1]} دولارا من ${match[2]}.`],
  [/^Your health improved by (\d+) points\.$/, match => `تحسنت صحتك بمقدار ${match[1]} نقطة.`],
  [
    /^(You practiced the? )(.+)\. Skill: (\d+)%\.$/,
    match => `${match[1]}${match[2]}. المهارة: ${match[3]}%.`,
  ],
  [
    /^(You practiced )(.+)\. Skill: (\d+)\.$/,
    match => `${match[1]}${match[2]}. المهارة: ${match[3]}.`,
  ],
  [/^You took voice lessons\. Skill: (\d+)%$/, match => `أخذت دروس غناء. المهارة: ${match[1]}%.`],
  [/^Your (.+) died\.$/, match => `مات ${match[1]} الخاص بك.`],
  [/^Your (.+) was born\.$/, match => `ولد ${match[1]}.`],
  [/^(\w+) was born\.$/, match => `ولدت ${match[1]}.`],
  [
    /^Your (pet|dog|cat|bird|fish|hamster) (.+) (passed away|died)\.$/,
    match => `${match[1]} الخاص بك ${match[2]} مات.`,
  ],
  // --- Additional patterns ---
  [/^You were fired from (.+)\.$/, match => `تم طردك من ${match[1]}.`],
  [/^You retired from your job\.$/, match => `تقاعدت من وظيفتك.`],
  [/^You were promoted to (.+)!$/, match => `تمت ترقيتك إلى ${match[1]}!`],
  [/^You graduated from (.+)!$/, match => `تخرجت من ${match[1]}!`],
  [/^You enrolled in (.+)\.$/, match => `التحقت بـ ${match[1]}.`],
  [/^You dropped out of school\.$/, match => `تركت المدرسة.`],
  [/^You were accepted into (.+)!$/, match => `تم قبولك في ${match[1]}!`],
  [/^You were rejected from (.+)\.$/, match => `تم رفضك من ${match[1]}.`],
  [/^You found a new job as a (.+)\.$/, match => `وجدت وظيفة جديدة كـ ${match[1]}.`],
  [/^You quit your job\.$/, match => `استقلت من وظيفتك.`],
  [/^Your (.+) was born\.$/, match => `ولد ${match[1]}.`],
  [/^You had a baby (.+)\.$/, match => `رزقت بـ ${match[1]}.`],
  [/^Your child (.+) was born\.$/, match => `وُلد طفلك ${match[1]}.`],
  [/^You adopted a (.+) named (.+)\.$/, match => `تبنيت ${match[1]} اسمه ${match[2]}.`],
  [/^Your pet (.+) died\.$/, match => `مات حيوانك الأليف ${match[1]}.`],
  [/^You got married!$/, match => `تزوجت!`],
  [/^You got divorced\.$/, match => `طلقت.`],
  [/^You broke up with (.+)\.$/, match => `انفصلت عن ${match[1]}.`],
  [/^You started dating (.+)\.$/, match => `بدأت مواعدة ${match[1]}.`],
  [/^(.+) proposed to you!$/, match => `${match[1]} تقدم لك!`],
  [/^You proposed to (.+)!$/, match => `تقدمت لـ ${match[1]}!`],
  [/^You bought a (.+) for \$([\d,]+)\.$/, match => `اشتريت ${match[1]} بمبلغ ${match[2]} دولارا.`],
  [/^You sold your (.+) for \$([\d,]+)\.$/, match => `بعت ${match[1]} بمبلغ ${match[2]} دولارا.`],
  [/^You earned \$([\d,]+) from your (.+)\.$/, match => `ربحت ${match[1]} دولارا من ${match[2]}.`],
  [/^You lost \$([\d,]+) from your (.+)\.$/, match => `خسرت ${match[1]} دولارا من ${match[2]}.`],
  [
    /^Your investment in (.+) (gained|lost) \$([\d,]+)\.$/,
    match => `استثمارك في ${match[1]} ${match[2] === 'gained' ? 'ربح' : 'خسر'} ${match[3]} دولارا.`,
  ],
  [
    /^Your business (.+) (earned|lost) \$([\d,]+)\.$/,
    match => `شركتك ${match[1]} ${match[2] === 'earned' ? 'ربحت' : 'خسرت'} ${match[3]} دولارا.`,
  ],
  [
    /^You won the lottery! You received \$([\d,]+)\.$/,
    match => `فزت باليانصيب! حصلت على ${match[1]} دولارا.`,
  ],
  [/^You went to prison for (\d+) years\.$/, match => `ذهبت للسجن لمدة ${match[1]} سنوات.`],
  [/^You were released from prison!$/, match => `أُطلق سراحك من السجن!`],
  [/^You escaped from prison!$/, match => `هربت من السجن!`],
  [/^You were caught escaping!$/, match => `تم القبض عليك وأنت تهرب!`],
  [/^You started a riot!$/, match => `بدأت أعمال شغب!`],
  [/^You joined a gang!$/, match => `انضممت إلى عصابة!`],
  [/^You completed a mission!$/, match => `أكملت مهمة!`],
  [/^Your space mission failed!$/, match => `فشلت مهمتك الفضائية!`],
  [
    /^Your space mission succeeded! You earned \$([\d,]+)\.$/,
    match => `نجحت مهمتك الفضائية! ربحت ${match[1]} دولارا.`,
  ],
  [
    /^You won the court case! Awarded \$([\d,]+)\.$/,
    match => `ربحت القضية! حصلت على ${match[1]} دولارا.`,
  ],
  [
    /^You lost the court case and owe \$([\d,]+)\.$/,
    match => `خسرت القضية وعليك دفع ${match[1]} دولارا.`,
  ],
  [/^You filed a lawsuit against (.+)\.$/, match => `رفعت دعوى قضائية ضد ${match[1]}.`],
  [
    /^You won the lawsuit against (.+)! Awarded \$([\d,]+)\.$/,
    match => `ربحت الدعوى ضد ${match[1]}! حصلت على ${match[2]} دولارا.`,
  ],
  [/^You lost the lawsuit against (.+)\.$/, match => `خسرت الدعوى ضد ${match[1]}.`],
  [/^You donated \$([\d,]+) to (.+)\.$/, match => `تبرعت بـ ${match[1]} دولارا لـ ${match[2]}.`],
  [/^You started a foundation: (.+)\.$/, match => `أسست مؤسسة: ${match[1]}.`],
  [/^You funded a legacy project: (.+)\.$/, match => `مولت مشروع إرث: ${match[1]}.`],
  [/^You joined a club: (.+)\.$/, match => `انضممت إلى نادٍ: ${match[1]}.`],
  [/^You left the club (.+)\.$/, match => `غادرت النادي ${match[1]}.`],
  [/^You tried out for (.+) and made the team!$/, match => `جربت لـ ${match[1]} وانضممت للفريق!`],
  [/^You went professional in (.+)!$/, match => `احترفت ${match[1]}!`],
  [/^You won a championship in (.+)!$/, match => `فزت ببطولة في ${match[1]}!`],
  [/^You practiced (.+)\. Skill: (\d+)%\.$/, match => `مارس ${match[1]}. المهارة: ${match[2]}%.`],
  [/^You took voice lessons\. Skill: (\d+)%$/, match => `أخذت دروس غناء. المهارة: ${match[1]}%.`],
  [/^You exercised at the gym\.$/, match => `تمرنت في النادي.`],
  [/^You went for a run\.$/, match => `ذهبت للجري.`],
  [/^You did yoga\.$/, match => `مارست اليوغا.`],
  [/^You lifted weights\.$/, match => `رفعت أثقالا.`],
  [/^You meditated\.$/, match => `تأملت.`],
  [/^You went to the library\.$/, match => `ذهبت للمكتبة.`],
  [/^You went clubbing\.$/, match => `ذهبت للسهر.`],
  [/^You got plastic surgery\.$/, match => `أجرت جراحة تجميل.`],
  [/^You found \$([\d,]+) on the street!$/, match => `وجدت ${match[1]} دولارا في الشارع!`],
  [/^You caught a cold\.$/, match => `أصبت بزكام.`],
  [/^You have the flu\.$/, match => `أصبت بالإنفلونزا.`],
  [/^You broke your (.+)\.$/, match => `كسرت ${match[1]}.`],
  [/^You recovered from (.+)\.$/, match => `تعافيت من ${match[1]}.`],
  [/^You visited the doctor\.$/, match => `زرت الطبيب.`],
  [/^You visited the witch doctor\.$/, match => `زرت المعالج الشعبي.`],
  [/^Your stress is too high!$/, match => `توترك عالٍ جدا!`],
  [/^You are feeling overwhelmed!$/, match => `تشعر بالإرهاق!`],
  [/^You need to relax!$/, match => `تحتاج للاسترخاء!`],
  [/^Good Karma! You found (.+)\.$/, match => `كارما جيدة! وجدت ${match[1]}.`],
  [/^Bad Karma! (.+)\.$/, match => `كارما سيئة! ${match[1]}.`],
  [/^A fan asked for your autograph!$/, match => `طلب منك معجب توقيعك!`],
  [/^A fan was stalking you\.\.\.$/, match => `كان معجب يلاحقك...`],
  [/^The economy has entered a (.+)\.$/, match => `دخل الاقتصاد في ${match[1]}.`],
  [/^War has been declared!$/, match => `أعلنت الحرب!`],
  [/^The war has ended!$/, match => `انتهت الحرب!`],
  [/^A GLOBAL PANDEMIC has been declared!$/, match => `أُعلن وباء عالمي!`],
  [/^The global pandemic has ended!$/, match => `انتهى الوباء العالمي!`],
  [
    /^You are now eligible to apply for citizenship in (.+)\.$/,
    match => `أصبحت مؤهلاً للتقدم للجنسية في ${match[1]}.`,
  ],
  [
    /^You need \$([\d,]+) to run for (.+)\.$/,
    match =>
      `تحتاج إلى ${match[1]} دولار للترشح لمنصب ${GAME_MESSAGE_BY_ENGLISH.get(match[2])?.ar || match[2]}.`,
  ],
  [
    /^You must be at least (\d+) to run for (.+)\.$/,
    match =>
      `يجب ألا يقل عمرك عن ${match[1]} سنة للترشح لمنصب ${GAME_MESSAGE_BY_ENGLISH.get(match[2])?.ar || match[2]}.`,
  ],
  [
    /^You announced your candidacy for (.+)! Campaign started\.$/,
    match =>
      `أعلنت ترشحك لمنصب ${GAME_MESSAGE_BY_ENGLISH.get(match[1])?.ar || match[1]}! بدأت الحملة.`,
  ],
  [
    /^You held a fundraiser and raised \$([\d,]+)!$/,
    match => `نظّمت حملة لجمع التبرعات وجمعت ${match[1]} دولار!`,
  ],
  [
    /^Campaign: (.+) was a success! Polls \+(\d+)%$/,
    match =>
      `الحملة: نجح إجراء «${GAME_MESSAGE_BY_ENGLISH.get(match[1])?.ar || match[1]}»! ارتفعت الاستطلاعات ${match[2]}%.`,
  ],
  [
    /^Campaign: (.+) backfired! Polls -(\d+)%$/,
    match =>
      `الحملة: جاء إجراء «${GAME_MESSAGE_BY_ENGLISH.get(match[1])?.ar || match[1]}» بنتائج عكسية! انخفضت الاستطلاعات ${match[2]}%.`,
  ],
  [
    /^ELECTION RESULTS: YOU WON! You are now the (.+)!$/,
    match =>
      `نتائج الانتخابات: فزت! أصبحت الآن ${GAME_MESSAGE_BY_ENGLISH.get(match[1])?.ar || match[1]}!`,
  ],
  [
    /^ELECTION RESULTS: You lost the election for (.+)\.$/,
    match =>
      `نتائج الانتخابات: خسرت انتخابات منصب ${GAME_MESSAGE_BY_ENGLISH.get(match[1])?.ar || match[1]}.`,
  ],
];

export function translateGameText(languageId, text) {
  if (!text) {
    return text;
  }

  if (typeof text === 'object') {
    return translateGameMessage(
      languageId,
      text.messageKey,
      text.messageParams || text.params || {},
      text.fallback || text.text || text.messageKey
    );
  }

  if (languageId !== 'ar') {
    return text;
  }

  const stableMessage = GAME_MESSAGE_BY_ENGLISH.get(text);
  if (stableMessage?.ar) {
    return stableMessage.ar;
  }
  if (AR_GAME_TEXT[text]) {
    return AR_GAME_TEXT[text];
  }

  for (const [pattern, replacer] of AR_REPLACERS) {
    const match = text.match(pattern);
    if (match) {
      return replacer(match);
    }
  }

  return text;
}

export function translateCountryName(languageId, country) {
  if (languageId !== 'ar') {
    return country;
  }
  return AR_COUNTRIES[country] || country;
}
