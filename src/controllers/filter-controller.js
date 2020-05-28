import {FilterType, MenuItem, Place} from "../utils/consts";
import FilterComponent from "../components/filters";
import {replace, render} from "../utils/render";
import {getPointsByFilter} from "../utils/filter";

class FilterController {
  constructor(container, pointsModel) {
    this._container = container;
    this._pointsModel = pointsModel;

    this._activeFilterType = FilterType.EVERYTHING;
    this._filterComponent = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._pointsModel.setDataChangeHandler(this._onDataChange);
  }

  render() {
    const container = this._container;
    const filters = Object.values(FilterType).map((filterType) => this._getFilter(filterType));
    const oldComponent = this._filterComponent;

    this._filterComponent = new FilterComponent(filters);
    this._filterComponent.setFilterChangeHandler(this._onFilterChange);

    if (oldComponent) {
      replace(this._filterComponent, oldComponent);
    } else {
      render(container, this._filterComponent, Place.BEFOREEND);
    }
  }

  setDefaultFilterType() {
    this._pointsModel.setFilter(FilterType.EVERYTHING);
    this._activeFilterType = FilterType.EVERYTHING;

    this._onDataChange();
  }

  _isDisabled(type) {
    if (this._pointsModel.getActivePage() === MenuItem.STATS) {
      return true;
    }

    return getPointsByFilter(this._pointsModel.getPoints(), type).length < 0;
  }

  _getFilter(filterType) {
    return {
      name: filterType,
      checked: filterType === this._activeFilterType,
      disabled: this._isDisabled(filterType),
    };
  }

  _onFilterChange(filterType) {
    this._pointsModel.setFilter(filterType);
    this._activeFilterType = filterType;
  }

  _onDataChange() {
    this.render();
  }
}

export default FilterController;
