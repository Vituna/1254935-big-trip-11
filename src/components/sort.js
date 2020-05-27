import AbstractSmartComponent from "./abstract-smart-component";
import {SortType} from "./consts";
import {toNormalCase} from "../utils/common";

const createSortButton = (type, currentType) => {
  const isChecked = type === currentType ? `checked` : ``;
  const title = toNormalCase(type);

  return (
    `<div class="trip-sort__item  trip-sort__item--${type}">
      <input
      id="sort-${type}"
      class="trip-sort__input  visually-hidden"
      type="radio"
      name="trip-sort"
      value="sort-${type}"
      ${isChecked}>
      <label class="trip-sort__btn" for="sort-${type}" data-sort-type="${type}">${title}</label>
    </div>`
  );
};

const createSort = (currentType) => {
  const day = currentType === SortType.EVENT ? `Day` : ``;
  const getButtons = () => Object.values(SortType).map((it) => createSortButton(it, currentType)).join(`\n`);

  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
        <span class="trip-sort__item  trip-sort__item--day">${day}</span>
        ${getButtons()}
        <span class="trip-sort__item  trip-sort__item--offers">Offers</span>
      </form>`
  );
};

class Sort extends AbstractSmartComponent {
  constructor() {
    super();

    this._sortHandler = null;
    this._currentSortType = SortType.EVENT;
    this.onSortType = this.onSortType.bind(this);
  }

  getTemplate() {
    return createSort(this._currentSortType);
  }

  setSortType(sortType) {
    this._currentSortType = sortType;
  }

  setSortTypeChangeHandler(handler) {
    this._sortHandler = handler;
    this.getElement().addEventListener(`click`, this.onSortType);
  }

  recoveryListeners() {
    this.getElement().addEventListener(`click`, this.onSortType);
  }

  onSortType(evt) {

    if (!evt.target.hasAttribute(`data-sort-type`)) {
      return;
    }

    const sortType = evt.target.dataset.sortType;

    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._sortHandler(this._currentSortType);
    this.rerender();
  }
}

export default Sort;
