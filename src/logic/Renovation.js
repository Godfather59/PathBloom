export const RENOVATIONS = {
  kitchen: {
    name: 'Kitchen Remodel',
    cost: 15000,
    valueBoost: 0.15,
    timeMonths: 3,
    minPropertyValue: 50000,
  },
  bathroom: {
    name: 'Bathroom Renovation',
    cost: 8000,
    valueBoost: 0.1,
    timeMonths: 2,
    minPropertyValue: 30000,
  },
  basement: {
    name: 'Basement Finishing',
    cost: 12000,
    valueBoost: 0.12,
    timeMonths: 4,
    minPropertyValue: 100000,
  },
  landscaping: {
    name: 'Landscaping',
    cost: 5000,
    valueBoost: 0.07,
    timeMonths: 1,
    minPropertyValue: 20000,
  },
  roof: {
    name: 'Roof Replacement',
    cost: 10000,
    valueBoost: 0.08,
    timeMonths: 1,
    minPropertyValue: 50000,
  },
  addition: {
    name: 'Room Addition',
    cost: 30000,
    valueBoost: 0.25,
    timeMonths: 6,
    minPropertyValue: 150000,
  },
  solar: {
    name: 'Solar Panels',
    cost: 15000,
    valueBoost: 0.1,
    timeMonths: 2,
    minPropertyValue: 100000,
  },
  pool: {
    name: 'Swimming Pool',
    cost: 25000,
    valueBoost: 0.18,
    timeMonths: 4,
    minPropertyValue: 200000,
  },
};

export function renovateProperty(person, assetIndex, renovationKey) {
  const asset = person.assets[assetIndex];
  if (!asset || asset.type !== 'Real Estate') {
    person.logEvent("That's not a real estate property.", 'bad');
    return false;
  }

  const ren = RENOVATIONS[renovationKey];
  if (!ren) {
    return false;
  }

  const currentValue = asset.value || asset.price || 0;
  if (currentValue < ren.minPropertyValue) {
    person.logEvent(`Your property is too small for a ${ren.name}.`, 'bad');
    return false;
  }

  if (person.money < ren.cost) {
    person.logEvent(
      `A ${ren.name} costs $${ren.cost.toLocaleString()}. You can't afford it.`,
      'bad'
    );
    return false;
  }

  if (!asset.renovations) {
    asset.renovations = [];
  }
  if (asset.renovations.includes(renovationKey)) {
    person.logEvent(`You already have a ${ren.name} on this property.`, 'bad');
    return false;
  }

  person.money -= ren.cost;
  asset.renovations.push(renovationKey);

  const valueGain = Math.floor(currentValue * ren.valueBoost);
  asset.value = (asset.value || currentValue) + valueGain;
  asset.renovationCost = (asset.renovationCost || 0) + ren.cost;

  person.logEvent(
    `You completed a ${ren.name} for $${ren.cost.toLocaleString()}. Property value increased by $${valueGain.toLocaleString()}!`,
    'good'
  );
  return true;
}

export function flipProperty(person, assetIndex) {
  const asset = person.assets[assetIndex];
  if (!asset || asset.type !== 'Real Estate') {
    person.logEvent("That's not a real estate property.", 'bad');
    return null;
  }

  if (!asset.renovations || asset.renovations.length === 0) {
    person.logEvent("This property hasn't been renovated. The market isn't interested.", 'neutral');
    return null;
  }

  const currentValue = asset.value || asset.price || 0;
  const purchasePrice = asset.purchasePrice || asset.price || 0;

  const marketMultiplier = 0.85 + Math.random() * 0.3;
  const flipValue = Math.floor(currentValue * marketMultiplier);

  const profit = flipValue - purchasePrice - (asset.renovationCost || 0);

  const mortgageBalance = asset.isMortgaged
    ? Math.max(
        0,
        Number(asset.mortgage?.balance ?? asset.mortgageBalance ?? asset.mortgageAmount) || 0
      )
    : 0;
  const netProceeds = flipValue - mortgageBalance;
  person.money += netProceeds;
  const idx = person.assets.indexOf(asset);
  if (idx > -1) {
    person.assets.splice(idx, 1);
  }

  const profitStr =
    profit >= 0
      ? `profit of $${profit.toLocaleString()}`
      : `loss of $${Math.abs(profit).toLocaleString()}`;
  const mortgageText =
    mortgageBalance > 0
      ? ` after repaying $${mortgageBalance.toLocaleString()} on the mortgage`
      : '';
  person.logEvent(
    `You flipped ${asset.name} for $${flipValue.toLocaleString()}${mortgageText} (${profitStr})!`,
    profit >= 0 ? 'good' : 'bad'
  );

  return { salePrice: flipValue, mortgagePaid: mortgageBalance, netProceeds, profit };
}
