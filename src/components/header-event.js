import {toNormalCase} from "../utils/common";
// import {createEventType} from "./select-type";
// import {createSelectTime} from "./selectTime";
// import {createSelectPrice} from "./select-price";
import {Mode, DefaultData, EvenOption, Format} from "./consts";
import moment from "moment";


const createFavoriteBtn = (isFavorite) => {
  return (
    `<input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${isFavorite ? `checked` : ``}>
      <label class="event__favorite-btn" for="event-favorite-1">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </label>`
  );
};

const createOptionCity = (city) => `<option value="${city}"></option>`;

const getCities = (CITIES) => CITIES.map((it) => createOptionCity(it)).join(`\n`);

export const createCitySelect = (typeEvent, city, CITIES) => {
  const type = toNormalCase(typeEvent);

  return (
    `<div class="event__field-group  event__field-group--destination">
      <label class="event__label  event__type-output" for="event-destination-1">
        ${type} to
      </label>
      <input
        class="event__input  event__input--destination"
        id="event-destination-1"
        type="text"
        name="event-destination"
        value="${city}"
        list="destination-list-1">
      <datalist id="destination-list-1">
        ${getCities(CITIES)}
      </datalist>
    </div>`
  );
};

const createSelect = (type, isChecked) => {
  const typeLowerCase = type.toLowerCase();
  const checked = isChecked ? `checked` : ``;

  return (
    `<div class="event__type-item">
       <input
        id="event-type-${typeLowerCase}-1"
        class="event__type-input  visually-hidden"
        type="radio"
        name="event-type"
        value="${type}"
        ${checked}>
       <label class="event__type-label  event__type-label--${typeLowerCase}" for="event-type-${typeLowerCase}-1">${type}</label>
     </div>`
  );
};

const getActivity = (type) => EvenOption.TYPE_ACTIVITY.map((it) => createSelect(it, it === type)).join(`\n`);

export const createActivity = (type) => {
  const typeEvent = toNormalCase(type);

  return (
    `<fieldset class="event__type-group">
       <legend class="visually-hidden">Activity</legend>
       ${getActivity(typeEvent)}
    </fieldset>`
  );
};


const getTransfers = (type) => EvenOption.TYPE_TRANSPORT.map((it) => createSelect(it, it === type)).join(`\n`);

export const createTransfer = (type) => {
  const typeEvent = toNormalCase(type);

  return (
    `<fieldset class="event__type-group">
      <legend class="visually-hidden">Transfer</legend>
      ${getTransfers(typeEvent)}
    </fieldset>`
  );
};


export const createEventType = (typeEvent) => {

  return (
    `<div class="event__type-wrapper">
      <label class="event__type  event__type-btn" for="event-type-toggle-1">
        <span class="visually-hidden">Choose event type</span>
        <img class="event__type-icon" width="17" height="17" src="img/icons/${typeEvent}.png" alt="${typeEvent}">
      </label>
      <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

      <div class="event__type-list">
        ${createTransfer(typeEvent)}
        ${createActivity(typeEvent)}
      </div>
    </div>`
  );
};

const getDate = (date) => {
  return moment(date).format(Format.DATE_TIME_REVERS);
};

export const createSelectTime = (timeStart, timeEnd) => {

  return (
    `<div class="event__field-group  event__field-group--time">
      <label class="visually-hidden" for="event-start-time-1">
        From
      </label>
      <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${getDate(timeStart)}">
      &mdash;
      <label class="visually-hidden" for="event-end-time-1">
        To
      </label>
      <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${getDate(timeEnd)}">
    </div>`
  );
};

const createSelectPrice = (price) => {
  return (
    `<div class="event__field-group  event__field-group--price">
      <label class="event__label" for="event-price-1">
        <span class="visually-hidden">Price</span>
        &euro;
      </label>
      <input
        class="event__input  event__input--price"
        id="event-price-1"
        type="text"
        name="event-price"
        value="${price}"
        pattern="^[0-9]+$"
        title="Используйте числовой формат"
        required>
    </div>`
  );
};

export const createHeader = (typeEvent, timeStart, timeEnd, isFavorite, city, basePrice, mode, pointsModel, externalData) => {
  const CITIES = pointsModel.getCities();
  const resetBtn = mode === Mode.ADDING ? DefaultData.CANCEL : externalData.DELETE_BTN;
  const saveButtonText = externalData.SAVE_BTN;
  const favoriteBtn = mode !== Mode.ADDING ? createFavoriteBtn(isFavorite) : ``;

  const isBlockSaveBtn = !CITIES.includes(city);

  return (
    `<header class="event__header">
      ${createEventType(typeEvent)}
      ${createCitySelect(typeEvent, city, CITIES)}
      ${createSelectTime(timeStart, timeEnd)}
      ${createSelectPrice(basePrice)}

      <button class="event__save-btn  btn  btn--blue" type="submit" ${isBlockSaveBtn ? `disabled` : ``}>${saveButtonText}</button>
      <button class="event__reset-btn" type="reset">${resetBtn}</button>
      ${favoriteBtn}
     </header>`
  );
};
