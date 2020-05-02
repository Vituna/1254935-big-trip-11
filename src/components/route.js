import AbstractComponent from "./abstract-component.js";

export default class TripInfo extends AbstractComponent {
  constructor(eventsData, price) {
    super();
    this._eventsData = eventsData;
    this._price = price;
    this._cities = eventsData.sort((a, b) => a.start - b.start).map((it) => it.city);
    this._startCity = this._cities[0];
    this._middleCity = this._cities.length > 3 ? `...` : this._cities[1];
    this._endCity = this._cities[this._cities.length - 1];
    this._dateStartTrip = new Date(this._eventsData[0].start).toDateString().slice(4, 10);
    this._dateEndTrip = new Date(this._eventsData[this._eventsData.length - 1].end).toDateString().slice(4, 10);
  }

  getTemplate() {
    return `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
    <h1 class="trip-info__title">${this._startCity} &mdash; ${this._middleCity} &mdash; ${this._endCity}</h1>
    <p class="trip-info__dates">${this._dateStartTrip}&nbsp;&mdash;&nbsp;${this._dateEndTrip}</p>
    </div>
    <p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value">${this._price}</span>
    </p>
    </section>`;
  }
}
