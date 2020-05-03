import Menu from './components/site-menu.js';
import Filters from './components/filter.js';
import TripInfo from './components/route.js';
import Stats from './components/stats.js';
import TripController from './controllers/trip-controller.js';
import LoadingMessage from './components/loading-message.js';
import {API} from './api.js';
import {filtersNames, ActionType, getPrice} from "./const.js";
import {render, remove, RenderPosition} from "./util.js";

const tripControls = document.querySelector(`.trip-controls`);
const tripEvents = document.querySelector(`.trip-events`);
const tripInfo = document.querySelector(`.trip-main`);
const addButton = document.querySelector(`.trip-main__event-add-btn`);
const AUTORIZATION = `Basic dgtlckBwYXNzd29yIAo=`;
const URL = `https://11.ecmascript.pages.academy/big-trip/`;
const api = new API({
  url: URL,
  authorization: AUTORIZATION
});

const onDataChange = (actionType, data, onError, element) => {
  switch (actionType) {
    case ActionType.DELETE:
      api.deleteEvent(data.id)
        .then(() => api.getEvents())
        .then((events) => {
          stats.update(events);
          tripController.init(events);
          info.remove();
          info = renderInfo(events);
        })
        .catch(() => {
          onError();
        });
      break;
    case ActionType.CHANGE:
      api.changeEvent(data.id, data)
        .then(() => api.getEvents())
        .then((events) => {
          stats.update(events);
          tripController.init(events);
          info.remove();
          info = renderInfo(events);
        })
        .catch(() => {
          onError();
        });
      break;
    case ActionType.CREATE:
      api.createEvent(data)
        .then(() => api.getEvents())
        .then((events) => {
          stats.update(events);

          tripController.init(events);
          info.remove();
          info = renderInfo(events);
          remove(element);
        })
        .catch(() => {
          onError();
        });
  }
};

const renderInfo = (events) => {
  let price = getPrice(events);
  const info = new TripInfo(events, price);
  if (events.length !== 0) {
    render(tripInfo, info.getElement(), RenderPosition.PREPEND);
  }
  return info.getElement();
};

const menu = new Menu();
const filters = new Filters(filtersNames);
const stats = new Stats();
const loadingMessage = new LoadingMessage();
const tripController = new TripController(tripEvents, onDataChange);

render(tripControls, menu.getElement(), RenderPosition.APPEND);
render(tripControls, filters.getElement(), RenderPosition.APPEND);
render(tripEvents, stats.getElement(), RenderPosition.APPEND);
render(tripEvents, loadingMessage.getElement(), RenderPosition.APPEND);


let info;
let allOffers;
let allDestinations;
(Promise.all([api.getOffers(), api.getDestinations(), api.getEvents()])
  .then(([offers, destinations, events]) => {
    allOffers = offers;
    allDestinations = destinations;

    stats.getStatistics(events);
    tripController.init(events);
    info = renderInfo(events);
  }))
.then(() => {
  remove(loadingMessage.getElement());
});

export {
  allOffers,
  allDestinations
};

const onAddEventButtonClick = () => {
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
      filters.getElement().classList.remove(`visually-hidden`);
      break;
    case `Stats`:
      tripController.hide();
      filters.getElement().classList.add(`visually-hidden`);
      stats.show();
  }
};

const onFilterClick = () => {
  tripController.init();
};

menu.getElement().addEventListener(`click`, onMenuClick);
addButton.addEventListener(`click`, onAddEventButtonClick);
filters.getElement().addEventListener(`change`, onFilterClick);
