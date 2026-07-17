const NPC_JOBS = [
  { title: 'Cashier', salary: 25000, tier: 1 },
  { title: 'Waiter', salary: 22000, tier: 1 },
  { title: 'Retail Associate', salary: 28000, tier: 1 },
  { title: 'Office Clerk', salary: 32000, tier: 1 },
  { title: 'Driver', salary: 35000, tier: 1 },
  { title: 'Security Guard', salary: 30000, tier: 1 },
  { title: 'Nurse', salary: 60000, tier: 2 },
  { title: 'Teacher', salary: 48000, tier: 2 },
  { title: 'Electrician', salary: 52000, tier: 2 },
  { title: 'Accountant', salary: 55000, tier: 2 },
  { title: 'Software Developer', salary: 85000, tier: 3 },
  { title: 'Engineer', salary: 78000, tier: 3 },
  { title: 'Lawyer', salary: 95000, tier: 3 },
  { title: 'Doctor', salary: 120000, tier: 3 },
  { title: 'Manager', salary: 65000, tier: 2 },
  { title: 'Executive', salary: 150000, tier: 4 },
  { title: 'Entrepreneur', salary: 100000, tier: 3 },
  { title: 'Artist', salary: 35000, tier: 1 },
  { title: 'Chef', salary: 40000, tier: 2 },
  { title: 'Police Officer', salary: 45000, tier: 2 },
  { title: 'Military', salary: 40000, tier: 2 },
  { title: 'Professor', salary: 75000, tier: 3 },
  { title: 'Real Estate Agent', salary: 50000, tier: 2 },
  { title: 'Consultant', salary: 80000, tier: 3 },
  { title: 'Journalist', salary: 42000, tier: 2 },
  { title: 'Pharmacist', salary: 90000, tier: 3 },
  { title: 'Dentist', salary: 110000, tier: 3 },
  { title: 'Architect', salary: 70000, tier: 3 },
  { title: 'Scientist', salary: 75000, tier: 3 },
];

const FIRST_NAMES_MALE = [
  'James',
  'John',
  'Robert',
  'Michael',
  'William',
  'David',
  'Daniel',
  'Joseph',
  'Thomas',
  'Charles',
  'Alexander',
  'Benjamin',
  'Christopher',
  'Andrew',
  'Matthew',
  'Ethan',
  'Ryan',
  'Jacob',
  'Noah',
  'Liam',
];
const FIRST_NAMES_FEMALE = [
  'Mary',
  'Patricia',
  'Jennifer',
  'Linda',
  'Barbara',
  'Elizabeth',
  'Susan',
  'Jessica',
  'Sarah',
  'Karen',
  'Emma',
  'Olivia',
  'Ava',
  'Sophia',
  'Isabella',
  'Mia',
  'Charlotte',
  'Amelia',
  'Harper',
  'Evelyn',
];
const LAST_NAMES = [
  'Smith',
  'Johnson',
  'Williams',
  'Brown',
  'Jones',
  'Garcia',
  'Miller',
  'Davis',
  'Rodriguez',
  'Martinez',
  'Hernandez',
  'Lopez',
  'Gonzalez',
  'Wilson',
  'Anderson',
  'Thomas',
  'Taylor',
  'Moore',
  'Jackson',
  'Martin',
  'Lee',
  'Thompson',
  'White',
  'Harris',
  'Clark',
];

const NPC_EDUCATION_LEVELS = [
  'None',
  'High School',
  'Associate',
  "Bachelor's",
  "Master's",
  'Doctorate',
];

const PET_NAMES = [
  'Max',
  'Charlie',
  'Cooper',
  'Milo',
  'Buddy',
  'Rocky',
  'Bear',
  'Leo',
  'Duke',
  'Teddy',
  'Luna',
  'Bella',
  'Lucy',
  'Daisy',
  'Lola',
  'Sadie',
  'Molly',
  'Bailey',
  'Stella',
  'Maggie',
  'Oliver',
  'Jack',
  'Toby',
  'Jake',
  'Ziggy',
  'Ruby',
  'Penny',
  'Pepper',
  'Mia',
  'Coco',
];

