import Day from '../components/point_day.js';
import Sort from '../components/sorting.js';
import SortBlock from '../components/sort_block';
import PointController from './point-controller.js';
import DaysList from '../components/point_day_all.js';
import {remove, getEventsInDays} from '../util.js';

export default class TripController {
  constructor(container, eventsData) {
    this._container = container;
    this._eventsData = eventsData;
    this._sort = new Sort();
    this._daysList = new DaysList();
    this._sortContainer = new SortBlock();
    this._onDataChange = this._onDataChange.bind(this);
    this._subscriptions = [];
    this._onChangeView = this._onChangeView.bind(this);
  }

  init() {
    this._renderDaysList();
    const tripEvents = document.querySelector(`.trip-events`);
    tripEvents.querySelector(`h2`).after(this._sort.getElement());
    this._sort.getElement().addEventListener(`click`, (evt) => this._onSortClick(evt));
  }

  _onSortClick(evt) {
    if (evt.target.tagName !== `LABEL`) {
      return;
    }
    this._daysList.getElement().innerHTML = ``;
    this._daysList.getElement().append(this._sortContainer.getElement());
    const eventsListSort = this._sortContainer.getElement().querySelector(`.trip-events__list`);
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
    const eventController = new PointController(eventData, eventsListContainer, this._onDataChange, this._onChangeView);
    this._subscriptions.push(eventController.setDefaultView.bind(eventController));
  }

  _renderEvents(eventsInDayData, eventsListContainer) {
    eventsInDayData.map((eventData) => {
      this._renderEvent(eventData, eventsListContainer);
    });
  }

  _onDataChange(newData, oldData) {
    this._eventsData[this._eventsData.findIndex((it) => it === oldData)] = newData;
  }

  _onChangeView() {
    this._subscriptions.forEach((subscription) => subscription());
  }
}
