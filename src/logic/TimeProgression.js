let currentPerson = null;
let currentLanguage = 'en';

const clampInt = (value, min, max) => Math.max(min, Math.min(max, Math.floor(Number(value) || 0)));

export function setCurrentTimePerson(person, language = currentLanguage) {
  currentPerson = person || null;
  currentLanguage = language === 'ar' ? 'ar' : 'en';
}

export function getCurrentTimePerson() {
  return currentPerson;
}

function logTimeEvent(person, english, arabic, type = 'neutral') {
  person.logEvent?.(currentLanguage === 'ar' ? arabic : english, type);
}

export function ensureTimeProgress(person) {
  if (!person || typeof person !== 'object') {
    return null;
  }

  if (!person.timeProgress || typeof person.timeProgress !== 'object') {
    person.timeProgress = {};
  }

  const state = person.timeProgress;
  state.month = clampInt(state.month, 0, 11);
  state.monthsLived = Math.max(
    Math.max(0, Math.floor(Number(person.age) || 0)) * 12 + state.month,
    Math.floor(Number(state.monthsLived) || 0)
  );
  state.situationMonths = Math.max(0, Math.floor(Number(state.situationMonths) || 0));
  state.treatmentMonths = Math.max(0, Math.floor(Number(state.treatmentMonths) || 0));
  state.prisonMonthsRemaining = Number.isFinite(Number(state.prisonMonthsRemaining))
    ? Math.max(0, Math.floor(Number(state.prisonMonthsRemaining)))
    : null;
  state.lastSituation = typeof state.lastSituation === 'string' ? state.lastSituation : null;
  state.skipPrisonAnnualTick = Boolean(state.skipPrisonAnnualTick);
  return state;
}

function hasActiveWar(person) {
  return (
    Object.values(person?.wars || {}).some(Boolean) ||
    Object.values(person?.countryRelations || {}).some(relation => relation?.atWar)
  );
}

function hasPoliticalCampaign(person) {
  return Boolean(
    person?.campaign?.active ||
    person?.campaignData?.active ||
    person?.politicalCampaign?.active ||
    person?.job?.campaignActive ||
    Number(person?.campaign?.weeksLeft) > 0 ||
    Number(person?.campaignData?.weeksLeft) > 0
  );
}

function hasPregnancy(person) {
  return Boolean(
    person?.pregnancy?.active ||
    person?.isPregnant ||
    person?.pregnant ||
    Number(person?.pregnancyMonths) > 0
  );
}

function hasDeployment(person) {
  return Boolean(
    person?.deployment?.active ||
    person?.activeDeployment ||
    person?.isDeployed ||
    person?.spaceProgram?.activeMission ||
    person?.spaceProgram?.currentMission
  );
}

function hasBusinessCrisis(person) {
  return (person?.companies || []).some(
    company =>
      company?.crisis ||
      company?.status === 'crisis' ||
      company?.status === 'bankruptcy_risk' ||
      (Number.isFinite(Number(company?.health)) && Number(company.health) <= 20)
  );
}

export function getActiveMonthlySituation(person) {
  if (!person?.isAlive || person?.pendingEvent) {
    return null;
  }

  if (person.isInPrison) {
    return { id: 'prison', icon: '🔒' };
  }
  if (hasPregnancy(person)) {
    return { id: 'pregnancy', icon: '🤰' };
  }
  if (hasPoliticalCampaign(person)) {
    return { id: 'campaign', icon: '🗳️' };
  }
  if (hasDeployment(person)) {
    return { id: 'deployment', icon: '🪖' };
  }
  if (person.inTreatment) {
    return { id: 'treatment', icon: '🏥' };
  }
  if ((person.activeLawsuits || []).length > 0) {
    return { id: 'lawsuit', icon: '⚖️' };
  }
  if (person.collegeSport?.active || person.collegeSport?.isProfessional) {
    return { id: 'sports', icon: '🏆' };
  }
  if (hasBusinessCrisis(person)) {
    return { id: 'business', icon: '📉' };
  }
  if (hasActiveWar(person)) {
    return { id: 'war', icon: '⚔️' };
  }
  return null;
}

export function getSituationLabel(situation, language = 'en') {
  if (!situation) {
    return '';
  }
  const labels = {
    en: {
      prison: 'Prison sentence',
      pregnancy: 'Pregnancy',
      campaign: 'Election campaign',
      deployment: 'Active deployment',
      treatment: 'Treatment',
      lawsuit: 'Court case',
      sports: 'Sports season',
      business: 'Business crisis',
      war: 'War situation',
    },
    ar: {
      prison: 'مدة السجن',
      pregnancy: 'الحمل',
      campaign: 'الحملة الانتخابية',
      deployment: 'مهمة عسكرية',
      treatment: 'العلاج',
      lawsuit: 'قضية قضائية',
      sports: 'الموسم الرياضي',
      business: 'أزمة الشركة',
      war: 'حالة الحرب',
    },
  };
  return labels[language === 'ar' ? 'ar' : 'en'][situation.id] || situation.id;
}

function progressCampaign(person) {
  const campaign = person.campaign || person.campaignData || person.politicalCampaign;
  if (!campaign || typeof campaign !== 'object') {
    return;
  }
  if (Number.isFinite(Number(campaign.weeksLeft))) {
    campaign.weeksLeft = Math.max(0, Number(campaign.weeksLeft) - 4);
  }
  if (Number.isFinite(Number(campaign.monthsLeft))) {
    campaign.monthsLeft = Math.max(0, Number(campaign.monthsLeft) - 1);
  }
}

