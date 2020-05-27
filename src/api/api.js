import Point from "../models/point";
import {ApiOption, Method, Code} from "../components/consts";

const checkStatus = (response) => {
  if (response.status >= Code.OK && response.status < Code.NOT_OK) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

const getConfigFetch = (data, url, method) => {
  return {
    url,
    method,
    body: JSON.stringify(data.toRAW()),
    headers: new Headers(ApiOption.CONTENT_TYPE)
  };
};

class API {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getPoints() {
    return this._load({url: ApiOption.POINTS})
      .then((response) => response.json())
      .then(Point.parsePoints)
      .catch((err) => {
        throw err;
      });
  }

  getDestinations() {
    return this._load({url: ApiOption.DESTINATIONS})
      .then((response) => response.json())
      .catch((err) => {
        throw err;
      });
  }

  getOffers() {
    return this._load({url: ApiOption.OFFERS})
      .then((response) => response.json())
      .catch((err) => {
        throw err;
      });
  }

  createPoint(point) {
    return this._load(getConfigFetch(point, ApiOption.POINTS, Method.POST))
      .then((response) => response.json())
      .then(Point.parsePoint)
      .catch((err) => {
        throw err;
      });
  }

  updatePoint(id, data) {
    return this._load(getConfigFetch(data, `${ApiOption.POINTS}/${id}`, Method.PUT))
      .then((response) => response.json())
      .then(Point.parsePoint)
      .catch((err) => {
        throw err;
      });
  }

  deletePoint(id) {
    return this._load({url: `${ApiOption.POINTS}/${id}`, method: Method.DELETE});
  }

  sync(data) {
    return this._load({
      url: ApiOption.SYNC,
      method: Method.POST,
      body: JSON.stringify(data),
      headers: new Headers(ApiOption.CONTENT_TYPE)
    })
      .then((response) => response.json());
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        throw err;
      });
  }
}

export default API;
