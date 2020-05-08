import {TYPES_OF_TRANSFER, TYPES_OF_ACTIVITY, TYPES_OF_EVENT} from "../const.js";
import {allOffers, allDestinations} from "../main.js";

import AbstractSmartComponent from "./abstract-smart-component.js";
import moment from 'moment';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/light.css';

export default class Create extends AbstractSmartComponent {
  constructor({
    type,
    destination,
    price,
    start,
    end,
    offers,
    isFavorite
  }) {
    super();
    this._type = {
      id: type,
      title: TYPES_OF_EVENT.find((it) => it.id === type).title
    };
    this._destination = destination;
    this._price = price;

    this._start = new Date(start);
    this._end = new Date(end);
    this._offers = offers;

    this._isFavorite = isFavorite;
    this._subscribeOnTypeChange();
    this._subscribeOnCityChange();
    this.addFlatpickr();
  }
  addFlatpickr() {
    const start = flatpickr((this.getElement().querySelector(`#event-start-time-1`)), {
      dateFormat: `d.m.y H:i`,
      allowInput: true,
      enableTime: true,
      defaultDate: this._start,
      onChange(selectedDates) {
        end.set(`minDate`, selectedDates[0]);
      }
    });

    const end = flatpickr((this.getElement().querySelector(`#event-end-time-1`)), {
      dateFormat: `d.m.y H:i`,
      allowInput: true,
      enableTime: true,
      defaultDate: this._end,
      onChange(selectedDates) {
        start.set(`maxDate`, selectedDates[0]);
      },
    });
  }

  getTemplate() {
    return `<li class="trip-events__item">
    <form class="event  event--edit"  method="post" action="https://echo.htmlacademy.ru" enctype="multipart/form-data" autocomplete="off">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${this._type.id}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
          <fieldset class="event__type-group">
          <legend class="visually-hidden">Transfer</legend>
          ${TYPES_OF_TRANSFER.map((transferType, index) => `<div class="event__type-item">
          <input id="event-type-${transferType.id}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${transferType.id}" ${transferType.id === this._type.id ? `checked` : ``} ${!this._type.id && index === 0 ? `checked` : ``}>
          <label class="event__type-label  event__type-label--${transferType.id}" for="event-type-${transferType.id}-1">${transferType.id}</label>
        </div>`).join(``)}
        </fieldset>
        <fieldset class="event__type-group">
          <legend class="visually-hidden">Activity</legend>
          ${TYPES_OF_ACTIVITY.map((activityType) => `<div class="event__type-item">
          <input id="event-type-${activityType.id}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${activityType.id}"${activityType.id === this._type.id ? `checked` : ``}>
          <label class="event__type-label  event__type-label--${activityType.id}" for="event-type-${activityType.id}-1">${activityType.id}</label>
        </div>`).join(``)}
        </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          ${this._type.title}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1"  name="event-destination" value="${this._destination.city ? this._destination.city : ``}" list="destination-list-1"  required readonly>
        <datalist id="destination-list-1">
          ${allDestinations ? allDestinations.map((destination) => `<option value="${destination.city}"></option>`).join(``) : ``}
        </datalist>
      </div>


      <div class="event__field-group  event__field-group--time">
      <label class="visually-hidden" for="event-start-time-1">
        From
      </label>
      <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${moment(this._start).format(`D.MM.YY h:mm`)}" required readonly>
      &mdash;
      <label class="visually-hidden" for="event-end-time-1">
        To
      </label>
      <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${moment(this._end).format(`D.MM.YY h:mm`)}" required readonly>
    </div>
        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">${this._price}</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" min="0" max="1000000" value="${this._price}" required>
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

        ${this._offers.length > 0 ? `<section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>
          <div class="event__available-offers">
          ${this._offers.map((it) =>`<div class="event__offer-selector">
              <input class="event__offer-checkbox  visually-hidden" id="event-offer-${it.title.split(`-`)}-1" type="checkbox" name="event-offer-${it.title.split(`-`)}" ${it.accepted ? `checked` : ``}>
              <label class="event__offer-label" for="event-offer-${it.title.split(`-`)}-1">
                <span class="event__offer-title">${it.title}</span>
                &plus;
                &euro;&nbsp;<span class="event__offer-price">${it.price}</span>
              </label>
            </div>`).join(``)}
          </div>
        </section>` : ``}
        ${this._destination ? `<section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${this._destination.description}</p>

        <div class="event__photos-container">
          <div class="event__photos-tape">

          ${this._destination.pictures.map((it) => `<img class="event__photo" src=${it.url} alt="${it.alt}">`).join(``)}
          </div>
        </div>
      </section>` : ``}

      </section>
    </form>
    </li>`;
  }

