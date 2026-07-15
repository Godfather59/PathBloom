export const LIFE_EVENTS = [
  // --- HEALTH & SICKNESS ---
  {
    id: 'chest_pain',
    trigger: person => person.health < 40 && Math.random() < 0.1,
    text: 'You are experiencing severe chest pains.',
    effects: { health: -8, happiness: -15 },
    type: 'bad',
  },
  {
    id: 'cold',
    trigger: person => Math.random() < 0.08,
    text: 'You have caught a nasty cold.',
    effects: { health: -5, happiness: -5 },
    type: 'bad',
  },
  {
    id: 'migraine',
    trigger: person => Math.random() < 0.05,
    text: 'You have a splitting migraine.',
    effects: { health: -2, happiness: -10 },
    type: 'bad',
  },

  // --- WINDFALLS & LUCK ---
  {
    id: 'found_money',
    trigger: person => person.age > 6 && Math.random() < 0.05,
    text: 'You found $100 on the street!',
    effects: { money: 100, happiness: 10 },
    type: 'good',
  },
  {
    id: 'lottery_win_small',
    trigger: person => person.age > 18 && Math.random() < 0.001,
    text: 'You won $5,000 in a scratch-off lottery!',
    effects: { money: 5000, happiness: 40 },
    type: 'good',
  },

  // --- SCHOOL & CHILDHOOD ---
  {
    id: 'studied_hard',
    trigger: person => person.age > 5 && person.age < 22 && Math.random() < 0.12,
    text: 'You studied hard at school.',
    effects: { smarts: 5, happiness: -2, stress: 5 },
    type: 'good',
  },
  {
    id: 'bullied',
    trigger: person => person.age > 6 && person.age < 18 && Math.random() < 0.1,
    text: 'A bully made fun of your shoes at school.',
    effects: { happiness: -15, stress: 10 },
    type: 'bad',
  },
  {
    id: 'parents_fighting',
    trigger: person => person.age < 12 && Math.random() < 0.1,
    text: 'Your parents are fighting loudly.',
    effects: { happiness: -10, stress: 10 },
    type: 'bad',
  },
  {
    id: 'family_vacation',
    trigger: person => person.age < 18 && Math.random() < 0.1,
    text: 'Your family went on a trip to Disney World!',
    effects: { happiness: 30 },
    type: 'good',
  },
  {
    id: 'lost_tooth',
    trigger: person => person.age > 4 && person.age < 10 && Math.random() < 0.15,
    text: 'You lost a baby tooth! The Tooth Fairy left $5.',
    effects: { money: 5, happiness: 5 },
    type: 'good',
  },
  {
    id: 'class_clown',
    trigger: person => person.age > 6 && person.age < 15 && Math.random() < 0.1,
    text: 'You made the whole class laugh.',
    effects: { happiness: 10, smarts: -1, looks: 1 },
    type: 'good',
  },
  {
    id: 'teacher_scolded',
    trigger: person => person.age > 6 && person.age < 18 && Math.random() < 0.1,
    text: 'Your teacher scolded you in front of everyone.',
    effects: { happiness: -20, smarts: 2 },
    type: 'bad',
  },
  {
    id: 'first_kiss',
    trigger: person => person.age > 12 && person.age < 18 && Math.random() < 0.15,
    text: 'You had your first kiss behind the bleachers.',
    effects: { happiness: 25 },
    type: 'good',
  },
  {
    id: 'acne',
    trigger: person => person.age > 13 && person.age < 19 && Math.random() < 0.3,
    text: 'You have a terrible breakout of acne.',
    effects: { looks: -10, happiness: -10 },
    type: 'bad',
  },

  // --- SCHOOL & YOUTH ---
  {
    id: 'cheating_test',
    trigger: person => person.age > 10 && person.age < 18 && Math.random() < 0.1,
    text: "You didn't study for your math test. Do you want to cheat?",
    choices: [
      {
        text: 'Cheat off neighbor',
        effects: { smarts: -2, stress: 5 },
        outcomeText: 'You got caught! Detention.',
        type: 'bad',
      },
      {
        text: 'Guess honestly',
        effects: { smarts: 2, happiness: -5 },
        outcomeText: 'You managed to scrape a C-.',
        type: 'neutral',
      },
    ],
  },
  {
    id: 'prom_invite',
    trigger: person => person.age > 15 && person.age < 18 && Math.random() < 0.15,
    text: "It's Prom season! Do you want to ask your crush?",
    choices: [
      {
        text: 'Ask them!',
        effects: { happiness: 20 },
        outcomeText: 'They said YES! Best night ever.',
        type: 'good',
      },
      {
        text: 'Stay home',
        effects: { happiness: -5 },
        outcomeText: 'You played video games all night.',
        type: 'neutral',
      },
    ],
  },
  {
    id: 'principal_office',
    trigger: person => person.age > 6 && person.age < 18 && Math.random() < 0.05,
    text: "You got sent to the Principal's office for talking back.",
    type: 'bad',
    effects: { happiness: -10, smarts: -1 },
  },
  {
    id: 'viral_video',
    trigger: person => person.age > 12 && Math.random() < 0.05,
    text: 'You filmed a funny video of your cat. Post it?',
    choices: [
      {
        text: 'Post it!',
        effects: { fame: 5, happiness: 10 },
        outcomeText: 'It went viral! 500k views!',
        type: 'good',
      },
      {
        text: 'Delete it',
        effects: { happiness: 0 },
        outcomeText: 'Probably for the best.',
        type: 'neutral',
      },
    ],
  },

  // --- WORK & CAREER ---
  {
    id: 'annoying_coworker',
    trigger: person => person.job && Math.random() < 0.1,
    text: 'A coworker, Karen, keeps stealing your lunch.',
    choices: [
      {
        text: 'Report her',
        effects: { happiness: 5, stress: -5 },
        outcomeText: 'HR gave her a warning.',
        type: 'good',
      },
      {
        text: 'Put laxatives in it',
        effects: { happiness: 20, karma: -20 },
        outcomeText: 'She ran to the bathroom screaming.',
        type: 'good',
      },
    ],
  },
  {
    id: 'business_trip',
    trigger: person => person.job && Math.random() < 0.05,
    text: 'Boss wants you to go on a boring conference trip to Ohio.',
    choices: [
      {
        text: 'Go',
        effects: { money: 1000, stress: 10 },
        outcomeText: 'You earned a per diem bonus.',
        type: 'good',
      },
      {
        text: 'Fake sick',
        effects: { happiness: 10, stress: -5 },
        outcomeText: 'You stayed home and watched Netflix.',
        type: 'good',
      },
    ],
  },
  // --- ADULT DRAMA ---
  {
    id: 'identity_theft',
    trigger: person => person.age > 25 && Math.random() < 0.02,
    text: 'Someone opened 5 credit cards in your name!',
    effects: { money: -2000, happiness: -20, stress: 30 },
    type: 'bad',
  },
  {
    id: 'junkie_neighbor',
    trigger: person => person.age > 20 && Math.random() < 0.05,
    text: "Your neighbor is asking for 'sugar' at 3 AM. They look rough.",
    effects: { happiness: -5, stress: 10 },
    type: 'bad',
  },
  {
    id: 'alien_abduction',
    trigger: person => Math.random() < 0.001,
    text: 'A bright light wakes you up... ALIENS?!',
    choices: [
      {
        text: 'Scream',
        effects: { health: -10, stress: 50 },
        outcomeText: 'They probed you and dumped you in a cornfield.',
        type: 'bad',
      },
      {
        text: 'communicate',
        effects: { smarts: 50, happiness: 20 },
        outcomeText: 'They gave you knowledge of the universe.',
        type: 'good',
      },
    ],
  },

  // --- HEALTH ---
  {
    id: 'broken_arm',
    trigger: person => Math.random() < 0.03,
    text: 'You tripped over your own feet and broke your arm.',
    effects: { health: -20, happiness: -20 },
    type: 'bad',
  },
  {
    id: 'food_poisoning',
    trigger: person => Math.random() < 0.05,
    text: 'That sushi smelled funny. Now you are puking.',
    effects: { health: -10, happiness: -15 },
    type: 'bad',
  },

  // --- RELATIONSHIPS (New Section) ---
  {
    id: 'anniversary_forgot',
    trigger: person => {
      const partner = person.relationships.find(r => r.type === 'Spouse' || r.type === 'Partner');
      return partner && Math.random() < 0.05;
    },
    text: 'It was your anniversary yesterday... and you forgot.',
    choices: [
      {
        text: 'Apologize profusely',
        effects: { happiness: -10, money: -200 },
        outcomeText: 'You bought expensive flowers. They still mad.',
        type: 'neutral',
      },
      {
        text: "Pretend you didn't",
        effects: { smarts: -5 },
        outcomeText: 'They saw right through you. Sleeping on couch.',
        type: 'bad',
      },
    ],
  },
  {
    id: 'inLaw_visit',
    trigger: person => {
      const partner = person.relationships.find(r => r.type === 'Spouse');
      return partner && Math.random() < 0.05;
    },
    text: 'Your in-laws are coming to visit for the weekend. They hate your cooking.',
    effects: { stress: 15, happiness: -5 },
    type: 'neutral',
  },
  {
    id: 'child_drawing',
    trigger: person => {
      const child = person.relationships.find(r => r.type === 'Child' && r.age > 3 && r.age < 10);
      return child && Math.random() < 0.1;
    },
    text: 'Your child drew a picture of you. It looks like a potato.',
    effects: { happiness: 10 },
    type: 'good',
  },

  // --- NEW EVENTS ---

  // Childhood
  {
    id: 'ate_glue',
    trigger: person => person.age < 8 && Math.random() < 0.05,
    text: 'You got curious in art class and ate a stick of glue.',
    effects: { health: -2, smarts: -1 },
    type: 'neutral',
  },
  {
    id: 'stray_dog',
    trigger: person => person.age > 5 && person.age < 12 && Math.random() < 0.03,
    text: 'You found a stray dog on the way home! Can you keep it?',
    choices: [
      {
        text: 'Beg parents',
        effects: { happiness: 20 },
        outcomeText: 'They said YES! You named him Buster.',
        type: 'good',
      },
      {
        text: 'Leave it',
        effects: { happiness: -10 },
        outcomeText: 'You walked away feeling sad.',
        type: 'bad',
      },
    ],
  },
  {
    id: 'imaginary_friend',
    trigger: person => person.age > 3 && person.age < 7 && Math.random() < 0.1,
    text: "You made a new friend named 'Mr. Sparkles'. No one else can see him.",
    effects: { happiness: 10, smarts: -1 },
    type: 'neutral',
  },
  {
    id: 'lost_in_store',
    trigger: person => person.age > 2 && person.age < 7 && Math.random() < 0.05,
    text: 'You got lost in the grocery store! The intercom called your name.',
    effects: { happiness: -10, stress: 5 },
    type: 'bad',
  },
  {
    id: 'eat_vegetables',
    trigger: person => person.age > 3 && person.age < 10 && Math.random() < 0.1,
    text: 'Your parents are forcing you to eat broccoli. It smells like feet.',
    choices: [
      {
        text: 'Eat it',
        effects: { health: 2, happiness: -5 },
        outcomeText: 'You choked it down. Gross.',
        type: 'neutral',
      },
      {
        text: 'Throw it',
        effects: { happiness: 5, health: 0 },
        outcomeText: 'You threw it on the floor! Timeout!',
        type: 'bad',
      },
    ],
  },
  {
    id: 'treehouse_build',
    trigger: person => person.age > 4 && person.age < 12 && Math.random() < 0.05,
    text: 'Your dad built a treehouse in the backyard!',
    effects: { happiness: 15 },
    type: 'good',
  },
  {
    id: 'scraped_knee',
    trigger: person => person.age > 2 && person.age < 10 && Math.random() < 0.1,
    text: 'You fell off your bike and scraped your knee.',
    effects: { health: -2, happiness: -5 },
    type: 'bad',
  },
  {
    id: 'school_play',
    trigger: person => person.age > 6 && person.age < 12 && Math.random() < 0.05,
    text: 'You got the lead role in the school play!',
    effects: { happiness: 20, smarts: 2, fame: 5 },
    type: 'good',
  },
  {
    id: 'chicken_pox',
    trigger: person => person.age > 1 && person.age < 10 && Math.random() < 0.03,
    text: 'You caught the Chicken Pox. You are incredibly itchy.',
    effects: { health: -10, happiness: -10 },
    type: 'bad',
  },
  {
    id: 'ice_cream_truck',
    trigger: person => person.age > 3 && person.age < 15 && Math.random() < 0.1,
    text: 'The music of the Ice Cream Truck is heard in the distance.',
    choices: [
      {
        text: 'Chase it',
        effects: { happiness: 10, money: -5 },
        outcomeText: 'You got a SpongeBob popsicle.',
        type: 'good',
      },
      {
        text: 'Ignore',
        effects: { happiness: 0 },
        outcomeText: 'You saved your money.',
        type: 'neutral',
      },
    ],
  },

  // Teen
  {
    id: 'vape_offer',
    trigger: person => person.age > 13 && person.age < 18 && Math.random() < 0.1,
    text: 'The cool kids are vaping in the bathroom. They offer you a hit.',
    choices: [
      {
        text: 'Try it',
        effects: { health: -5, happiness: 5 },
        outcomeText: "You coughed everywhere, but they think you're cool.",
        type: 'neutral',
      },
      {
        text: 'Refuse',
        effects: { health: 0 },
        outcomeText: 'They called you a nerd.',
        type: 'neutral',
      },
    ],
  },
  {
    id: 'skip_school',
    trigger: person => person.age > 14 && person.age < 18 && Math.random() < 0.1,
    text: 'Your friends want to skip school to go to the mall.',
    choices: [
      {
        text: 'Skip school',
        effects: { smarts: -2, happiness: 10 },
        outcomeText: 'You had a blast, but missed a test.',
        type: 'mixed',
      },
      {
        text: 'Go to class',
        effects: { smarts: 2, happiness: -5 },
        outcomeText: 'You learned about photosynthesis. Yay.',
        type: 'neutral',
      },
    ],
  },
  {
    id: 'crush_reject',
    trigger: person => person.age > 12 && person.age < 19 && Math.random() < 0.05,
    text: 'You worked up the courage to ask your crush out... and they laughed at you.',
    effects: { happiness: -30, stress: 10 },
    type: 'bad',
  },
  {
    id: 'driving_test',
    trigger: person => person.age >= 16 && person.age < 19 && Math.random() < 0.15,
    text: "It's time for your driving test!",
    choices: [
      {
        text: 'Take test',
        effects: { happiness: 20, smarts: 2 },
        outcomeText: 'You passed! License acquired.',
        type: 'good',
      },
      {
        text: 'Skip it',
        effects: { happiness: -5 },
        outcomeText: "You're stuck riding the bus.",
        type: 'neutral',
      },
    ],
  },
  {
    id: 'house_party',
    trigger: person => person.age > 15 && person.age < 19 && Math.random() < 0.1,
    text: 'A popular kid is throwing a huge house party.',
    choices: [
      {
        text: 'Go',
        effects: { happiness: 15, fame: 5 },
        outcomeText: 'It was legendary!',
        type: 'good',
      },
      {
        text: 'Study instead',
        effects: { smarts: 5, happiness: -5 },
        outcomeText: 'You aced the test, but missed the fun.',
        type: 'neutral',
      },
    ],
  },
  {
    id: 'first_zit',
    trigger: person => person.age > 12 && person.age < 19 && Math.random() < 0.2,
    text: 'A massive zit appeared on your nose right before school.',
    effects: { looks: -5, happiness: -10 },
    type: 'bad',
  },
  {
    id: 'sneak_out',
    trigger: person => person.age > 14 && person.age < 18 && Math.random() < 0.05,
    text: "There's a concert tonight. Do you sneak out?",
    choices: [
      {
        text: 'Sneak out',
        effects: { happiness: 20, stress: 5, karma: -5 },
        outcomeText: 'It was awesome! Detailed evaded parents.',
        type: 'good',
      },
      {
        text: 'Stay home',
        effects: { happiness: -5 },
        outcomeText: 'You have FOMO.',
        type: 'neutral',
      },
    ],
  },
  {
    id: 'math_tutor',
    trigger: person =>
      person.age > 12 && person.age < 17 && person.smarts < 50 && Math.random() < 0.1,
    text: "Your parents hired a math tutor because you're failing.",
    effects: { smarts: 5, stress: 5, happiness: -5 },
    type: 'neutral',
  },
  {
    id: 'shoplifting_dare',
    trigger: person => person.age > 13 && person.age < 18 && Math.random() < 0.03,
    text: "Your 'friends' dare you to steal a candy bar.",
    choices: [
      {
        text: 'Do it',
        effects: { karma: -10, stress: 10 },
        outcomeText: 'You did it. The rush was intense.',
        type: 'mixed',
      },
      {
        text: 'Chicken out',
        effects: { happiness: -5 },
        outcomeText: 'They called you a wimp.',
        type: 'neutral',
      },
    ],
  },

  // Young Adult
  {
    id: 'frat_party',
    trigger: person => person.age > 18 && person.age < 23 && Math.random() < 0.1,
    text: 'You went to a wild frat party last night.',
    effects: { health: -5, happiness: 10, stress: -5 },
    type: 'good',
  },
  {
    id: 'all_nighter',
    trigger: person => person.education === 'University' && Math.random() < 0.15,
    text: 'You pulled an all-nighter to study for finals.',
    effects: { smarts: 5, stress: 10, health: -2 },
    type: 'neutral',
  },
  {
    id: 'first_apartment',
    trigger: person => person.age > 18 && person.age < 25 && Math.random() < 0.05,
    text: 'You moved into your first cheap apartment. It has roaches.',
    effects: { happiness: -10, stress: 5, money: -500 },
    type: 'bad',
  },
  {
    id: 'backpacking',
    trigger: person => person.age > 18 && person.age < 30 && Math.random() < 0.02,
    text: 'You have an urge to backpack across Europe.',
    choices: [
      {
        text: 'Go ($2k)',
        effects: { money: -2000, happiness: 30, smarts: 5 },
        outcomeText: 'Life changing experience!',
        type: 'good',
      },
      {
        text: 'Too poor',
        effects: { happiness: -5 },
        outcomeText: 'Maybe next year.',
        type: 'neutral',
      },
    ],
  },

  // Adult
  {
    id: 'found_wallet',
    trigger: person => person.age > 18 && Math.random() < 0.03,
    text: 'You found a loaded wallet on the sidewalk. It has $200 and an ID.',
    choices: [
      {
        text: 'Return it',
        effects: { happiness: 10, karma: 20 },
        outcomeText: 'The owner was so grateful!',
        type: 'good',
      },
      {
        text: 'Keep the cash',
        effects: { money: 200, karma: -20 },
        outcomeText: 'Finders keepers!',
        type: 'neutral',
      },
    ],
  },
  {
    id: 'witness_crime',
    trigger: person => person.age > 18 && Math.random() < 0.02,
    text: 'You just saw a guy smashing a car window!',
    choices: [
      {
        text: 'Call Police',
        effects: { karma: 10, stress: 5 },
        outcomeText: 'The police arrived and thanked you.',
        type: 'good',
      },
      {
        text: 'Walk away',
        effects: { stress: -5, karma: -5 },
        outcomeText: 'Not your problem.',
        type: 'neutral',
      },
    ],
  },
  {
    id: 'traffic_jam',
    trigger: person => person.job && Math.random() < 0.1,
    text: 'Stuck in brutal traffic on the way to work.',
    effects: { stress: 5, happiness: -5 },
    type: 'neutral',
  },
  {
    id: 'coffee_spill',
    trigger: person => person.age > 18 && Math.random() < 0.05,
    text: 'You spilled hot coffee all over your white shirt.',
    effects: { happiness: -5, stress: 2 },
    type: 'bad',
  },
  {
    id: 'found_twenty',
    trigger: person => person.age > 6 && Math.random() < 0.05,
    text: 'You found a $20 bill in your old jeans.',
    effects: { money: 20, happiness: 5 },
    type: 'good',
  },
  {
    id: 'double_rainbow',
    trigger: person => Math.random() < 0.01,
    text: 'You saw a double rainbow! What does it mean?',
    effects: { happiness: 15 },
    type: 'good',
  },
  {
    id: 'bird_poop',
    trigger: person => Math.random() < 0.03,
    text: 'A bird pooped directly on your head.',
    effects: { happiness: -10, looks: -1 },
    type: 'bad',
  },
  {
    id: 'friend_loan',
    trigger: person => person.age > 21 && Math.random() < 0.04,
    text: "Your friend Steve wants to borrow $500 for his 'revolutionary' app idea.",
    choices: [
      {
        text: 'Lend money',
        effects: { money: -500, karma: 5 },
        outcomeText: "He says he'll pay you back... eventually.",
        type: 'neutral',
      },
      {
        text: 'Refuse',
        effects: { happiness: -5 },
        outcomeText: 'Steve is annoyed with you.',
        type: 'neutral',
      },
    ],
  },
  {
    id: 'lottery_find',
    trigger: person => person.age > 18 && Math.random() < 0.01,
    text: "A gust of wind blew a lottery ticket right into your face. It's a winner!",
    effects: { money: 50, happiness: 10 },
    type: 'good',
  },
  {
    id: 'jury_duty',
    trigger: person => person.age > 20 && person.age < 65 && Math.random() < 0.04,
    text: 'You have been summoned for Jury Duty.',
    choices: [
      {
        text: 'Serve',
        effects: { karma: 10, stress: 5, money: 100 },
        outcomeText: 'You did your civic duty.',
        type: 'neutral',
      },
      {
        text: 'Skip it',
        effects: { karma: -10, happiness: 5 },
        outcomeText: 'You threw the letter in the trash.',
        type: 'bad',
      },
    ],
  },
  {
    id: 'bad_haircut',
    trigger: person => person.age > 15 && Math.random() < 0.05,
    text: 'The barber completely messed up your hair.',
    effects: { looks: -10, happiness: -10 },
    type: 'bad',
  },
  {
    id: 'crypto_scam',
    trigger: person => person.age > 20 && Math.random() < 0.03,
    text: "A 'friend' tells you about a guaranteed crypto coin that will moon.",
    choices: [
      {
        text: 'Invest $1k',
        effects: { money: -1000, stress: 10 },
        outcomeText: 'It was a rug pull! You lost it all.',
        type: 'bad',
      },
      {
        text: 'Ignore',
        effects: { smarts: 2 },
        outcomeText: 'Smart move. It crashed to zero.',
        type: 'good',
      },
    ],
  },

  // Work
  {
    id: 'bribe_offer',
    trigger: person => person.job && Math.random() < 0.02,
    text: 'A shady client offers you a bribe to ignore protocol.',
    choices: [
      {
        text: 'Take Bribe ($5k)',
        effects: { money: 5000, karma: -30, stress: 10 },
        outcomeText: "You took the cash. Hope you don't get caught.",
        type: 'bad',
      },
      {
        text: 'Report them',
        effects: { happiness: 5, karma: 20 },
        outcomeText: 'Your boss praised your integrity.',
        type: 'good',
      },
    ],
  },
  {
    id: 'office_prank',
    trigger: person => person.job && Math.random() < 0.05,
    text: 'Someone put your stapler in Jell-O. Classic.',
    choices: [
      {
        text: 'Laugh',
        effects: { happiness: 5 },
        outcomeText: 'It was pretty funny.',
        type: 'good',
      },
      {
        text: 'Rage',
        effects: { stress: 5, happiness: -5 },
        outcomeText: 'You yelled at the whole office.',
        type: 'bad',
      },
    ],
  },
  {
    id: 'layoff_rumors',
    trigger: person => person.job && Math.random() < 0.05,
    text: 'There are rumors of layoffs in your department.',
    effects: { stress: 15, happiness: -5 },
    type: 'bad',
  },
  {
    id: 'office_romance',
    trigger: person => person.job && Math.random() < 0.03,
    text: 'A cute coworker is flirting with you.',
    choices: [
      {
        text: 'Flirt back',
        effects: { happiness: 10 },
        outcomeText: 'You have a new work spouse!',
        type: 'good',
      },
      {
        text: 'Keep it professional',
        effects: { smarts: 2 },
        outcomeText: 'You focused on your work.',
        type: 'neutral',
      },
    ],
  },
  {
    id: 'broken_copier',
    trigger: person => person.job && Math.random() < 0.05,
    text: "The office copier is broken again. 'PC LOAD LETTER'?",
    effects: { stress: 5 },
    type: 'neutral',
  },
  {
    id: 'work_bestie',
    trigger: person => person.job && Math.random() < 0.05,
    text: 'You found a work bestie! Lunch is now fun.',
    effects: { happiness: 10, stress: -5 },
    type: 'good',
  },
  {
    id: 'team_building',
    trigger: person => person.job && Math.random() < 0.05,
    text: 'Mandatory team building exercise: Trust Falls.',
    choices: [
      {
        text: 'Participate',
        effects: { stress: 5, karma: 2 },
        outcomeText: 'Dave dropped you.',
        type: 'bad',
      },
      {
        text: 'Skip it',
        effects: { stress: -2 },
        outcomeText: 'You hid in the bathroom.',
        type: 'neutral',
      },
    ],
  },

  // Elderly
  {
    id: 'grandkids_visit',
    trigger: person => person.age > 60 && Math.random() < 0.1,
    text: 'Your grandkids came to visit. They are extremely loud.',
    effects: { happiness: 15, stress: 5 },
    type: 'good',
  },
  {
    id: 'memory_slip',
    trigger: person => person.age > 70 && Math.random() < 0.1,
    text: 'You walked into a room and completely forgot why you were there.',
    effects: { smarts: -1 },
    type: 'neutral',
  },
  {
    id: 'scam_call',
    trigger: person => person.age > 65 && Math.random() < 0.1,
    text: 'Someone called claiming to be the IRS demanding gift cards.',
    choices: [
      {
        text: 'Pay them',
        effects: { money: -500, smarts: -5 },
        outcomeText: 'You got scammed!',
        type: 'bad',
      },
      {
        text: 'Hang up',
        effects: { smarts: 2 },
        outcomeText: 'Not today, scammers.',
        type: 'good',
      },
    ],
  },
  {
    id: 'retirement_hobby',
    trigger: person => person.age > 60 && !person.job && Math.random() < 0.1,
    text: "You're bored in retirement. Pick a hobby?",
    choices: [
      {
        text: 'Gardening',
        effects: { happiness: 5, health: 2 },
        outcomeText: 'Your tomatoes are thriving!',
        type: 'good',
      },
      {
        text: 'Birdwatching',
        effects: { happiness: 5, stress: -5 },
        outcomeText: 'You saw a rare Blue Jay.',
        type: 'good',
      },
    ],
  },
  {
    id: 'bad_hip',
    trigger: person => person.age > 70 && Math.random() < 0.1,
    text: 'Your hip is aching. Rain must be coming.',
    effects: { health: -2, happiness: -2 },
    type: 'neutral',
  },
  {
    id: 'bingo_night',
    trigger: person => person.age > 65 && Math.random() < 0.05,
    text: 'You went to Bingo night and won the jackpot!',
    effects: { money: 50, happiness: 10 },
    type: 'good',
  },
  {
    id: 'technophobia',
    trigger: person => person.age > 70 && Math.random() < 0.05,
    text: "You can't figure out how to work the new TV remote.",
    effects: { smarts: -1, stress: 5 },
    type: 'neutral',
  },
  {
    id: 'early_bird',
    trigger: person => person.age > 65 && Math.random() < 0.05,
    text: 'You ate dinner at 4:30 PM to get the Early Bird Special.',
    effects: { money: 10, happiness: 5 },
    type: 'good',
  },

  // Crazy / Rare
  {
    id: 'time_traveler',
    trigger: person => person.age > 6 && Math.random() < 0.005,
    text: "A person in a silver suit appears and asks: 'WHAT YEAR IS IT?!'",
    choices: [
      {
        text: 'Tell them',
        effects: { smarts: 2 },
        outcomeText: 'They typed it into a watch and vanished.',
        type: 'neutral',
      },
      {
        text: 'Run away',
        effects: { stress: 5 },
        outcomeText: 'You ran deeply into the night.',
        type: 'neutral',
      },
    ],
  },
  {
    id: 'find_contraband',
    trigger: person => person.age > 16 && Math.random() < 0.005,
    text: 'You found a bag of white powder on the park bench.',
    choices: [
      {
        text: 'Sell it',
        effects: { money: 2000, karma: -30 },
        outcomeText: 'You sold it to a shady guy.',
        type: 'bad',
      },
      {
        text: 'Leave it',
        effects: { karma: 5 },
        outcomeText: 'You walked away quickly.',
        type: 'neutral',
      },
    ],
  },
  {
    id: 'bank_error',
    trigger: person => person.age > 18 && Math.random() < 0.005,
    text: 'Bank Error in your favor!',
    effects: { money: 200, happiness: 10 },
    type: 'good',
  },
  {
    id: 'found_phone',
    trigger: person => person.age > 10 && Math.random() < 0.02,
    text: 'You found an iPhone on a park bench.',
    choices: [
      {
        text: 'Return it',
        effects: { karma: 10, happiness: 5 },
        outcomeText: 'The owner gave you $20 reward!',
        type: 'good',
      },
      {
        text: 'Keep it',
        effects: { money: 500, karma: -20 },
        outcomeText: "It's locked, but you sold it for parts.",
        type: 'bad',
      },
    ],
  },
  {
    id: 'solicitor',
    trigger: person => person.age > 18 && Math.random() < 0.05,
    text: 'A door-to-door salesman is trying to sell you magazines.',
    choices: [
      {
        text: 'Buy ($20)',
        effects: { money: -20, karma: 5 },
        outcomeText: 'You are too nice.',
        type: 'neutral',
      },
      { text: 'Slam door', effects: { happiness: 2 }, outcomeText: 'Take that!', type: 'neutral' },
    ],
  },
];

