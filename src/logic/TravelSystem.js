import { CITIES, getCityByName } from './City';

export const CONTINENTS = {
  'United States': 'North America',
  'United Kingdom': 'Europe',
  Canada: 'North America',
  Australia: 'Oceania',
  Japan: 'Asia',
  France: 'Europe',
  Germany: 'Europe',
  Italy: 'Europe',
  Spain: 'Europe',
  Brazil: 'South America',
  Mexico: 'North America',
  China: 'Asia',
  India: 'Asia',
  Russia: 'Europe',
  'South Korea': 'Asia',
  'United Arab Emirates': 'Asia',
  Singapore: 'Asia',
  Netherlands: 'Europe',
  Sweden: 'Europe',
  Switzerland: 'Europe',
  Turkey: 'Europe',
  Thailand: 'Asia',
  Kenya: 'Africa',
  'South Africa': 'Africa',
};

export const CITY_EVENTS = [
  {
    text: 'You explored the local markets and found unique souvenirs.',
    type: 'good',
    minCulture: 60,
  },
  {
    text: 'A local festival was happening — you joined the celebrations!',
    type: 'good',
    minCulture: 70,
  },
  { text: 'You tried the local cuisine and loved it.', type: 'good', minCulture: 0 },
  {
    text: 'You got lost exploring the city and discovered a hidden gem.',
    type: 'good',
    minCulture: 0,
  },
  { text: 'The weather was beautiful during your stay.', type: 'good', minCulture: 0 },
  { text: 'You visited a famous landmark and took photos.', type: 'good', minCulture: 50 },
  {
    text: 'A local resident gave you tips on the best places to visit.',
    type: 'good',
    minCulture: 0,
  },
  { text: 'You had a great conversation with locals at a cafe.', type: 'good', minCulture: 0 },
  { text: 'Your luggage was delayed at the airport.', type: 'bad', minCulture: 0 },
  { text: 'You got caught in a rainstorm without an umbrella.', type: 'bad', minCulture: 0 },
  { text: 'A pickpocket tried to steal your wallet.', type: 'bad', minCulture: 0 },
  { text: 'The hotel lost your reservation.', type: 'bad', minCulture: 0 },
  { text: 'You found a charming bookstore and spent hours browsing.', type: 'good', minCulture: 0 },
  { text: 'The nightlife exceeded your expectations.', type: 'good', minCulture: 50 },
];

export function getContinent(country) {
  return CONTINENTS[country] || 'Other';
}

export function calculateFlightCost(fromCity, toCity) {
  if (!fromCity || !toCity) {
    return 500;
  }
  if (fromCity.country === toCity.country) {
    return 80 + Math.floor(Math.random() * 150);
  }
  const fromCont = getContinent(fromCity.country);
  const toCont = getContinent(toCity.country);
  if (fromCont === toCont) {
    return 250 + Math.floor(Math.random() * 350);
  }
  return 400 + Math.floor(Math.random() * 1200);
}

export function generateCityEvent(city) {
  const eligible = CITY_EVENTS.filter(e => (city.culture || 0) >= e.minCulture);
  const ev =
    eligible.length > 0 ? eligible[Math.floor(Math.random() * eligible.length)] : CITY_EVENTS[0];
  return {
    text: ev.text,
    type: ev.type,
    happinessChange:
      ev.type === 'good'
        ? 5 + Math.floor(Math.random() * 10)
        : -(3 + Math.floor(Math.random() * 8)),
  };
}

export function travelToCity(person, city) {
  if (!person || person.city === city.name) {
    return { success: false, reason: 'already_there' };
  }

  const currentCity = getCityByName(person.city) || CITIES.find(c => c.country === person.country);
  const cost = calculateFlightCost(currentCity, city);

  if (person.money < cost) {
    return { success: false, reason: 'no_money', cost };
  }

  person.money -= cost;

  const prevCountry = person.country;
  person.city = city.name;
  person.country = city.country;
  person.yearsInCurrentCity = 0;
  person.yearsInCurrentCountry = 0;

  if (prevCountry !== city.country) {
    if (!Array.isArray(person.countriesVisited)) {
      person.countriesVisited = [];
    }
    if (!person.countriesVisited.includes(city.country)) {
      person.countriesVisited.push(city.country);
    }
    if (!Array.isArray(person.citizenships)) {
      person.citizenships = [prevCountry];
    }
    person.logEvent(
      `You moved to ${city.name}, ${city.country}. Flight cost: $${cost.toLocaleString()}.`,
      'neutral'
    );
    person.updateStats({ happiness: 10, stress: 5 });
  } else {
    person.logEvent(
      `You moved to ${city.name}. Flight cost: $${cost.toLocaleString()}.`,
      'neutral'
    );
    person.updateStats({ happiness: 5 });
  }

  const event = generateCityEvent(city);
  person.logEvent(event.text, event.type);
  if (event.happinessChange) {
    person.updateStats({ happiness: event.happinessChange });
  }

  return { success: true, cost, event };
}

export function getCitiesByContinent() {
  const grouped = {};
  CITIES.forEach(city => {
    const cont = getContinent(city.country);
    if (!grouped[cont]) {
      grouped[cont] = [];
    }
    grouped[cont].push(city);
  });
  return grouped;
}

export function getClimateIcon(climate) {
  const icons = {
    tropical: '',
    subtropical: '',
    mediterranean: '',
    maritime: '',
    continental: '',
    temperate: '',
    arid: '',
    humid_subtropical: '',
  };
  return icons[climate] || '';
}
