export default class Store {
  constructor(keysStorage, storage) {
    this._keysStorage = keysStorage;
    this._storage = storage;
  }
  setItem(key, item) {
    const items = this.getAll();
    items[key] = item;
    this._storage.setItem(this._keysStorage.EVENTS, JSON.stringify(items));
  }
  removeItem(key) {
    const items = this.getAll();
    delete items[key];

    this._storage.setItem(this._keysStorage.EVENTS, JSON.stringify(items));
  }
  getItem(key) {
    const items = this.getAll();
    return items[key];
  }
  getOffers() {
    const offers = this._storage.getItem(this._keysStorage.OFFERS);
    return JSON.parse(offers);
  }
  getDestinations() {
    const destinations = this._storage.getItem(this._keysStorage.DESTINATIONS);
    return JSON.parse(destinations);
  }
  setOffers(offers) {
    this._storage.setItem(this._keysStorage.OFFERS, JSON.stringify(offers));
  }
  setDestinations(destinations) {
    this._storage.setItem(this._keysStorage.DESTINATIONS, JSON.stringify(destinations));
  }
  getAll() {
    const emptyItems = {};
    const items = this._storage.getItem(this._keysStorage.EVENTS);
    if (!items) {
      return emptyItems;
    }
    try {
      return JSON.parse(items);
    } catch (e) {
      return emptyItems;
    }
  }
}