export const INITIAL_EVENTS = [
  person => `You were born a ${person.gender} in a hospital.`,
  person => `Your name is ${person.getFullName()}.`,
];

export const CAREER_EVENTS = [
  // --- POLITICS (President/Governor/Mayor) ---
  {
    id: 'pol_disaster',
    trigger: person => person.job && person.job.isPolitical,
    text: 'A massive hurricane has devastated the coast. The people are looking to you.',
    choices: [
      {
        text: 'Send Aid ()',
        effects: { happiness: 5, karma: 10 },
        outcomeText: 'The relief effort was successful. Approval ratings up!',
        type: 'good',
      },
      {
        text: 'Ignore it',
        effects: { happiness: -5, karma: -20 },
        outcomeText: 'The media is destroying you. Approval ratings plummeted.',
        type: 'bad',
      },
    ],
  },
  {
    id: 'pol_war',
    trigger: person => person.job && person.job.title === 'President',
    text: 'Intelligence suggests a hostile nation is preparing a missile test.',
    choices: [
      {
        text: 'Diplomacy',
        effects: { smarts: 2, karma: 5 },
        outcomeText: 'Peace talks succeeded. Nobel Prize?',
        type: 'good',
      },
      {
        text: 'Drone Strike',
        effects: { stress: 20, karma: -10 },
        outcomeText: 'Target destroyed. International tensions are high.',
        type: 'mixed',
      },
    ],
  },
  {
    id: 'pol_scandal',
    trigger: person => person.job && person.job.isPolitical && Math.random() < 0.1,
    text: 'A tape has leaked of you insulting your voters.',
    choices: [
      {
        text: 'Apologize',
        effects: { happiness: -10 },
        outcomeText: "Some forgave you. Others didn't.",
        type: 'neutral',
      },
      {
        text: 'Deny it',
        effects: { karma: -10, smarts: -2 },
        outcomeText: 'The lie made it worse.',
        type: 'bad',
      },
    ],
  },
  {
    id: 'pol_taxes',
    trigger: person => person.job && person.job.title === 'President' && Math.random() < 0.2,
    text: 'The Congress is debating a major tax reform. They want your signature.',
    choices: [
      {
        text: 'Lower Taxes',
        effects: { happiness: 15, money: 50000 },
        outcomeText: 'The middle class is happy, but the budget deficit grew.',
        type: 'good',
      },
      {
        text: 'Tax the Rich',
        effects: { happiness: 10, karma: 10 },
        outcomeText: 'Public services boosted. Your billionaire donors are furious.',
        type: 'mixed',
      },
      {
        text: 'Veto Bill',
        effects: { stress: 10 },
        outcomeText: 'Political gridlock continues. You look strong but unproductive.',
        type: 'neutral',
      },
    ],
  },
  {
    id: 'pol_infra',
    trigger: person => person.job && person.job.isPolitical && Math.random() < 0.15,
    text: 'A proposal for a high-speed rail network is on your desk.',
    choices: [
      {
        text: 'Build it',
        effects: { smarts: 5, happiness: 10 },
        outcomeText: 'A technological marvel! Your legacy is secured.',
        type: 'good',
      },
      {
        text: 'Budget cuts',
        effects: { money: 100000, happiness: -5 },
        outcomeText: 'Saved money, but the roads are crumbling.',
        type: 'mixed',
      },
    ],
  },
  {
    id: 'pol_state_visit',
    trigger: person => person.job && person.job.title === 'President' && Math.random() < 0.1,
    text: 'The leader of a powerful allied nation is visiting for a summit.',
    choices: [
      {
        text: 'Lavish Gala',
        effects: { fame: 10, money: -20000 },
        outcomeText: 'The world watched in awe. Diplomacy at its finest.',
        type: 'good',
      },
      {
        text: 'Business only',
        effects: { smarts: 3 },
        outcomeText: 'A productive meeting. No fluff.',
        type: 'neutral',
      },
    ],
  },
  {
    id: 'pol_reform',
    trigger: person => person.job && person.job.isPolitical && Math.random() < 0.1,
    text: 'Activists are marching for major healthcare reform.',
    choices: [
      {
        text: 'Universal Care',
        effects: { karma: 20, health: 10, happiness: 20 },
        outcomeText: "A historic move! You've changed millions of lives.",
        type: 'good',
      },
      {
        text: 'Private system',
        effects: { money: 200000 },
        outcomeText: 'The stock market loved it. The people... not so much.',
        type: 'mixed',
      },
      {
        text: 'Do nothing',
        effects: { happiness: -15 },
        outcomeText: 'Protests intensified. You look out of touch.',
        type: 'bad',
      },
    ],
  },
  {
    id: 'pol_crisis',
    trigger: person => person.job && person.job.title === 'President' && Math.random() < 0.05,
    text: 'The stock market has crashed 20% in a single day.',
    choices: [
      {
        text: 'Bailouts',
        effects: { money: -500000, stress: 30 },
        outcomeText: 'The banks survived. The taxpayers are angry.',
        type: 'mixed',
      },
      {
        text: 'Austerity',
        effects: { happiness: -20, money: 100000 },
        outcomeText: 'National debt down, unemployment up.',
        type: 'bad',
      },
      {
        text: 'Stimulus',
        effects: { happiness: 10, money: -200000 },
        outcomeText: 'The economy is slowly recovering.',
        type: 'good',
      },
    ],
  },

  // --- MUSICIAN ---
  {
    id: 'music_hit',
    trigger: person => person.job && person.job.customReq === 'musician',
    text: 'Your latest single is climbing the charts!',
    effects: { fame: 10, money: 50000, happiness: 20 },
    type: 'good',
  },
  {
    id: 'music_flop',
    trigger: person => person.job && person.job.customReq === 'musician' && Math.random() < 0.1,
    text: 'Your experimental jazz album was a total flop.',
    effects: { fame: -5, happiness: -10 },
    type: 'bad',
  },
  {
    id: 'music_tour',
    trigger: person => person.job && person.job.customReq === 'musician',
    text: 'Your label wants you to go on a World Tour.',
    choices: [
      {
        text: 'Go on Tour',
        effects: { money: 500000, stress: 20, fame: 15 },
        outcomeText: "Sold out stadiums! You're exhausted but rich.",
        type: 'good',
      },
      {
        text: 'Stay home',
        effects: { stress: -5 },
        outcomeText: 'You worked on new music instead.',
        type: 'neutral',
      },
    ],
  },

  // --- ATHLETE ---
  {
    id: 'sports_championship',
    trigger: person => person.job && person.job.customReq === 'athlete',
    text: "It's the Championship Game! The score is tied.",
    choices: [
      {
        text: 'Pass the ball',
        effects: { karma: 5 },
        outcomeText: 'Teammate scored! WE WON!',
        type: 'good',
      },
      {
        text: 'Go for glory',
        effects: { fame: 10, stress: 10 },
        outcomeText: 'You scored the winning point! MVP!',
        type: 'good',
      },
    ],
  },
  {
    id: 'sports_injury',
    trigger: person => person.job && person.job.customReq === 'athlete' && Math.random() < 0.05,
    text: 'You felt a pop in your knee during practice.',
    effects: { health: -20, happiness: -20, stress: 10 },
    type: 'bad',
  },

  // --- MILITARY ---
  {
    id: 'mil_deployment',
    trigger: person => person.job && person.job.isMilitary && Math.random() < 0.2,
    text: 'You have been ordered to deploy to a combat zone.',
    choices: [
      {
        text: 'Serve proudly',
        effects: { stress: 20, karma: 5, money: 5000 },
        outcomeText: 'You returned home safe with a medal.',
        type: 'good',
      },
      {
        text: 'Desert',
        effects: { karma: -50, happiness: -20 },
        outcomeText: 'You went AWOL and are now a fugitive.',
        type: 'bad',
      },
    ],
  },

  // --- CHILDHOOD EXTRA ---
  {
    id: 'child_sport',
    trigger: person => person.age > 4 && person.age < 12 && Math.random() < 0.08,
    text: 'Your parents signed you up for soccer! You hate it.',
    effects: { health: 3, happiness: -5 },
    type: 'neutral',
  },
  {
    id: 'child_piano',
    trigger: person => person.age > 5 && person.age < 14 && Math.random() < 0.06,
    text: 'You started piano lessons. Your fingers hurt but it sounds nice.',
    effects: { smarts: 3, happiness: 2 },
    type: 'good',
  },
  {
    id: 'child_bedwetting',
    trigger: person => person.age > 3 && person.age < 7 && Math.random() < 0.08,
    text: 'You wet the bed at a sleepover. So embarrassing.',
    effects: { happiness: -15, stress: 10 },
    type: 'bad',
  },
  {
    id: 'child_penpal',
    trigger: person => person.age > 7 && person.age < 14 && Math.random() < 0.04,
    text: 'You got a pen pal from Japan! You write letters every month.',
    effects: { happiness: 10, smarts: 3 },
    type: 'good',
  },
  {
    id: 'child_pet_fish',
    trigger: person => person.age > 3 && person.age < 12 && Math.random() < 0.05,
    text: 'You won a goldfish at the fair! You named it George.',
    effects: { happiness: 15 },
    type: 'good',
  },
  {
    id: 'child_grounded',
    trigger: person => person.age > 6 && person.age < 16 && Math.random() < 0.05,
    text: 'You broke a vase playing ball inside. You are grounded for a week.',
    effects: { happiness: -15, stress: 5 },
    type: 'bad',
  },
  {
    id: 'child_rollercoaster',
    trigger: person => person.age > 7 && person.age < 15 && Math.random() < 0.04,
    text: 'Your family went to an amusement park! You rode the biggest rollercoaster.',
    effects: { happiness: 20, stress: -10, health: 2 },
    type: 'good',
  },
  {
    id: 'child_bake_sale',
    trigger: person => person.age > 6 && person.age < 14 && Math.random() < 0.04,
    text: 'Your school is having a bake sale. Do you want to help?',
    choices: [
      {
        text: 'Bake cookies',
        effects: { happiness: 10, money: 20, smarts: 2 },
        outcomeText: 'You sold out in an hour!',
        type: 'good',
      },
      {
        text: 'Buy cookies',
        effects: { happiness: 5, money: -10 },
        outcomeText: 'You ate six cupcakes. Worth it.',
        type: 'good',
      },
    ],
  },

  // --- TEEN EXTRA ---
  {
    id: 'teen_driving',
    trigger: person => person.age > 15 && person.age < 19 && Math.random() < 0.06,
    text: 'You saved up and bought your first car. It is a 1998 Honda Civic with 200k miles.',
    effects: { happiness: 25, money: -3000, stress: -5 },
    type: 'good',
  },
  {
    id: 'teen_exam_stress',
    trigger: person => person.age > 13 && person.age < 19 && Math.random() < 0.15,
    text: 'Final exams are next week and you have barely studied.',
    effects: { stress: 25 },
    type: 'bad',
  },
  {
    id: 'teen_dye_hair',
    trigger: person => person.age > 13 && person.age < 19 && Math.random() < 0.06,
    text: 'You dyed your hair bright blue. Your mom is furious.',
    effects: { looks: 5, happiness: 10, stress: 5 },
    type: 'good',
  },
  {
    id: 'teen_part_time_job',
    trigger: person => person.age > 15 && person.age < 19 && !person.job && Math.random() < 0.08,
    text: 'The local pizza place is hiring. Do you want a part-time job?',
    choices: [
      {
        text: 'Take the job',
        effects: { money: 5000, smarts: 3, stress: 10 },
        outcomeText: 'You are making minimum wage, but it is your own money!',
        type: 'good',
      },
      {
        text: 'Focus on school',
        effects: { smarts: 5 },
        outcomeText: 'You aced your classes.',
        type: 'neutral',
      },
    ],
  },
  {
    id: 'teen_breakup',
    trigger: person => person.age > 14 && person.age < 19 && Math.random() < 0.08,
    text: 'Your high school sweetheart dumped you for the quarterback.',
    effects: { happiness: -30, stress: 15, looks: -2 },
    type: 'bad',
  },
  {
    id: 'teen_college_letter',
    trigger: person => person.age === 17 && Math.random() < 0.2,
    text: 'Your dream university sent a letter. Acceptance or rejection?',
    choices: [
      {
        text: 'Open it',
        effects: { happiness: 30, stress: -20 },
        outcomeText: 'You got in! Tears of joy.',
        type: 'good',
      },
      {
        text: 'Delay',
        effects: { stress: 10 },
        outcomeText: 'You are too nervous to look.',
        type: 'neutral',
      },
    ],
  },

  // --- ADULT EXTRA ---
  {
    id: 'adult_marathon',
    trigger: person => person.age > 20 && person.health > 60 && Math.random() < 0.03,
    text: 'You decided to run a marathon. You trained for months.',
    effects: { health: 10, happiness: 15, stress: -10 },
    type: 'good',
  },
  {
    id: 'adult_therapy',
    trigger: person => person.age > 25 && person.stress > 60 && Math.random() < 0.05,
    text: "Your therapist says you have made great progress. But your insurance won't cover the next session.",
    choices: [
      {
        text: 'Pay out of pocket',
        effects: { money: -200, stress: -15, happiness: 10 },
        outcomeText: 'Your mental health is worth it.',
        type: 'good',
      },
      {
        text: 'Quit therapy',
        effects: { stress: 10, happiness: -5 },
        outcomeText: 'You will be fine. Probably.',
        type: 'neutral',
      },
    ],
  },
  {
    id: 'adult_side_hustle',
    trigger: person => person.age > 20 && person.money < 50000 && Math.random() < 0.05,
    text: 'A friend wants you to invest in their startup. It is a phone case that doubles as a wallet.',
    choices: [
      {
        text: 'Invest $500',
        effects: { money: -500, smarts: 2 },
        outcomeText: 'It actually took off! You made $2000 back.',
        type: 'good',
      },
      {
        text: 'Pass',
        effects: { happiness: 0 },
        outcomeText: 'You missed the next big thing.',
        type: 'neutral',
      },
    ],
  },
  {
    id: 'adult_jealous',
    trigger: person => {
      const partner = person.relationships.find(r => r.type === 'Spouse' || r.type === 'Partner');
      return partner && Math.random() < 0.04;
    },
    text: 'Your partner has been texting a "friend" a lot lately. You feel jealous.',
    choices: [
      {
        text: 'Confront them',
        effects: { stress: 10, happiness: -5 },
        outcomeText: 'They were just planning your surprise party. Oops.',
        type: 'good',
      },
      {
        text: 'Ignore it',
        effects: { stress: 15 },
        outcomeText: 'It eats at you all year.',
        type: 'bad',
      },
    ],
  },
  {
    id: 'adult_midlife_crisis',
    trigger: person => person.age > 38 && person.age < 55 && Math.random() < 0.04,
    text: 'You are having a midlife crisis. You bought a red convertible.',
    effects: { money: -40000, happiness: 10, looks: 3, stress: -10 },
    type: 'mixed',
  },

  // --- YOUNG ADULT (19-30) ---
  {
    id: 'ya_roommate',
    trigger: person => person.age > 18 && person.age < 28 && !person.spouse && Math.random() < 0.06,
    text: 'Your roommate ate all your food again and left a mess.',
    effects: { happiness: -8, stress: 5 },
    type: 'bad',
  },
  {
    id: 'ya_first_serious',
    trigger: person => {
      const partner = person.relationships.find(r => r.type === 'Partner' || r.type === 'Fiance');
      return partner && person.age > 20 && person.age < 30 && Math.random() < 0.04;
    },
    text: 'Your partner said "I love you" for the first time. Butterflies everywhere.',
    effects: { happiness: 25, stress: -5 },
    type: 'good',
  },
  {
    id: 'ya_job_interview',
    trigger: person => !person.job && person.age > 18 && person.age < 30 && Math.random() < 0.08,
    text: 'You have a big job interview tomorrow. Your best shirt has a stain.',
    choices: [
      {
        text: 'Buy a new shirt',
        effects: { money: -50, happiness: 5, smarts: 2 },
        outcomeText: 'You nailed the interview! They loved your confidence.',
        type: 'good',
      },
      {
        text: 'Wear it anyway',
        effects: { stress: 10, happiness: -3 },
        outcomeText: 'They noticed. You did not get the job.',
        type: 'bad',
      },
    ],
  },
  {
    id: 'ya_moving_home',
    trigger: person => person.money < 5000 && person.age > 22 && person.age < 30 && Math.random() < 0.03,
    text: 'Money is tight. Your parents offered to let you move back in.',
    choices: [
      {
        text: 'Move back',
        effects: { money: 2000, happiness: -5, stress: -10 },
        outcomeText: 'Free laundry and home-cooked meals. Worth it.',
        type: 'neutral',
      },
      {
        text: 'Tough it out',
        effects: { stress: 10, karma: 5 },
        outcomeText: 'Pride over comfort. You will make it work.',
        type: 'neutral',
      },
    ],
  },
  {
    id: 'ya_credit_card',
    trigger: person => person.age > 20 && person.age < 30 && person.money < 20000 && Math.random() < 0.05,
    text: 'You checked your credit card statement. The interest is brutal.',
    effects: { stress: 15, happiness: -8 },
    type: 'bad',
  },
  {
    id: 'ya_friend_wedding',
    trigger: person => person.age > 22 && person.age < 35 && !person.relationships.some(r => r.type === 'Spouse') && Math.random() < 0.03,
    text: 'Your best friend just got engaged. You are happy for them, but also... single.',
    effects: { happiness: 5, stress: 5 },
    type: 'mixed',
  },
  {
    id: 'ya_promotion_milestone',
    trigger: person => person.job && person.age > 22 && person.age < 32 && Math.random() < 0.04,
    text: 'Your boss pulled you aside. They see leadership potential in you.',
    effects: { happiness: 20, stress: 5 },
    type: 'good',
  },
  {
    id: 'ya_fitness_journey',
    trigger: person => person.health < 70 && person.age > 18 && person.age < 35 && Math.random() < 0.04,
    text: 'You are tired of feeling out of shape. A gym opened near your place.',
    choices: [
      {
        text: 'Join the gym',
        effects: { money: -300, health: 10, happiness: 5, looks: 2 },
        outcomeText: 'Six months later, you barely recognize yourself!',
        type: 'good',
      },
      {
        text: 'Skip it',
        effects: { happiness: -3 },
        outcomeText: 'Maybe next year.',
        type: 'bad',
      },
    ],
  },
  {
    id: 'ya_learning_cook',
    trigger: person => person.age > 18 && person.age < 30 && person.money < 30000 && Math.random() < 0.05,
    text: 'Eating out is draining your wallet. Time to learn to cook.',
    choices: [
      {
        text: 'Take a cooking class',
        effects: { money: -200, smarts: 5, happiness: 5, health: 3 },
        outcomeText: 'You can now make a mean spaghetti carbonara!',
        type: 'good',
      },
      {
        text: 'YouTube tutorials',
        effects: { smarts: 2, happiness: 3 },
        outcomeText: 'You burnt the rice. But the omelets are getting better.',
        type: 'neutral',
      },
    ],
  },
  {
    id: 'ya_late_night_existential',
    trigger: person => person.age > 19 && person.age < 35 && Math.random() < 0.04,
    text: 'It is 2 AM and you are wide awake questioning every life choice you ever made.',
    effects: { stress: 8, happiness: -5 },
    type: 'bad',
  },
  {
    id: 'ya_networking',
    trigger: person => person.job && person.age > 20 && person.age < 35 && Math.random() < 0.04,
    text: 'An industry conference is in town. Great chance to network.',
    choices: [
      {
        text: 'Attend',
        effects: { money: -200, smarts: 5, fame: 3 },
        outcomeText: 'You met someone who could change your career!',
        type: 'good',
      },
      {
        text: 'Skip it',
        effects: { happiness: 0 },
        outcomeText: 'Networking is overrated anyway.',
        type: 'neutral',
      },
    ],
  },
  {
    id: 'ya_online_dating',
    trigger: person => person.age > 18 && person.age < 40 && !person.relationships.some(r => ['Spouse', 'Partner', 'Fiance'].includes(r.type)) && Math.random() < 0.04,
    text: 'You matched with someone amazing on a dating app. They want to meet!',
    choices: [
      {
        text: 'Go on the date',
        effects: { happiness: 15, money: -100 },
        outcomeText: 'It went surprisingly well. You really clicked!',
        type: 'good',
      },
      {
        text: 'Too nervous',
        effects: { stress: -5, happiness: -5 },
        outcomeText: 'You unmatched and regretted it immediately.',
        type: 'bad',
      },
    ],
  },
  {
    id: 'ya_city_discovery',
    trigger: person => person.age > 18 && person.age < 35 && Math.random() < 0.05,
    text: 'You discovered a hidden gem of a café in your neighborhood.',
    effects: { happiness: 10 },
    type: 'good',
  },

  // --- MIDDLE AGE (31-55) ---
  {
    id: 'ma_home_maintenance',
    trigger: person => person.age > 28 && person.age < 60 && Math.random() < 0.06,
    text: 'The water heater broke and the basement is flooding.',
    effects: { money: -3000, stress: 15, happiness: -8 },
    type: 'bad',
  },
  {
    id: 'ma_old_friend',
    trigger: person => person.age > 30 && person.age < 60 && Math.random() < 0.04,
    text: 'An old friend from high school just moved back to town. They want to catch up.',
    choices: [
      {
        text: 'Meet up',
        effects: { happiness: 15, stress: -5 },
        outcomeText: 'It felt like no time had passed. Great night.',
        type: 'good',
      },
      {
        text: 'Too busy',
        effects: { happiness: -3, stress: 5 },
        outcomeText: 'You keep saying you will call. You never do.',
        type: 'bad',
      },
    ],
  },
  {
    id: 'ma_high_school_reunion',
    trigger: person => person.age > 35 && person.age < 55 && Math.random() < 0.02,
    text: 'Your high school reunion is coming up. Do you go?',
    choices: [
      {
        text: 'Go and show off',
        effects: { happiness: 10, fame: 3 },
        outcomeText: 'You are doing way better than most of them. Feels good.',
        type: 'good',
      },
      {
        text: 'Skip it',
        effects: { happiness: 0 },
        outcomeText: 'Living well is the best revenge.',
        type: 'neutral',
      },
    ],
  },
  {
    id: 'ma_parenting_milestone',
    trigger: person => {
      const child = person.relationships.find(r => r.type === 'Child' && r.age > 2 && r.age < 20);
      return child && Math.random() < 0.05;
    },
    text: 'Your child just performed in their first school play. You cried a little.',
    effects: { happiness: 20, stress: -5 },
    type: 'good',
  },
  {
    id: 'ma_health_scare',
    trigger: person => person.age > 35 && person.health > 40 && Math.random() < 0.04,
    text: 'Your doctor says your cholesterol is high and your blood pressure is concerning.',
    choices: [
      {
        text: 'Change diet and exercise',
        effects: { health: 15, happiness: -3 },
        outcomeText: 'A year later, your numbers are perfect. Feel amazing!',
        type: 'good',
      },
      {
        text: 'Ignore it',
        effects: { health: -5, stress: 5 },
        outcomeText: 'Ignorance is bliss until it is not.',
        type: 'bad',
      },
    ],
  },
  {
    id: 'ma_neighbor_dispute',
    trigger: person => person.age > 25 && Math.random() < 0.03,
    text: 'Your new neighbor blasts music at 2 AM every night.',
    choices: [
      {
        text: 'Talk to them nicely',
        effects: { karma: 5, stress: -5 },
        outcomeText: 'They apologized! They did not realize the walls were thin.',
        type: 'good',
      },
      {
        text: 'Call the police',
        effects: { stress: 5, karma: -3 },
        outcomeText: 'Now they glare at you in the hallway. Worth it.',
        type: 'neutral',
      },
    ],
  },
  {
    id: 'ma_mentor_junior',
    trigger: person => person.job && person.age > 35 && person.age < 60 && Math.random() < 0.04,
    text: 'Your company asked you to mentor a junior employee. They look up to you.',
    effects: { happiness: 10, karma: 5, stress: 3 },
    type: 'good',
  },
  {
    id: 'ma_empty_nest',
    trigger: person => {
      const adultChild = person.relationships.find(r => r.type === 'Child' && r.age > 18);
      return adultChild && Math.random() < 0.03;
    },
    text: 'Your last child moved out. The house feels so quiet now.',
    effects: { happiness: -10, stress: -15 },
    type: 'mixed',
  },
  {
    id: 'ma_refinance',
    trigger: person => person.money > 50000 && person.age > 25 && person.age < 60 && Math.random() < 0.03,
    text: 'Interest rates dropped. A great time to refinance your mortgage.',
    choices: [
      {
        text: 'Refinance',
        effects: { money: 10000, stress: -5 },
        outcomeText: 'Your monthly payment dropped significantly. Financial win!',
        type: 'good',
      },
      {
        text: 'Not worth the hassle',
        effects: { happiness: 0 },
        outcomeText: 'You missed the rate window.',
        type: 'neutral',
      },
    ],
  },
  {
    id: 'ma_volunteering',
    trigger: person => person.age > 30 && person.age < 65 && Math.random() < 0.03,
    text: 'A local shelter is looking for volunteers. You have some free weekends.',
    choices: [
      {
        text: 'Volunteer',
        effects: { happiness: 15, karma: 10 },
        outcomeText: 'Giving back fills a void you did not know you had.',
        type: 'good',
      },
      {
        text: 'Too busy',
        effects: { stress: -3 },
        outcomeText: 'Maybe another time.',
        type: 'neutral',
      },
    ],
  },
  {
    id: 'ma_back_pain',
    trigger: person => person.age > 35 && Math.random() < 0.05,
    text: 'You threw your back out by sneezing. Getting old is humbling.',
    effects: { health: -3, happiness: -8, stress: 5 },
    type: 'bad',
  },
  {
    id: 'ma_renew_vows',
    trigger: person => {
      const spouse = person.relationships.find(r => r.type === 'Spouse');
      return spouse && person.age > 35 && person.age < 65 && Math.random() < 0.02;
    },
    text: 'Your anniversary is coming up. You want to do something special.',
    choices: [
      {
        text: 'Renew your vows',
        effects: { money: -5000, happiness: 25 },
        outcomeText: 'It was beautiful. Your partner cried. You cried. Everyone cried.',
        type: 'good',
      },
      {
        text: 'Quiet dinner at home',
        effects: { happiness: 10, money: -200 },
        outcomeText: 'Sometimes simple is best.',
        type: 'good',
      },
    ],
  },
  {
    id: 'ma_new_hobby',
    trigger: person => person.age > 30 && person.age < 65 && Math.random() < 0.04,
    text: 'You have been feeling stagnant. Maybe it is time for a new hobby.',
    choices: [
      {
        text: 'Take up photography',
        effects: { money: -800, happiness: 15, smarts: 3 },
        outcomeText: 'You have an eye for it! Friends love your photos.',
        type: 'good',
      },
      {
        text: 'Start a garden',
        effects: { money: -200, happiness: 12, health: 2 },
        outcomeText: 'Your tomatoes are the envy of the neighborhood.',
        type: 'good',
      },
      {
        text: 'Not now',
        effects: { happiness: -3 },
        outcomeText: 'The routine consumes you again.',
        type: 'bad',
      },
    ],
  },
  {
    id: 'ma_kids_activities',
    trigger: person => {
      const young = person.relationships.find(r => r.type === 'Child' && r.age > 4 && r.age < 18);
      return young && Math.random() < 0.04;
    },
    text: 'Your child wants to join an expensive extracurricular activity.',
    choices: [
      {
        text: 'Enroll them',
        effects: { money: -1500, happiness: 10, stress: 5 },
        outcomeText: 'They loved it! You are their favorite parent.',
        type: 'good',
      },
      {
        text: 'Too expensive',
        effects: { happiness: -5, stress: 5 },
        outcomeText: 'They understood, but you feel guilty.',
        type: 'bad',
      },
    ],
  },
  {
    id: 'ma_glasses',
    trigger: person => person.age > 35 && person.age < 70 && Math.random() < 0.04,
    text: 'You have been squinting at menus. It is time for reading glasses.',
    effects: { money: -300, smarts: 2, looks: -1 },
    type: 'neutral',
  },
  {
    id: 'ma_inheritance',
    trigger: person => person.age > 30 && person.age < 70 && Math.random() < 0.01,
    text: 'A distant aunt you barely remember passed away and left you something.',
    choices: [
      {
        text: 'Cash inheritance',
        effects: { money: 25000, happiness: 5, karma: -3 },
        outcomeText: 'She always liked you best.',
        type: 'good',
      },
      {
        text: 'Heirloom watch',
        effects: { happiness: 10, karma: 5 },
        outcomeText: 'It is not worth much, but the sentimental value is priceless.',
        type: 'good',
      },
    ],
  },
  {
    id: 'ma_family_reunion',
    trigger: person => person.age > 25 && person.age < 65 && Math.random() < 0.02,
    text: 'Your extended family is organizing a reunion. You have not seen some of them in years.',
    choices: [
      {
        text: 'Go',
        effects: { happiness: 15, stress: 5 },
        outcomeText: 'Aunt Karen was there. So was the good potato salad. Worth it.',
        type: 'good',
      },
      {
        text: 'Make an excuse',
        effects: { happiness: -5, stress: -5 },
        outcomeText: 'You ordered pizza and watched TV instead. Peaceful.',
        type: 'neutral',
      },
    ],
  },
  {
    id: 'ma_annual_checkup',
    trigger: person => person.age > 30 && Math.random() < 0.04,
    text: 'You are due for your annual physical. You have been avoiding it.',
    choices: [
      {
        text: 'Go to the doctor',
        effects: { money: -200, health: 5, stress: -5 },
        outcomeText: 'Clean bill of health. What a relief!',
        type: 'good',
      },
      {
        text: 'Skip it again',
        effects: { stress: 3, health: -2 },
        outcomeText: 'Ignorance is bliss.',
        type: 'bad',
      },
    ],
  },

  // --- WEALTH & POVERTY EVENTS ---
  {
    id: 'wealth_donation',
    trigger: person => person.money > 1000000 && Math.random() < 0.05,
    text: 'A charity asks you to make a significant donation.',
    choices: [
      {
        text: 'Donate $100k',
        effects: { karma: 20, happiness: 15, money: -100000 },
        outcomeText: 'You changed lives. Feels amazing.',
        type: 'good',
      },
      {
        text: 'Decline',
        effects: { karma: -5 },
        outcomeText: 'Your bank account is safe.',
        type: 'neutral',
      },
    ],
  },
  {
    id: 'poverty_eviction',
    trigger: person => person.money < 1000 && person.age > 18 && Math.random() < 0.03,
    text: 'You are behind on rent. The landlord posted an eviction notice.',
    choices: [
      {
        text: 'Beg for more time',
        effects: { stress: 20, happiness: -10 },
        outcomeText: 'He gave you two weeks to pay up.',
        type: 'bad',
      },
      {
        text: 'Sell belongings',
        effects: { money: 2000, happiness: -5 },
        outcomeText: 'You sold your TV and guitar. Rent paid.',
        type: 'neutral',
      },
    ],
  },
  {
    id: 'wealth_investment_offer',
    trigger: person => person.money > 500000 && Math.random() < 0.04,
    text: 'A private equity firm offers you an exclusive investment opportunity.',
    choices: [
      {
        text: 'Invest $200k',
        effects: { money: 600000, stress: 10 },
        outcomeText: 'The IPO was a massive success!',
        type: 'good',
      },
      {
        text: 'Too risky',
        effects: { smarts: 3 },
        outcomeText: 'It soared without you. Regret.',
        type: 'neutral',
      },
    ],
  },

  // --- PET EVENTS ---
  {
    id: 'pet_sick',
    trigger: person => person.pets.length > 0 && Math.random() < 0.05,
    text: 'Your pet is acting strange. Might be sick.',
    choices: [
      {
        text: 'Vet visit',
        effects: { money: -500, happiness: -5 },
        outcomeText: 'Just a stomach bug. They are fine!',
        type: 'good',
      },
      {
        text: 'Wait and see',
        effects: { stress: 10, happiness: -5 },
        outcomeText: 'They recovered on their own, luckily.',
        type: 'neutral',
      },
    ],
  },
  {
    id: 'pet_tricks',
    trigger: person => person.pets.length > 0 && Math.random() < 0.05,
    text: 'Your pet learned a new trick! They can roll over and play dead.',
    effects: { happiness: 10 },
    type: 'good',
  },

  // --- FAME & SOCIAL MEDIA ---
  {
    id: 'fame_haters',
    trigger: person => person.fame > 60 && Math.random() < 0.1,
    text: 'A gossip site published a story about you. It is completely false.',
    choices: [
      {
        text: 'Ignore it',
        effects: { stress: 5, fame: 5 },
        outcomeText: 'The controversy made you more famous.',
        type: 'mixed',
      },
      {
        text: 'Sue them',
        effects: { money: 100000, stress: 20, fame: 10 },
        outcomeText: 'You won the lawsuit! Headlines everywhere.',
        type: 'good',
      },
      {
        text: 'Cry',
        effects: { happiness: -15, stress: 10 },
        outcomeText: 'Not your finest moment.',
        type: 'bad',
      },
    ],
  },
  {
    id: 'fame_fan_encounter',
    trigger: person => person.fame > 40 && Math.random() < 0.1,
    text: 'A fan approaches you in a restaurant and asks for a selfie.',
    choices: [
      {
        text: 'Take the selfie',
        effects: { happiness: 5, fame: 2 },
        outcomeText: 'You made their day!',
        type: 'good',
      },
      {
        text: 'Politely decline',
        effects: { fame: -2 },
        outcomeText: 'They understood. Mostly.',
        type: 'neutral',
      },
    ],
  },

  // --- ROYALTY EVENTS ---
  {
    id: 'royal_duty',
    trigger: person => person.royalty && Math.random() < 0.15,
    text: 'You are required to attend a state banquet. Boring but expected.',
    effects: { stress: 10, fame: 3, happiness: -3 },
    type: 'neutral',
  },
  {
    id: 'royal_scandal',
    trigger: person => person.royalty && Math.random() < 0.03,
    text: 'The press caught you doing something embarrassing at a private club.',
    choices: [
      {
        text: 'Issue apology',
        effects: { fame: -5, stress: 10 },
        outcomeText: 'Damage control. The tabloids move on.',
        type: 'neutral',
      },
      {
        text: 'Deny everything',
        effects: { fame: 10, karma: -10, stress: 20 },
        outcomeText: 'The story grew. You are memed worldwide.',
        type: 'mixed',
      },
    ],
  },

  // --- RETIREMENT & ELDERLY ---
  {
    id: 'elder_reminsice',
    trigger: person => person.age > 65 && Math.random() < 0.1,
    text: 'You find an old photo album and spend the afternoon reminiscing.',
    effects: { happiness: 15, stress: -10 },
    type: 'good',
  },
  {
    id: 'elder_grandchild',
    trigger: person => {
      const child = person.relationships.find(r => r.type === 'Child');
      return child && person.age > 60 && Math.random() < 0.05;
    },
    text: 'Your child had a baby! You are a grandparent now!',
    effects: { happiness: 30, stress: -10 },
    type: 'good',
  },
  {
    id: 'elder_health_scare',
    trigger: person => person.age > 70 && Math.random() < 0.08,
    text: 'You had a health scare. The doctors say you need to take it easy.',
    effects: { health: -15, stress: 15, happiness: -5 },
    type: 'bad',
  },
  {
    id: 'elder_will_update',
    trigger: person => person.age > 60 && person.money > 100000 && Math.random() < 0.04,
    text: 'Your lawyer recommends updating your will.',
    choices: [
      {
        text: 'Update it',
        effects: { stress: -10, money: -1000 },
        outcomeText: 'Peace of mind. Your affairs are in order.',
        type: 'good',
      },
      {
        text: 'Procrastinate',
        effects: { stress: 5 },
        outcomeText: 'You will do it next year. Probably.',
        type: 'neutral',
      },
    ],
  },
  {
    id: 'elder_wisdom',
    trigger: person => person.age > 50 && Math.random() < 0.05,
    text: 'You feel a sense of clarity. Life is good. You write down your thoughts.',
    effects: { happiness: 10, smarts: 3, stress: -10 },
    type: 'good',
  },
];

