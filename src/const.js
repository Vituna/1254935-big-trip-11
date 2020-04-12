const DAYS_COUNT = 15;
const TASK_COUNT = 10;

export const CITIES = [`St.Petersburg`, `Moscow`, `Krasnoyarsk`, `Abakan`, `Sayanogorsk`, `Minsk`, `Novosibirsk`];

export const TYPES_OF_TRANSFER = [
  `Taxi to`,
  `Bus to`,
  `Train to`,
  `Ship to`,
  `Transport to`,
  `Drive to`,
  `Flight to`,
];

export const TYPES_OF_ACTIVITY = [
  `Check-in in`,
  `Sightseeing in`,
  `Restaurant in`,
];
const TYPES_OF_EVENT = TYPES_OF_TRANSFER.concat(TYPES_OF_ACTIVITY);

const DESCRIPTIONS = [`Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  `Cras aliquet varius magna, non porta ligula feugiat eget.`,
  `Fusce tristique felis at fermentum pharetra.`,
  `Aliquam id orci ut lectus varius viverra.`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`];

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

import {
  getRandomElement,
  getRandomArray,
  getArray,
  getRandomInteger,
  getRandomDate,
} from "./util.js";

const getEvent = () => {
  const type = getRandomElement(TYPES_OF_EVENT);
  const start = getRandomDate(DAYS_COUNT);
  const residual = getRandomInteger(20, 180) * 60 * 1000;
  const residualInHours = residual / 1000 / 60 / 60;
  const hours = Math.trunc(residualInHours);
  const minutes = Math.trunc((residualInHours - hours) * 60);
  return {
    type,
    city: getRandomElement(CITIES),
    price: getRandomInteger(0, 1000),
    description: new Set(getRandomArray(1, 3, DESCRIPTIONS)),
    start,
    end: start + residual,
    hours,
    minutes,
    offers: new Set(getRandomArray(1, 2, OPTIONS)),
    urls: new Set(getArray(0, 5)),
  };

};

export const getCities = () => {
  return eventsData.map((event) => event.city);
};

export const getDatesEnd = () => {
  return eventsData.map((event) => new Date(event.end));
};

export const getEventsData = (count) => {
  const events = new Array(count);
  return events.fill(``).map(getEvent).sort((a, b) => a.start - b.start);
};

export const eventsData = getEventsData(TASK_COUNT);

export const getDatesStart = () => {
  return eventsData.map((event) => new Date(event.start));
};

export const tripDaysDates = new Set(getDatesStart().map((date) => `${date}`.slice(4, 10)));

