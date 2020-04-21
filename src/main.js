const EVENT_COUNT = 15;

import Menu from './components/site-menu.js';
import Filters from './components/filter.js';
import TripInfo from './components/route.js';
import DaysList from './components/point_day_all.js';
import PointAdd from './components/point_add.js';
import TripController from './controllers/trip-controller.js';

import {
  getEventsData,
  menuValues,
  filtersNames,
  getPrice,
  getCities,
  getEventsInDays
} from "./const.js";

const tripControls = document.querySelector(`.trip-controls`);
const tripEvents = document.querySelector(`.trip-events`);
const tripInfo = document.querySelector(`.trip-main`);
const addButton = document.querySelector(`.trip-main__event-add-btn`);

const eventsData = getEventsData(EVENT_COUNT);
const tripCities = getCities(eventsData);
const eventsInDays = getEventsInDays(eventsData);
const price = getPrice(eventsData);

const renderMenu = () => {
  const menu = new Menu(menuValues);
  tripControls.append(menu.getElement());
};

const renderFilters = () => {
  const filters = new Filters(filtersNames);
  tripControls.append(filters.getElement());
};

const renderDaysList = () => {
  const daysList = new DaysList();
  tripEvents.append(daysList.getElement());
  return daysList.getElement();
};

const renderTripInfo = () => {
  const info = new TripInfo(tripCities, eventsData, price);
  tripInfo.prepend(info.getElement());
};

const renderPointAdd = () => {
  const eventAdd = new PointAdd();
  tripEvents.append(eventAdd.getElement());
  addButton.disabled = true;
};

renderMenu();
renderFilters();
if (eventsData.length > 0) {
  renderTripInfo();
  const daysList = renderDaysList();
  const tripController = new TripController(daysList, eventsInDays, eventsData);
  tripController.init();
} else {
  renderPointAdd();
}
