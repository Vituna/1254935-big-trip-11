import AbstractComponent from "./abstract-component.js";

export default class TripInfo extends AbstractComponent {
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
    this._dateStartTrip = new Date(this._eventsData[0].start).toDateString().slice(4, 10);
    this._dateEndTrip = new Date(this._eventsData[this._eventsData.length - 1].end).toDateString().slice(4, 10);
  }

  _getCity() {
    if (!this._eventsData) {
      return;
    }
    this._cities = this._eventsData.sort((a, b) => a.start - b.start).map((it) => it.destination.city);
    this._startCity = this._cities[0];
    if (this._cities.length > 3) {
      this._middleCity = `&mdash;...`;
    } else if (this._cities.length < 3) {
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