export const PANDEMIC_EVENTS = [
  {
    id: 'pan_mask',
    trigger: person => Math.random() < 0.2, // 20% chance per year during pandemic
    text: 'A lady in the grocery store refuses to wear a mask and is screaming.',
    choices: [
      {
        text: 'Confront her',
        effects: { stress: 5, karma: 5 },
        outcomeText: 'She coughed on you.',
        type: 'bad',
      },
      {
        text: 'Ignore her',
        effects: { happiness: -2 },
        outcomeText: 'You bought your beans and left.',
        type: 'neutral',
      },
    ],
  },
  {
    id: 'pan_lockdown',
    trigger: person => Math.random() < 0.15,
    text: 'The government has issued a strict lockdown. No leaving the house!',
    effects: { happiness: -10, stress: 10, health: 5 }, // Health goes up (safe), insane goes up
    type: 'neutral',
  },
  {
    id: 'pan_infected',
    trigger: person => Math.random() < 0.1,
    text: 'You have tested positive for the virus.',
    effects: { health: -30, happiness: -20 },
    type: 'bad',
  },
  {
    id: 'pan_remote',
    trigger: person => person.job && Math.random() < 0.2,
    text: 'Your job has switched to remote work.',
    effects: { happiness: 5, stress: -5 },
    type: 'good',
  },
];

