const EVENT_COUNT = 15;

import Menu from './components/site-menu.js';
import Filters from './components/filter.js';
import TripInfo from './components/route.js';
import Sort from './components/sorting.js';
import Cost from './components/cost.js';
import DaysList from './components/point_day_all.js';
import Day from './components/point_day.js';
import PointList from './components/point_list.js';
import Point from './components/point.js';
import Create from './components/create.js';
import NoPoints from './components/no_points.js';

import {
  getEventsData,
  menuValues,
  TYPES_OF_TRANSFER,
  TYPES_OF_ACTIVITY,
  CITIES,
  OPTIONS,
  filtersNames,
  getUniqDates,
  getCities,
} from "./const.js";

const tripControls = document.querySelector(`.trip-controls`);
const tripEvents = document.querySelector(`.trip-events`);
const tripInfo = document.querySelector(`.trip-main`);
const addButton = document.querySelector(`.trip-main__event-add-btn`);


const eventsData = getEventsData(EVENT_COUNT);
const uniqDates = getUniqDates(eventsData);
const tripCities = getCities(eventsData);

const renderMenu = () => {
  const menu = new Menu(menuValues);
  tripControls.append(menu.getElement());
};

const renderNoPoints = () => {
  const noPoints = new NoPoints();
  tripEvents.append(noPoints.getElement());

};

const renderFilters = () => {
  const filters = new Filters(filtersNames);
  tripControls.append(filters.getElement());
};

const renderTripInfo = () => {
  const info = new TripInfo(tripCities, eventsData);
  tripInfo.prepend(info.getElement());
};

const reenderMany = () => {
  const cost = new Cost();
  tripInfo.prepend(cost.getElement());
};

const renderSort = () => {
  const sort = new Sort();
  tripEvents.prepend(sort.getElement());
};

const renderPointAdd = () => {
  const eventAdd = new Create(TYPES_OF_TRANSFER, TYPES_OF_ACTIVITY, CITIES);
  tripEvents.append(eventAdd.getElement());
  addButton.disabled = true;
};

const renderDaysList = () => {
  const daysList = new DaysList();
  tripEvents.append(daysList.getElement());

  uniqDates.map((date, index) => {
    return renderDay(date, index, daysList.getElement());
  });
};

const renderDay = (date, index, container) => {
  const eventsInDayData = getDayEvents(date);

  const day = new Day(eventsInDayData[0].start, index);
  container.append(day.getElement());

  const eventsList = renderPointList(day.getElement());
  eventsInDayData.map((eventData) => {
    renderPoint(eventData, eventsList.getElement());
  });
};

const renderPointList = (container) => {
  const eventsList = new PointList();
  container.append(eventsList.getElement());
  return eventsList;
};

const getDayEvents = (date) => {
  const dayEvents = eventsData.filter((event) => {
    return event.date === date;
  });
  return dayEvents;
};

const renderPoint = (eventData, container) => {
  const event = new Point(eventData);
  const eventEdit = new Create(eventData, TYPES_OF_TRANSFER, TYPES_OF_ACTIVITY, CITIES, OPTIONS);
  container.append(event.getElement());

  const onEscKeydown = (evt) => {
    if (evt.key === `Esc` || evt.key === `Escape`) {
      container.replaceChild(event.getElement(), eventEdit.getElement());
    }
  };

  event.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, () => {
    container.replaceChild(eventEdit.getElement(), event.getElement());
    document.addEventListener(`keydown`, onEscKeydown);
  });

  event.getElement().querySelector(`.event__rollup-btn`).addEventListener(`submit`, () => {
  });
};

renderMenu();
reenderMany();
renderFilters();
renderSort();

if (eventsData.length > 0) {
  renderTripInfo();
  renderDaysList();
  renderPointAdd();
} else {
  renderNoPoints();
}

