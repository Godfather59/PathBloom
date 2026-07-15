import { processGeopoliticsYear, updatePolicies, initializeGeopolitics } from './GeoPolitics';

export const POLITICAL_OFFICES = [
  {
    id: 'school_board',
    title: 'School Board Director',
    salary: 20000,
    term: 4,
    minAge: 18,
    cost: 5000,
    difficulty: 1,
    prestige: 20,
  },
  {
    id: 'city_council',
    title: 'City Council Member',
    salary: 45000,
    term: 4,
    minAge: 21,
    cost: 10000,
    difficulty: 2,
    prestige: 30,
  },
  {
    id: 'mayor',
    title: 'Mayor',
    salary: 120000,
    term: 4,
    minAge: 25,
    cost: 50000,
    difficulty: 3,
    prestige: 50,
  },
  {
    id: 'congress',
    title: 'Member of Congress',
    salary: 174000,
    term: 2,
    minAge: 25,
    cost: 200000,
    difficulty: 5,
    prestige: 70,
  },
  {
    id: 'senate',
    title: 'Senator',
    salary: 174000,
    term: 6,
    minAge: 30,
    cost: 500000,
    difficulty: 7,
    prestige: 85,
  },
  {
    id: 'governor',
    title: 'Governor',
    salary: 180000,
    term: 4,
    minAge: 30,
    cost: 500000,
    difficulty: 6,
    prestige: 80,
  },
  {
    id: 'president',
    title: 'President',
    salary: 400000,
    term: 4,
    minAge: 35,
    cost: 10000000,
    difficulty: 10,
    prestige: 100,
  },
];

for (const office of POLITICAL_OFFICES) {
  office.titleMessageKey = `politics.office.${office.id}`;
}

export const CAMPAIGN_ACTIONS = [
  { id: 'rally', title: 'Hold a Rally', cost: 1000, impact: 5, risk: 2 },
  { id: 'fundraise', title: 'Fundraising Event', cost: 500, impact: 2, risk: 0, gain: true },
  { id: 'interview', title: 'TV Interview', cost: 0, impact: 8, risk: 20 },
  { id: 'debate', title: 'Participate in Debate', cost: 0, impact: 10, risk: 15 },
  { id: 'town_hall', title: 'Town Hall Meeting', cost: 200, impact: 6, risk: 5 },
  { id: 'ad_campaign', title: 'Run TV Ads', cost: 20000, impact: 12, risk: 3 },
  { id: 'attack', title: 'Attack Opponent', cost: 5000, impact: 15, risk: 40 },
  { id: 'bribe', title: 'Bribe Officials', cost: 50000, impact: 25, risk: 80 },
  { id: 'scandal_leak', title: 'Leak Scandal', cost: 10000, impact: 18, risk: 35 },
];

for (const action of CAMPAIGN_ACTIONS) {
  action.titleMessageKey = `politics.action.${action.id}`;
}

