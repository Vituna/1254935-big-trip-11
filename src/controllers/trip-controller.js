import Day from '../components/point_day.js';
import Event from '../components/point.js';
import Create from '../components/create.js';
import Sort from '../components/sorting.js';
import SortBlock from '../components/sort_block';

export default class TripController {
  constructor(container, eventsData, events) {
    this._container = container;
    this._eventsData = eventsData;
    this._events = events;
    this._sort = new Sort();
    this._datesData = Object.keys(eventsData);
    this._sortContainer = new SortBlock();

  }

  init() {
    this._datesData.forEach((date, index) => {
      const day = this._renderDay(date, index, this._container);
      const eventsInDayData = this._eventsData[date];
      const eventsList = day.querySelector(`.trip-events__list`);
      this._renderEvents(eventsInDayData, eventsList);
    });
    const tripEvents = document.querySelector(`.trip-events`);
    tripEvents.querySelector(`h2`).after(this._sort.getElement());
    this._sort.getElement().addEventListener(`click`, (evt) => this._onSortClick(evt));
  }

  _onSortClick(evt) {
    if (evt.target.tagName !== `LABEL`) {
      return;
    }
    this._container.innerHTML = ``;
    this._container.append(this._sortContainer.getElement());
    const eventsListSort = this._sortContainer.getElement().querySelector(`.trip-events__list`);
    eventsListSort.innerHTML = ``;
    switch (evt.target.dataset.sortType) {
      case `price`:
        const sortByPrice = this._events.slice().sort((a, b) => b.price - a.price);
        this._renderEvents(sortByPrice, eventsListSort);
        break;
      case `time`:
        const sortByTime = this._events.slice().sort((a, b) => (a.start - a.end) - (b.start - b.end));
        this._renderEvents(sortByTime, eventsListSort);
        break;
      case `default`:
        this._container.innerHTML = ``;
        this._datesData.forEach((date, index) => {
          const day = this._renderDay(date, index, this._container);
          const eventsInDayData = this._eventsData[date];
          const eventsList = day.querySelector(`.trip-events__list`);
          this._renderEvents(eventsInDayData, eventsList);
        });
        break;
    }
  }

  _renderDay(date, index, daysListElement) {
    const day = new Day(date, index);
    const dayElement = day.getElement();
    daysListElement.append(dayElement);
    return dayElement;
  }

  _renderEvents(eventsInDayData, eventsList) {
    eventsInDayData.map((eventData) => {
      this._renderEvent(eventData, eventsList);
    });
  }

  _renderEvent(eventData, container) {
    const event = new Event(eventData);
    const eventEdit = new Create(eventData);
    container.append(event.getElement());

    const onEscKeydown = (evt) => {
      if (evt.key === `Esc` || evt.key === `Escape`) {
        container.replaceChild(event.getElement(), eventEdit.getElement());
        document.removeEventListener(`keydown`, onEscKeydown);
      }
    };

    event.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, () => {
      container.replaceChild(eventEdit.getElement(), event.getElement());
      document.addEventListener(`keydown`, onEscKeydown);
    });
    eventEdit.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, () => {
      container.replaceChild(event.getElement(), eventEdit.getElement());
      document.removeEventListener(`keydown`, onEscKeydown);
    });

    eventEdit.getElement().querySelector(`.event--edit`).addEventListener(`submit`, () => {
      container.replaceChild(event.getElement(), eventEdit.getElement());
      document.removeEventListener(`keydown`, onEscKeydown);
    });
  }
}
