
export const TYPES_OF_TRANSFER = [
  {
    title: `Bus to`,
    id: `bus`,
  },
  {
    title: `Drive to`,
    id: `drive`,
  },
  {
    title: `Flight to`,
    id: `flight`,
  },
  {
    title: `Ship to`,
    id: `ship`,
  },
  {
    title: `Taxi to`,
    id: `taxi`,
  },
  {
    title: `Train to`,
    id: `train`,
  },
  {
    title: `Transport to`,
    id: `transport`,
  },
];

export const TYPES_OF_ACTIVITY = [
  {
    title: `Check-in in`,
    id: `check-in`,
  },
  {
    title: `Restaurant in`,
    id: `restaurant`,
  },
  {
    title: `Sightseeing in`,
    id: `sightseeing`,
  },
];

export const TYPES_OF_EVENT = TYPES_OF_TRANSFER.concat(TYPES_OF_ACTIVITY);

export const ActionType = {
  DELETE: `delete`,
  CREATE: `create`,
  CHANGE: `change`
};
export const ModeType = {
  ADD: `add`,
  DEFAULT: `default`,
};

export const getPrice = ((eventsData) => {
  let price = 0;
  if (eventsData.length !== 0) {
    price = eventsData.map((event) => {
      const offersPrice = Array.from(event.offers).reduce((a, b) => {
        return a + b.price;
      }, 0);
      return event.price + offersPrice;
    }).reduce((a, b) => a + b);
  }
  return price;
});

export const filtersNames = [`Everything`, `Future`, `Past`];
