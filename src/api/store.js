class Store {
  constructor(key, storage) {
    this._storage = storage;
    this._storeKey = key;
    this._destinationKey = `destinations`;
    this._offersKey = `offers`;
  }

  getItems() {
    try {
      return JSON.parse(this._storage.getItem(this._storeKey)) || {};
    } catch (err) {
      return {};
    }
  }

  getDestinations() {
    try {
      return JSON.parse(this._storage.getItem(this._destinationKey)) || {};
    } catch (err) {
      return {};
    }
  }

  getOffers() {
    try {
      return JSON.parse(this._storage.getItem(this._offersKey)) || {};
    } catch (err) {
      return {};
    }
  }

  setItem(key, value) {
    const store = this.getItems();

    this._storage.setItem(
        this._storeKey,
        JSON.stringify(
            Object.assign({}, store, {
              [key]: value
            })
        )
    );
  }

  setItems(items) {
    this._storage.setItem(
        this._storeKey,
        JSON.stringify(items)
    );
  }

  setDestinations(destinations) {
    this._storage.setItem(this._destinationKey, JSON.stringify(destinations));
  }

  setOffers(offers) {
    this._storage.setItem(this._offersKey, JSON.stringify(offers));
  }

  removeItem(key) {
    const store = this.getItems();

    delete store[key];

    this._storage.setItem(this._storeKey, JSON.stringify(store));
  }
}

export default Store;
