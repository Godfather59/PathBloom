export const MEMBER_ARCHETYPES = [
  { namePool: ['Alex', 'Charlie', 'Drew', 'Jess'], role: 'Lead Guitar', instrument: 'guitar' },
  { namePool: ['Sam', 'Max', 'Riley', 'Quinn'], role: 'Drummer', instrument: 'drums' },
  { namePool: ['Jordan', 'Casey', 'Morgan', 'Dakota'], role: 'Bassist', instrument: 'bass' },
  { namePool: ['Taylor', 'Avery', 'Parker', 'Blake'], role: 'Keyboardist', instrument: 'piano' },
  { namePool: ['Reese', 'Skyler', 'Logan', 'Finch'], role: 'Saxophonist', instrument: 'saxophone' },
  {
    namePool: ['Cameron', 'Hayden', 'Rowan', 'Sage'],
    role: 'Backup Vocalist',
    instrument: 'voice',
  },
  { namePool: ['Emery', 'Finley', 'Oakley', 'Story'], role: 'Rhythm Guitar', instrument: 'guitar' },
  {
    namePool: ['Justice', 'Wren', 'Kendall', 'Shiloh'],
    role: 'Percussionist',
    instrument: 'drums',
  },
];

export const VENUES = [
  {
    id: 'bar',
    name: 'Local Bar',
    minFame: 0,
    minCohesion: 10,
    payout: 500,
    capacity: 100,
    stress: 5,
  },
  {
    id: 'club',
    name: 'Nightclub',
    minFame: 10,
    minCohesion: 25,
    payout: 3000,
    capacity: 300,
    stress: 10,
  },
  {
    id: 'theater',
    name: 'Theater',
    minFame: 25,
    minCohesion: 40,
    payout: 10000,
    capacity: 800,
    stress: 15,
  },
  {
    id: 'hall',
    name: 'Concert Hall',
    minFame: 40,
    minCohesion: 55,
    payout: 30000,
    capacity: 2000,
    stress: 20,
  },
  {
    id: 'arena',
    name: 'Arena',
    minFame: 60,
    minCohesion: 70,
    payout: 100000,
    capacity: 10000,
    stress: 25,
  },
  {
    id: 'stadium',
    name: 'Stadium',
    minFame: 80,
    minCohesion: 85,
    payout: 300000,
    capacity: 50000,
    stress: 30,
  },
];

export const GENRES = [
  { id: 'pop', name: 'Pop', popularity: 1.0 },
  { id: 'rock', name: 'Rock', popularity: 0.85 },
  { id: 'rap', name: 'Hip Hop / Rap', popularity: 0.9 },
  { id: 'country', name: 'Country', popularity: 0.65 },
  { id: 'rb', name: 'R&B', popularity: 0.75 },
];

export function generateBandMembers(count = 3) {
  const shuffled = [...MEMBER_ARCHETYPES].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map((arch, i) => ({
    id: `member_${i}_${Date.now()}`,
    name: arch.namePool[Math.floor(Math.random() * arch.namePool.length)],
    role: arch.role,
    instrument: arch.instrument,
    skill: 15 + Math.floor(Math.random() * 55),
    loyalty: 50 + Math.floor(Math.random() * 40),
    happiness: 60 + Math.floor(Math.random() * 35),
  }));
}

export function getBandCohesion(person) {
  if (!person.band || !person.band.members) {
    return 0;
  }
  return person.band.cohesion || 0;
}

export function getAvgMemberSkill(person) {
  if (!person.band || !person.band.members || person.band.members.length === 0) {
    return 0;
  }
  const total = person.band.members.reduce((s, m) => s + (m.skill || 0), 0);
  return Math.round(total / person.band.members.length);
}

export function getAvailableVenues(person) {
  if (!person.band) {
    return [];
  }
  return VENUES.filter(v => {
    const metFame = person.fame >= v.minFame;
    const metCohesion = getBandCohesion(person) >= v.minCohesion;
    return metFame && metCohesion;
  });
}

