export const DIET_TYPES = {
  standard: { name: 'Standard', cost: 0, healthMod: 0, weightMod: 0, looksMod: 0 },
  vegetarian: { name: 'Vegetarian', cost: 50, healthMod: 2, weightMod: -2, looksMod: 1 },
  vegan: { name: 'Vegan', cost: 100, healthMod: 3, weightMod: -3, looksMod: 2 },
  keto: { name: 'Keto', cost: 150, healthMod: 1, weightMod: -5, looksMod: 0 },
  mediterranean: { name: 'Mediterranean', cost: 120, healthMod: 5, weightMod: -2, looksMod: 3 },
  junk: { name: 'Junk Food', cost: 20, healthMod: -3, weightMod: 5, looksMod: -2 },
  highProtein: { name: 'High Protein', cost: 200, healthMod: 2, weightMod: -1, looksMod: 4 },
};

export const EXERCISE_TYPES = {
  cardio: {
    name: 'Cardio',
    calBurn: 300,
    healthGain: 2,
    stressRelief: 8,
    weightLoss: 3,
    muscleGain: 0,
  },
  strength: {
    name: 'Strength Training',
    calBurn: 200,
    healthGain: 3,
    stressRelief: 5,
    weightLoss: 1,
    muscleGain: 4,
  },
  yoga: {
    name: 'Yoga',
    calBurn: 150,
    healthGain: 1,
    stressRelief: 15,
    weightLoss: 1,
    muscleGain: 1,
  },
  sports: {
    name: 'Sports',
    calBurn: 400,
    healthGain: 4,
    stressRelief: 10,
    weightLoss: 4,
    muscleGain: 2,
  },
  walking: {
    name: 'Walking',
    calBurn: 100,
    healthGain: 1,
    stressRelief: 5,
    weightLoss: 1,
    muscleGain: 0,
  },
};

export function getBMI(person) {
  const weight = person.fitness?.weight || 150;
  const height = 70;
  return (weight / (height * height)) * 703;
}

export function getBMICategory(bmi) {
  if (bmi < 18.5) {
    return 'underweight';
  }
  if (bmi < 25) {
    return 'normal';
  }
  if (bmi < 30) {
    return 'overweight';
  }
  return 'obese';
}

export function processFitness(person) {
  if (!person.fitness) {
    person.fitness = {
      weight: 150,
      diet: 'standard',
      exerciseDays: 0,
      muscleMass: 30,
      bodyFat: 20,
    };
  }

  let diet = DIET_TYPES[person.fitness.diet] || DIET_TYPES.standard;

  if (diet.cost > 0 && person.fitness.diet !== 'standard') {
    const annualCost = diet.cost * 12;
    if (person.money >= annualCost) {
      person.money -= annualCost;
    } else {
      person.fitness.diet = 'standard';
      diet = DIET_TYPES.standard;
      person.logEvent("You couldn't afford your diet plan for the year.", 'bad');
    }
  }

  person.fitness.weight = Math.max(
    80,
    Math.min(
      400,
      person.fitness.weight + diet.weightMod * 0.5 + (person.fitness.exerciseDays > 0 ? -1 : 1)
    )
  );

  if (person.fitness.exerciseDays > 0) {
    person.fitness.exerciseDays = Math.max(0, person.fitness.exerciseDays - 1);
  }

  if (person.fitness.muscleMass === undefined) {
    person.fitness.muscleMass = 30;
  }
  if (person.fitness.bodyFat === undefined) {
    person.fitness.bodyFat = 20;
  }
  person.fitness.muscleMass = Math.max(5, Math.min(60, person.fitness.muscleMass - 0.5));
  person.fitness.bodyFat = Math.max(5, Math.min(50, person.fitness.bodyFat + 0.3));

  const bmi = getBMI(person);
  const category = getBMICategory(bmi);

  if (category === 'obese') {
    person.updateStats({ health: -3, looks: -2, happiness: -3 });
  } else if (category === 'overweight') {
    person.updateStats({ health: -1, looks: -1 });
  } else if (category === 'underweight') {
    person.updateStats({ health: -2, looks: -1 });
  } else {
    person.updateStats({ health: 1 });
  }
}

export function exercise(person, type) {
  const ex = EXERCISE_TYPES[type];
  if (!ex) {
    return false;
  }

  if (!person.fitness) {
    person.fitness = {
      weight: 150,
      diet: 'standard',
      exerciseDays: 0,
      muscleMass: 30,
      bodyFat: 20,
    };
  }

  if ((person.energy ?? 100) < 20) {
    person.logEvent("You're too exhausted to exercise.", 'neutral');
    return false;
  }
  person.energy = Math.max(0, (person.energy ?? 100) - 20);

  const days = person.fitness.exerciseDays || 0;
  const dim = Math.max(0.3, 1 - days / 7);
  person.fitness.exerciseDays = Math.min(7, days + 1);
  person.fitness.weight = Math.max(80, person.fitness.weight - ex.weightLoss * 0.3 * dim);
  person.fitness.muscleMass = Math.min(
    60,
    (person.fitness.muscleMass || 30) + ex.muscleGain * 0.5 * dim
  );
  person.fitness.bodyFat = Math.max(5, (person.fitness.bodyFat || 20) - ex.weightLoss * 0.2 * dim);

  person.updateStats({ health: ex.healthGain, stress: -ex.stressRelief, happiness: 1 });

  if (ex.muscleGain > 0 && person.hasTrait('Athletic')) {
    person.fitness.muscleMass += 1;
    person.logEvent('Your Athletic trait boosted your muscle gains!', 'good');
  }

  person.logEvent(`You did ${ex.name}. Feeling fit!`, 'good');
  return true;
}

export function changeDiet(person, dietType) {
  const diet = DIET_TYPES[dietType];
  if (!diet) {
    return false;
  }

  if (!person.fitness) {
    person.fitness = {
      weight: 150,
      diet: 'standard',
      exerciseDays: 0,
      muscleMass: 30,
      bodyFat: 20,
    };
  }

  if (diet.cost > 0) {
    if (person.money < diet.cost) {
      person.logEvent(`You can't afford the ${diet.name} diet.`, 'bad');
      return false;
    }
  }

  person.fitness.diet = dietType;
  person.logEvent(`You switched to a ${diet.name} diet.`, 'good');
  return true;
}