const HOBBIES = [
  'painting',
  'photography',
  'gardening',
  'cooking',
  'baking',
  'hiking',
  'yoga',
  'running',
  'cycling',
  'fishing',
  'camping',
  'pottery',
  'woodworking',
  'knitting',
  'dancing',
  'singing',
  'writing',
  'blogging',
  'gaming',
  'bird watching',
  'wine tasting',
  'craft beer brewing',
];

const AWARDS = [
  'Employee of the Month',
  'Community Service Award',
  'Innovation Award',
  'Leadership Excellence',
  'Best Sales Performance',
  'Research Grant',
  'Art Competition Winner',
  'Marathon Finisher Medal',
  'Culinary Award',
  'Volunteer Recognition',
  'Safety Award',
  'Customer Service Star',
];

export class NPCSimulator {
  static ensureNPCData(rel, playerAge) {
    if (rel.npcInitialized) {
      return;
    }
    rel.npcInitialized = true;
    const isChild = rel.type === 'Child';
    const isParent = ['Father', 'Mother', 'Parent'].includes(rel.type);
    const npc = {
      job: null,
      education: 'None',
      money: Math.floor(Math.random() * 20000) + 1000,
      happiness: 50 + Math.floor(Math.random() * 35),
      health: isChild ? 85 + Math.floor(Math.random() * 15) : 60 + Math.floor(Math.random() * 30),
      isAlive: rel.status !== 'Deceased',
      lastSimAge: playerAge,
      city: null,
      lifeEvents: [],
      isMarried: false,
      marriedTo: null,
      pet: null,
      hobby: null,
      hasHouse: false,
      travelCount: 0,
    };

    if (!isChild) {
      const edRoll = Math.random();
      if (edRoll < 0.25) {
        npc.education = 'None';
      } else if (edRoll < 0.5) {
        npc.education = 'High School';
      } else if (edRoll < 0.65) {
        npc.education = 'Associate';
      } else if (edRoll < 0.85) {
        npc.education = "Bachelor's";
      } else if (edRoll < 0.95) {
        npc.education = "Master's";
      } else {
        npc.education = 'Doctorate';
      }

      if (rel.age >= 18) {
        const job = this.pickJobForNPC(rel, npc);
        if (job) {
          npc.job = { ...job };
        }
        npc.money = Math.floor(Math.random() * (npc.job ? npc.job.salary * 2 : 30000)) + 2000;
      }

      if (isParent && rel.age >= 30) {
        npc.money += Math.floor(Math.random() * 150000) + 50000;
      }
    }

    rel.npcData = npc;
  }

  static pickJobForNPC(rel, npc) {
    const age = rel.age || 0;
    const ed = npc.education || 'None';
    let tierMax = 1;
    if (ed === "Bachelor's" || ed === 'Associate') {
      tierMax = 2;
    } else if (ed === "Master's") {
      tierMax = 3;
    } else if (ed === 'Doctorate') {
      tierMax = 4;
    }

    if (age < 18) {
      return null;
    }
    if (age >= 65) {
      return null;
    }

    const eligible = NPC_JOBS.filter(j => j.tier <= tierMax);
    if (eligible.length === 0) {
      return null;
    }
    const job = eligible[Math.floor(Math.random() * eligible.length)];
    const variance = 0.85 + Math.random() * 0.3;
    return { title: job.title, salary: Math.floor(job.salary * variance) };
  }

