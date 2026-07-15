export const CLUBS = [
  {
    id: 'freemasons',
    name: 'Freemasons',
    type: 'secret_society',
    joinCost: 5000,
    annualDues: 500,
    minAge: 21,
    minFame: 10,
    minMoney: 50000,
    benefits: ['business_connections', 'political_favors', 'networking'],
    description: 'Ancient fraternal organization with powerful connections',
  },
  {
    id: 'rotary',
    name: 'Rotary Club',
    type: 'service',
    joinCost: 1000,
    annualDues: 200,
    minAge: 18,
    minFame: 0,
    minMoney: 0,
    benefits: ['community_standing', 'networking'],
    description: 'Service organization focused on community improvement',
  },
  {
    id: 'country_club',
    name: 'Country Club',
    type: 'social',
    joinCost: 50000,
    annualDues: 5000,
    minAge: 21,
    minFame: 5,
    minMoney: 200000,
    benefits: ['networking', 'luxury_access', 'sports'],
    description: 'Prestigious golf and country club for the elite',
  },
  {
    id: 'ivy_league',
    name: 'Ivy League Alumni Association',
    type: 'academic',
    joinCost: 2000,
    annualDues: 300,
    minAge: 22,
    minFame: 0,
    minMoney: 0,
    benefits: ['career_connections', 'mentorship'],
    description: 'Network of elite university alumni',
    customReq: person => person.degrees.length > 0,
  },
  {
    id: 'skull_bones',
    name: 'Skull & Bones',
    type: 'secret_society',
    joinCost: 10000,
    annualDues: 1000,
    minAge: 25,
    minFame: 20,
    minMoney: 100000,
    benefits: ['power_connections', 'political_favors', 'secrets'],
    description: 'One of the most secretive and powerful societies',
    customReq: person => person.fame >= 20 && person.money >= 100000,
  },
  {
    id: 'elks',
    name: 'Elks Lodge',
    type: 'service',
    joinCost: 500,
    annualDues: 100,
    minAge: 21,
    minFame: 0,
    minMoney: 0,
    benefits: ['community', 'charity'],
    description: 'Fraternal organization dedicated to charity',
  },
  {
    id: 'chamber',
    name: 'Chamber of Commerce',
    type: 'business',
    joinCost: 2000,
    annualDues: 500,
    minAge: 18,
    minFame: 0,
    minMoney: 10000,
    benefits: ['business_connections', 'local_influence'],
    description: 'Network of local business owners and entrepreneurs',
    customReq: person => person.companies.length > 0 || person.job?.title === 'CEO',
  },
];

export function getClubBenefits(person) {
  const benefits = new Set();
  (person.clubs || []).forEach(clubId => {
    const club = CLUBS.find(c => c.id === clubId);
    if (club) {
      club.benefits.forEach(b => benefits.add(b));
    }
  });
  return Array.from(benefits);
}

export function processClubs(person) {
  if (!person.clubs || person.clubs.length === 0) {
    return;
  }

  person.clubs.forEach(clubId => {
    const club = CLUBS.find(c => c.id === clubId);
    if (!club) {
      return;
    }

    if (person.money >= club.annualDues) {
      person.money -= club.annualDues;
    } else {
      person.clubs = person.clubs.filter(id => id !== clubId);
      person.logEvent(`You were removed from ${club.name} for non-payment of dues.`, 'bad');
    }
  });

  if (Math.random() < 0.15 && person.clubs.length > 0) {
    const randomClub = CLUBS.find(c => person.clubs.includes(c.id));
    if (randomClub) {
      const events = [
        `Your ${randomClub.name} connections helped you in business.`,
        `You attended a ${randomClub.name} networking event.`,
        `A fellow ${randomClub.name} member gave you valuable advice.`,
      ];
      person.logEvent(events[Math.floor(Math.random() * events.length)], 'good');

      if (Math.random() < 0.3 && person.job) {
        person.job.performance = Math.min(100, (person.job.performance || 50) + 2);
      }
    }
  }
}

export function joinClub(person, clubId) {
  const club = CLUBS.find(c => c.id === clubId);
  if (!club) {
    return false;
  }

  if (!person.clubs) {
    person.clubs = [];
  }
  if (person.clubs.includes(clubId)) {
    person.logEvent(`You are already a member of ${club.name}.`, 'bad');
    return false;
  }

  if (person.age < club.minAge) {
    person.logEvent(`You must be ${club.minAge}+ to join ${club.name}.`, 'bad');
    return false;
  }

  if (person.fame < club.minFame) {
    person.logEvent(`You need ${club.minFame} fame to join ${club.name}.`, 'bad');
    return false;
  }

  if (person.money < club.minMoney) {
    person.logEvent(
      `You need at least $${club.minMoney.toLocaleString()} net worth to join ${club.name}.`,
      'bad'
    );
    return false;
  }

  if (club.customReq && !club.customReq(person)) {
    person.logEvent(`You don't meet the special requirements for ${club.name}.`, 'bad');
    return false;
  }

  if (person.money < club.joinCost) {
    person.logEvent(
      `The initiation fee for ${club.name} is $${club.joinCost.toLocaleString()}.`,
      'bad'
    );
    return false;
  }

  person.money -= club.joinCost;
  person.clubs.push(clubId);
  person.logEvent(`You were accepted into ${club.name}!`, 'good');
  return true;
}

export function leaveClub(person, clubId) {
  if (!person.clubs) {
    person.clubs = [];
  }
  const club = CLUBS.find(c => c.id === clubId);
  person.clubs = person.clubs.filter(id => id !== clubId);
  person.logEvent(`You left ${club?.name || clubId}.`, 'neutral');
  return true;
}
