import AbstractComponent from "./abstract-component";
import {castTimeFormat, getIsoDate, getDurationMinutes} from "../utils/common";
import {Format} from "../utils/consts";
import moment from "moment";

const getDuration = (start, end) => {
  const duration = getDurationMinutes(start, end);
  const durationHour = Math.floor(duration / Format.IN_HOUR);
  const durationMinute = (duration) % Format.IN_HOUR;
  const durationDay = Math.floor(durationHour / Format.IN_DAY);
  const durationH = durationHour ? castTimeFormat(durationHour % Format.IN_DAY) + `H` : ``;
  const durationM = durationMinute ? castTimeFormat(durationMinute) + `M` : ``;
  const durationD = durationDay ? castTimeFormat(durationDay) + `D` : ``;

  return `${durationD} ${durationH} ${durationM}`;
};

const getDataEvent = (start, end) => {
  const startTime = moment(start).format(Format.TIME);
  const endTime = moment(end).format(Format.TIME);
  const duration = getDuration(start, end);

  return {
    startTime,
    endTime,
    duration
  };
};

const createOption = (option) => {
  const {title, price} = option;

  return (
    `<li class="event__offer">
      <span class="event__offer-title">${title}</span>
      &plus;
      &euro;&nbsp;<span class="event__offer-price">${price}</span>
     </li>`
  );
};

const getOptions = (offers) => offers.slice(0, 3).map((it) => createOption(it)).join(`\n`);

const createOptions = (offers) => {
  return (
    `<h4 class="visually-hidden">Offers:</h4>
     <ul class="event__selected-offers">
        ${getOptions(offers)}
     </ul>`
  );
};


const createEvent = (event) => {
  const {basePrice, type, destinations, timeStart, timeEnd, offers} = event;
  const {startTime, endTime, duration} = getDataEvent(timeStart, timeEnd);

  return (
    `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${type[0].toUpperCase()}${type.slice(1)} to ${destinations.name}</h3>
        <div class="event__schedule">
          <p class="event__time">
          <time class="event__start-time" datetime="${getIsoDate(timeStart)}">${startTime}</time>
          &mdash;
          <time class="event__end-time" datetime="${getIsoDate(timeEnd)}">${endTime}</time>
          </p>
          <p class="event__duration">${duration}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
        </p>
        ${createOptions(offers)}
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
};

class Point extends AbstractComponent {
  constructor(event) {
    super();

    this._event = event;
  }

  getTemplate() {

    return createEvent(this._event);
  }

  setEditBtnClickHandler(handler) {
    this.getElement().querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, handler);
  }
}

export default Point;