  _subscribeOnTypeChange() {
    const eventDetailsContainer = this.getElement().querySelector(`.event__details`);
    const label = this.getElement().querySelector(`.event__type-output`);
    const img = this.getElement().querySelector(`.event__type-icon`);
    let offersContainer = this.getElement().querySelector(`.event__available-offers`);

    const onTypeChange = (evt) => {
      const newType = TYPES_OF_EVENT.find((it) => it.id === evt.target.value);
      label.textContent = newType.title;
      img.src = `img/icons/${newType.id}.png`;
      const offers = allOffers.find((it) => it.type === newType.id).offers;
      if (!offersContainer) {
        eventDetailsContainer.insertAdjacentHTML(`afterbegin`, this._getOffersContainer());
        offersContainer = eventDetailsContainer.querySelector(`.event__available-offers`);
      }
      offersContainer.innerHTML = this._getOffers(offers);
    };
    this.getElement().querySelector(`.event__type-list`).addEventListener(`change`, onTypeChange);
  }

  _getOffersContainer() {
    return `<section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>
    <div class="event__available-offers">
    </div>
  </section>`;
  }

  _subscribeOnCityChange() {
    const eventDetailsContainer = this.getElement().querySelector(`.event__details`);
    const options = Array.from(this.getElement().querySelector(`#destination-list-1`).querySelectorAll(`option`));

    const onCityChange = (evt) => {
      if (!evt.target.value) {
        return;
      }
      if (options.find((it) => it.value === evt.target.value)) {
        const newDestination = allDestinations.find((it) => it.city === evt.target.value);
        this._getDescription(eventDetailsContainer, newDestination);
        evt.target.setCustomValidity(``);
      } else {
        evt.target.setCustomValidity(`Please select a valid value.`);
      }
      this.rerender();
    };
    this.getElement().querySelector(`.event__input--destination`).addEventListener(`change`, onCityChange);
  }

  _getOffers(offers) {
    return offers.map((it) => {
      return `<div class="event__offer-selector">
            <input class="event__offer-checkbox  visually-hidden" id="event-offer-${it.title.split(`-`)}-1" type="checkbox" name="event-offer-${it.title.split(`-`)}">
            <label class="event__offer-label" for="event-offer-${it.title.split(`-`)}-1">
              <span class="event__offer-title">${it.title}</span>
              &plus;
              &euro;&nbsp;<span class="event__offer-price">${it.price}</span>
            </label>
          </div>`;
    }).join(``);
  }

  _getDescription(eventDetailsContainer, destination) {
    let destinationContainer = eventDetailsContainer.querySelector(`.event__section--destination`);
    if (!destinationContainer) {
      eventDetailsContainer.insertAdjacentHTML(`beforeend`, this._getFirstDescription(destination));
      destination = eventDetailsContainer.querySelector(`.event__section--destination`);
    } else {
      const description = eventDetailsContainer.querySelector(`.event__destination-description`);
      const photosContainer = eventDetailsContainer.querySelector(`.event__photos-tape`);
      description.textContent = destination.description;
      photosContainer.innerHTML = this._getPhotos(destination);
    }
  }

  rerender() {
    super.rerender();
  }

  recoveryListeners() {
    this._subscribeOnCityChange();
    this._subscribeOnTypeChange();
    // this._applyFlatpickr();
  }

  _getFirstDescription(newType) {
    return `<section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
    <p class="event__destination-description">${newType.description}</p>

    <div class="event__photos-container">
      <div class="event__photos-tape">
      ${newType.pictures.map((it) => `<img class="event__photo" src=${it.url} alt="${it.alt}">`).join(``)}
      </div>
    </div>
  </section>`;
  }

  _getPhotos(destination) {
    return destination.pictures.map((it) => `<img class="event__photo" src=${it.url} alt="${it.alt}">`).join(``);
  }
}