  static simulateYear(person, worldState) {
    if (!Array.isArray(person.relationships)) {
      return [];
    }

    const events = [];
    const myCountryState = worldState?.countries
      ? Object.values(worldState.countries).find(c => c.name === person.country)
      : null;

    const atWar = person.countryRelations
      ? Object.values(person.countryRelations).some(rel => rel && rel.atWar)
      : false;

    const recession = myCountryState && myCountryState.gdpGrowth < -2;
    const pandemic = worldState?.pandemicRisk > 0.5;

    for (const rel of person.relationships) {
      if (rel.status === 'Deceased') {
        continue;
      }
      if (!rel.npcInitialized) {
        this.ensureNPCData(rel, person.age);
      }
      if (!rel.npcData) {
        continue;
      }
      if (!rel.npcData.isAlive) {
        continue;
      }

      const npc = rel.npcData;
      npc.lastSimAge = person.age;

      npc.happiness = Math.max(0, Math.min(100, npc.happiness + (Math.random() < 0.5 ? -3 : 3)));

      // Country/world effects on NPCs
      if (atWar && rel.age >= 18 && rel.age <= 45 && Math.random() < 0.03) {
        npc.health = Math.max(0, npc.health - 15);
        this.pushEvent(events, rel, 'war_draft', `${rel.name} was drafted due to the war.`, 'bad');
        person.logEvent(`Your ${rel.type}, ${rel.name}, was drafted into the military.`, 'bad');
      }

      if (atWar && Math.random() < 0.01) {
        npc.isAlive = false;
        rel.status = 'Deceased';
        this.pushEvent(events, rel, 'war_casualty', `${rel.name} was killed in the war.`, 'bad');
        person.logEvent(`Your ${rel.type}, ${rel.name}, was killed in the war. 💔`, 'bad');
        person.updateStats({ happiness: -20, stress: 15 });
        continue;
      }

      if (recession && npc.job && Math.random() < 0.05) {
        npc.job = null;
        npc.money = Math.max(0, npc.money - 10000);
        this.pushEvent(
          events,
          rel,
          'job_loss',
          `${rel.name} lost their job due to the recession.`,
          'bad'
        );
        person.logEvent(
          `Your ${rel.type}, ${rel.name}, lost their job due to the recession.`,
          'bad'
        );
      }

      if (pandemic && Math.random() < 0.04) {
        npc.health = Math.max(0, npc.health - 10);
        this.pushEvent(events, rel, 'illness', `${rel.name} got sick during the pandemic.`, 'bad');
        person.logEvent(`Your ${rel.type}, ${rel.name}, got sick during the pandemic.`, 'bad');
      }

      if (myCountryState && myCountryState.stability < 25 && Math.random() < 0.02) {
        this.pushEvent(
          events,
          rel,
          'emigration',
          `${rel.name} fled the country due to instability.`,
          'neutral'
        );
        person.logEvent(
          `Your ${rel.type}, ${rel.name}, fled the country due to instability.`,
          'neutral'
        );
      }

      if (rel.type === 'Child' && rel.age >= 18) {
        this.simulateAdultNPC(person, rel, npc, events);
      } else if (
        [
          'Father',
          'Mother',
          'Parent',
          'Sibling',
          'Friend',
          'Best Friend',
          'Partner',
          'Fiance',
          'Spouse',
        ].includes(rel.type)
      ) {
        this.simulateAdultNPC(person, rel, npc, events);
      }

      if (rel.age > 60 && npc.health > 40) {
        npc.health = Math.max(0, npc.health - (rel.age > 80 ? 3 : rel.age > 70 ? 1.5 : 0.5));
      }

      if (npc.health <= 0 && npc.isAlive) {
        npc.isAlive = false;
        rel.status = 'Deceased';
        const loss = ['Spouse', 'Child', 'Parent'].includes(rel.type) ? -25 : -15;
        person.logEvent(`Your ${rel.type}, ${rel.name}, has passed away at age ${rel.age}.`, 'bad');
        person.updateStats({ happiness: loss, stress: Math.abs(loss) / 2 });
      }

      if (npc.job && npc.job.salary > 0) {
        npc.money = Math.max(0, (npc.money || 0) + Math.floor(npc.job.salary * 0.7));
      }
      const expenseBase = rel.type === 'Child' && rel.age < 18 ? 5000 : 15000;
      npc.money = Math.max(0, (npc.money || 0) - expenseBase);
    }

    return events;
  }

  static simulateAdultNPC(person, rel, npc, events) {
    this.simulateParentRetirement(rel, npc, events, person);
    this.simulateJobStart(rel, npc, events, person);
    this.simulateJobChange(rel, npc, events, person);
    this.simulateEducation(rel, npc, events, person);
    this.simulateLateRetirement(rel, npc, events, person);
    this.simulateHealthScare(rel, npc, events, person);

    this.simulateMarriage(rel, npc, events, person);
    this.simulateHavingBaby(rel, npc, events, person);
    this.simulateDivorce(rel, npc, events, person);
    this.simulateBuyingHouse(rel, npc, events, person);
    this.simulateAward(rel, npc, events, person);
    this.simulatePetAdoption(rel, npc, events, person);
    this.simulateHobby(rel, npc, events, person);
    this.simulateTravel(rel, npc, events, person);
    this.simulateAccident(rel, npc, events, person);
    this.simulateGraduate(rel, npc, events, person);
  }

