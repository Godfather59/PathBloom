export const SPACE_AGENCIES = [
  {
    name: 'NASA',
    country: 'United States',
    difficulty: 'hard',
    minSmarts: 85,
    minDegree: 'Engineering',
  },
  { name: 'ESA', country: 'Germany', difficulty: 'hard', minSmarts: 82, minDegree: 'Physics' },
  {
    name: 'SpaceX',
    country: 'United States',
    difficulty: 'medium',
    minSmarts: 80,
    minDegree: 'Engineering',
  },
  {
    name: 'Roscosmos',
    country: 'Russia',
    difficulty: 'hard',
    minSmarts: 80,
    minDegree: 'Engineering',
  },
  { name: 'ISRO', country: 'India', difficulty: 'medium', minSmarts: 78, minDegree: 'Physics' },
  { name: 'CNSA', country: 'China', difficulty: 'hard', minSmarts: 82, minDegree: 'Engineering' },
  {
    name: 'Virgin Galactic',
    country: 'United States',
    difficulty: 'easy',
    minSmarts: 70,
    minDegree: '',
  },
];

export const SPACE_MISSIONS = [
  { name: 'Suborbital Flight', risk: 0.05, duration: 1, fame: 20, pay: 50000, reqTraining: 20 },
  { name: 'ISS Supply Mission', risk: 0.08, duration: 2, fame: 30, pay: 100000, reqTraining: 40 },
  { name: 'ISS Long Duration', risk: 0.1, duration: 6, fame: 50, pay: 250000, reqTraining: 60 },
  { name: 'Lunar Orbit', risk: 0.15, duration: 3, fame: 70, pay: 500000, reqTraining: 70 },
  { name: 'Moon Landing', risk: 0.2, duration: 4, fame: 90, pay: 1000000, reqTraining: 80 },
  { name: 'Mars Mission', risk: 0.35, duration: 24, fame: 100, pay: 2000000, reqTraining: 95 },
];

export const TRAINING_MODULES = [
  { name: 'Basic Training', cost: 0, duration: 1, gains: 15, requirement: 0 },
  { name: 'Advanced Pilot Training', cost: 5000, duration: 2, gains: 25, requirement: 15 },
  { name: 'Spacewalk Certification', cost: 10000, duration: 3, gains: 35, requirement: 30 },
  { name: 'Zero-Gravity Training', cost: 15000, duration: 2, gains: 30, requirement: 40 },
  { name: 'Mission Command', cost: 20000, duration: 4, gains: 40, requirement: 55 },
  { name: 'Survival Training', cost: 8000, duration: 2, gains: 20, requirement: 25 },
  { name: 'Robotics & Engineering', cost: 12000, duration: 3, gains: 30, requirement: 35 },
];

export function processSpaceCareer(person) {
  if (!person.spaceProgram) {
    return;
  }
  const prog = person.spaceProgram;

  if (prog.training < 100 && prog.trainingPlan) {
    const module = TRAINING_MODULES.find(m => m.name === prog.trainingPlan);
    if (module && Math.random() < 0.3) {
      prog.training = Math.min(100, prog.training + 5);
    }
  }
}

export function joinSpaceProgram(person, agency) {
  if (!agency || !SPACE_AGENCIES.some(candidate => candidate.name === agency.name)) {
    person.logEvent('That space agency is not available.', 'bad');
    return false;
  }
  if (person.age < 22) {
    person.logEvent('You need to be at least 22 to join a space program.', 'bad');
    return false;
  }

  if (person.job) {
    person.logEvent('You must quit your current job first.', 'bad');
    return false;
  }

  const acceptedDegrees = ['engineering', 'physics', 'cs', 'computer science'];
  const hasRelevantDegree = (person.degrees || []).some(degree => {
    const degreeName = `${degree?.type || ''} ${degree?.name || ''}`.toLowerCase();
    return acceptedDegrees.some(accepted => degreeName.includes(accepted));
  });
  if (!hasRelevantDegree) {
    person.logEvent('You need a degree in Engineering, Physics, or Computer Science.', 'bad');
    return false;
  }

  if (person.smarts < agency.minSmarts) {
    person.logEvent("Your smarts aren't high enough for this agency.", 'bad');
    return false;
  }

  if (agency.country !== person.country && !(person.citizenships || []).includes(agency.country)) {
    if (agency.name !== 'SpaceX' && agency.name !== 'Virgin Galactic') {
      person.logEvent(
        `You need to be a citizen of ${agency.country} to join ${agency.name}.`,
        'bad'
      );
      return false;
    }
  }

  person.spaceProgram = {
    agency: agency.name,
    training: 0,
    missionsCompleted: 0,
    rank: 'Trainee',
  };

  person.job = {
    title: `Astronaut Trainee (${agency.name})`,
    salary: 60000,
    performance: 50,
    isSpaceProgram: true,
    spaceAgency: agency.name,
  };

  person.logEvent(`You joined ${agency.name} as an Astronaut Trainee!`, 'good');
  return true;
}