export const SEASONAL_EVENTS = [
  {
    id: 'spring_flowers',
    season: 'Spring',
    trigger: person => Math.random() < 0.5,
    text: 'Spring is in the air! Flowers are blooming everywhere.',
    effects: { happiness: 3 },
    type: 'good',
  },
  {
    id: 'spring_cleaning',
    season: 'Spring',
    trigger: person => Math.random() < 0.3,
    text: 'You did some spring cleaning and found $50 in an old coat.',
    effects: { money: 50, happiness: 2 },
    type: 'good',
  },
  {
    id: 'spring_allergies',
    season: 'Spring',
    trigger: person => Math.random() < 0.2,
    text: 'Your spring allergies are acting up. You feel miserable.',
    effects: { health: -2, happiness: -3 },
    type: 'bad',
  },
  {
    id: 'summer_vacation',
    season: 'Summer',
    trigger: person => person.money > 500 && Math.random() < 0.3,
    text: 'You took a summer vacation to the beach!',
    effects: { happiness: 10, stress: -8, money: -500 },
    type: 'good',
  },
  {
    id: 'summer_heatwave',
    season: 'Summer',
    trigger: person => Math.random() < 0.2,
    text: 'A brutal heatwave has hit your area. Stay hydrated!',
    effects: { health: -2, happiness: -3, stress: 3 },
    type: 'bad',
  },
  {
    id: 'summer_romance',
    season: 'Summer',
    trigger: person =>
      person.age > 15 &&
      !person.relationships.some(r => r.type === 'Spouse') &&
      Math.random() < 0.1,
    text: 'You had a summer fling! Nothing serious, but it was fun.',
    effects: { happiness: 8 },
    type: 'good',
  },
  {
    id: 'fall_leaves',
    season: 'Fall',
    trigger: person => Math.random() < 0.4,
    text: 'The autumn leaves are beautiful this year. You take a peaceful walk.',
    effects: { happiness: 3, stress: -3 },
    type: 'good',
  },
  {
    id: 'fall_harvest',
    season: 'Fall',
    trigger: person => Math.random() < 0.2,
    text: 'You visited a harvest festival and enjoyed fresh apple cider.',
    effects: { happiness: 5 },
    type: 'good',
  },
  {
    id: 'fall_weather',
    season: 'Fall',
    trigger: person => Math.random() < 0.15,
    text: 'A big storm is rolling in. You lose power for a day.',
    effects: { happiness: -3, stress: 2 },
    type: 'bad',
  },
  {
    id: 'winter_holidays',
    season: 'Winter',
    trigger: person => Math.random() < 0.35,
    text: 'The holiday season is here! You exchange gifts with loved ones.',
    effects: { happiness: 8, money: -200 },
    type: 'good',
  },
  {
    id: 'winter_snow',
    season: 'Winter',
    trigger: person => Math.random() < 0.25,
    text: 'A massive snowstorm has blanketed the city. Everything is closed.',
    effects: { happiness: 2, stress: -3 },
    type: 'neutral',
  },
  {
    id: 'winter_blues',
    season: 'Winter',
    trigger: person => Math.random() < 0.15,
    text: 'The short days are getting to you. You feel a bit depressed.',
    effects: { happiness: -5, stress: 3 },
    type: 'bad',
  },
  {
    id: 'new_year',
    season: 'Winter',
    trigger: person => person.age % 4 === 0 && Math.random() < 0.6,
    text: 'Happy New Year! You reflect on the past year and set new goals.',
    effects: { happiness: 5, stress: -5 },
    type: 'good',
  },

  // --- NEW CHILDHOOD EVENTS ---
  {
    id: 'school_play',
    trigger: person => person.age >= 6 && person.age <= 12 && Math.random() < 0.08,
    text: 'You were cast in the school play! The audience gave you a standing ovation.',
    effects: { happiness: 12, fame: 1, smarts: 1 },
    type: 'good',
  },
  {
    id: 'science_fair',
    trigger: person => person.age >= 8 && person.age <= 14 && Math.random() < 0.06,
    text: 'You won first place at the science fair! Your project impressed the judges.',
    effects: { happiness: 15, smarts: 5, fame: 2 },
    type: 'good',
  },
  {
    id: 'scout_trip',
    trigger: person => person.age >= 7 && person.age <= 15 && Math.random() < 0.07,
    text: 'Your scout troop went camping. You learned to build a fire and tie knots.',
    effects: { happiness: 8, health: 2, smarts: 1 },
    type: 'good',
  },
  {
    id: 'lost_pet',
    trigger: person => person.age >= 5 && person.age <= 14 && Math.random() < 0.04,
    text: "Your pet ran away! You searched everywhere but couldn't find them.",
    effects: { happiness: -15, stress: 10 },
    type: 'bad',
  },
  {
    id: 'first_sleepover',
    trigger: person => person.age >= 6 && person.age <= 12 && Math.random() < 0.09,
    text: 'You went to your first sleepover! You stayed up all night telling stories.',
    effects: { happiness: 10, energy: -10 },
    type: 'good',
  },

  // --- NEW TEEN EVENTS ---
  {
    id: 'drivers_license',
    trigger: person => person.age === 16 && Math.random() < 0.4,
    text: "You passed your driver's license test! Freedom awaits.",
    effects: { happiness: 15, stress: -5 },
    type: 'good',
  },
  {
    id: 'failed_drivers_test',
    trigger: person => person.age === 16 && Math.random() < 0.2,
    text: "You failed your driver's license test. Parallel parking is impossible.",
    effects: { happiness: -10, stress: 8 },
    type: 'bad',
  },
  {
    id: 'prom_night',
    trigger: person => person.age >= 16 && person.age <= 18 && Math.random() < 0.12,
    text: "It's prom night! You danced the night away and made memories to last a lifetime.",
    effects: { happiness: 20, stress: -5 },
    type: 'good',
  },
  {
    id: 'teen_stress',
    trigger: person => person.age >= 13 && person.age <= 18 && Math.random() < 0.1,
    text: 'The pressure of school and social life is overwhelming you.',
    effects: { stress: 15, happiness: -5 },
    type: 'bad',
  },
  {
    id: 'first_crush',
    trigger: person => person.age >= 12 && person.age <= 16 && Math.random() < 0.1,
    text: 'You have a massive crush on someone. Your heart races every time you see them.',
    effects: { happiness: 10, stress: 5 },
    type: 'neutral',
  },

  // --- NEW ADULT EVENTS ---
  {
    id: 'promotion_party',
    trigger: person => person.age >= 25 && person.age <= 60 && person.job && Math.random() < 0.05,
    text: 'Your colleagues threw you a surprise party for your recent promotion!',
    effects: { happiness: 12, stress: -5 },
    type: 'good',
  },
  {
    id: 'housewarming',
    trigger: person =>
      person.age >= 22 &&
      person.assets.filter(a => a.type === 'House').length > 0 &&
      Math.random() < 0.08,
    text: 'You hosted a housewarming party. Your new home feels alive!',
    effects: { happiness: 10, fame: 1 },
    type: 'good',
  },
  {
    id: 'reconnect_old_friend',
    trigger: person => person.age >= 20 && Math.random() < 0.06,
    text: 'You ran into an old friend from school. You caught up like no time had passed.',
    effects: { happiness: 8, karma: 2 },
    type: 'good',
  },
  {
    id: 'burnout',
    trigger: person =>
      person.age >= 25 && person.age <= 55 && person.stress > 60 && Math.random() < 0.1,
    text: "You're completely burned out. Work and life have drained all your energy.",
    effects: { health: -5, happiness: -10, energy: -20 },
    type: 'bad',
  },
  {
    id: 'internet_famous',
    trigger: person => person.age >= 15 && person.fame > 30 && Math.random() < 0.04,
    text: "A video of you went viral! You're suddenly internet famous.",
    effects: { fame: 15, happiness: 5, stress: 5 },
    type: 'good',
  },

  // --- NEW SENIOR EVENTS ---
  {
    id: 'retirement_party',
    trigger: person => person.age >= 60 && person.job && Math.random() < 0.15,
    text: "Your coworkers threw you a retirement party. You'll miss this place.",
    effects: { happiness: 15, karma: 5 },
    type: 'good',
  },
  {
    id: 'grandchild_birth',
    trigger: person => person.age >= 50 && Math.random() < 0.05,
    text: 'You became a grandparent! The newest addition to the family has arrived.',
    effects: { happiness: 25, stress: -10 },
    type: 'good',
  },
  {
    id: 'bucket_list',
    trigger: person => person.age >= 55 && Math.random() < 0.06,
    text: 'You crossed off a bucket list item! Life feels complete.',
    effects: { happiness: 20, karma: 3 },
    type: 'good',
  },
  {
    id: 'senior_health_scare',
    trigger: person => person.age >= 65 && Math.random() < 0.08,
    text: 'You had a health scare. It makes you appreciate every moment.',
    effects: { health: -10, happiness: -5, stress: 15 },
    type: 'bad',
  },

  // --- NEW RANDOM EVENTS ---
  {
    id: 'strange_encounter',
    trigger: person => person.age >= 10 && Math.random() < 0.03,
    text: 'You met someone who looks exactly like you. Strangest thing that ever happened.',
    effects: { happiness: 3, smarts: 1 },
    type: 'neutral',
  },
  {
    id: 'deja_vu',
    trigger: person => Math.random() < 0.04,
    text: 'You experienced intense déjà vu. The moment felt strangely familiar.',
    effects: { smarts: 1 },
    type: 'neutral',
  },
  {
    id: 'lucky_penny',
    trigger: person => Math.random() < 0.06,
    text: 'You found a lucky penny heads up. Maybe today will be a good day!',
    effects: { happiness: 3 },
    type: 'good',
  },
  {
    id: 'charity_knock',
    trigger: person => person.age >= 18 && Math.random() < 0.05,
    text: 'A charity志愿者 knocked on your door. You donated what you could spare.',
    effects: { karma: 5, money: -20 },
    type: 'neutral',
  },
  {
    id: 'power_outage',
    trigger: person => Math.random() < 0.04,
    text: 'A power outage plunged your neighborhood into darkness. You made the best of it with candlelight.',
    effects: { happiness: -3, stress: 3 },
    type: 'bad',
  },
  {
    id: 'perfect_weather',
    trigger: person => Math.random() < 0.07,
    text: 'The weather is absolutely perfect today. Not too hot, not too cold.',
    effects: { happiness: 5 },
    type: 'good',
  },
  {
    id: 'neighbor_noise',
    trigger: person => person.age >= 18 && Math.random() < 0.05,
    text: "Your neighbors are being extremely loud again. You can't get any peace.",
    effects: { stress: 8, happiness: -3 },
    type: 'bad',
  },
  {
    id: 'random_act_of_kindness',
    trigger: person => Math.random() < 0.05,
    text: 'A stranger paid for your coffee today. Kindness is contagious!',
    effects: { happiness: 8, karma: 2 },
    type: 'good',
  },
  {
    id: 'lost_wallet',
    trigger: person => person.age >= 15 && Math.random() < 0.03,
    text: 'You lost your wallet! Someone returned it with everything still inside.',
    effects: { happiness: 10, karma: 3 },
    type: 'good',
  },
  {
    id: 'flat_tire',
    trigger: person => person.age >= 17 && Math.random() < 0.04,
    text: 'You got a flat tire on the way to an important meeting. What a day.',
    effects: { stress: 10, happiness: -5 },
    type: 'bad',
  },
  {
    id: 'rainy_day_cozy',
    trigger: person => person.age >= 5 && Math.random() < 0.05,
    text: "It's a rainy day. You stayed inside with a good book and hot tea.",
    effects: { happiness: 6, stress: -3, smarts: 1 },
    type: 'good',
  },
  {
    id: 'food_poisoning',
    trigger: person => person.age >= 3 && Math.random() < 0.03,
    text: "You got food poisoning from last night's dinner. Never again.",
    effects: { health: -10, happiness: -8 },
    type: 'bad',
  },
  {
    id: 'surprise_gift',
    trigger: person => Math.random() < 0.04,
    text: "You received a surprise gift in the mail! It's from an anonymous admirer.",
    effects: { happiness: 12 },
    type: 'good',
  },
];

function attachMessageKeys(events, namespace) {
  for (const event of events) {
    event.messageKey = `event.${namespace}.${event.id}`;
    if (!Array.isArray(event.choices)) {
      continue;
    }

    event.choices.forEach((choice, index) => {
      choice.messageKey = `${event.messageKey}.choice.${index}`;
      if (choice.outcomeText) {
        choice.outcomeMessageKey = `${event.messageKey}.outcome.${index}`;
      }
    });
  }
}

attachMessageKeys(LIFE_EVENTS, 'life');
attachMessageKeys(CAREER_EVENTS, 'career');
attachMessageKeys(PANDEMIC_EVENTS, 'pandemic');
attachMessageKeys(SEASONAL_EVENTS, 'seasonal');