  static simulateParentRetirement(rel, npc, events, person) {
    if (
      !['Father', 'Mother', 'Parent'].includes(rel.type) ||
      rel.age < 60 ||
      !npc.job ||
      Math.random() >= 0.08
    ) {
      return;
    }
    npc.job = null;
    this.pushEvent(events, rel, 'retirement', `${rel.name} retired.`, 'neutral');
    person.logEvent(`Your ${rel.type}, ${rel.name}, retired.`, 'neutral');
  }

  static simulateJobStart(rel, npc, events, person) {
    if (rel.age < 18 || rel.age >= 60 || npc.job || Math.random() >= 0.3) {
      return;
    }
    const job = this.pickJobForNPC(rel, npc);
    if (!job) {
      return;
    }
    npc.job = { ...job };
    this.pushEvent(events, rel, 'job_start', `${rel.name} became a ${job.title}.`, 'good');
    person.logEvent(
      `Your ${rel.type}, ${rel.name}, became a ${job.title} earning $${job.salary.toLocaleString()}/yr.`,
      'good'
    );
  }

  static simulateJobChange(rel, npc, events, person) {
    if (!npc.job || rel.age >= 55 || Math.random() >= 0.07) {
      return;
    }
    const newJob = this.pickJobForNPC(rel, npc);
    if (!newJob || newJob.salary <= (npc.job.salary || 0) * 1.08) {
      return;
    }
    npc.job = { ...newJob };
    this.pushEvent(events, rel, 'job_change', `${rel.name} became a ${newJob.title}.`, 'good');
    person.logEvent(
      `Your ${rel.type}, ${rel.name}, got a new job as a ${newJob.title} earning $${newJob.salary.toLocaleString()}/yr.`,
      'good'
    );
  }

  static simulateEducation(rel, npc, events, person) {
    if (
      rel.type !== 'Child' ||
      rel.age < 18 ||
      rel.age > 25 ||
      npc.education !== 'None' ||
      Math.random() >= 0.15
    ) {
      return;
    }
    npc.education = "Bachelor's";
    this.pushEvent(events, rel, 'education', `${rel.name} went to college.`, 'good');
    person.logEvent(`Your child ${rel.name} started college!`, 'good');
  }

  static simulateGraduate(rel, npc, events, person) {
    if (
      npc.education === 'None' ||
      npc.education === 'High School' ||
      rel.age < 21 ||
      Math.random() >= 0.03
    ) {
      return;
    }
    const levels = ['High School', 'Associate', "Bachelor's", "Master's", 'Doctorate'];
    const idx = levels.indexOf(npc.education);
    if (idx < 0 || idx >= levels.length - 1) {
      return;
    }
    if (rel.type === 'Child' && rel.age < 18) {
      return;
    }
    npc.education = levels[idx + 1];
    const label = rel.type === 'Child' ? 'Your child' : `Your ${rel.type}`;
    this.pushEvent(
      events,
      rel,
      'education',
      `${rel.name} earned a ${levels[idx + 1]} degree.`,
      'good'
    );
    person.logEvent(`${label} ${rel.name} earned a ${levels[idx + 1]} degree!`, 'good');
  }

  static simulateLateRetirement(rel, npc, events, person) {
    if (rel.age < 65 || !npc.job || Math.random() >= 0.15) {
      return;
    }
    npc.job = null;
    this.pushEvent(events, rel, 'retirement', `${rel.name} retired.`, 'neutral');
    person.logEvent(`Your ${rel.type}, ${rel.name}, retired.`, 'neutral');
  }

