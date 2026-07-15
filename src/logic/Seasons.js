export const SEASONS = ['Spring', 'Summer', 'Fall', 'Winter'];

export function formatOrdinal(value) {
  const number = Math.trunc(Number(value));
  if (!Number.isFinite(number)) {
    return String(value);
  }

  const absolute = Math.abs(number);
  const lastTwoDigits = absolute % 100;
  let suffix = 'th';

  if (lastTwoDigits < 11 || lastTwoDigits > 13) {
    if (absolute % 10 === 1) {
      suffix = 'st';
    } else if (absolute % 10 === 2) {
      suffix = 'nd';
    } else if (absolute % 10 === 3) {
      suffix = 'rd';
    }
  }

  return `${number}${suffix}`;
}

export const SEASONAL_EVENTS = {
  Spring: [
    {
      id: 'spring_bloom',
      text: 'Spring flowers are blooming everywhere. The world feels fresh.',
      effects: { happiness: 5 },
      type: 'good',
      prob: 0.4,
    },
    {
      id: 'spring_allergies',
      text: 'Your seasonal allergies are acting up. Pollen is everywhere.',
      effects: { health: -3, happiness: -3 },
      type: 'bad',
      prob: 0.2,
    },
    {
      id: 'spring_rain',
      text: 'It has been raining for a week straight. You feel cooped up.',
      effects: { happiness: -5 },
      type: 'bad',
      prob: 0.2,
    },
    {
      id: 'spring_garden',
      text: 'You plant a small garden. Watching things grow is satisfying.',
      effects: { happiness: 8 },
      type: 'good',
      prob: 0.15,
    },
  ],
  Summer: [
    {
      id: 'summer_heatwave',
      text: 'A brutal heatwave has hit. You can barely function.',
      effects: { health: -5, happiness: -8 },
      type: 'bad',
      prob: 0.2,
    },
    {
      id: 'summer_vacation',
      text: 'You take a lovely summer vacation. The memories will last a lifetime.',
      effects: { happiness: 12, stress: -10 },
      type: 'good',
      prob: 0.3,
    },
    {
      id: 'summer_fun',
      text: 'Summer is in full swing! You feel full of energy.',
      effects: { happiness: 8, energy: 10 },
      type: 'good',
      prob: 0.25,
    },
    {
      id: 'summer_storm',
      text: 'A violent thunderstorm knocks out the power for days.',
      effects: { happiness: -5, stress: 5 },
      type: 'bad',
      prob: 0.15,
    },
  ],
  Fall: [
    {
      id: 'fall_harvest',
      text: 'The harvest season brings abundance and cozy feelings.',
      effects: { happiness: 6, money: 200 },
      type: 'good',
      prob: 0.25,
    },
    {
      id: 'fall_flu',
      text: 'The autumn flu is going around. You caught it.',
      effects: { health: -8, happiness: -5 },
      type: 'bad',
      prob: 0.2,
    },
    {
      id: 'fall_leaves',
      text: 'The leaves have turned beautiful colors. You go for a scenic walk.',
      effects: { happiness: 8 },
      type: 'good',
      prob: 0.3,
    },
    {
      id: 'fall_gloom',
      text: 'The grey skies and shorter days are bringing you down.',
      effects: { happiness: -5, stress: 3 },
      type: 'bad',
      prob: 0.15,
    },
  ],
  Winter: [
    {
      id: 'winter_blizzard',
      text: 'A massive blizzard has stranded everyone indoors.',
      effects: { stress: 8, happiness: -5 },
      type: 'bad',
      prob: 0.2,
    },
    {
      id: 'winter_cozy',
      text: 'You spend a cozy day by the fire with hot cocoa.',
      effects: { happiness: 10, stress: -5 },
      type: 'good',
      prob: 0.25,
    },
    {
      id: 'winter_holiday',
      text: 'The holiday season fills you with warmth and joy.',
      effects: { happiness: 15, karma: 3 },
      type: 'good',
      prob: 0.25,
    },
    {
      id: 'winter_sadness',
      text: 'The cold, dark winter is making you feel lonely.',
      effects: { happiness: -8, stress: 5 },
      type: 'bad',
      prob: 0.15,
    },
  ],
};