function progressPregnancy(person) {
  if (person.pregnancy && typeof person.pregnancy === 'object') {
    person.pregnancy.month = clampInt((person.pregnancy.month || 0) + 1, 0, 9);
  }
  if (Number.isFinite(Number(person.pregnancyMonths))) {
    person.pregnancyMonths = clampInt(Number(person.pregnancyMonths) + 1, 0, 9);
  }
}

function progressLawsuits(person) {
  (person.activeLawsuits || []).forEach(lawsuit => {
    if (lawsuit && typeof lawsuit === 'object') {
      lawsuit.monthsOpen = Math.max(0, Math.floor(Number(lawsuit.monthsOpen) || 0) + 1);
    }
  });
}

function progressTreatment(person, state) {
  state.treatmentMonths += 1;
  person.updateStats?.({ health: 1, stress: -2, happiness: -1 });

  if (state.treatmentMonths >= 3 && Math.random() < 0.3) {
    person.inTreatment = false;
    state.treatmentMonths = 0;
    logTimeEvent(
      person,
      'You completed a course of treatment.',
      'أكملت دورة العلاج بنجاح.',
      'good'
    );
  }
}

function progressPrison(person, state) {
  const sentenceMonths = Math.max(0, Math.round((Number(person.prisonSentence) || 0) * 12));
  if (state.prisonMonthsRemaining === null) {
    state.prisonMonthsRemaining = sentenceMonths;
  } else if (sentenceMonths > state.prisonMonthsRemaining + 11) {
    // Keep extensions from riots or failed escapes in sync.
    state.prisonMonthsRemaining = sentenceMonths;
  }

  state.prisonMonthsRemaining = Math.max(0, state.prisonMonthsRemaining - 1);
  person.prisonSentence = Math.ceil(state.prisonMonthsRemaining / 12);
  person.updateStats?.({ happiness: -1, stress: 1, energy: 20 });
  logTimeEvent(person, 'You served one month in prison.', 'قضيت شهرا واحدا في السجن.');

  if (state.prisonMonthsRemaining <= 0) {
    person.isInPrison = false;
    person.prisonSentence = 0;
    state.prisonMonthsRemaining = null;
    logTimeEvent(person, 'You have been released from prison!', 'تم إطلاق سراحك من السجن!', 'good');
    person.updateStats?.({ happiness: 20, stress: -10 });
  }
}

function progressSituation(person, situation, state) {
  state.situationMonths += 1;
  state.lastSituation = situation.id;

  switch (situation.id) {
    case 'prison':
      progressPrison(person, state);
      break;
    case 'campaign':
      progressCampaign(person);
      person.updateStats?.({ stress: 2, energy: 20 });
      logTimeEvent(
        person,
        'One month passed in your election campaign.',
        'مر شهر في حملتك الانتخابية.'
      );
      break;
    case 'pregnancy':
      progressPregnancy(person);
      person.updateStats?.({ stress: 1, energy: 15 });
      logTimeEvent(person, 'One month passed in the pregnancy.', 'مر شهر من فترة الحمل.');
      break;
    case 'treatment':
      progressTreatment(person, state);
      break;
    case 'lawsuit':
      progressLawsuits(person);
      person.updateStats?.({ stress: 2, energy: 20 });
      logTimeEvent(
        person,
        'One month passed while your court case continued.',
        'مر شهر بينما استمرت قضيتك في المحكمة.'
      );
      break;
    case 'deployment':
      person.updateStats?.({ stress: 3, health: -1, energy: 25 });
      logTimeEvent(
        person,
        'One month passed during your deployment.',
        'مر شهر خلال مهمتك العسكرية.'
      );
      break;
    case 'sports':
      person.collegeSport.seasonMonth =
        Math.max(0, Math.floor(Number(person.collegeSport.seasonMonth) || 0)) + 1;
      person.updateStats?.({ health: 1, stress: 1, energy: 20 });
      logTimeEvent(person, 'One month passed in the sports season.', 'مر شهر من الموسم الرياضي.');
      break;
    case 'business':
      person.updateStats?.({ stress: 2, energy: 20 });
      logTimeEvent(
        person,
        'One month passed while you managed the business crisis.',
        'مر شهر وأنت تدير أزمة الشركة.'
      );
      break;
    case 'war':
      person.updateStats?.({ stress: 2, happiness: -1, energy: 20 });
      logTimeEvent(
        person,
        'One month passed while the war continued.',
        'مر شهر آخر بينما استمرت الحرب.',
        'bad'
      );
      break;
    default:
      person.updateStats?.({ energy: 20, stress: -1 });
      break;
  }
}

export function advanceOneMonth(person, advanceYear) {
  if (!person?.isAlive) {
    return person;
  }
  if (person.pendingEvent) {
    return person;
  }

  const situation = getActiveMonthlySituation(person);
  if (!situation) {
    logTimeEvent(
      person,
      'Monthly progression is available only during an active situation.',
      'التقدم الشهري متاح فقط أثناء وجود حالة نشطة.'
    );
    return person;
  }

  const state = ensureTimeProgress(person);
  const wasInPrison = person.isInPrison;
  progressSituation(person, situation, state);

  state.month += 1;
  state.monthsLived += 1;
  if (state.month >= 12) {
    state.month = 0;
    if (wasInPrison && person.isInPrison) {
      state.skipPrisonAnnualTick = true;
    }
    if (typeof advanceYear === 'function' && person.isAlive && !person.pendingEvent) {
      advanceYear(person);
    }
  }

  return person;
}

export function recordYearAdvance(person) {
  const state = ensureTimeProgress(person);
  state.monthsLived = Math.max(
    state.monthsLived,
    Math.max(0, Math.floor(Number(person?.age) || 0)) * 12 + state.month
  );
  return state;
}