  static simulateHealthScare(rel, npc, events, person) {
    if (rel.age < 65 || Math.random() >= 0.06 || npc.health <= 40) {
      return;
    }
    npc.health = Math.max(0, npc.health - 15);
    this.pushEvent(events, rel, 'health', `${rel.name} had a health scare.`, 'bad');
    person.logEvent(`Your ${rel.type}, ${rel.name}, had a health scare.`, 'bad');
  }

  static simulateMarriage(rel, npc, events, person) {
    if (npc.isMarried || rel.age < 22 || rel.age > 55 || Math.random() >= 0.04) {
      return;
    }
    npc.isMarried = true;
    const spouseName = `${this.randomFirstName()} ${this.randomLastName()}`;
    npc.marriedTo = spouseName;
    const label = rel.type === 'Child' ? 'Your child' : `Your ${rel.type}`;
    this.pushEvent(events, rel, 'marriage', `${rel.name} married ${spouseName}.`, 'good');
    person.logEvent(`${label} ${rel.name} married ${spouseName}!`, 'good');
  }

  static simulateHavingBaby(rel, npc, events, person) {
    if (!npc.isMarried || !npc.marriedTo || rel.age < 24 || rel.age > 42 || Math.random() >= 0.04) {
      return;
    }
    const lastName = rel.name.split(' ').pop() || this.randomLastName();
    const babyName = `${this.randomFirstName()} ${lastName}`;
    const babyAge = 0;
    const isGrandchild = rel.type === 'Child';
    const relType = isGrandchild ? 'Grandchild' : 'Nibling';
    const label = isGrandchild ? 'Your grandchild' : `Your ${rel.type}'s child`;
    this.pushEvent(events, rel, 'baby', `${rel.name} had a baby: ${babyName}.`, 'good');
    person.logEvent(`${label} ${babyName} was born to ${rel.name}!`, 'good');

    if (person.addRelationship) {
      person.addRelationship({
        id: `npc_baby_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        name: babyName,
        type: relType,
        age: babyAge,
        gender: Math.random() > 0.5 ? 'male' : 'female',
        traits: [],
        inheritedSmarts: Math.floor(Math.random() * 100),
        inheritedLooks: Math.floor(Math.random() * 100),
        inheritedHealth: Math.floor(Math.random() * 100),
      });
      person.logEvent(`You have a new ${relType.toLowerCase()}: ${babyName}!`, 'good');
    }
  }

  static simulateDivorce(rel, npc, events, person) {
    if (!npc.isMarried || !npc.marriedTo || rel.age < 25 || rel.age > 60 || Math.random() >= 0.02) {
      return;
    }
    npc.isMarried = false;
    const exName = npc.marriedTo;
    npc.marriedTo = null;
    npc.happiness = Math.max(0, npc.happiness - 15);
    const label = rel.type === 'Child' ? 'Your child' : `Your ${rel.type}`;
    this.pushEvent(events, rel, 'divorce', `${rel.name} divorced ${exName}.`, 'bad');
    person.logEvent(`${label} ${rel.name} divorced ${exName}.`, 'bad');
  }

  static simulateBuyingHouse(rel, npc, events, person) {
    if (
      npc.hasHouse ||
      rel.age < 25 ||
      rel.age > 60 ||
      npc.money < 30000 ||
      Math.random() >= 0.05
    ) {
      return;
    }
    npc.hasHouse = true;
    npc.money = Math.max(0, npc.money - Math.floor(Math.random() * 40000 + 20000));
    const label = rel.type === 'Child' ? 'Your child' : `Your ${rel.type}`;
    this.pushEvent(events, rel, 'house', `${rel.name} bought a house!`, 'good');
    person.logEvent(`${label} ${rel.name} bought a house!`, 'good');
  }

  static simulateAward(rel, npc, events, person) {
    if (rel.age < 20 || rel.age > 70 || Math.random() >= 0.03) {
      return;
    }
    const award = AWARDS[Math.floor(Math.random() * AWARDS.length)];
    npc.happiness = Math.min(100, npc.happiness + 5);
    const label = rel.type === 'Child' ? 'Your child' : `Your ${rel.type}`;
    this.pushEvent(events, rel, 'award', `${rel.name} won ${award}!`, 'good');
    person.logEvent(`${label} ${rel.name} won ${award}!`, 'good');
  }

  static simulatePetAdoption(rel, npc, events, person) {
    if (npc.pet || rel.age < 20 || rel.age > 75 || Math.random() >= 0.02) {
      return;
    }
    const petName = PET_NAMES[Math.floor(Math.random() * PET_NAMES.length)];
    const petType =
      Math.random() < 0.6
        ? 'dog'
        : Math.random() < 0.7
          ? 'cat'
          : Math.random() < 0.85
            ? 'hamster'
            : 'parrot';
    npc.pet = { name: petName, type: petType };
    npc.happiness = Math.min(100, npc.happiness + 3);
    this.pushEvent(
      events,
      rel,
      'pet',
      `${rel.name} adopted a ${petType} named ${petName}.`,
      'good'
    );
    person.logEvent(`Your ${rel.type} ${rel.name} adopted a ${petType} named ${petName}!`, 'good');
  }

  static simulateHobby(rel, npc, events, person) {
    if (npc.hobby || rel.age < 16 || rel.age > 80 || Math.random() >= 0.03) {
      return;
    }
    const hobby = HOBBIES[Math.floor(Math.random() * HOBBIES.length)];
    npc.hobby = hobby;
    npc.happiness = Math.min(100, npc.happiness + 4);
    this.pushEvent(events, rel, 'hobby', `${rel.name} started ${hobby}.`, 'good');
    person.logEvent(`Your ${rel.type} ${rel.name} started ${hobby}!`, 'good');
  }

  static simulateTravel(rel, npc, events, person) {
    if (rel.age < 18 || rel.age > 75 || Math.random() >= 0.03) {
      return;
    }
    npc.travelCount = (npc.travelCount || 0) + 1;
    const destinations = [
      'Paris',
      'Tokyo',
      'Bali',
      'London',
      'Rome',
      'Barcelona',
      'Dubai',
      'Sydney',
      'New York',
      'Hawaii',
      'Amsterdam',
      'Bangkok',
    ];
    const dest = destinations[Math.floor(Math.random() * destinations.length)];
    npc.happiness = Math.min(100, npc.happiness + 3);
    this.pushEvent(events, rel, 'travel', `${rel.name} visited ${dest}.`, 'good');
    person.logEvent(`Your ${rel.type} ${rel.name} visited ${dest}!`, 'good');
  }

  static simulateAccident(rel, npc, events, person) {
    if (rel.age < 16 || Math.random() >= 0.02) {
      return;
    }
    const accidentTypes = [
      { text: 'sprained ankle', healthLoss: 5 },
      { text: 'caught a bad flu', healthLoss: 8 },
      { text: 'got into a minor car accident', healthLoss: 12 },
      { text: 'broke their arm', healthLoss: 15 },
      { text: 'had food poisoning', healthLoss: 6 },
    ];
    const accident = accidentTypes[Math.floor(Math.random() * accidentTypes.length)];
    npc.health = Math.max(0, npc.health - accident.healthLoss);
    npc.happiness = Math.max(0, npc.happiness - 5);
    this.pushEvent(events, rel, 'accident', `${rel.name} ${accident.text}.`, 'bad');
    person.logEvent(`Your ${rel.type} ${rel.name} ${accident.text}.`, 'bad');
  }

  static pushEvent(events, rel, type, text, mood) {
    events.push({ type, rel, text, mood: mood || 'neutral' });
  }

  static randomFirstName() {
    return Math.random() < 0.5
      ? FIRST_NAMES_MALE[Math.floor(Math.random() * FIRST_NAMES_MALE.length)]
      : FIRST_NAMES_FEMALE[Math.floor(Math.random() * FIRST_NAMES_FEMALE.length)];
  }

  static randomLastName() {
    return LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
  }

  static getNPCStatusSummary(rel) {
    if (!rel.npcData) {
      return '';
    }
    const npc = rel.npcData;
    if (!npc.isAlive) {
      return 'Deceased';
    }
    const parts = [];
    if (npc.job) {
      parts.push(npc.job.title);
    }
    if (npc.education && npc.education !== 'None' && !npc.job) {
      parts.push(npc.education);
    }
    return parts.join(' · ') || 'No occupation';
  }
}