export const TERM_EVENTS = [
  {
    id: 'bipartisan_bill',
    messageKey: 'politics.term.bipartisan_bill',
    trigger: () => Math.random() < 0.1,
    text: 'You passed a bipartisan bill! Your approval ratings rise.',
    effects: { approval: 5 },
    type: 'good',
  },
  {
    id: 'administration_scandal',
    messageKey: 'politics.term.administration_scandal',
    trigger: () => Math.random() < 0.06,
    text: 'A scandal erupts in your administration. Your staff takes the blame.',
    effects: { approval: -5 },
    type: 'bad',
  },
  {
    id: 'economic_boom',
    messageKey: 'politics.term.economic_boom',
    trigger: () => Math.random() < 0.04,
    text: 'The economy is booming under your leadership! Citizens are grateful.',
    effects: { approval: 8 },
    type: 'good',
  },
  {
    id: 'opponent_rumors',
    messageKey: 'politics.term.opponent_rumors',
    trigger: () => Math.random() < 0.05,
    text: 'Your opponent spreads rumors about you. You lose some support.',
    effects: { approval: -3 },
    type: 'bad',
  },
  {
    id: 'politician_of_year',
    messageKey: 'politics.term.politician_of_year',
    trigger: () => Math.random() < 0.03,
    text: 'You were voted "Politician of the Year"! Your fame grows.',
    effects: { approval: 10, fame: 5 },
    type: 'good',
  },
  {
    id: 'disaster_response',
    messageKey: 'politics.term.disaster_response',
    trigger: () => Math.random() < 0.07,
    text: 'A natural disaster struck. Your response was widely praised.',
    effects: { approval: 6, karma: 3 },
    type: 'good',
  },
  {
    id: 'policy_protest',
    messageKey: 'politics.term.policy_protest',
    trigger: () => Math.random() < 0.05,
    text: 'A protest against your policies has gained momentum.',
    effects: { approval: -8, stress: 10 },
    type: 'bad',
  },
  {
    id: 'tax_cut_spending',
    messageKey: 'politics.term.tax_cut_spending',
    trigger: () => Math.random() < 0.04,
    text: 'You cut taxes and increased spending. The public loves it!',
    effects: { approval: 7 },
    type: 'good',
  },
  {
    id: 'corruption_investigation',
    messageKey: 'politics.term.corruption_investigation',
    trigger: () => Math.random() < 0.06,
    text: 'A corruption investigation has been opened. Your lawyers are handling it.',
    effects: { approval: -10, stress: 15 },
    type: 'bad',
  },
  {
    id: 'convention_speech',
    messageKey: 'politics.term.convention_speech',
    trigger: () => Math.random() < 0.03,
    text: 'Your speech at the national convention moved the audience to tears.',
    effects: { approval: 12, fame: 3 },
    type: 'good',
  },
];

export function processPoliticalYear(person) {
  if (!person.job || !person.job.isPolitical) {
    return;
  }

  if (person.job.yearsLeft === undefined) {
    person.job.yearsLeft = person.job.termYears || 4;
  }
  person.job.yearsLeft--;

  if (person.job.title === 'President' && !person.countryRelations) {
    initializeGeopolitics(person);
  }

  if (person.job.title === 'President') {
    processGeopoliticsYear(person);
    updatePolicies(person);
  }

  if (person.job.approval === undefined) {
    person.job.approval = 50;
  }
  const drift = Math.floor(Math.random() * 5) - 2;
  person.job.approval = Math.max(0, Math.min(100, person.job.approval + drift));

  for (const evt of TERM_EVENTS) {
    if (evt.trigger()) {
      person.job.approval = Math.max(
        0,
        Math.min(100, person.job.approval + (evt.effects.approval || 0))
      );
      if (evt.effects.fame) {
        person.fame = Math.min(100, (person.fame || 0) + evt.effects.fame);
      }
      if (evt.effects.karma) {
        person.karma = Math.min(100, (person.karma || 0) + evt.effects.karma);
      }
      if (evt.effects.stress) {
        person.stress = Math.min(100, (person.stress || 0) + evt.effects.stress);
      }
      person.logEvent(`[Politics] ${evt.text}`, evt.type, {
        messageKey: evt.messageKey,
        messageParams: {},
      });
      break;
    }
  }

  if (person.job.yearsLeft <= 0) {
    const winChance = person.job.approval;
    if (Math.random() * 100 < winChance) {
      person.job.yearsLeft = person.job.termYears || 4;
      person.logEvent(`[Politics] You won re-election! Your term continues.`, 'good', {
        messageKey: 'politics.term.re_elected',
        messageParams: {},
      });
    } else {
      const prevTitle = person.job.title;
      person.job = null;
      person.isHeadOfState = false;
      person.logEvent(
        `[Politics] You lost re-election as ${prevTitle}. Back to civilian life.`,
        'bad',
        {
          messageKey: 'politics.term.lost_re_election',
          messageParams: { office: prevTitle },
        }
      );
    }
  }
}
