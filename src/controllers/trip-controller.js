import Day from "../components/point_day";
import SortBlock from "../components/sort-block";
import SortComponent from "../components/sort";
import NoEventComponent from "../components/no-points";
import PointController from "./point-controller";

import {
  emptyPoint,
  Format,
  Place,
  SortType,
  Mode as PointControllerMode,
  Selector, MenuItem
} from "../components/consts";
import moment from "moment";
import {getSortedEvents, makeCounter} from "../utils/common";
import {render} from "../utils/render";

const dayCounter = makeCounter();

const getDays = (events) => {
  const dayDates = [];
  const days = [];
  const sortedEvents = events.sort((current, previous) => current.timeStart - previous.timeStart);
  dayCounter.currentCount = 0;

  sortedEvents.map((event) => {
    if (!dayDates.includes(moment(event.timeStart).format(Format.DAY_DATE))) {
      dayDates.push(moment(event.timeStart).format(Format.DAY_DATE));
      days.push(generateDay(event.timeStart));
    }
  });

  return days;
};

const generateDay = (date) => {
  const dateTime = moment(date).format(Format.DATE_TIME);
  const dayDate = moment(date).format(Format.DAY_DATE);

  return {
    dayCounter: dayCounter() + 1,
    dateTime,
    dayDate
  };
};

const renderEventsForDay = (eventList, events, onDataChange, onViewChange, day, pointsModel) => {
  const eventsForDay = events.filter((event) => moment(event.timeStart).format(Format.DAY_DATE) === day.dayDate);

  return renderOnlyEvents(eventList, eventsForDay, onDataChange, onViewChange, pointsModel);
};

const renderOnlyEvents = (eventList, events, onDataChange, onViewChange, pointsModel) => {
  return events.map((event) => {
    const pointController = new PointController(eventList, onDataChange, onViewChange, pointsModel);

    pointController.render(event, PointControllerMode.DEFAULT);

    return pointController;
  });
};

const header = document.querySelector(`.trip-main`);

class TripController {
  constructor(container, pointsModel, menuComponent, api, statistics, filterController, headerInfoComponent) {
    this._container = container;
    this._tripDays = this._container.getElement();
    this._pointsModel = pointsModel;
    this._api = api;
    this._creatingEvent = null;

    this._events = [];
    this._showedEventControllers = [];
    this._showedDays = [];

    this._addPointBtn = document.querySelector(`.trip-main__event-add-btn`);

    this._sortComponent = new SortComponent();
    this._dayForSort = new SortBlock();
    this._dayForNew = new SortBlock();
    this._noEventComponent = new NoEventComponent();
    this._headerInfo = headerInfoComponent;
    this._menuComponent = menuComponent;
    this._filterController = filterController;
    this._statistics = statistics;

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onSortRender = this._onSortRender.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._onAddNewEvent = this._onAddNewEvent.bind(this);
    this._changeApiPoint = this._changeApiPoint.bind(this);

    this._sortComponent.setSortTypeChangeHandler(this._onSortRender);
    this._pointsModel.setFilterChangeHandler(this._onFilterChange);
  }

  hide() {
    this._container.hide();
    this._sortComponent.hide();
  }

  show() {
    this._container.show();
    this._sortComponent.show();
  }

  render() {
    this._events = this._pointsModel.getPoints();
    const eventsCopy = this._events.slice();
    const container = this._container.getElement();

    this._addPointBtn.addEventListener(`click`, this._onAddNewEvent);

    if (this._events.length === 0) {
      render(container, this._noEventComponent, Place.AFTERBEGIN);
    } else {
      render(container, this._sortComponent, Place.BEFORENODE);

      this._renderDays(container, eventsCopy);
    }
  }

  createPoint() {
    if (this._creatingEvent) {
      return;
    }

    render(this._tripDays, this._dayForNew, Place.AFTERBEGIN);
    const eventList = this._dayForNew.getElement().querySelector(Selector.EVENT_LIST);
    this._showedDays.push(this._dayForNew);

    this._creatingEvent = new PointController(eventList, this._onDataChange, this._onViewChange, this._pointsModel);
    this._creatingEvent.render(emptyPoint, PointControllerMode.ADDING);
  }

  _removeEvents() {
    this._showedEventControllers.forEach((eventController) => eventController.destroy());
    this._showedEventControllers = [];
  }

  _removeDays() {
    this._showedDays.forEach((day) => day.destroy());
    this._showedDays = [];
  }

  _updateEvents() {
    this._removeEvents();
    this._removeDays();

    const sortedEvents = this._pointsModel.getPoints();

    if (sortedEvents.length > 0) {
      this._renderDays(this._container.getElement(), sortedEvents);
    }

    this._updateInfo();
  }

