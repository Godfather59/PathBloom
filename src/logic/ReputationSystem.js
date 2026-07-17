const clamp = (value, min = 0, max = 100) =>
  Math.max(min, Math.min(max, Math.round(Number(value) || 0)));

const EVENT_RULES = [
  {
    test: /achievement unlocked|award|promoted|successful|graduated|degree|patent|nobel/i,
    changes: { professional: 3, public: 1 },
  },
  { test: /fired|laid off|rejected|failed|bankrupt/i, changes: { professional: -3, public: -1 } },
  {
    test: /crime|robbery|burglary|fraud|scam|stole|arrested|caught attempting|prison|riot/i,
    changes: { criminal: 7, trust: -4, public: -2 },
  },
  {
    test: /volunteer|donated|charity|help refugees|community service|returned.*wallet/i,
    changes: { public: 4, trust: 4, family: 1 },
  },
  {
    test: /election|campaign|president|mayor|senator|politics|policy|re-election/i,
    changes: { political: 4, public: 2 },
  },
  {
    test: /cheated|betray|divorced|broke your promise|neglected/i,
    changes: { family: -6, trust: -5 },
  },
  {
    test: /married|baby|spent time|thoughtful gift|support|apology|made peace/i,
    changes: { family: 4, trust: 3 },
  },
  { test: /viral|followers|autograph|world tour|charts|fame/i, changes: { public: 5 } },
  {
    test: /war criminal|blood money|bribe|corruption/i,
    changes: { criminal: 5, political: -4, trust: -6 },
  },
];

export function ensureReputation(person) {
  if (!person || typeof person !== 'object') {
    return null;
  }
  const existing =
    person.reputation && typeof person.reputation === 'object' ? person.reputation : {};
  person.reputation = {
    professional: clamp(existing.professional ?? 50),
    criminal: clamp(existing.criminal ?? 0),
    political: clamp(existing.political ?? 0),
    family: clamp(existing.family ?? 50),
    public: clamp(existing.public ?? Math.min(25, Number(person.fame) || 0)),
    trust: clamp(existing.trust ?? 50),
    identityTags: Array.isArray(existing.identityTags)
      ? [...new Set(existing.identityTags)].slice(0, 8)
      : [],
    lastUpdatedAge: Math.max(0, Number(existing.lastUpdatedAge) || Number(person.age) || 0),
  };
  return person.reputation;
}

export function adjustReputation(person, changes = {}) {
  const reputation = ensureReputation(person);
  if (!reputation) {
    return null;
  }
  ['professional', 'criminal', 'political', 'family', 'public', 'trust'].forEach(key => {
    const delta = Number(changes[key]);
    if (Number.isFinite(delta) && delta !== 0) {
      reputation[key] = clamp(reputation[key] + delta);
    }
  });
  reputation.lastUpdatedAge = Math.max(0, Number(person.age) || 0);
  updateIdentityTags(person);
  return reputation;
}

export function observeReputationEvent(person, rawText) {
  if (!rawText) {
    return null;
  }
  const text = String(rawText);
  const combined = {};
  EVENT_RULES.forEach(rule => {
    if (!rule.test.test(text)) {
      return;
    }
    Object.entries(rule.changes).forEach(([key, value]) => {
      combined[key] = (combined[key] || 0) + value;
    });
  });
  if (Object.keys(combined).length === 0) {
    return ensureReputation(person);
  }
  return adjustReputation(person, combined);
}

function updateIdentityTags(person) {
  const rep = ensureReputation(person);
  const tags = [];
  if (rep.professional >= 75) {
    tags.push('respected professional');
  }
  if (rep.professional <= 25) {
    tags.push('unreliable worker');
  }
  if (rep.criminal >= 70) {
    tags.push('notorious criminal');
  } else if (rep.criminal >= 35) {
    tags.push('known offender');
  }
  if (rep.political >= 65) {
    tags.push('political leader');
  }
  if (rep.family >= 75) {
    tags.push('family pillar');
  }
  if (rep.family <= 25) {
    tags.push('estranged relative');
  }
  if (rep.public >= 70) {
    tags.push('public figure');
  }
  if (rep.trust >= 75) {
    tags.push('highly trusted');
  }
  if (rep.trust <= 25) {
    tags.push('widely distrusted');
  }
  rep.identityTags = tags.slice(0, 8);
}

export function processReputationYear(person) {
  const rep = ensureReputation(person);
  if (!rep) {
    return;
  }

  // Reputation slowly moves toward a neutral baseline when the player stays quiet.
  const drift = (value, target, amount = 1) =>
    value > target
      ? Math.max(target, value - amount)
      : value < target
        ? Math.min(target, value + amount)
        : value;
  rep.criminal = drift(rep.criminal, 0, person.isInPrison ? 0 : 2);
  rep.public = drift(rep.public, Math.min(50, Number(person.fame) || 0), 1);
  rep.professional = drift(rep.professional, person.job ? 55 : 45, 1);

  if (person.job?.isPolitical) {
    rep.political = clamp(
      rep.political + Math.max(-2, Math.min(3, ((person.job.approval || 50) - 50) / 15))
    );
  }
  if (person.isInPrison) {
    rep.criminal = clamp(rep.criminal + 3);
    rep.trust = clamp(rep.trust - 2);
  }
  if ((person.relationships || []).some(rel => rel.type === 'Child' && rel.status !== 'Deceased')) {
    const childAverage = (person.relationships || [])
      .filter(rel => rel.type === 'Child' && rel.status !== 'Deceased')
      .reduce((sum, rel, _, list) => sum + (Number(rel.stat) || 50) / Math.max(1, list.length), 0);
    rep.family = clamp(rep.family + (childAverage >= 70 ? 1 : childAverage < 35 ? -2 : 0));
  }

  updateIdentityTags(person);
}

export function applyJobReputation(person, jobData) {
  const rep = ensureReputation(person);
  if (!jobData || !rep) {
    return { allowed: true, performanceBonus: 0 };
  }

  const trustedRole = /doctor|teacher|lawyer|police|judge|bank|government|manager|executive/i.test(
    jobData.title || ''
  );
  if (trustedRole && rep.criminal >= 70 && !jobData.isCriminal) {
    return {
      allowed: false,
      reason: `Your criminal reputation prevented you from being hired as ${jobData.title}.`,
      performanceBonus: 0,
    };
  }

  let performanceBonus = 0;
  if (rep.professional >= 75) {
    performanceBonus += 8;
  }
  if (rep.trust >= 70 && trustedRole) {
    performanceBonus += 5;
  }
  if (rep.professional <= 25) {
    performanceBonus -= 8;
  }
  return { allowed: true, performanceBonus };
}

export function getReputationSummary(person) {
  const rep = ensureReputation(person);
  return {
    ...rep,
    strongest: ['professional', 'political', 'family', 'public', 'trust']
      .map(key => ({ key, value: rep[key] }))
      .sort((a, b) => b.value - a.value)[0],
    risk: rep.criminal >= 50 ? 'criminal scrutiny' : rep.trust <= 30 ? 'low trust' : 'none',
  };
}
