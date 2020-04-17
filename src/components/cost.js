import {createElement} from "./../util.js";

export default class Cost {
  constructor(filtersNames) {
    this._filtersNames = filtersNames;
    this._element = null;
  }
  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }
  getTemplate() {
    return `<p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value">30</span>
    </p>`;
  }
}