  _resetSorting() {
    this._sortComponent.setSortType(SortType.EVENT);
    this._sortComponent.rerender();
    this._sortComponent.setSortTypeChangeHandler(this._onSortRender);
  }

  _renderDays(container, events) {
    const days = getDays(events);

    days.forEach((day) => {
      this._renderDay(container, day, events);
    });
  }

  _renderDay(container, day, events) {
    const eventDay = new Day(day);
    const eventList = eventDay.getElement().querySelector(Selector.EVENT_LIST);
    this._showedDays.push(eventDay);

    render(container, eventDay, Place.BEFOREEND);

    const newEvents = renderEventsForDay(eventList, events, this._onDataChange, this._onViewChange, day, this._pointsModel);
    this._showedEventControllers = this._showedEventControllers.concat(newEvents);
  }

  _addApiPoint(pointModel, pointController) {
    if (this._pointsModel.getPoints().length === 0) {
      this._noEventComponent.destroy();
      render(this._container.getElement(), this._sortComponent, Place.BEFORENODE);
    }

    this._pointsModel.addPoint(pointModel);
    pointController.destroy();
    this._updateEvents();
  }

  _addPoint(pointController, oldData, newData) {
    this._creatingEvent = null;
    this._addPointBtn.disabled = false;

    if (newData === null) {
      pointController.destroy();
      this._updateEvents();
    } else {
      this._api.createPoint(newData)
        .then((response) => this._addApiPoint(response, pointController))
        .catch(pointController.shake);
    }
  }

  _deleteApiPoint(id) {
    this._pointsModel.removePoint(id);
    this._updateEvents();

    if (this._pointsModel.getPoints().length === 0) {
      this._sortComponent.destroy();
      render(this._container.getElement(), this._noEventComponent, Place.AFTERBEGIN);
    }
  }

  _deletePoint(pointController, oldData) {
    this._api.deletePoint(oldData.id)
      .then(() => this._deleteApiPoint(oldData.id))
      .catch(pointController.shake);
  }

  _changeApiPoint(pointModel, id, pointController, inFavorite) {
    const isSuccess = this._pointsModel.updatePoint(id, pointModel);

    if (inFavorite) {
      return;
    }

    if (isSuccess) {
      pointController.render(pointModel, PointControllerMode.DEFAULT);
      this._updateEvents();
    }
  }

  _changePoint(pointController, oldData, newData, inFavorite) {
    this._api.updatePoint(oldData.id, newData)
      .then((response) => this._changeApiPoint(response, oldData.id, pointController, inFavorite))
      .catch(pointController.shake);
  }

  _updateInfo() {
    this._headerInfo.destroy();
    render(header, this._headerInfo, Place.AFTERBEGIN);
  }

  _onDataChange(pointController, oldData, newData, inFavorite = false) {
    if (oldData === emptyPoint) {
      this._addPoint(pointController, oldData, newData);
    } else if (newData === null) {
      this._deletePoint(pointController, oldData);
    } else {
      this._changePoint(pointController, oldData, newData, inFavorite);
    }
  }

  _onFilterChange() {
    this._onViewChange();
    this._resetSorting();
    this._updateEvents();
  }

  _onViewChange() {
    this._showedEventControllers.forEach((event) => event.setDefaultView());

    if (this._creatingEvent) {
      this._creatingEvent.destroy();
      this._creatingEvent = null;
      this._addPointBtn.disabled = false;
    }
  }

  _onSortRender(sortType) {
    this._onViewChange();

    const sortedEvents = getSortedEvents(this._pointsModel.getPoints(), sortType);

    this._removeEvents();
    this._removeDays();

    if (sortType !== SortType.EVENT) {
      this._showedDays.push(this._dayForSort);
      render(this._tripDays, this._dayForSort, Place.BEFOREEND);
      const eventsList = this._dayForSort.getElement().querySelector(Selector.EVENT_LIST);

      const newEvents = renderOnlyEvents(eventsList, sortedEvents, this._onDataChange, this._onViewChange, this._pointsModel);
      this._showedEventControllers = this._showedEventControllers.concat(newEvents);
    } else {
      this._renderDays(this._tripDays, sortedEvents, this._onDataChange, this._onViewChange);
    }
  }

  _onAddNewEvent(evt) {
    evt.target.disabled = true;
    this._onViewChange();
    this.show();
    this._statistics.hide();
    this._filterController.setDefaultFilterType();
    this._menuComponent.setActiveItem(MenuItem.TABLE);
    this.createPoint();
  }
}

export default TripController;
