import Event from '../components/point.js';
import Create from '../components/create.js';
import moment from 'moment';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/light.css';
import {render, remove, RenderPosition, replace} from "../util.js";
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

  _setResetNewButtonClickHandler(handler) {
    this._eventEdit.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, handler);
  }

  _setEditHandler(handler) {
    this._eventEdit.getElement().querySelector(`.event--edit`).addEventListener(`submit`, handler);
  }

  reRender() {
    super.rerender();
    this.addFlatpickr();
  }

  setDefaultView() {
    if (this._container.contains(this._eventEdit.getElement())) {
      this._container.replaceChild(this._event.getElement(), this._eventEdit.getElement());
    }
  }

  onError(type) {
    setTimeout(() => {
      this._shake();
      this._unbind(type);
    }, 2000
    );
  }

  _create(mode) {
    this._resetButton = this._eventEdit.getElement().querySelector(`.event__reset-btn `);
    this._submitButton = this._eventEdit.getElement().querySelector(`.event__save-btn `);
    this._formElements = Array.from(this._eventEdit.getElement().querySelectorAll(`input, button`));
    this._form = this._eventEdit.getElement().querySelector(`form`);

    let currentView = this._event.getElement();
    let position = RenderPosition.APPEND;
    if (mode === ModeType.ADD) {
      this._addFlatpickr();
      currentView = this._eventEdit.getElement().querySelector(`form`);
      position = RenderPosition.APPEND;
      currentView.classList.add(`trip-events__item`);
      currentView.querySelector(`.event__rollup-btn`).remove();
      currentView.querySelector(`.event__reset-btn`).textContent = `Cancel`;

    }

    const onEscKeydown = (evt) => {
      if (evt.key === `Esc` || evt.key === `Escape`) {
        evt.preventDefault();
        replace(this._event, this._eventEdit);
        document.removeEventListener(`keydown`, onEscKeydown);
        this._eventEdit.removeElement();
      }
    };

    this._setRollunbButtonClickHandler(() => {
      this._onChangeView();
      this._addFlatpickr();
      replace(this._eventEdit, this._event);
      document.addEventListener(`keydown`, onEscKeydown);
      if (mode === ModeType.DEFAULT) {
        this._eventEdit.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, () => {
          replace(this._event, this._eventEdit);
          this._eventEdit.removeElement();
          this._eventEdit.getElement().querySelector(`form`).reset();
          document.removeEventListener(`keydown`, onEscKeydown);
        });
      }
    });

    this._setResetNewButtonClickHandler((evt) => {
      evt.preventDefault();
      if (mode === ModeType.ADD) {
        this._onDataChange();
        this._eventEdit.removeElement();
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

  _addFlatpickr() {
    if (this._flatpickrStartDate || this._flatpickrEndDate) {
      this._flatpickrStartDate.destroy();
      this._flatpickrEndDate.destroy();
      this._flatpickrStartDate = null;
      this._flatpickrEndDate = null;
    }

    const element = this._eventEdit.getElement();

    const options = {
      dateFormat: `d.m.y H:i`,
      allowInput: true,
      enableTime: true,
      defaultDate: this._end,
    };

    this._flatpickrStartDate = flatpickr(element.querySelector(`#event-start-time-1`), options, {defaultDate: this._start});
    this._flatpickrEndDate = flatpickr(element.querySelector(`#event-end-time-1`), options, {defaultDate: this._end});
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
