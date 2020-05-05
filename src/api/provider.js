import ModelEvent from '../models/model-point.js';
import {objectToArray} from '../util.js';

const isOnline = () => {
  return window.navigator.onLine;
};

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }
  getEvents() {
    if (isOnline()) {
      return this._api.getEvents()
        .then((events) => {
          events.map((it) => {
            return this._store.setItem(it.id, ModelEvent.toRAW(it));
          });
          return events;
        });
    } else {
      const events = objectToArray(this._store.getAll());
      const a = ModelEvent.parseEvents(events);
      return Promise.resolve(a);
    }
  }
  createEvent(newEvent) {
    if (isOnline()) {
      return this._api.createEvent(newEvent)
        .then((event) => {
          this._store.setItem(event.id, ModelEvent.toRAW(event));
          return event;
        });
    } else {
      this._store.setItem(this._generateId(), ModelEvent.toRAW(newEvent));
      return Promise.resolve(newEvent);
    }

  }
  deleteEvent(id) {
    if (isOnline()) {
      return this._api.deleteEvent(id)
        .then(() => {
          this._store.removeItem(id);
        });
    } else {
      this._store.removeItem(id);
      return Promise.resolve(true);
    }
  }

  changeEvent(id, data) {
    if (isOnline()) {
      return this._api.changeEvent(id, data)
        .then((event) => {
          this._store.setItem(event.id, ModelEvent.toRAW(event));
          return event;
        });
    } else {
      this._store.setItem(data.id, ModelEvent.toRAW(data));
      return Promise.resolve(ModelEvent.parseEvent(data));
    }
  }
  getOffers() {
    if (isOnline()) {
      return this._api.getOffers()
        .then((offers) => {
          this._store.setOffers(offers);
          return offers;
        });
    } else {
      const offers = this._store.getOffers();
      return Promise.resolve(offers);
    }
  }
  getDestinations() {
    if (isOnline()) {
      return this._api.getDestinations()
        .then((destinations) => {
          this._store.setDestinations(destinations);
          return destinations;
        });
    } else {
      const destinations = this._store.setDestinations();
      return Promise.resolve(destinations);
    }
  }
  syncEvents() {
    return this._api.syncEvents(objectToArray(this._store.getAll()));
  }

  _generateId() {
    return String(Date.now() + Math.random());
  }
}
