import {FilterType, MenuItem} from "../components/consts";
import {getPointsByFilter} from "../utils/filter";

class Points {
  constructor() {
    this._points = [];
    this._activeFilterType = FilterType.EVERYTHING;

    this._dataChangeHandlers = [];
    this._filterChangeHandlers = [];

    this._destinations = [];
    this._cities = [];
    this._offers = [];
    this._activePage = MenuItem.TABLE;
  }

  getPoints() {
    return getPointsByFilter(this._points, this._activeFilterType);
  }

  setPoints(points) {
    this._points = Array.from(points);
    this._callHandlers(this._dataChangeHandlers);
  }

  setDestinations(data) {
    this._destinations = data;
    this.setCities(data);
  }

  getDestinationForCity(city) {
    return this._destinations.filter((it) => it.name === city);
  }

  getDestinations() {
    return this._destinations;
  }

  setCities(data) {
    data.forEach((it) => this._cities.push(it.name));
  }

  getCities() {
    return this._cities;
  }

  setOffers(data) {
    this._offers = data;
  }

  getOffersForType(type) {
    const currentOffers = this._offers.filter((it) => it.type === type.toLowerCase());

    return currentOffers[0].offers;
  }

  getOffers() {
    return this._offers;
  }

  setActivePage(page) {
    this._activePage = page;
  }

  getActivePage() {
    return this._activePage;
  }

  setFilter(filterType) {
    this._activeFilterType = filterType;
    this._callHandlers(this._filterChangeHandlers);
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  removePoint(id) {
    const index = this._points.findIndex((it) => it.id === id);
    const from = this._points.slice(0, index);
    const to = this._points.slice(index + 1);

    if (index === -1) {
      return false;
    }

    this._points = [...from, ...to];

    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  updatePoint(id, point) {
    const index = this._points.findIndex((it) => it.id === id);
    const from = this._points.slice(0, index);
    const to = this._points.slice(index + 1);

    if (index === -1) {
      return false;
    }

    this._points = [...from, point, ...to];

    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  addPoint(point) {
    this._points = [point, ...this._points];
    this._callHandlers(this._dataChangeHandlers);
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}

export default Points;