export const DRAMA_EVENTS = [
  {
    id: 'creative_diff',
    text: 'Creative differences are tearing the band apart. Members want to change genre.',
    resolve: [
      { text: 'Switch genres', effect: genre => ({ genre, cohesion: 20, happiness: 15 }) },
      {
        text: 'Stand your ground',
        effect: genre => ({ cohesion: -20, happiness: -10, loyalty: -10 }),
      },
    ],
  },
  {
    id: 'member_poach',
    text: 'A record label wants to poach {member} for a solo deal!',
    resolve: [
      { text: 'Let them go', effect: () => ({ cohesion: -10, loyalty: 5 }) },
      { text: 'Convince them to stay', effect: () => ({ cohesion: 5, loyalty: -5 }) },
    ],
  },
  {
    id: 'label_offer',
    text: 'A major record label offers you a contract! {amount} advance + {pct}% royalties.',
    resolve: [
      { text: 'Sign the deal', effect: () => ({ money: 100000, fame: 10, labelContract: true }) },
      { text: 'Stay indie', effect: () => ({ fame: 5, money: 0 }) },
    ],
  },
  {
    id: 'members_clash',
    text: '{member1} and {member2} got into a huge fight backstage!',
    resolve: [
      { text: 'Mediate the dispute', effect: () => ({ cohesion: 10, stress: 10 }) },
      { text: 'Let them sort it out', effect: () => ({ cohesion: -15, happiness: -5 }) },
    ],
  },
];

export function getRandomDrama(person) {
  if (!person.band || person.band.members.length < 2) {
    return null;
  }
  const event = DRAMA_EVENTS[Math.floor(Math.random() * DRAMA_EVENTS.length)];
  const template = { ...event };
  const member1 = person.band.members[Math.floor(Math.random() * person.band.members.length)];
  const member2 = person.band.members[Math.floor(Math.random() * person.band.members.length)];
  template.text = event.text
    .replace('{member}', member1?.name || 'a member')
    .replace('{member1}', member1?.name || 'One member')
    .replace('{member2}', member2?.name || 'Another member')
    .replace('{amount}', '$100,000')
    .replace('{pct}', '15');
  return template;
}

export function getAlbumQuality(avgSkill, cohesion) {
  const score = avgSkill * 0.6 + cohesion * 0.4;
  if (score >= 85) {
    return { tier: 'Masterpiece', sales: 2000000, royaltyRate: 2.5, fameGain: 40, minScore: 85 };
  }
  if (score >= 65) {
    return { tier: 'Platinum', sales: 500000, royaltyRate: 1.5, fameGain: 25, minScore: 65 };
  }
  if (score >= 45) {
    return { tier: 'Hit', sales: 100000, royaltyRate: 1.0, fameGain: 12, minScore: 45 };
  }
  if (score >= 25) {
    return { tier: 'Modest', sales: 10000, royaltyRate: 0.5, fameGain: 5, minScore: 25 };
  }
  return { tier: 'Flop', sales: 1000, royaltyRate: 0.1, fameGain: -2, minScore: 0 };
}

export function practiceBand(person) {
  if (!person.band) {
    return null;
  }
  if ((person.energy ?? 100) < 15) {
    return { success: false, message: 'Too tired to practice. Rest first.' };
  }
  person.energy = Math.max(0, (person.energy ?? 100) - 15);

  const improvement = 2 + Math.floor(Math.random() * 6);
  person.band.cohesion = Math.min(100, (person.band.cohesion || 0) + improvement);

  person.band.members.forEach(m => {
    const memberImprovement = Math.floor(Math.random() * 3) + 1;
    m.skill = Math.min(100, (m.skill || 0) + memberImprovement);
    m.happiness = Math.min(100, (m.happiness || 0) + 2);
  });

  const message = `Band cohesion improved by ${improvement}% (now ${person.band.cohesion}%). Members are getting better.`;
  return { success: true, message, cohesion: person.band.cohesion };
}

export function bookGig(person, venueId) {
  if (!person.band) {
    return null;
  }
  const venue = VENUES.find(v => v.id === venueId);
  if (!venue) {
    return null;
  }
  if ((person.energy ?? 100) < venue.stress) {
    return { success: false, message: 'Too exhausted to play a gig right now.' };
  }

  person.energy = Math.max(0, (person.energy ?? 100) - venue.stress);

  const crowdSize = Math.floor(venue.capacity * (0.3 + Math.random() * 0.7));
  const payout = venue.payout + Math.floor(Math.random() * venue.payout * 0.3);
  const fameGain = Math.min(10, Math.floor(crowdSize / 500) + 1);

  person.money = (person.money || 0) + payout;
  person.fame = Math.min(100, (person.fame || 0) + fameGain);

  person.band.members.forEach(m => {
    m.happiness = Math.min(100, (m.happiness || 0) + 5);
    m.loyalty = Math.min(100, (m.loyalty || 0) + 2);
  });

  person.band.totalEarnings = (person.band.totalEarnings || 0) + payout;

  const message = `You played ${venue.name}! Crowd of ${crowdSize.toLocaleString()}. Earned $${payout.toLocaleString()}.`;
  return { success: true, message, payout, fameGain, venue: venue.name, crowdSize };
}

