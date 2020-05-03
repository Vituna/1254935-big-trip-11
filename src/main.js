const EVENT_COUNT = 10;

import Menu from './components/site-menu.js';
import Filters from './components/filter.js';
import TripInfo from './components/route.js';
// import PointAdd from './components/point_add.js';
import Stats from './components/stats.js';
import TripController from './controllers/trip-controller.js';

import {
  getEventsData,
  filtersNames,
  getPrice,
} from "./const.js";

import {
  render,
  RenderPosition
} from "./util.js";

const tripControls = document.querySelector(`.trip-controls`);
const tripEvents = document.querySelector(`.trip-events`);
const tripInfo = document.querySelector(`.trip-main`);
const addButton = document.querySelector(`.trip-main__event-add-btn`);

let eventsData = getEventsData(EVENT_COUNT);
let price = getPrice(eventsData);

const menu = new Menu();
const filters = new Filters(filtersNames);
const stats = new Stats();
const renderInfo = () => {
  const info = new TripInfo(eventsData, price);
  render(tripInfo, info.getElement(), RenderPosition.PREPEND);
  return info.getElement();
};
let info = renderInfo();

const onDataChange = (events) => {
  eventsData = events;
  info.remove();
  info = renderInfo();
};

const tripController = new TripController(tripEvents, eventsData, onDataChange, filters);

render(tripControls, menu.getElement(), RenderPosition.APPEND);
render(tripControls, filters.getElement(), RenderPosition.APPEND);

if (eventsData.length > 0) {
  render(tripEvents, stats.getElement(), RenderPosition.APPEND);
  stats.hide();
  tripController.init();
}


const onAddButtonClick = () => {
  addButton.disabled = true;
  tripController.createEvent(addButton);
  tripController.onChangeView();
  stats.hide();
  tripController.show();
  Array.from(menu.getElement().querySelectorAll(`a`)).find((a) => a.text === `Table`).classList.add(`trip-tabs__btn--active`);
  Array.from(menu.getElement().querySelectorAll(`a`)).find((a) => a.text === `Stats`).classList.remove(`trip-tabs__btn--active`);
};

const onMenuClick = (evt) => {

  if (evt.target.tagName !== `A`) {
    return;
  }
  menu.getElement().querySelector(`.trip-tabs__btn--active`).classList.remove(`trip-tabs__btn--active`);
  evt.target.classList.add(`trip-tabs__btn--active`);
  switch (evt.target.textContent) {
    case `Table`:
      stats.hide();
      tripController.show();
      break;
    case `Stats`:
      tripController.hide();
      stats.show();
      stats.getStatistics(eventsData);
  }
};


menu.getElement().addEventListener(`click`, onMenuClick);
addButton.addEventListener(`click`, onAddButtonClick);
