import ModelEvent from './models/model-point.js';
// import ModelOffers from './models/model-point.js';
import ModelDestinations from './models/model-destinations.js';

export default class API {
  constructor({url, authorization}) {
    this._url = url;
    this._authorization = authorization;
  }

  getOffers() {
    return this._load({
      url: `${this._url}offers`
    })
    .then((response) => response.json());
    // .then(ModelOffers.parseOffers);
  }
  getDestinations() {
    return this._load({
      url: `${this._url}destinations`
    })
    .then((response) => response.json())
    .then(ModelDestinations.parseDestinations);
  }
  getEvents() {
    return this._load({
      url: `${this._url}points`
    })
    .then((response) => response.json())
    .then(ModelEvent.parseEvents);

  }
  createEvent(event) {
    const dataRAW = ModelEvent.toRAW(event);
    return this._load({
      url: `${this._url}points`,
      method: `POST`,
      body: JSON.stringify(dataRAW),
      headers: new Headers({'Content-Type': `application/json`})
    })
    .then((response) => response.json())
    .then(ModelEvent.parseEvent);
  }
  deleteEvent(id) {
    return this._load({
      url: `${this._url}points/${id}`,
      method: `DELETE`
    });
  }
  changeEvent(id, data) {
    const dataRAW = ModelEvent.toRAW(data);

    return this._load({
      url: `${this._url}points/${id}`,
      method: `PUT`,
      body: JSON.stringify(dataRAW),
      headers: new Headers({'Content-Type': `application/json`})
    })
    .then((response) => response.json())
    .then(ModelEvent.parseEvent);
  }

  syncEvents(events) {
    return this._load({
      url: `${this._url}points/sync`,
      method: `POST`,
      body: JSON.stringify(events),
      headers: new Headers({'Content-Type': `application/json`})
    })
    .then((response) => response.json());
  }

  _checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {

      return response;
    } else {
      throw new Error(`${response.status} : ${response.statusText}`);
    }
  }

  _load({url, method = `GET`, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);
    return fetch(url, {method, body, headers})
    .then(this._checkStatus)
    .catch((error) => {
      throw error;
    });
  }
}
