export const SPORTS = [
  {
    id: 'football',
    name: 'Football',
    position: 'Quarterback',
    minWeight: 180,
    maxWeight: 280,
    minHeight: 70,
    fitnessFocus: 'strength',
  },
  {
    id: 'basketball',
    name: 'Basketball',
    position: 'Guard',
    minWeight: 160,
    maxWeight: 250,
    minHeight: 74,
    fitnessFocus: 'cardio',
  },
  {
    id: 'soccer',
    name: 'Soccer',
    position: 'Forward',
    minWeight: 130,
    maxWeight: 220,
    minHeight: 66,
    fitnessFocus: 'cardio',
  },
  {
    id: 'tennis',
    name: 'Tennis',
    position: 'Singles',
    minWeight: 120,
    maxWeight: 200,
    minHeight: 64,
    fitnessFocus: 'cardio',
  },
  {
    id: 'swimming',
    name: 'Swimming',
    position: 'Freestyler',
    minWeight: 130,
    maxWeight: 210,
    minHeight: 68,
    fitnessFocus: 'cardio',
  },
  {
    id: 'track',
    name: 'Track & Field',
    position: 'Sprinter',
    minWeight: 120,
    maxWeight: 220,
    minHeight: 66,
    fitnessFocus: 'cardio',
  },
  {
    id: 'baseball',
    name: 'Baseball',
    position: 'Pitcher',
    minWeight: 160,
    maxWeight: 260,
    minHeight: 70,
    fitnessFocus: 'strength',
  },
  {
    id: 'golf',
    name: 'Golf',
    position: 'Player',
    minWeight: 130,
    maxWeight: 250,
    minHeight: 64,
    fitnessFocus: 'yoga',
  },
];

export const SCHOLARSHIP_TYPES = [
  { name: 'Partial Athletic Scholarship', coverage: 0.5, minSkill: 40, fameGain: 5 },
  { name: 'Full Athletic Scholarship', coverage: 1.0, minSkill: 65, fameGain: 10 },
  { name: 'Academic + Athletic', coverage: 1.0, minSkill: 50, minSmarts: 80, fameGain: 15 },
];

export function processCollegeSports(person) {
  if (!person.collegeSport) {
    return;
  }

  const sport = SPORTS.find(s => s.id === person.collegeSport.sportId);
  if (!sport) {
    return;
  }

  if (!person.collegeSport.skill) {
    person.collegeSport.skill = 0;
  }
  person.collegeSport.skill = Math.min(
    100,
    person.collegeSport.skill + Math.floor(Math.random() * 3)
  );

  if (person.fitness?.exerciseDays > 0) {
    person.collegeSport.skill = Math.min(100, person.collegeSport.skill + 1);
  }

  if (person.currentSchool && person.collegeSport.skill > 50 && Math.random() < 0.1) {
    person.logEvent(`Your performance in ${sport.name} is getting attention!`, 'good');
    person.fame = Math.min(100, (person.fame || 0) + 2);
  }

  if (!person.currentSchool && person.collegeSport.skill > 70 && Math.random() < 0.05) {
    person.logEvent(`Scouts are interested in your ${sport.name} talent!`, 'good');
  }

  // Challenge tracking: championships & MVP awards
  if (person.collegeSport.skill > 60 && Math.random() < 0.08) {
    person.sportsChampionships = (person.sportsChampionships || 0) + 1;
    person.logEvent(`You won a championship in ${sport.name}!`, 'good');
    person.fame = Math.min(100, (person.fame || 0) + 5);
  }
  if (person.collegeSport.skill > 75 && Math.random() < 0.05) {
    person.mvpAwards = (person.mvpAwards || 0) + 1;
    person.logEvent(`You were named MVP in ${sport.name}!`, 'good');
    person.fame = Math.min(100, (person.fame || 0) + 8);
  }
}

export function tryoutForSport(person, sportId) {
  if (person.age < 14) {
    person.logEvent('You must be at least 14 to join competitive sports.', 'bad');
    return false;
  }
  if (person.collegeSport) {
    person.logEvent("You're already on a sports team.", 'bad');
    return false;
  }

  const sport = SPORTS.find(s => s.id === sportId);
  if (!sport) {
    return false;
  }

  const hasAthleticTrait = person.hasTrait('Athletic');
  const baseChance = hasAthleticTrait ? 0.7 : 0.3;
  const healthBonus = (person.health - 50) / 100;
  const fitnessBonus = person.fitness?.exerciseDays > 3 ? 0.1 : 0;

  const chance = Math.min(0.95, baseChance + healthBonus + fitnessBonus);

  if (Math.random() > chance) {
    person.logEvent(`You tried out for ${sport.name} but didn't make the team.`, 'bad');
    return false;
  }

  person.collegeSport = {
    sportId,
    skill: hasAthleticTrait ? 30 : 15,
    professionalDraft: false,
    championships: 0,
  };

  person.logEvent(`You made the ${sport.name} team!`, 'good');
  person.updateStats({ happiness: 15, health: 5 });
  return true;
}

export function practiceSport(person) {
  if (!person.collegeSport) {
    person.logEvent("You're not on any sports team.", 'bad');
    return false;
  }

  if ((person.energy ?? 100) < 25) {
    person.logEvent("You're too exhausted to practice.", 'neutral');
    return false;
  }
  person.energy = Math.max(0, (person.energy ?? 100) - 25);

  const sport = SPORTS.find(s => s.id === person.collegeSport.sportId);
  if (!sport) {
    return false;
  }

  const skill = person.collegeSport.skill || 0;
  const dim = 1 - Math.pow(skill / 100, 1.5);
  const gain = Math.max(1, Math.round((5 + Math.floor(Math.random() * 5)) * dim));
  person.collegeSport.skill = Math.min(100, skill + gain);

  person.updateStats({ health: 2, stress: 5, happiness: 2 });
  person.logEvent(`You practiced ${sport.name}. Skill: ${person.collegeSport.skill}.`, 'good');
  return true;
}

export function goProfessional(person) {
  if (!person.collegeSport) {
    person.logEvent("You're not in college sports.", 'bad');
    return false;
  }

  if (person.collegeSport.skill < 80) {
    person.logEvent('You need at least 80 skill to go pro.', 'bad');
    return false;
  }

  const sport = SPORTS.find(s => s.id === person.collegeSport.sportId);
  if (!sport) {
    return false;
  }

  const draftChance = person.collegeSport.skill > 90 ? 0.8 : 0.4;
  const drafted = Math.random() < draftChance;

  if (!drafted) {
    person.logEvent(`You tried to go pro in ${sport.name} but weren't drafted.`, 'bad');
    return false;
  }

  const baseSalary = 50000 + person.collegeSport.skill * 5000;
  const contractValue = Math.floor(baseSalary * (0.5 + Math.random()));

  if (person.job) {
    person.quitJob();
  }
  person.job = {
    title: `Professional ${sport.name} Player`,
    salary: contractValue,
    performance: 50,
    isSportsPro: true,
    sportId: sport.id,
  };

  person.collegeSport.professionalDraft = true;
  person.fame = Math.min(100, (person.fame || 0) + 30);
  person.logEvent(
    `You were drafted as a professional ${sport.name} player! Contract: $${contractValue.toLocaleString()}/year.`,
    'good'
  );
  return true;
}
