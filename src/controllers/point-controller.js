import Event from '../components/point.js';
import Create from '../components/create.js';
import moment from 'moment';

import {render, remove, RenderPosition} from "../util.js";
import {ActionType, ModeType} from "../const.js";
import {allDestinations} from '../main.js';

export default class PointController {
  constructor(eventData, mode, container, onDataChange, onChangeView) {
    this._container = container;
    this._eventData = eventData;
    this._event = new Event(eventData);
    this._eventEdit = new Create(eventData);
    this._onDataChange = onDataChange;

    this._onChangeView = onChangeView;
    this._bind = this._bind.bind(this);
    this._create(mode);
  }

  _setRollunbButtonClickHandler(handler) {
    this._event.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, handler);
  }

  _setResetButtonClickHandler(handler) {
    this._eventEdit.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, handler);
  }

  _setEditHandler(handler) {
    this._eventEdit.getElement().querySelector(`.event--edit`).addEventListener(`submit`, handler);
  }


  _create(mode) {
    this._resetButton = this._eventEdit.getElement().querySelector(`.event__reset-btn `);
    this._submitButton = this._eventEdit.getElement().querySelector(`.event__save-btn `);
    this._formElements = Array.from(this._eventEdit.getElement().querySelectorAll(`input, button`));
    this._form = this._eventEdit.getElement().querySelector(`form`);
    // const flet = this._eventEdit.getElement().querySelectorAll(`.flatpickr-calendar`);

    let currentView = this._event.getElement();
    let position = RenderPosition.PREPEND;
    if (mode === ModeType.ADD) {
      currentView = this._eventEdit.getElement().querySelector(`form`);
      position = RenderPosition.PREPEND;
      this._form.classList.add(`trip-events__item`);
      this._form.querySelector(`.event__rollup-btn`).remove();
      this._form.querySelector(`.event__reset-btn`).textContent = `Cancel`;
    }

    const onEscKeydown = (evt) => {
      if (evt.key === `Esc` || evt.key === `Escape`) {
        evt.preventDefault();
        this._container.replaceChild(this._event.getElement(), this._eventEdit.getElement());
        document.removeEventListener(`keydown`, onEscKeydown);
      }
    };

    this._setRollunbButtonClickHandler(() => {
      this._onChangeView();
      this._container.replaceChild(this._eventEdit.getElement(), this._event.getElement());
      document.addEventListener(`keydown`, onEscKeydown);
      if (mode === ModeType.DEFAULT) {
        this._eventEdit.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, () => {
          this._container.replaceChild(this._event.getElement(), this._eventEdit.getElement());
          this._eventEdit.getElement().querySelector(`form`).reset();
          document.removeEventListener(`keydown`, onEscKeydown);
        });
      }
    });

    this._setResetButtonClickHandler((evt) => {
      evt.preventDefault();
      if (mode === ModeType.ADD) {
        this._onDataChange();
        remove(currentView);
      } else {
        this._bind(ActionType.DELETE);
        this._onDataChange(ActionType.DELETE, this._eventData, this.onError.bind(this, ActionType.DELETE));
      }
      document.removeEventListener(`keydown`, onEscKeydown);
    });

    this._setEditHandler((evt) => {
      evt.preventDefault();
      const formData = new FormData(evt.target);
      this._eventData.id = this._eventData.id ? this._eventData.id : ``;
      this._eventData.type = formData.get(`event-type`);
      this._eventData.destination = {
        city: formData.get(`event-destination`),
        description: allDestinations.find((it) => it.city === formData.get(`event-destination`)).description,
        pictures: allDestinations.find((it) => it.city === formData.get(`event-destination`)).pictures,
      };
      this._eventData.price = Number(formData.get(`event-price`));
      this._eventData.start = moment(formData.get(`event-start-time`), `D.MM.YY h:mm`).format();
      this._eventData.end = moment(formData.get(`event-end-time`), `D.MM.YY h:mm`).format();
      this._eventData.offers = Array.from(this._eventEdit.getElement().querySelectorAll(`.event__offer-selector`)).map((it) => {
        return {
          title: it.querySelector(`.event__offer-title`).textContent,
          price: Number(it.querySelector(`.event__offer-price`).textContent),
          accepted: it.querySelector(`.event__offer-checkbox`).checked,
        };
      });
      this._eventData.isFavorite = formData.get(`event-favorite`) === `on` ? true : false;

      this._bind(ActionType.CHANGE);

      this._onDataChange(mode === ModeType.ADD ? ActionType.CREATE : ActionType.CHANGE, this._eventData, this.onError.bind(this, ActionType.CHANGE), currentView);
      document.removeEventListener(`keydown`, onEscKeydown);
    });
    render(this._container, currentView, position);
  }

  setDefaultView() {
    if (this._container.contains(this._eventEdit.getElement())) {
      this._container.replaceChild(this._event.getElement(), this._eventEdit.getElement());
    }
  }

  _getDisabledFormElements() {
    this._formElements.forEach((it) => {
      it.disabled = true;
    });
  }

  _getActiveFormElements() {
    this._formElements.forEach((it) => {
      it.disabled = false;
    });
  }

  _bind(type) {
    this._getDisabledFormElements();
    switch (type) {
      case ActionType.DELETE:
        this._resetButton.textContent = `Deleting..`;
        break;
      case ActionType.CHANGE:
        this._submitButton.textContent = `Saving..`;
        break;
    }
  }

  onError(type) {
    setTimeout(() => {
      this._shake();
      this._unbind(type);
    }, 2000
    );
  }

  _shake() {
    const ANIMATION_TIMEOUT = 600;
    this._form.style.border = `2px solid red`;
    this._form.style.animation = `shake ${ANIMATION_TIMEOUT / 1000}s`;
    setTimeout(() => {
      this._form.style.animation = ``;
      this._form.style.border = `none`;
    }, ANIMATION_TIMEOUT);
  }

  _unbind(type) {
    this._getActiveFormElements();
    switch (type) {
      case ActionType.DELETE:
        this._resetButton.textContent = `Delete..`;
        break;
      case ActionType.CHANGE:
        this._submitButton.textContent = `Save`;
        break;
    }
  }
}
