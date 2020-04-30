import {TYPES_OF_TRANSFER, TYPES_OF_ACTIVITY, TYPES_OF_EVENT, CITIES, OPTIONS} from "./../const.js";
import AbstractComponent from "./abstract-component.js";
import flatpickr from 'flatpickr';

import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/light.css';

export default class EventEdit extends AbstractComponent {
  constructor({
    type,
    city,
    price,
    start,
    end,
    offers,
    isFavorite
  }) {
    super();
    this._type = type;
    this._city = city;
    this._price = price;

    this._start = new Date(start);
    this._end = new Date(end);
    this._offers = offers;

    this._isFavorite = isFavorite;
    this._subscribeOnTypeChange();
    this._subscribeOnCityChange();
    this._addFlatpickr();
  }

  _addFlatpickr() {
    flatpickr((this.getElement().querySelector(`#event-start-time-1`)), {
      altInput: true,
      altFormat: `d.m.y H:i`,
      enableTime: true,
      defaultDate: this._start,
    });
    flatpickr((this.getElement().querySelector(`#event-end-time-1`)), {
      altInput: true,
      altFormat: `d.m.y H:i`,
      enableTime: true,
      defaultDate: this._end,
    });

  }
  _subscribeOnTypeChange() {
    const label = this.getElement().querySelector(`.event__type-output`);
    const img = this.getElement().querySelector(`.event__type-icon`);
    const offersContainer = this.getElement().querySelector(`.event__available-offers`);
    const onTypeChange = (evt) => {
      const newType = TYPES_OF_EVENT.find((type) => type.type === evt.target.value);
      label.textContent = newType.title;
      img.src = `img/icons/${newType.type}.png`;
      offersContainer.innerHTML = this._getOffers(newType);
      this.rerender();
    };
    this.getElement().querySelector(`.event__type-list`).addEventListener(`change`, onTypeChange);
  }
  _getOffers(newType) {
    return Array.from(newType.options).map((option) => {
      return `<div class="event__offer-selector">
            <input class="event__offer-checkbox  visually-hidden" id="event-offer-${option.id}-1" type="checkbox" name="event-offer-${option.id}">
            <label class="event__offer-label" for="event-offer-${option.id}-1">
              <span class="event__offer-title">${option.option}</span>
              &plus;
              &euro;&nbsp;<span class="event__offer-price">${option.price}</span>
            </label>
          </div>`;
    }).join(``);
  }

  _getFirstDescription(newType) {
    return `<section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
    <p class="event__destination-description">${newType.description}</p>
    <div class="event__photos-container">
      <div class="event__photos-tape">
      ${newType.urls.map((url) => `<img class="event__photo" src=${url} alt="Event photo">`).join(``)}
      </div>
    </div>
  </section>`;
  }

  _subscribeOnCityChange() {
    const eventDetailsContainer = this.getElement().querySelector(`.event__details`);
    const onCityChange = (evt) => {

      if (evt.target.value) {
        const newType = CITIES.find((it) => it.city === evt.target.value);
        const destination = this.getElement().querySelector(`.event__section--destination`);
        if (!destination) {
          eventDetailsContainer.insertAdjacentHTML(`beforeend`, this._getFirstDescription(newType));
        } else {
          const description = this.getElement().querySelector(`.event__destination-description`);
          const photosContainer = this.getElement().querySelector(`.event__photos-tape`);
          description.textContent = newType.description;
          photosContainer.innerHTML = this._getPhotos(newType);
        }
      }
      this.rerender();
    };
    this.getElement().querySelector(`.event__input--destination`).addEventListener(`change`, onCityChange);
  }

  _getPhotos(newType) {
    return newType.urls.map((it) => `<img class="event__photo" src=${it} alt="Event photo">`).join(``);
  }

  rerender() {
    super.rerender();
  }

  recoveryListeners() {
    this._subscribeOnTypeChange();
    this._subscribeOnCityChange();
    this._addFlatpickr();
  }

  getTemplate() {
    return `<li class="trip-events__item">
    <form class="event  event--edit"  method="post" action="https://echo.htmlacademy.ru" enctype="multipart/form-data" autocomplete="off">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${this._type.type ? this._type.type : TYPES_OF_TRANSFER[0].type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
          <div class="event__type-list">
          <fieldset class="event__type-group">
          <legend class="visually-hidden">Transfer</legend>
          ${TYPES_OF_TRANSFER.map((transferType, index) => `<div class="event__type-item">
          <input id="event-type-${transferType.type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${transferType.type}" ${transferType.type === this._type.type ? `checked` : ``} ${!this._type.type && index === 0 ? `checked` : ``}>
          <label class="event__type-label  event__type-label--${transferType.type}" for="event-type-${transferType.type}-1">${transferType.type}</label>
        </div>`).join(``)}
        </fieldset>
        <fieldset class="event__type-group">
          <legend class="visually-hidden">Activity</legend>
          ${TYPES_OF_ACTIVITY.map((activityType) => `<div class="event__type-item">
          <input id="event-type-${activityType.type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${activityType.type}"${activityType.type === this._type.type ? `checked` : ``}>
          <label class="event__type-label  event__type-label--${activityType.type}" for="event-type-${activityType.type}-1">${activityType.type}</label>
        </div>`).join(``)}
        </fieldset>
          </div>
        </div>
        <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          ${this._type.title ? this._type.title : TYPES_OF_TRANSFER[0].title}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${this._city}" list="destination-list-1">
        <datalist id="destination-list-1">
          ${CITIES.map((cities) => `<option value="${cities.city}"></option>`).join(``)}
        </datalist>
      </div>
      <div class="event__field-group  event__field-group--time">
      <label class="visually-hidden" for="event-start-time-1">
        From
      </label>
      <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="">
      &mdash;
      <label class="visually-hidden" for="event-end-time-1">
        To
      </label>
      <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="">
    </div>
        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">${this._price}</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${this._price}">
        </div>
        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>
        <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${this._isFavorite ? `checked` : ``}>
        <label class="event__favorite-btn" for="event-favorite-1">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </label>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>
          <div class="event__available-offers">
          ${OPTIONS.map((option) =>`<div class="event__offer-selector">
              <input class="event__offer-checkbox  visually-hidden" id="event-offer-${option.id}-1" type="checkbox" name="event-offer-${option.id}" ${(Array.from(this._offers).filter((offer) => offer.option === option.option)).length > 0 ? `checked` : ``}>
              <label class="event__offer-label" for="event-offer-${option.id}-1">
                <span class="event__offer-title">${option.option}</span>
                &plus;
                &euro;&nbsp;<span class="event__offer-price">${option.price}</span>
              </label>
            </div>`).join(``)}
          </div>
        </section>
        ${this._city ? `${`<section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${(CITIES.find((it) => it.city === this._city) || {}).cities || ``}</p>
        <div class="event__photos-container">
          <div class="event__photos-tape">
          ${CITIES.find((sities) => sities.city === this._city).urls.map((url) => `<img class="event__photo" src=${url} alt="Event photo">`).join(``)}
          </div>
        </div>
      </section>`} ` : ``}
      </section>
    </form>
    </li>`;
  }
}
