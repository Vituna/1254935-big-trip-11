const FORMAT_DATA = 100 * 60 * 60 * 24 * 1000 / 24;


import Day from '../components/point_day.js';
import Sort from '../components/sorting.js';
import NoPoint from '../components/no_points.js';
import SortContainer from '../components/sort_block';
import PointController from './point-controller.js';
import DaysList from '../components/point_day_all.js';
import {remove, getEventsInDays} from '../util.js';

export default class TripController {
  constructor(container, eventsData, onDataChange, filters) {
    this._container = container;
    this._eventsData = eventsData;
    this._creatingEvent = null;
    this._sort = new Sort();
    this._filters = filters;
    this._message = new NoPoint();
    this._daysList = new DaysList();
    this._sortOrFilterEventsContainer = new SortContainer();
    this._onDataChange = this._onDataChange.bind(this);
    this._onDataChangeMain = onDataChange;
    this._subscriptions = [];
    this.onChangeView = this.onChangeView.bind(this);

  }

  init() {
    if (this._eventsData.lenght === 0) {
      this._renderMessage();
    }
    this._renderDaysList();
    const tripEvents = document.querySelector(`.trip-events`);
    tripEvents.querySelector(`h2`).after(this._sort.getElement());
    this._sort.getElement().addEventListener(`click`, (evt) => this._onSortClick(evt));
    this._filters.getElement().addEventListener(`click`, (evt) => this._onFilterClick(evt));
  }

  createEvent(addButton) {
    if (this._creatingEvent) {
      return;
    }
    const defaultEvent = {
      type: ``,
      city: ``,
      price: ``,
      start: new Date(),
      end: new Date(),
      offers: [],
      isFavorite: false,
    };
    if (this._message.getElement()) {
      remove(this._message.getElement());
    }
    this._addButton = addButton;
    const eventsListContainer = this._container.querySelector(`.trip-sort`);
    this._creatingEvent = new PointController(this._addButton, defaultEvent, `add`, eventsListContainer, (...args) => {
      this._creatingEvent = null;
      this._addButton.disabled = false;
      this._onDataChange(...args);
    }, this.onChangeView);
  }

  _renderMessage() {
    this._container.append(this._message.getElement());
  }

  _onSortClick(evt) {
    if (evt.target.tagName !== `LABEL`) {
      return;
    }
    this._daysList.getElement().innerHTML = ``;
    this._daysList.getElement().append(this._sortOrFilterEventsContainer.getElement());
    const eventsListSort = this._sortOrFilterEventsContainer.getElement().querySelector(`.trip-events__list`);
    eventsListSort.innerHTML = ``;
    switch (evt.target.dataset.sortType) {
      case `price`:
        const sortByPrice = this._eventsData.slice().sort((a, b) => b.price - a.price);
        this._renderEvents(sortByPrice, eventsListSort);
        break;
      case `time`:
        const sortByTime = this._eventsData.slice().sort((a, b) => (a.start - a.end) - (b.start - b.end));
        this._renderEvents(sortByTime, eventsListSort);
        break;
      default:
        this._renderDaysList();
        break;
    }
  }

  _onFilterClick(evt) {
    if (evt.target.tagName !== `LABEL`) {
      return;
    }
    this._daysList.getElement().innerHTML = ``;
    this._daysList.getElement().append(this._sortOrFilterEventsContainer.getElement());
    const eventsListSort = this._sortOrFilterEventsContainer.getElement().querySelector(`.trip-events__list`);
    eventsListSort.innerHTML = ``;

    const date = Date.now() + FORMAT_DATA;
    switch (evt.target.textContent) {
      case `Future`:
        const futureEvents = this._eventsData.filter((event) => {
          return event.start > date;
        });

        this._renderEvents(futureEvents, eventsListSort);
        break;
      case `Past`:
        const pastEvents = this._eventsData.filter((event) => {

          return event.start < date;
        });
        this._renderEvents(pastEvents, eventsListSort);
        break;
      case `Everything`:
        this._renderDaysList();
        break;
    }
  }

  _renderDaysList() {
    remove(this._daysList.getElement());
    this._daysList.removeElement();
    this._container.append(this._daysList.getElement());
    const eventsInDays = getEventsInDays(this._eventsData.sort((a, b) => a.start - b.start));
    const datesData = Object.keys(eventsInDays);
    datesData.forEach((date, index) => {
      const day = this._renderDay(date, index, this._daysList.getElement());
      const eventsInDayData = eventsInDays[date];
      const eventsList = day.querySelector(`.trip-events__list`);
      this._renderEvents(eventsInDayData, eventsList);
    });
  }

  _renderDay(date, index, daysListElement) {
    const day = new Day(date, index);
    const dayElement = day.getElement();
    daysListElement.append(dayElement);
    return dayElement;
  }

  _renderEvent(eventData, eventsListContainer) {
    const eventController = new PointController(this._addButton, eventData, `default`, eventsListContainer, this._onDataChange, this.onChangeView);
    this._subscriptions.push(eventController.setDefaultView.bind(eventController));
  }

  _renderEvents(eventsInDayData, eventsListContainer) {
    eventsInDayData.map((eventData) => {
      this._renderEvent(eventData, eventsListContainer);
    });
  }

  _onDataChange(newData, oldData) {
    const index = this._eventsData.findIndex((it) => it === oldData);
    if (newData === null) {
      this._eventsData = this._eventsData.slice();
      this._eventsData.splice(index, 1);
    } else if (oldData === null) {
      this._eventsData = [newData, ...this._eventsData];
    } else {
      this._eventsData[index] = newData;
    }
    if (this._eventsData.length === 0) {
      this._renderMessage();
      remove(this._daysList.getElement());

    } else {
      this._renderDaysList();
    }
    this._onDataChangeMain(this._eventsData);
  }


  onChangeView() {
    this._subscriptions.forEach((subscription) => subscription());
  }

  hide() {
    this._daysList.getElement().classList.add(`visually-hidden`);
    this._sort.getElement().classList.add(`visually-hidden`);
  }

  show() {
    this._daysList.getElement().classList.remove(`visually-hidden`);
    this._sort.getElement().classList.remove(`visually-hidden`);
  }
}
