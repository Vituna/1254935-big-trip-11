export const HIDDEN_CLASS = `visually-hidden`;
export const BAR_HEIGHT = 55;

export const EvenOption = {
  TYPE_TRANSPORT: [`Taxi`, `Bus`, `Train`, `Ship`, `Transport`, `Drive`, `Flight`],
  TYPE_ACTIVITY: [`Check-in`, `Sightseeing`, `Restaurant`],
};

export const Format = {
  LESS_TEN: 10,
  IN_HOUR: 60,
  IN_DAY: 24,
  DATE: `m/d/y H:i`,
  TIME: `HH:mm`,
  ISO_DATE: `YYYY-MM-DDTHH:mm`,
  DATE_TIME: `YYYY-MM-DD`,
  DATE_TIME_REVERS: `MM/DD/YY hh:mm`,
  DAY_DATE: `MMM DD`,
  MAX_TITLE_COUNT: 3,
  MAX_DATE_COUNT: 2,
  MIN_DATE_COUNT: 1,
};

export const Place = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`,
  AFTERNODE: `after`,
  BEFORENODE: `before`
};

export const SortType = {
  EVENT: `event`,
  TIME: `time`,
  PRICE: `price`
};

export const Mode = {
  ADDING: `adding`,
  DEFAULT: `default`,
  EDIT: `edit`,
};

export const FilterType = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`
};

export const emptyPoint = {
  basePrice: ``,
  timeStart: new Date(),
  timeEnd: new Date(),
  destinations: {name: ``, description: ``, pictures: []},
  id: new Date() + Math.random(),
  isFavorite: false,
  offers: [],
  type: `taxi`,
};

export const MenuItem = {
  TABLE: `table`,
  STATS: `stats`,
};

export const EvtKey = {
  ESC: `Escape`
};

export const TagName = {
  A: `A`,
};

export const Selector = {
  EVENT_LIST: `.trip-events__list`
};

export const TypeChart = {
  MONEY: `MONEY`,
  TRANSPORT: `TRANSPORT`,
  TIME_SPENT: `TIME SPENT`
};

export const typeIcon = {
  'taxi': `🚕`,
  'bus': `🚌`,
  'train': `🚂`,
  'ship': `🚢`,
  'transport': `🚙`,
  'drive': `🚗`,
  'flight': `✈️`,
  'check-in': `🏨`,
  'sightseeing': `🏛️`,
  'restaurant': `🍴`
};

export const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

export const Code = {
  OK: 200,
  NOT_OK: 300
};

export const DefaultData = {
  DELETE_BTN: `Delete`,
  SAVE_BTN: `Save`,
  CANCEL: `Cancel`,
};

export const DuringData = {
  DELETE_BTN: `Deleting...`,
  SAVE_BTN: `Saving...`,
};