export function startTraining(person, moduleName) {
  const module = TRAINING_MODULES.find(m => m.name === moduleName);
  if (!module) {
    return false;
  }

  if (!person.spaceProgram) {
    return false;
  }

  if (person.spaceProgram.lastTrainingAge === person.age) {
    person.logEvent('You can complete only one space-training module per year.', 'bad');
    return false;
  }

  if ((person.energy ?? 100) < 25) {
    person.logEvent('You need 25 energy for space training.', 'bad');
    return false;
  }

  const training = person.spaceProgram.training || 0;
  if (training < module.requirement) {
    person.logEvent(
      `You need at least ${module.requirement} training level for ${moduleName}.`,
      'bad'
    );
    return false;
  }

  if (person.money < module.cost) {
    person.logEvent(`You can't afford ${moduleName} ($${module.cost.toLocaleString()}).`, 'bad');
    return false;
  }

  person.money -= module.cost;
  person.energy = Math.max(0, (person.energy ?? 100) - 25);
  person.spaceProgram.trainingPlan = moduleName;
  person.spaceProgram.lastTrainingAge = person.age;
  person.spaceProgram.training = Math.min(100, training + module.gains);
  person.spaceProgram.rank =
    person.spaceProgram.training > 80
      ? 'Senior Astronaut'
      : person.spaceProgram.training > 50
        ? 'Astronaut'
        : person.spaceProgram.training > 25
          ? 'Junior Astronaut'
          : 'Trainee';

  person.logEvent(
    `You completed ${moduleName}. Training level: ${person.spaceProgram.training}.`,
    'good'
  );
  return true;
}

export function beginSpaceMission(person, mission) {
  const knownMission = SPACE_MISSIONS.find(candidate => candidate.name === mission?.name);
  if (
    !person.spaceProgram ||
    !knownMission ||
    knownMission.reqTraining > (person.spaceProgram.training || 0)
  ) {
    person.logEvent('That space mission is not available yet.', 'bad');
    return false;
  }
  if (person.spaceProgram.lastMissionAge === person.age) {
    person.logEvent('You can fly only one space mission per year.', 'bad');
    return false;
  }
  if ((person.energy ?? 100) < 30) {
    person.logEvent('You need 30 energy to launch a space mission.', 'bad');
    return false;
  }

  person.energy = Math.max(0, (person.energy ?? 100) - 30);
  person.spaceProgram.lastMissionAge = person.age;
  return true;
}

export function goOnMission(person) {
  if (!person.spaceProgram) {
    person.logEvent("You're not part of a space program.", 'bad');
    return null;
  }

  const training = person.spaceProgram.training || 0;
  const availableMissions = SPACE_MISSIONS.filter(m => m.reqTraining <= training);

  if (availableMissions.length === 0) {
    person.logEvent('You need more training before going on missions.', 'bad');
    return null;
  }

  const mission = availableMissions[Math.floor(Math.random() * availableMissions.length)];
  if (!beginSpaceMission(person, mission)) {
    return null;
  }
  const successChance =
    1 - mission.risk - (training < 50 ? 0.1 : 0) + (person.hasTrait('Genius') ? 0.05 : 0);
  const success = Math.random() < successChance;

  if (success) {
    person.money += mission.pay;
    person.fame = Math.min(100, (person.fame || 0) + mission.fame);
    person.spaceProgram.missionsCompleted++;
    person.logEvent(
      `MISSION COMPLETE: ${mission.name}! You earned $${mission.pay.toLocaleString()} and gained fame!`,
      'good'
    );

    if (person.job && person.job.isSpaceProgram) {
      person.job.salary = Math.floor(person.job.salary * 1.15);
      person.job.performance = Math.min(100, (person.job.performance || 50) + 10);
    }
  } else {
    const fatal = Math.random() < 0.3;
    if (fatal) {
      person.isAlive = false;
      person.logEvent(
        `DISASTER! The ${mission.name} ended in tragedy. You did not survive.`,
        'bad'
      );
      return { mission, success: false, fatal: true };
    }
    person.health = Math.max(0, person.health - 40);
    person.logEvent(`The ${mission.name} had a critical failure! You barely survived.`, 'bad');

    if (person.health <= 0) {
      person.isAlive = false;
      person.logEvent('Your injuries from the mission were fatal.', 'bad');
      return { mission, success: false, fatal: true };
    }
  }

  return { mission, success, fatal: false };
}
