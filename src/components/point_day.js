import AbstractComponent from "./abstract-component.js";
import moment from 'moment';

export default class Day extends AbstractComponent {
  constructor(date, index) {
    super();
    this._dayIndex = index + 1;
    this._date = new Date(date);
  }

  getTemplate() {
    return `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${this._dayIndex}</span>
        <time class="day__date" datetime="${moment(this._date).format()}">${moment(this._date).format(`MMM DD`)}</time>
      </div>
      <ul class="trip-events__list">
      </ul>
      </li>`;
  }
}


