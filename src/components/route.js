import AbstractComponent from "./abstract-component.js";
const SHOW_CITIES_COUNT = 3;
import moment from 'moment';

export default class Route extends AbstractComponent {
  constructor(eventsData, price) {
    super();
    this._price = price;
    this._eventsData = eventsData.length !== 0 ? eventsData : null;
    this._getCity();
    this._getDate();
  }

  _getDate() {
    if (!this._eventsData) {
      return;
    }
    this._dateStartTrip = moment(this._eventsData[0].start).format(`MMM DD`);
    this._dateEndTrip = moment(this._eventsData[this._eventsData.length - 1].end).format(`MMM DD`);
  }

  _getCity() {
    if (!this._eventsData) {
      return;
    }
    this._cities = this._eventsData.sort((a, b) => a.start - b.start).map((it) => it.destination.city);
    this._startCity = this._cities[0];
    if (this._cities.length > SHOW_CITIES_COUNT) {
      this._middleCity = `&mdash;...`;
    } else if (this._cities.length < SHOW_CITIES_COUNT) {
      this._middleCity = ``;
    } else {
      this._middleCity = `&mdash; ${this._cities[1]}`;
    }
    this._endCity = this._cities[this._cities.length - 1];
  }

  getTemplate() {
    return `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
    <h1 class="trip-info__title">${this._startCity} ${this._middleCity} &mdash; ${this._endCity}</h1>
    <p class="trip-info__dates">${this._dateStartTrip}&nbsp;&mdash;&nbsp;${this._dateEndTrip}</p>
    </div>
    <p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value">${this._price}</span>
    </p>
    </section>`;
  }
}