export function recordAlbum(person) {
  if (!person.band) {
    return null;
  }
  if ((person.energy ?? 100) < 30) {
    return { success: false, message: 'Too exhausted to record. Rest first.' };
  }
  const cost = 20000 + Math.floor(Math.random() * 30000);
  if (person.money < cost) {
    return {
      success: false,
      message: `Recording costs $${cost.toLocaleString()}. You can't afford it.`,
    };
  }

  person.money -= cost;
  person.energy = Math.max(0, (person.energy ?? 100) - 30);

  const avgSkill = getAvgMemberSkill(person);
  const cohesion = getBandCohesion(person);
  const quality = getAlbumQuality(avgSkill, cohesion);

  const sales = Math.floor(quality.sales * (0.8 + Math.random() * 0.4));
  const firstYearRoyalty = Math.floor(sales * quality.royaltyRate * 5);
  const ongoingRoyalty = Math.floor(firstYearRoyalty * 0.3);

  person.money += firstYearRoyalty;
  person.fame = Math.min(100, (person.fame || 0) + quality.fameGain);

  person.band.totalEarnings = (person.band.totalEarnings || 0) + firstYearRoyalty;
  if (!person.band.albums) {
    person.band.albums = [];
  }
  person.band.albums.push({
    title: quality.tier,
    tier: quality.tier,
    sales,
    royalty: firstYearRoyalty,
    ongoingRoyalty,
    year: person.age,
  });

  person.band.members.forEach(m => {
    m.happiness = Math.min(100, (m.happiness || 0) + 8);
  });

  const message = `"${quality.tier}" album released! Sold ${sales.toLocaleString()} copies. Earned $${firstYearRoyalty.toLocaleString()} in royalties.`;
  return { success: true, message, tier: quality.tier, sales, royalty: firstYearRoyalty };
}

export function replaceMember(person, memberId) {
  if (!person.band || !person.band.members) {
    return null;
  }
  const idx = person.band.members.findIndex(m => m.id === memberId);
  if (idx === -1) {
    return null;
  }

  const candidate = MEMBER_ARCHETYPES[Math.floor(Math.random() * MEMBER_ARCHETYPES.length)];
  const newMember = {
    id: `member_${Date.now()}`,
    name: candidate.namePool[Math.floor(Math.random() * candidate.namePool.length)],
    role: candidate.role,
    instrument: candidate.instrument,
    skill: 10 + Math.floor(Math.random() * 40),
    loyalty: 40 + Math.floor(Math.random() * 30),
    happiness: 50 + Math.floor(Math.random() * 30),
  };

  person.band.cohesion = Math.max(0, (person.band.cohesion || 0) - 15);
  person.band.members[idx] = newMember;
  return { message: `${newMember.name} joined as ${newMember.role}.`, member: newMember };
}

export function processBandYearly(person) {
  if (!person.band) {
    return null;
  }

  const events = [];

  if (person.band.albums && person.band.albums.length > 0) {
    const totalOngoing = person.band.albums.reduce((s, a) => s + (a.ongoingRoyalty || 0), 0);
    if (totalOngoing > 0) {
      person.money = (person.money || 0) + totalOngoing;
      person.band.totalEarnings = (person.band.totalEarnings || 0) + totalOngoing;
      events.push(
        `💰 ${person.band.name} earned $${totalOngoing.toLocaleString()} in ongoing album royalties.`
      );
    }
  }

  person.band.members.forEach(m => {
    if (Math.random() < 0.1 && m.loyalty < 30) {
      const idx = person.band.members.indexOf(m);
      if (idx !== -1) {
        person.band.members.splice(idx, 1);
        person.band.cohesion = Math.max(0, (person.band.cohesion || 0) - 20);
        events.push(`😤 ${m.name} left the band due to low morale!`);
      }
    }
  });

  const decay = 1 + Math.floor(Math.random() * 3);
  person.band.cohesion = Math.max(0, (person.band.cohesion || 0) - decay);

  if (events.length > 0) {
    return events.join(' ');
  }

  if (person.band.cohesion < 30 && Math.random() < 0.3) {
    return '⚠️ Band cohesion is low. Schedule a practice session soon.';
  }

  return null;
}
