const DAYS_COUNT = 14;

import {
  getRandomElement,
  getRandomArray,
  getArray,
  getRandomInteger,
  getRandomDate,
} from "./util.js";

const DESCRIPTIONS = [`Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  `Cras aliquet varius magna, non porta ligula feugiat eget.`,
  `Fusce tristique felis at fermentum pharetra.`,
  `Aliquam id orci ut lectus varius viverra.`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`];

export const DESTINATIONS = [{
  city: `St.Petersburg`,
  description: Array.from(new Set(getRandomArray(1, 3, DESCRIPTIONS))).join(``),
  urls: Array.from(new Set(getArray(1, 5))),
},
{
  city: `Moscow`,
  description: Array.from(new Set(getRandomArray(1, 3, DESCRIPTIONS))).join(``),
  urls: Array.from(new Set(getArray(1, 5))),
}, {
  city: `Krasnoyarsk`,
  description: Array.from(new Set(getRandomArray(1, 3, DESCRIPTIONS))).join(``),
  urls: Array.from(new Set(getArray(1, 5))),
},
{
  city: `Abakan`,
  description: Array.from(new Set(getRandomArray(1, 3, DESCRIPTIONS))).join(``),
  urls: Array.from(new Set(getArray(1, 5))),
}, {
  city: `Sayanogorsk`,
  description: Array.from(new Set(getRandomArray(1, 3, DESCRIPTIONS))).join(``),
  urls: Array.from(new Set(getArray(1, 5))),
}];

export const OPTIONS = [{
  id: `luggage`,
  option: `Add luggage`,
  price: 100
},
{
  id: `comfort`,
  option: `Switch to comfort class`,
  price: 400
},
{
  id: `meal`,
  option: `Add meal`,
  price: 24
},
{
  id: `seats`,
  option: `Choose seats`,
  price: 40
},
];

export const TYPES_OF_TRANSFER = [
  {
    title: `Bus to`,
    type: `bus`,
    options: new Set(getRandomArray(1, 4, OPTIONS)),
  },
  {
    title: `Drive to`,
    type: `drive`,
    options: new Set(getRandomArray(1, 4, OPTIONS)),
  },
  {
    title: `Flight to`,
    type: `flight`,
    options: new Set(getRandomArray(1, 4, OPTIONS)),
  },
  {
    title: `Ship to`,
    type: `ship`,
    options: new Set(getRandomArray(1, 4, OPTIONS)),
  },
  {
    title: `Taxi to`,
    type: `taxi`,
    options: new Set(getRandomArray(1, 4, OPTIONS)),
  },
  {
    title: `Train to`,
    type: `train`,
    options: new Set(getRandomArray(1, 4, OPTIONS)),
  },
  {
    title: `Transport to`,
    type: `transport`,
    options: new Set(getRandomArray(1, 4, OPTIONS)),
  },
];
export const TYPES_OF_ACTIVITY = [
  {
    title: `Check-in in`,
    type: `check-in`,
    options: new Set(getRandomArray(1, 4, OPTIONS)),
  },
  {
    title: `Restaurant in`,
    type: `restaurant`,
    options: new Set(getRandomArray(1, 4, OPTIONS)),
  },
  {
    title: `Sightseeing in`,
    type: `sightseeing`,
    options: new Set(getRandomArray(1, 4, OPTIONS)),
  },
];

export const TYPES_OF_EVENT = TYPES_OF_TRANSFER.concat(TYPES_OF_ACTIVITY);

export const menuValues = [
  {
    title: `Table`,
    active: true
  },
  {
    title: `Stats`,
    active: false
  },
];

const getEvent = () => {
  const type = getRandomElement(TYPES_OF_EVENT);
  const start = getRandomDate(DAYS_COUNT);
  const residual = getRandomInteger(20, 180) * 60 * 1000;
  const end = start + residual;
  return {
    type,
    city: getRandomElement(DESTINATIONS).city,
    price: getRandomInteger(0, 1000),
    start,
    end,
    offers: type.options,
    isFavorite: false
  };
};

export const getEventsData = (count) => {
  const events = new Array(count);
  return events.fill(``).map(getEvent);
};

export const getCities = (eventsData) => {
  return eventsData.map((event) => event.city);
};

export const getPrice = ((eventsData) => {
  return eventsData.map((event) => {
    const offersPrice = Array.from(event.offers).reduce((a, b) => {
      return a + b.price;
    }, 0);
    return event.price + offersPrice;
  }).reduce((a, b) => a + b);
});

export const filtersNames = [`Everything`, `Future`, `Past`];
