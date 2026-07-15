export const MILESTONE_AGES = [10, 18, 21, 25, 30, 40, 50, 60, 70, 80, 90, 100];

export const MEMORY_TYPES = {
  birthday: { label: 'Birthday' },
  graduation: { label: 'Graduation' },
  wedding: { label: 'Wedding' },
  birth: { label: 'Child Born' },
  career: { label: 'Career Milestone' },
  achievement: { label: 'Achievement' },
  travel: { label: 'Travel' },
  tragedy: { label: 'Tragedy' },
};

export function checkTimeCapsuleMilestone(person) {
  if (!person.timeCapsules) {
    person.timeCapsules = [];
  }
  return (
    MILESTONE_AGES.includes(person.age) &&
    !person.timeCapsules.some(tc => tc.milestoneAge === person.age)
  );
}

export function writeTimeCapsule(person, message) {
  const safeMessage = typeof message === 'string' ? message.trim().slice(0, 500) : '';
  if (!safeMessage) {
    person.logEvent('Write a message before saving a time capsule.', 'bad');
    return false;
  }
  if (!person.timeCapsules) {
    person.timeCapsules = [];
  }
  person.timeCapsules.push({
    age: person.age,
    message: safeMessage,
    createdAt: Date.now(),
    milestoneAge: MILESTONE_AGES.includes(person.age) ? person.age : null,
  });
  person.logEvent(`You wrote a time capsule entry at age ${person.age}.`, 'good');
  return true;
}

export function readTimeCapsule(person, index) {
  const capsule = person.timeCapsules?.[index];
  if (!capsule) {
    return null;
  }

  const ageDiff = person.age - capsule.age;
  if (ageDiff > 0) {
    const reflected = capsule.milestoneAge
      ? `You look back at your ${capsule.milestoneAge}-year-old self: "${capsule.message}" - you've grown so much.`
      : `Reading your message from age ${capsule.age}: "${capsule.message}"`;
    person.logEvent(reflected, 'good');
    if (ageDiff > 20) {
      person.updateStats({ happiness: 5, stress: -5 });
    }
  } else {
    person.logEvent(`Your time capsule: "${capsule.message}"`, 'neutral');
  }

  return capsule;
}

export function autoRecordMemory(person, type, details) {
  if (!person.memories) {
    person.memories = [];
  }
  person.memories.push({
    age: person.age,
    type,
    details,
    date: Date.now(),
  });
  person.memories = person.memories.slice(-50);
}

export function getMemories(person, type) {
  if (!person.memories) {
    return [];
  }
  if (type) {
    return person.memories.filter(m => m.type === type);
  }
  return person.memories;
}

export function getNostalgiaEffect(memories) {
  if (!memories || memories.length === 0) {
    return 0;
  }
  const recentMilestones = memories.filter(m => MILESTONE_AGES.includes(m.age)).length;
  return Math.min(10, recentMilestones * 2);
}
