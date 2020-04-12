import {createSiteMenuTemplate} from "./components/site-menu.js";
import {createFilterTemplate} from "./components/filter.js";
import {createSortingTemplate} from "./components/sorting.js";
import {createSiteRouteInformation} from "./components/route.js";
import {createSiteCostTravel} from "./components/cost.js";
import {createFormTemplate} from "./components/create.js";
import {generateFilters} from "./mock/filter.js";
import {getDaysListTemplate} from "./components/point_day_all.js";
import {
  menuValues,
  eventsData,
  getEventsData,
  tripDaysDates,
  getCities,
  getDatesStart,
  getDatesEnd,
  OPTIONS,
} from "./const.js";

const TASK_COUNT = 1;

const filters = generateFilters();

const render = (container, template, place = `beforeEnd`) => {
  container.insertAdjacentHTML(place, template);
};

const siteHeaderElement = document.querySelector(`.page-header`);

const siteRouteElement = siteHeaderElement.querySelector(`.trip-main`);
render(siteRouteElement, createSiteRouteInformation(getCities(), getDatesStart(), getDatesEnd()), `afterBegin`);

const siteCostElement = siteHeaderElement.querySelector(`.trip-main__trip-info`);
render(siteCostElement, createSiteCostTravel());

const siteMenuElement = siteHeaderElement.querySelector(`.visually-hidden`);
render(siteMenuElement, createSiteMenuTemplate(menuValues), `afterEnd`);

const siteFilterElement = siteHeaderElement.querySelector(`.trip-main__trip-controls`);
render(siteFilterElement, createFilterTemplate(filters));

const siteMainElement = document.querySelector(`.page-body__page-main`);

const siteSortingElement = siteMainElement.querySelector(`.trip-events`);
render(siteSortingElement, createSortingTemplate());
render(siteSortingElement, createFormTemplate(getEventsData(TASK_COUNT), OPTIONS));
render(siteSortingElement, getDaysListTemplate(eventsData, tripDaysDates));