export const HOLIDAYS = [
  {
    id: 'new_year',
    ageRange: [1, 120],
    text: "It's New Year's Day! A time for fresh starts.",
    effects: { happiness: 10, stress: -5 },
    type: 'good',
    prob: 1.0,
  },
  {
    id: 'birthday',
    ageRange: [1, 120],
    text: p => `It's your ${formatOrdinal(p.age)} birthday!`,
    effects: { happiness: 10 },
    type: 'good',
    prob: 1.0,
  },
  {
    id: 'summer_solstice',
    ageRange: [10, 120],
    text: 'The summer solstice — the longest day of the year.',
    effects: { happiness: 5, energy: 5 },
    type: 'good',
    prob: 0.3,
  },
  {
    id: 'winter_solstice',
    ageRange: [10, 120],
    text: 'The winter solstice — the longest night of the year.',
    effects: { happiness: -3 },
    type: 'neutral',
    prob: 0.3,
  },
  {
    id: 'tax_day',
    ageRange: [18, 120],
    text: 'Tax season is here. What a drag.',
    effects: { stress: 10, happiness: -5 },
    type: 'bad',
    prob: 0.5,
  },
  {
    id: 'halloween',
    ageRange: [1, 16],
    text: 'Trick or treat! Halloween is so much fun.',
    effects: { happiness: 12 },
    type: 'good',
    prob: 0.6,
  },
  {
    id: 'spooky_season',
    ageRange: [17, 120],
    text: 'Halloween parties are in full swing. Did you dress up?',
    effects: { happiness: 8 },
    type: 'good',
    prob: 0.4,
  },
  {
    id: 'national_day',
    ageRange: [5, 120],
    text: p => `Your country is celebrating its national day!`,
    effects: { happiness: 5, karma: 2 },
    type: 'good',
    prob: 0.3,
  },
];

for (const [season, events] of Object.entries(SEASONAL_EVENTS)) {
  for (const event of events) {
    event.messageKey = `season.${season.toLowerCase()}.${event.id}`;
    event.messageParams = {};
  }
}

for (const holiday of HOLIDAYS) {
  holiday.messageKey = `holiday.${holiday.id}`;
}

export function getSeason(age) {
  return SEASONS[age % 4];
}

export function processSeasonalEvent(person) {
  const { age } = person;
  const season = getSeason(age);

  person.currentSeason = season;

  const events = SEASONAL_EVENTS[season] || [];
  for (const evt of events) {
    if (Math.random() < evt.prob) {
      const text = typeof evt.text === 'function' ? evt.text(person) : evt.text;
      person.logEvent(`[${season}] ${text}`, evt.type, {
        messageKey: evt.messageKey,
        messageParams: { season },
      });
      if (evt.effects) {
        person.updateStats(evt.effects);
      }
      break;
    }
  }

  const birthday = HOLIDAYS.find(holiday => holiday.id === 'birthday');
  if (birthday && age >= birthday.ageRange[0] && age <= birthday.ageRange[1]) {
    person.logEvent(`🎂 ${birthday.text(person)}`, birthday.type, {
      messageKey: birthday.messageKey,
      messageParams: { age },
    });
    person.updateStats(birthday.effects);
  }

  const eligibleHolidays = HOLIDAYS.filter(
    holiday =>
      holiday.id !== 'birthday' &&
      (!holiday.ageRange || (age >= holiday.ageRange[0] && age <= holiday.ageRange[1]))
  );
  if (eligibleHolidays.length > 0) {
    const holiday = eligibleHolidays[Math.floor(Math.random() * eligibleHolidays.length)];
    if (Math.random() < holiday.prob) {
      const text = typeof holiday.text === 'function' ? holiday.text(person) : holiday.text;
      person.logEvent(`🎉 ${text}`, holiday.type, {
        messageKey: holiday.messageKey,
        messageParams: { age },
      });
      if (holiday.effects) {
        person.updateStats(holiday.effects);
      }
    }
  }
}
