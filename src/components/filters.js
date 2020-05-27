import AbstractComponent from "./abstract-component";

const FILTER_ID_PREFIX = `filter-`;

const getFilterNameById = (id) => {
  return id.substring(FILTER_ID_PREFIX.length);
};

const createFilterButton = (filter) => {
  const {name, checked, disabled} = filter;
  const disableStyle = disabled ? `style="opacity: 0.6; cursor: auto"` : ``;

  return (
    `<div class="trip-filters__filter">
      <input
        id="filter-${name}"
        class="trip-filters__filter-input  visually-hidden"
        type="radio"
        name="trip-filter"
        value="${name}"
        ${checked ? `checked` : ``}
        ${disabled ? `disabled` : ``}>
      <label ${disableStyle} class="trip-filters__filter-label" for="filter-${name}">${name}</label>
    </div>`
  );
};

const createFilter = (filters) => {
  const filtersMarkup = filters.map((filter) => createFilterButton(filter)).join(`\n`);

  return (
    `<form class="trip-filters" action="#" method="get">
        ${filtersMarkup}
        <button class="visually-hidden" type="submit">Accept filter</button>
      </form>`
  );
};

class Filter extends AbstractComponent {
  constructor(filters) {
    super();

    this._filters = filters;
  }

  getTemplate() {
    return createFilter(this._filters);
  }

  setFilterChangeHandler(handler) {
    this.getElement().addEventListener(`change`, (evt) => {
      const filterName = getFilterNameById(evt.target.id);
      handler(filterName);
    });
  }
}

export default Filter;
